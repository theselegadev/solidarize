<?php
    namespace Api\Models;
    // Classe responsável pelá regra de negócio e manipulação dos dados dos usuários
    
    class userDao{
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
    }