<?php
    namespace Api\Models;

    // classe responsável pela manipulação dos dados dos objetivos
    class objectiveDao{
        // criar objetivos do usuário
        public function createObjectiveUser($id,$json,$user_type){
            $data = json_decode($json,true);

            $table = $user_type == "user" ? "usuario_objetivo" : "ong_objetivo";
            $colunm = $user_type == "user" ? "id_usuario" : "id_ong";

            $sql = "INSERT INTO $table ($colunm,id_objetivo) VALUES (?,?)";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            foreach($data['objetivos'] as $objective){
                $stmt->execute([$id,$objective]);
            }
        }
        // pegar objetivos do usuário
        public function getObjectivesUser($id,$user_type){
            if($user_type == "user"){
                $sql = "SELECT o.id, o.nome, o.descricao FROM objetivo as o INNER JOIN usuario_objetivo as uo ON o.id = uo.id_objetivo WHERE uo.id_usuario = ?";
            }else{
                $sql = "SELECT o.id, o.nome, o.descricao FROM objetivo as o INNER JOIN ong_objetivo as oo ON o.id = oo.id_objetivo WHERE oo.id_ong = ?";
            }

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->bindParam(1,$id);
            $stmt->execute();

            $objectives = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return $objectives;
        }
        // atualizar objetivos do usuário
        public function updateObjectivesUser($id,$json,$user_type){
            $data = json_decode($json,true);
            $table = $user_type === "user" ? "usuario_objetivo" : "ong_objetivo";
            $colunm = $user_type === "user" ? "id_usuario" : "id_ong";
            $db = \Api\config\ConnectDB::getConnect();
            
            $sql = "DELETE FROM $table WHERE $colunm = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$id]);

            $sql = "INSERT INTO $table ($colunm,id_objetivo) VALUES (?,?)";
            $stmt = $db->prepare($sql);

            foreach($data['objetivos'] as $objective){
                $stmt->execute([$id,$objective]);
            }
        }
        // pegar todos os objetivos
        public function getAllObjectives(){
            $sql = "SELECT * FROM objetivo";
            
            $stmt = \Api\config\ConnectDB::getConnect()->query($sql);

            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
    }