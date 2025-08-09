<?php
    namespace Api\Models;
    // Classe responsável pela regra de negócio e manipulação dos dados das instituiões

    class ongDao{
        // método para criar organizações
        public function create($json){
            $data = json_decode($json,true);
            $sql = "INSERT INTO ong (nome,cnpj,email,senha,telefone,cidade, estado,precisa_voluntario,verificada) VALUES (?,?,?,?,?,?,?,?,?)";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['cnpj']);
            $stmt->bindValue(3,$data['email']);
            $stmt->bindValue(4,password_hash($data['password'],PASSWORD_BCRYPT));
            $stmt->bindValue(5,$data['tel']);
            $stmt->bindValue(6,$data['city']);
            $stmt->bindValue(7,$data['state']);
            $stmt->bindValue(8,false);
            $stmt->bindValue(9,false);

            $stmt->execute();

            return [
                "user_id" => \Api\config\ConnectDB::getConnect()->lastInsertId(),
                "user_type" => "ong"
            ];
        }
        // método para pegar os dados da ong por id
        public function getForId($id){
            $sql = "SELECT nome,email,telefone,cidade,estado,precisa_voluntario,verificada FROM ong WHERE id = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id]);

            $ong = $stmt->rowCount()>0 ? $stmt->fetch(\PDO::FETCH_ASSOC) : [];

            return $ong;
        }
        // método para atualizar os dados da ong
        public function update($id,$json){
            $data = json_decode($json,true);
            $sql = "UPDATE ong SET nome = ?, email = ?, telefone = ?, cidade = ?, estado = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->bindValue(1,$data['name']);
            $stmt->bindValue(2,$data['email']);
            $stmt->bindValue(3,$data['tel']);
            $stmt->bindValue(4,$data['city']);
            $stmt->bindValue(5,$data['state']);
            $stmt->bindValue(6,$id);

            $stmt->execute();
        }
        // método para definir se o usuário precisa de voluntários
        public function  defineNeedVolunteer($id,$value){
            $sql = "UPDATE ong SET precisa_voluntario = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->execute([$value,$id]);
        }
    }