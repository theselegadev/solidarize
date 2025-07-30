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
    }