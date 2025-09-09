<?php
    namespace Api\Router;

    // Classe responsável pelo controle de rotas e requisições

    class Router{
        private $controllerUser;
        private $controllerObjective;
        private $controllerOng;
        private $controllerPerfil;

        public function __construct()
        {
            $this->controllerUser = new \Api\Controllers\ControllerUser();
            $this->controllerObjective = new \Api\Controllers\ControllerObjective();
            $this->controllerOng = new \Api\Controllers\ControllerOng();
            $this->controllerPerfil = new \Api\Controllers\ControllerPerfil();
        }

        // método que prepara a resposta
        public static function prepareResponse($array){
            http_response_code($array['status_code']);

            return [
                "status" => $array['status'],
                "message" => $array['message'],
                "data" => $array['data']
            ];
        }

        // Método que vai lidar com com as requisições, rotas e devolverá a resposta esperada
        public function handleRequest($method,$uri){
            $route = explode('/',trim($uri,"/"));
            $route = array_slice($route,2);

            switch ($route[0]) {
                // rota user
                case 'user':
                    if($method == "POST"){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->create($body);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method == "GET" and !empty($route[1]) and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerUser->getForId($route[1]);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->update($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                
                // rota user-objective
                case "user-objective":
                    if($method === "POST" and !empty($route[1]) and is_numeric($route[1])){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerObjective->createObjectiveUser($route[1],$body,"user");

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerObjective->getObjectivesUser($route[1],"user");

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerObjective->updateObjectivesUser($route[1],$body,"user");

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                
                // rota objectives
                case "objectives":
                    if($method == "GET"){
                        // método GET
                        $data = $this->controllerObjective->getAllObjectives();

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                // rota user-image
                case "user-image":
                    if($method === "POST" and is_numeric($route[1])){
                        // método POST
                        $data = $this->controllerUser->updateImage($route[1],$_FILES['image_user']);
                        
                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                // rota user-volunteer 
                case "user-volunteer":
                    if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->defineVolunteer($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;

                // rota ong
                case "ong":
                    if($method === "POST"){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerOng->create($body);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerOng->getForId($route[1]);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerOng->update($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                // rota ong-objective
                case "ong-objective":
                    if($method === "POST" and is_numeric($route[1])){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerObjective->createObjectiveUser($route[1],$body,"ong");

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerObjective->getObjectivesUser($route[1],"ong");

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerObjective->updateObjectivesUser($route[1],$body,"ong");

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                // rota ong-perfil
                case "ong-perfil":
                    if($method === "POST" and is_numeric($route[1])){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerPerfil->create($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerPerfil->getPerfil($route[1]);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerPerfil->update($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota ong-image
                case "ong-image":
                    if($method === "POST" and is_numeric($route[1])){
                        // método POST
                        $data = $this->controllerPerfil->uploadImage($route[1],$_FILES['image']);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota ong-need-volunteer
                case "ong-need-volunteer":
                    if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerOng->defineNeedVolunteer($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota user-recommended
                case "user-recommended":
                    if($method === "GET" and is_numeric($route[1]) and is_numeric($route[2])){
                        // método GET
                        $data = $this->controllerObjective->recommendOng($route[1],$route[2]);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota ong-recommended
                case "ong-recommended":
                    if($method === "GET" and is_numeric($route[1]) and is_numeric($route[2])){
                        // método GET
                        $data = $this->controllerObjective->recommendUser($route[1],$route[2]);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota need-volunteer
                case "need-volunteer":
                    if($method === "GET" and is_numeric($route[1]) and is_numeric($route[2])){
                        // método GET
                        $data = $this->controllerObjective->needVolunteer($route[1],$route[2]);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota user-favorite
                case "user-favorite":
                    if($method === "POST" and is_numeric($route[1])){
                        // método POST
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->favorite($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerUser->getFavorites($route[1]);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota like-profile
                case "like-profile":
                    if($method === "PUT" and is_numeric($route[1])){
                        // método PUT
                        $body = file_get_contents("php://input");
                        $data = $this->controllerPerfil->likeProfile($route[1],$body);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota best-ongs
                case "best-ongs":
                    if($method === "GET" and is_numeric($route[1])){
                        // método GET
                        $data = $this->controllerPerfil->getBest($route[1]);

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota data-user
                case "data-user":
                    if($method === "GET"){
                        // método GET
                        session_start();

                        $data = [
                            "status" => "success",
                            "message" => "Dados do usuário",
                            "status_code" => 200,
                            "data" => [
                                "user_id" => $_SESSION['user_id'],
                                "user_type" => $_SESSION['user_type']
                            ]                        
                        ];

                        // resposta
                        return self::prepareResponse($data);
                    }

                    break;
                // rota logout
                case "logout":
                    if($method === "POST"){
                        // método POST
                        session_start();
                        session_unset();
                        session_destroy();

                        $data = [
                            "status" => "success",
                            "message" => "Sessão encerrada com sucesso",
                            "status_code" => 200,
                            "data" => []
                        ];

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                // rota login
                case "login":
                    if($method === "POST" and isset($route[1])){
                        // método POST
                        $body = file_get_contents("php://input");
                        
                        if($route[1] === "user"){
                            $data = $this->controllerUser->login($body);
                        }else if($route[1] === "ong"){
                            $data = $this->controllerOng->login($body);
                        }else{
                            $data = [
                                "status" => "error",
                                "message" => "tipo de usuário inválido",
                                "status_code" => 404,
                                "data" => []
                            ];
                        }

                        // resposta
                        return self::prepareResponse($data);
                    }
                    break;
                default:
                    http_response_code(404);
                    return [
                        "status" => "error",
                        "message" => "Nenhuma rota encontrada",
                        "data" => []
                    ];

                    break;
            }
        }
    }