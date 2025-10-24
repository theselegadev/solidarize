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
        // recomendar as ongs com base nos objetivos do usuário com paginação
        public function recommendOng($id,$page){
            // quantidade de dados
            $sql = "SELECT COUNT(DISTINCT o.id) as total FROM ong o INNER JOIN ong_objetivo oo ON o.id = oo.id_ong INNER JOIN usuario_objetivo uo ON oo.id_objetivo = uo.id_objetivo WHERE uo.id_usuario = ?";
            $countStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $countStmt->execute([$id]);
            $total = (int) $countStmt->fetchColumn();

            $offset = ($page - 1) * 8;

            // query de paginação
            $sql = "SELECT p.id,o.nome, p.foto AS foto_perfil, p.missao, p.visao, p.valores, p.descricao, p.curtidas,p.id_ong, COUNT(*) AS objetivos_em_comum, CASE WHEN up.id_usuario IS NOT NULL THEN 1 ELSE 0 END as curtido FROM ong o INNER JOIN perfil p ON o.id = p.id_ong INNER JOIN ong_objetivo oo ON o.id = oo.id_ong INNER JOIN usuario_objetivo uo ON oo.id_objetivo = uo.id_objetivo LEFT JOIN usuario_perfil up on up.id_perfil = p.id AND up.id_usuario = ? WHERE uo.id_usuario = ? GROUP BY o.id ORDER BY objetivos_em_comum DESC LIMIT 8 OFFSET $offset";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
    
            $stmt->execute([$id,$id]);
 
            $ongs = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return [
                "profiles" => $ongs,
                "page" => $page,
                "total_pages" => ceil($total/8)
            ];
        }
        // recomendar os usuários que querem ser voluntários com base nos objetivos das ongs e com paginação
        public function recommendUser($id,$page){
            $sql = "SELECT COUNT(DISTINCT u.id) AS total FROM usuario u INNER JOIN usuario_objetivo uo ON u.id = uo.id_usuario INNER JOIN ong_objetivo oo ON uo.id_objetivo = oo.id_objetivo WHERE oo.id_ong = ? AND u.voluntario = 1;";

            $countStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $countStmt->execute([$id]);
            $total = (int) $countStmt->fetchColumn();

            // query de paginação
            $offset = ($page - 1) * 8;

            $sql = "SELECT u.id, u.nome, u.descricao, u.foto, COUNT(DISTINCT uo.id_objetivo) AS objetivos_em_comum FROM usuario u INNER JOIN usuario_objetivo uo ON u.id = uo.id_usuario INNER JOIN ong_objetivo oo ON uo.id_objetivo = oo.id_objetivo INNER JOIN objetivo obj ON obj.id = uo.id_objetivo WHERE oo.id_ong = ? AND u.voluntario = 1 GROUP BY u.id, u.nome, u.foto ORDER BY objetivos_em_comum DESC LIMIT 8 OFFSET $offset;";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);

            $stmt->execute([$id]);

            $users = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return [
                "profiles" => $users,
                "page" => $page,
                "total_pages" => ceil($total/8)
            ];
        }
        // recomendar ongs que prcisam de voluntários com base nos objetivos do usuário e com paginação
        public function needVolunteer($id,$page){
            // query para total de registros
            $sql = "SELECT COUNT(DISTINCT o.id) AS total FROM ong o INNER JOIN perfil p ON o.id = p.id_ong INNER JOIN ong_objetivo oo ON o.id = oo.id_ong INNER JOIN usuario_objetivo uo ON oo.id_objetivo = uo.id_objetivo WHERE uo.id_usuario = ? AND o.precisa_voluntario = 1;";

            $countStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $countStmt->execute([$id]);
            $total = $countStmt->fetchColumn();

            // query com paginação
            $offset = ($page - 1) * 8;

            $sql = "SELECT p.id,o.nome, p.foto AS foto_perfil, p.missao, p.visao, p.valores, p.descricao, p.curtidas, p.id_ong, COUNT(*) AS objetivos_em_comum, CASE WHEN up.id_usuario IS NOT NULL THEN 1 ELSE 0 END as curtido  FROM ong o INNER JOIN perfil p ON o.id = p.id_ong INNER JOIN ong_objetivo oo ON o.id = oo.id_ong INNER JOIN usuario_objetivo uo ON oo.id_objetivo = uo.id_objetivo  LEFT JOIN usuario_perfil up on up.id_perfil = p.id AND up.id_usuario = ? WHERE uo.id_usuario = ? AND o.precisa_voluntario = 1 GROUP BY o.id ORDER BY objetivos_em_comum DESC LIMIT 8 OFFSET $offset";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id,$id]);
            
            $profiles = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return [
                "profiles" => $profiles,
                "page" => $page,
                "total_pages" => ceil($total/8)
            ];
        }
    }