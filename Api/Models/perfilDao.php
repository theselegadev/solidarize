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
        public function getPerfil($id,$idUser){

            if($idUser){
                $sql = "SELECT p.id, p.id_ong, p.foto, p.missao, p.visao, p.valores, p.descricao, p.curtidas, CASE WHEN uo.id_ong IS NOT NULL THEN 1 ELSE 0 END as favoritado FROM perfil p LEFT JOIN usuario_ong uo ON uo.id_ong = p.id_ong AND uo.id_usuario = ? WHERE p.id_ong = ?";
                $arr_execute = [$idUser,$id];
            }else{
                $sql = "SELECT * FROM perfil WHERE id_ong = ?";
                $arr_execute = [$id];
            }

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute($arr_execute);

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
        public function likeProfile($id,$action,$idUser){
            $sql = "SELECT curtidas FROM perfil WHERE id = ?";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$id]);

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            $value = (int) $result['curtidas'];
            
            if ($action === "increment") {
                $value++;

                $sql = "INSERT INTO usuario_perfil (id_perfil,id_usuario) VALUES (?,?)";
                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute([$id,$idUser]);
            }elseif ($action === "decrement" && $value > 0) {
                $value--;

                $sql = "DELETE FROM usuario_perfil WHERE id_perfil = ? and id_usuario = ?";
                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute([$id,$idUser]);
            }

            $sql = "UPDATE perfil SET curtidas = ? WHERE id = ?";
            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$value,$id]);
        }
        // método que vai buscar o perfis de ongs com mais curtidas
        public function getBest($page,$idUser){
            // query total de registros
            $sql = "SELECT COUNT(p.id) as total FROM perfil p";
            $countStmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $countStmt->execute();

            $total = $countStmt->fetchColumn();

            // query com paginação
            $offset = ($page - 1) * 8;
            $sql = "SELECT p.*, o.nome, CASE WHEN up.id_perfil IS NOT NULL THEN 1 ELSE 0 END as curtido FROM perfil p LEFT JOIN usuario_perfil up ON up.id_perfil = p.id AND up.id_usuario = ? INNER JOIN ong o ON o.id = p.id_ong ORDER BY p.curtidas DESC LIMIT 8 OFFSET $offset";

            $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
            $stmt->execute([$idUser]);

            $bests = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            return [
                "profiles" => $bests,
                "page" => $page,
                "total_pages" => ceil($total/8)
            ];
        }
        // método que vai filtrar os perfis
        public function filterProfiles($page,$idUser,$json){
            $data = json_decode($json,true);
            $params = [$idUser];
            $conditions = [];
            $joins = "";

            $offset = ($page - 1) * 8;

            if($data['user_type'] == "ong"){
                // query que retorna a quantidade de dados
                $sqlCountBase = "SELECT COUNT(p.id) FROM  perfil p INNER JOIN ong o ON o.id = p.id_ong";
                
                // query dos perfis filtrados
                $sqlBase = "SELECT p.id,o.nome, p.foto AS foto_perfil, p.missao, p.visao, p.valores, p.descricao, p.curtidas,p.id_ong, CASE WHEN up.id_perfil IS NOT NULL THEN 1 ELSE 0 END as curtido FROM perfil p INNER JOIN ong o ON p.id_ong = o.id LEFT JOIN usuario_perfil up ON up.id_perfil = p.id AND up.id_usuario = ?";
                
                if(!empty($data['cidade'])){
                    $conditions[] = "o.cidade = ?";
                    $params[] = $data["cidade"];
                }

                if(!empty($data['estado'])){
                    $conditions[] = "o.estado = ?";
                    $params[] = $data['estado'];
                }

                if(!empty($data['precisa_voluntario'])){
                    $conditions[]= "o.precisa_voluntario = ?";
                    $params[] = (int) $data['precisa_voluntario'] ? 1 : 0;
                }

                if(!empty($data['objetivo'])){
                    $joins .= " INNER JOIN ong_objetivo oo ON o.id = oo.id_ong";
                    $conditions[] = "oo.id_objetivo = ?";
                    $params[] = $data['objetivo'];
                }

                $where = "";
                if(!empty($conditions)){
                    $where = " WHERE " . implode(" AND ",$conditions); 
                }
                // formação da query de total de registros com filtro
                $sqlCount = $sqlCountBase . $joins . $where;

                // formação da query dos perfis com paginação com filtro
                $sql = $sqlBase . " " . $joins . " " . $where . " GROUP BY p.id LIMIT 8 OFFSET $offset";

                $paramsCount = array_slice($params,1);

                $stmtCount = \Api\config\ConnectDB::getConnect()->prepare($sqlCount);
                $stmtCount->execute($paramsCount);
                $total = $stmtCount->fetchColumn();

                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute($params);
                $profiles = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

                return [
                    "profiles" => $profiles,
                    "page" => $page,
                    "total_pages" => ceil($total/8)
                ];
            }else if($data['user_type'] == 'user'){
                // query base para contar total de registros
                $sqlCountBase = "SELECT COUNT(*) FROM usuario u";

                // query base para paginação dos registros
                $sqlBase = "SELECT u.id, u.nome, u.descricao, u.foto FROM usuario u";
                $params = [];
                $conditions[] = "u.voluntario = 1";

                if(!empty($data['cidade'])){
                    $params[] = $data['cidade'];
                    $conditions[] = "u.cidade = ?";
                }

                if(!empty($data['estado'])){
                    $params[] = $data['estado'];
                    $conditions[] = "u.estado = ?";
                }

                if(!empty($data['objetivo'])){
                    $params[] = $data['objetivo'];
                    $conditions[] = "uo.id_objetivo = ?";
                    $joins .= " INNER JOIN usuario_objetivo uo ON u.id = uo.id_usuario";
                }

                $where = "";
                if(!empty($conditions)){
                    $where = " WHERE " . implode(" AND ",$conditions); 
                }

                // formação da query de total de registros com filtro
                $sqlCount = $sqlCountBase . $joins . $where;

                // formação da query dos perfis com paginação com filtro
                $sql = $sqlBase . " " . $joins . " " . $where . " GROUP BY u.id LIMIT 8 OFFSET $offset";

                $stmtCount = \Api\config\ConnectDB::getConnect()->prepare($sqlCount);
                $stmtCount->execute($params);
                $total = $stmtCount->fetchColumn();

                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute($params);
                $profiles = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

                return [
                    "profiles" => $profiles,
                    "page" => $page,
                    "total_pages" => ceil($total/8)
                ];
            }
        }
        // método que vai realizar a pesquisa de perfis
        public function searchProfiles($userId, $page, $json){
            $data = json_decode($json,true);
            $offset = ($page - 1) * 8;
            $search = "%". $data['pesquisa'] ."%";
            
            if($data['user_type'] == 'ong'){
                // query para contar a quantidade de registros totais com base na pesquisa
                $sqlCount = "SELECT COUNT(p.id) FROM  perfil p INNER JOIN ong o ON o.id = p.id_ong WHERE o.nome LIKE ?";

                $stmtCount = \Api\config\ConnectDB::getConnect()->prepare($sqlCount);
                $stmtCount->execute([$search]);
                $total = $stmtCount->fetchColumn();

                // query dos perfis com paginação e pesquisa
                $sql = "SELECT p.id,o.nome, p.foto AS foto_perfil, p.missao, p.visao, p.valores, p.descricao, p.curtidas,p.id_ong, CASE WHEN up.id_perfil IS NOT NULL THEN 1 ELSE 0 END as curtido FROM perfil p INNER JOIN ong o ON p.id_ong = o.id LEFT JOIN usuario_perfil up ON up.id_perfil = p.id AND up.id_usuario = ? WHERE o.nome LIKE ? GROUP BY p.id LIMIT 8 OFFSET $offset";

                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute([$userId,$search]);
                $profiles = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

                return [
                    "profiles" => $profiles,
                    "page" => $page,
                    "total_pages" => ceil($total/8)
                ];
            }else if($data['user_type'] == "user"){
                // query para contar o número total de registros retornados da pesquisa
                $sqlCount = "SELECT COUNT(u.id) FROM usuario u WHERE u.nome LIKE ? AND u.voluntario = 1";
                
                // query para retornar os perfis de voluntários da pesquisa com paginação
                $sql = "SELECT u.id, u.nome, u.descricao, u.foto FROM usuario u WHERE u.nome LIKE ? AND u.voluntario = 1 LIMIT 8 OFFSET $offset";

                $stmtCount = \Api\config\ConnectDB::getConnect()->prepare($sqlCount);
                $stmtCount->execute([$search]);
                $total = $stmtCount->fetchColumn();

                $stmt = \Api\config\ConnectDB::getConnect()->prepare($sql);
                $stmt->execute([$search]);
                $profiles = $stmt->rowCount()>0 ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

                return [
                    "profiles" => $profiles,
                    "page" => $page,
                    "total_pages" => ceil($total/8)
                ];
            }
        }   
    }