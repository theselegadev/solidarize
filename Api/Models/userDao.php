<?php
    namespace Api\Models;
    // Classe responsável pela regra de negócio e manipulação dos dados dos usuários
    
    class userDao{
        // método para criar usuários
        public function create($json){
            // inserindo o usuário no banco de dados
            $sql = "INSERT INTO usuario (nome,email,senha,telefone,voluntario,foto,cidade,estado) VALUES (?,?,?,?,?,?,?,?)";
            $data = json_decode($json,true);

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['email']);
            $stmt->bindValue(3,password_hash($data['password'],PASSWORD_BCRYPT));
            $stmt->bindValue(4,$data['tel']);
            $stmt->bindValue(5,0,\PDO::PARAM_BOOL);
            $stmt->bindValue(6,"uploads/default_perfil.jpg");
            $stmt->bindValue(7,$data['city']);
            $stmt->bindValue(8,$data['state']);

            $stmt->execute();

            return [
                "user_id" => \Api\config\ConnectDB::getConnect()->lastInsertId(),
                "user_type" => "user"
            ];
        }
        // buscar dados do usuário pelo id
        public function  getForId($id){
            $sql = "SELECT nome,email,telefone,foto,voluntario,cidade,estado FROM usuario WHERE id = ?";

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

            $stmt->execute([$value,$id]);
        }
    }