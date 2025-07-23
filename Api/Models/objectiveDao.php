<?php
    namespace Api\Models;

    // classe responsável pela manipulação dos dados dos objetivos
    class objectiveDao{
        public function createObjective($id,$json){
            $data = json_decode($json,true);

            $sql = "INSERT INTO usuario_objetivo (id_usuario,id_objetivo) VALUES (?,?)";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            foreach($data['objetivos'] as $objective){
                $stmt->execute([$id,$objective]);
            }
        }
    }