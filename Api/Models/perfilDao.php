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
            $stmt->bindValue(2,"upload/default_image.png");
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
    }