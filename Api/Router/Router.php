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