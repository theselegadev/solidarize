<?php
    namespace Api\Models;
    // Classe responsável pela regra de negócio e manipulação dos dados das instituiões

    class ongDao{
        // método para criar organizações
        public function create($json){
            $data = json_decode($json,true);
            $sql = "INSERT INTO ong (nome,cnpj,email,senha,telefone,cidade, estado,verificada) VALUES (?,?,?,?,?,?,?,?)";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['cnpj']);
            $stmt->bindValue(3,$data['email']);
            $stmt->bindValue(4,password_hash($data['password'],PASSWORD_BCRYPT));
            $stmt->bindValue(5,$data['tel']);
            $stmt->bindValue(6,$data['city']);
            $stmt->bindValue(7,$data['state']);
            $stmt->bindValue(8,false);

            $stmt->execute();

            return [
                "user_id" => \Api\config\ConnectDB::getConnect()->lastInsertId(),
                "user_type" => "ong"
            ];
        }
    }