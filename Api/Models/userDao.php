<?php
    namespace Api\Models;
    // Classe responsável pela regra de negócio e manipulação dos dados dos usuários
    
    class userDao{
        // método para criar usuários
        public function create($json){
            // inserindo o usuário no banco de dados
            $sql = "INSERT INTO usuario (nome,email,descricao,senha,telefone,voluntario,foto,cidade,estado) VALUES (?,?,?,?,?,?,?,?,?)";
            $data = json_decode($json,true);

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['email']);
            $stmt->bindValue(3,null);
            $stmt->bindValue(4,password_hash($data['password'],PASSWORD_BCRYPT));
            $stmt->bindValue(5,$data['tel']);
            $stmt->bindValue(6,0,\PDO::PARAM_BOOL);
            $stmt->bindValue(7,"uploads/default_perfil.png");
            $stmt->bindValue(8,$data['city']);
            $stmt->bindValue(9,$data['state']);

            $stmt->execute();

            return [
                "user_id" => \Api\config\ConnectDB::getConnect()->lastInsertId(),
                "user_type" => "user"
            ];
        }
        // buscar dados do usuário pelo id
        public function  getForId($id){
            $sql = "SELECT nome,email,descricao,telefone,foto,voluntario,cidade,estado FROM usuario WHERE id = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindParam(1,$id);
            $stmt->execute();

            $user = $stmt->rowCount()>0 ? $stmt->fetch(\PDO::FETCH_ASSOC) : [];

            return $user;
        }
        // método para atualizar os dados do usuário
        public function update($id,$json){
            $data = json_decode($json,true);

            $sql = "UPDATE usuario SET nome = ?, email = ?, telefone = ?, cidade = ?, estado = ? WHERE id = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['email']);
            $stmt->bindValue(3,$data['tel']);
            $stmt->bindValue(4,$data['city']);
            $stmt->bindValue(5,$data['state']);
            $stmt->bindValue(6,$id);
            
            $stmt->execute();
        }
        // método para atualizar e fazer o upload da nova imagem do usuário
        public function updateImage($id,$file){
            // query para pegar a antiga imagem
            $sql = "SELECT foto FROM usuario WHERE id = ?";
            $oldImageStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $oldImageStmt->execute([$id]);
            $oldImage = $oldImageStmt->fetchColumn();

            // query de atualização do path da imagem
            $sql = "UPDATE usuario SET foto = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            if(isset($file)){
                $options = ["jpg","png","jpeg"];
                $ext = strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));

                if(in_array($ext,$options)){
                    $newName = uniqid("perfil_",true) . "." . $ext;
                    $newName = "uploads/". $newName;

                    if(!move_uploaded_file($file['tmp_name'],$newName)){
                        return [
                            "status" => "error",
                            "message" => "Falha no upload da imagem",
                            "status_code" => 500,
                            "data" => []
                        ];
                    }

                    $stmt->execute([$newName,$id]);

                    // deletar antiga imagem que não seja a padrão
                    if($oldImage !== "uploads/default_perfil.png" and file_exists($oldImage)){
                        unlink($oldImage);
                    }
                    
                    return [
                        "status" => "success",
                        "message" => "Imagem atualizada com sucesso",
                        "status_code" => 200,
                        "data" => [
                            "path" => $newName
                        ]
                    ];

                }else{
                    return [
                        "status" => "error",
                        "message" => "Formato de arquivo inválido",
                        "status_code" => 415,
                        "data" => []
                    ];
                }
            }

            return [
                "status" => "error",
                "message" => "Nenhuma imagem enviada",
                "status_code" => 400,
                "data" => []
            ];
        }
        // método para definir o user como voluntário ou não
        public function defineVolunteer($id,$value){
            $sql = "UPDATE usuario SET voluntario = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->bindValue(1, (int) $value, \PDO::PARAM_INT);
            $stmt->bindValue(2, (int) $id, \PDO::PARAM_INT);

            $stmt->execute();
        }
        // método para o usuário favoritar ongs
        public function favorite($id,$json){
            $data = json_decode($json,true);

            if($data['action'] == 'favorite'){
                $sql = "INSERT INTO usuario_ong (id_usuario,id_ong) VALUES (?,?)";
                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
    
                $stmt->execute([$id,$data['id_ong']]);

                return "favorite";
            }else if($data['action'] == 'desfavorite'){
                $sql = "DELETE FROM usuario_ong WHERE id_usuario = ? AND id_ong = ?";
                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

                $stmt->execute([$id,$data['id_ong']]);
                return "desfavorite";
            }

        }
        // método para buscar os dados de perfil das ongs favoritadas
        public function getFavorites($id){
            $sql = "SELECT p.id_ong, p.foto, p.descricao, p.curtidas, CASE WHEN up.id_usuario IS NOT NULL THEN 1 ELSE 0 END as curtido FROM perfil as p INNER JOIN ong as o ON p.id_ong = o.id INNER JOIN usuario_ong as uo ON uo.id_ong = o.id  LEFT JOIN usuario_perfil up ON up.id_perfil = p.id AND up.id_usuario = ? WHERE uo.id_usuario = ? ORDER BY p.curtidas";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id, $id]);

            $favorites = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return $favorites;
        }
        // método para autorizar o login do usuário
        public function login($json){
            $data = json_decode($json,true); 
            $sql = "SELECT id,senha FROM usuario WHERE nome = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$data['name']]);

            if($stmt->rowCount() > 0){
                $res = $stmt->fetch(\PDO::FETCH_ASSOC);
                if(password_verify($data['password'],$res['senha'])){
                    return [
                        "user_id" => $res['id'],
                        "user_type" => "user"
                    ];
                }
                return false;
            }else{
                return false;
            }
        }
        // método para atualizar descrição do usuário
        public function updateDescription($id,$json){
            // query para validar se o usuário é voluntário
            $sql = "SELECT u.voluntario FROM usuario u WHERE u.id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id]);
            $voluntario = $stmt->rowCount()>0 ? $stmt->fetchColumn() : null;

            if($voluntario == 1){
                $data = json_decode($json,true);
                $sql = "UPDATE usuario u SET u.descricao = ? WHERE u.id = ?";
                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute([$data['descricao'],$id]);

                return $data['descricao'];
            }

            return false;
        }
    }