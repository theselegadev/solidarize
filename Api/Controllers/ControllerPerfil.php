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
        // método que vai chamar o dao para pegar os dados do perfil e retornar a resposta
        public function getPerfil($id){
            $data = $this->perfilDao->getPerfil($id);

            return [
                "status" => !empty($data) ? "success" : "error",
                "message" => !empty($data) ? "Dados do perfil retornados com sucesso" : "Perfil inexistente",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }
        // método que vai chamar o dao para atualizar o perfil e vai retornar a resposta
        public function update($id,$json){
            $this->perfilDao->update($id,$json);

            return [
                "status" => "success",
                "message" => "Dados atualizados com sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que vai chamar o dao para fazer o upload da imagem e vai retornar a resposta
        public function uploadImage($id,$file){
            $data = $this->perfilDao->uploadImage($id,$file);

            return $data;
        }
        // método que vai chamar o likeProfile para controlar as curtidas e retornar a resposta
        public function likeProfile($id,$json){
            $data = json_decode($json,true);
            $this->perfilDao->likeProfile($id,$data['action'],$data['idUser']);

            return [
                "status" => "success",
                "message" => $data['action'] === "increment" ? "curtido" : "descurtido",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que vai chamar o getBest do dao para pegar as melhores ongs e retornar a resposta
        public function getBest($page){
            $data = $this->perfilDao->getBest($page);

            return [
                "status" => !empty($data['profiles']) ? "success" : "error",
                "message" => !empty($data['profiles']) ? "Perfis encontrados" : "Nenhuma instituição encontrada",
                "status_code" => !empty($data['profiles']) ? 200 : 404,
                "data" => $data  
            ];
        }
    }