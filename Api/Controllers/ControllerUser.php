<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisiçoes da Router e passar para a model do usuário

    class ControllerUser{
        private $userDao;

        public function __construct()
        {
            $this->userDao = new \Api\Models\userDao();
        }

        // método que passa os dados para o dao e cria uma sessão com o id e tipo do user
        public function create($json){
            $data = $this->userDao->create($json);

            // criando a sessão
            session_start();
            $_SESSION['user_id'] = $data['user_id'];
            $_SESSION['user_type'] = $data['user_type'];

            return [
                "status_code" => 201,
                "status" => "success",
                "data" => [
                    "user_id" => $_SESSION['user_id'],
                    "user_type" => $_SESSION['user_type']
                ]
            ];
        }
        // método que chama o dao e retorna os dados do user
        public function getForId($id){
            $data = $this->userDao->getForId($id);

            return [
                "status" => !empty($data) ? "success" : "error",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data,
            ];
            
        }
        // método que chama o dao e passa os dados para o update
        public function update($id,$json){
            $this->userDao->update($id,$json);

            return [
                "status" => "success",
                "message" => "Dados atualizados com sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
    }