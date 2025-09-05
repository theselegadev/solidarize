<?php
    namespace Api\Models;
    // Classe responsável pela manipulação de dados e regra de negócios do perfil

    class perfilDao{
        // método para criar o perfil
        public function create($id,$json){
            $data = json_decode($json,true);

            $sql = "INSERT INTO perfil (id_ong,foto,missao,visao,valores,descricao,curtidas) VALUES(?,?,?,?,?,?,?)";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->bindValue(1,$id);
            $stmt->bindValue(2,"uploads/default_image.png");
            $stmt->bindValue(3,$data['mission']);
            $stmt->bindValue(4,$data['vision']);
            $stmt->bindValue(5,$data['values']);
            $stmt->bindValue(6,$data['description']);
            $stmt->bindValue(7,0);

            $stmt->execute();
        }
        // método para retornar o perfil da ong
        public function getPerfil($id){
            $sql = "SELECT * FROM perfil WHERE id_ong = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id]);

            $perfil = $stmt->rowCount()>0 ? $stmt->fetch(\PDO::FETCH_ASSOC) : [];

            return $perfil;
        }
        // método para atualizar os dados do perfil
        public function update($id,$json){
            $data = json_decode($json,true);
            $sql = "UPDATE perfil SET missao = ?, visao = ?, valores = ?, descricao = ? WHERE id_ong = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindValue(1,$data['mission']);
            $stmt->bindValue(2,$data['vision']);
            $stmt->bindValue(3,$data['values']);
            $stmt->bindValue(4,$data['description']);
            $stmt->bindValue(5,$id);

            $stmt->execute();
        }
        // método que vai fazer o upload da imagem de perfil
        public function uploadImage($id,$file){
            // query para buscar o caminho da antiga imagem
            $sql = "SELECT foto FROM perfil WHERE id_ong = ?";
            $oldImageStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $oldImageStmt->execute([$id]);
            $oldImage = $oldImageStmt->fetchColumn();

            // query para atualização do caminho da imagem
            $sql = "UPDATE perfil SET foto = ? WHERE id_ong = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            
            if(isset($file)){
                $options = ["jpg","png","jpeg"];
                $ext = strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));

                if(in_array($ext,$options)){
                    $newName = uniqid("perfil_ong_",true) . "." . $ext;
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

                    // deleta a antiga imagem sem ser a padrão
                    if($oldImage !== "uploads/default_image.png" and file_exists($oldImage)){
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
        }
        // método que vai atualizar o números de curtidas do perfil
        public function likeProfile($id,$action){
            $sql = "SELECT curtidas FROM perfil WHERE id = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id]);

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            $value = (int) $result['curtidas'];
            
            if ($action === "increment") {
                $value++;
            }elseif ($action === "decrement" && $value > 0) {
                $value--;
            }

            $sql = "UPDATE perfil SET curtidas = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$value,$id]);
        }
        // método que vai buscar o perfis de ongs com mais curtidas
        public function getBest($page){
            // query total de registros
            $sql = "SELECT COUNT(p.id) as total FROM perfil p";
            $countStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $countStmt->execute();

            $total = $countStmt->fetchColumn();

            // query com paginação
            $offset = ($page - 1) * 8;
            $sql = "SELECT p.* FROM perfil p ORDER BY p.curtidas DESC LIMIT 8 OFFSET $offset";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute();

            $bests = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return [
                "profiles" => $bests,
                "page" => $page,
                "total_pages" => ceil($total/8)
            ];
        }   
    }