<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisições do Router e passar para o Dao de Ongs

    class ControllerOng{
        private $ongDao;

        public function __construct(){
            $this->ongDao = new \Api\Models\ongDao();
        }

        // método que chama o dao para criar a ong e abre uma sessão com id e tipo do user
        public function create($json){
            $data = $this->ongDao->create($json);

            // criando a sessão
            session_start();
            $_SESSION['user_id'] = $data['user_id'];
            $_SESSION['user_type'] = $data['user_type'];

            return [
                "status_code" => 201,
                "status" => "success",
                "message" => "Instituição criada com sucesso",
                "data" => [
                    "user_id" => $_SESSION['user_id'],
                    "user_type" => $_SESSION['user_type']
                ]
            ];
        }
    }