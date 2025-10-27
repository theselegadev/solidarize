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
                "message" => "Usuario criado com sucesso",
                "data" => [
                    "user_id" => $_SESSION['user_id'],
                    "user_type" => $_SESSION['user_type']
                ]
            ];
        }
        // método que chama o dao e retorna os dados do user como resposta
        public function getForId($id){
            $data = $this->userDao->getForId($id);

            return [
                "status" => !empty($data) ? "success" : "error",
                "message" => !empty($data) ? "Usuário retornado com sucesso" : "Usuário inexistente",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data,
            ];
            
        }
        // método que chama o update do dao e retorna a resposta
        public function update($id,$json){
            $this->userDao->update($id,$json);

            return [
                "status" => "success",
                "message" => "Dados atualizados com sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que chama o updateImage do dao e retorna a resposta
        public function updateImage($id,$file){
            $data = $this->userDao->updateImage($id,$file);

            return $data;
        }
        // método que chama o defineVolunteer para a operação e retorna a resposta
        public function defineVolunteer($id,$json){
            $data = json_decode($json,true);
            $this->userDao->defineVolunteer($id,$data['value']);

            return [
                "status" => "success",
                "message" => $data['value'] ? "Virou voluntário com sucesso" : "Deixou de ser voluntário com sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que chama o favorite para favoritar a ong e retorna a resposta
        public function favorite($id,$json){
            $action = $this->userDao->favorite($id,$json);

            return [
                "status" => "success",
                "message" => $action == "favorite" ? "Ong favoritada com sucesso" : "Ong desfavoritada com sucesso",
                "status_code" => 201,
                "data" => []
            ];
        }
        // método que chama o getFavorites do dao para pegar os dados e retorna a resposta
        public function getFavorites($id,$page){
            $data = $this->userDao->getFavorites($id,$page);

            return [
                "status" => !empty($data['profiles']) ? "success" : "error",
                "message" => !empty($data['profiles']) ? "Dados retornados com sucesso" : "Não há ongs como favoritas",
                "status_code" => !empty($data['profiles']) ? 200 : 404,
                "data" => $data  
            ];
        }
        // método que chamo o login do dao para autenticar o usuário, cria a session e retorna a resposta
        public function login($json){
            $data = $this->userDao->login($json);

            if($data){
                // inicia a session do usuário
                session_start();
                $_SESSION['user_id'] = $data['user_id'];
                $_SESSION['user_type'] = $data['user_type'];

                return [
                    "status" => "success",
                    "status_code" => 200,
                    "message" => "Login realizado com sucesso",
                    "data" => $data
                ];
            }else{
                return [
                    "status" => "error",
                    "status_code" => 401,
                    "message" => "Usuário ou senha inválidos",
                    "data" => []
                ];
            }
        }
        // método que chama o updateDescription do dao para atualizar a descrição de voluntario e retorna a resposta
        public function updateDescription($id,$json){
            $data = $this->userDao->updateDescription($id,$json);
            
            return [
                "status" => $data ? "success" : "error",
                "message" => $data ? "Atualização de descrição feita com sucesso" : "Usuário não voluntário",
                "status_code" => $data ? 200 : 400,
                "data" => $data ? ["descricao" => $data] : [],
            ];
        }
    }