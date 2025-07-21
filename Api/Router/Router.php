<?php
    namespace Api\Router;

    // Classe responsável pelo controle de rotas e requisições

    class Router{
        private $controllerUser;
        private $controllerOng;

        public function __construct()
        {
            $this->controllerUser = new \Api\Controllers\ControllerUser();
        }

        // Método que vai lidar com com as requisições, rotas e devolverá a resposta esperada
        public function handleRequest($method,$uri){
            $route = explode('/',trim($uri,"/"));
            $route = array_slice($route,2);

            switch ($route[0]) {
                case 'user':
                    if($method == "POST"){
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
                        $data = $this->controllerUser->getForId($route[1]);

                        http_response_code($data['status_code']);

                        return [
                            "status" => $data['status'],
                            "message" => !empty($data['data']) ? "Dados do usuário retornados com sucesso" : "Nenhum usuário encontrado",
                            "data" => $data['data'],
                        ];
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