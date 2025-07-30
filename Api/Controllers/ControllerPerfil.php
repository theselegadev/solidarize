<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisições da router e passar para o dao de Perfil

    class ControllerPerfil{
        private $perfilDao;

        public function __construct(){
            $this->perfilDao = new \Api\Models\perfilDao();
        }

        // método que chama o dao para criar o perfil e retorna a resposta
        public function create($id,$json){
            $this->perfilDao->create($id,$json);

            return [
                "status" => "success",
                "message" => "perfil criado com sucesso",
                "status_code" => 201,
                "data" => [] 
            ];
        }
    }