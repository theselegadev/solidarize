<?php
    namespace Api\Router;

    // Classe responsável pelo controle de rotas e requisições

    class Router{
        private $controllerUser;
        private $controllerObjective;
        private $controllerOng;

        public function __construct()
        {
            $this->controllerUser = new \Api\Controllers\ControllerUser();
            $this->controllerObjective = new \Api\Controllers\ControllerObjective();
        }

        // Método que vai lidar com com as requisições, rotas e devolverá a resposta esperada
        public function handleRequest($method,$uri){
            $route = explode('/',trim($uri,"/"));
            $route = array_slice($route,2);

            switch ($route[0]) {
                // rota user
                case 'user':
                    if($method == "POST"){
                        // método post
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->create($body);

                        http_response_code($data['status_code']);
                        return [
                            "status" => "success",
                            "message" => "Usuário criado com sucesso!",
                            "data" => [
                                "user_id" => $data['data']['user_id'],
                                "user_type" => $data['data']['user_type'],
                            ]
                        ];
                    }else if($method == "GET" and !empty($route[1]) and is_numeric($route[1])){
                        // método get
                        $data = $this->controllerUser->getForId($route[1]);

                        http_response_code($data['status_code']);

                        return [
                            "status" => $data['status'],
                            "message" => !empty($data['data']) ? "Dados do usuário retornados com sucesso" : "Nenhum usuário encontrado",
                            "data" => $data['data'],
                        ];
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método put
                        $body = file_get_contents("php://input");
                        $data = $this->controllerUser->update($route[1],$body);

                        http_response_code($data['status_code']);

                        return [
                            "status" => $data['status'],
                            "message" => $data['message'],
                            "data" => $data['data']
                        ];
                    }

                    break;
                
                // rota user-objective
                case "user-objective":
                    if($method === "POST" and !empty($route[1]) and is_numeric($route[1])){
                        // método post
                        $body = file_get_contents("php://input");

                        $data = $this->controllerObjective->createObjectiveUser($route[1],$body);

                        http_response_code($data['status_code']);

                        return [
                            'status' => $data['status'],
                            'message' => $data['message'],
                            'data' => []
                        ];
                    }else if($method === "GET" and is_numeric($route[1])){
                        // método get
                        $data = $this->controllerObjective->getObjectivesUser($route[1],"user");

                        http_response_code($data['status_code']);

                        return [
                            "status" => $data['status'],
                            "message" => $data['message'],
                            "data" => $data['data']
                        ];
                    }else if($method === "PUT" and is_numeric($route[1])){
                        // método put
                        $body = file_get_contents("php://input");

                        $data = $this->controllerObjective->updateObjectivesUser($route[1],$body,"user");

                        http_response_code($data['status_code']);

                        return [
                            "status" => $data['status'],
                            "message" => $data['message'],
                            "data" => $data['data']
                        ];
                    }

                    break;
                
                // rota objectives
                case "objectives":
                    // método get
                    $data = $this->controllerObjective->getAllObjectives();

                    http_response_code($data['status_code']);

                    return [
                        "status" => $data['status'],
                        "message" => $data['message'],
                        "data" => $data['data']
                    ];
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