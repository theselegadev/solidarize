<?php
    namespace Api\Models;

    // classe responsável pela manipulação dos dados dos objetivos
    class objectiveDao{
        // criar objetivos do usuário
        public function createObjective($id,$json){
            $data = json_decode($json,true);

            $sql = "INSERT INTO usuario_objetivo (id_usuario,id_objetivo) VALUES (?,?)";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            foreach($data['objetivos'] as $objective){
                $stmt->execute([$id,$objective]);
            }
        }
        // pegar objetivos do usuário
        public function getObjectives($id,$user_type){
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
    }