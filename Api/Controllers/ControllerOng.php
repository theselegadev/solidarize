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
        // método que chama o dao para buscar os dados e retorna a resposta com os dados
        public function getForId($id){
            $data = $this->ongDao->getForId($id);

            return [
                "status" => !empty($data) ? "success" : "error",
                "message" => !empty($data) ? "Instiuição retornada com sucesso" : "Instituição inexistente",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data,
            ];
        }
        // método que passa os dados para o dao atualizar no banco
        public function update($id,$json){
            $this->ongDao->update($id,$json);

            return [
                "status" => "success",
                "message" => "Dados atualizados com sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que passa os dados para o dao definir se precisa de voluntario
        public function defineNeedVolunteer($id,$json){
            $value = json_decode($json,true);
            $this->ongDao->defineNeedVolunteer($id,$value['value']);

            return [
                "status" => "success",
                "message" => $value['value'] ? "definido que precisa de voluntários" : "definido que não precisa de voluntários",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que chama o login do dao para autenticar a ong, cria a session e retorna a resposta
        public function login($json){
            $data = $this->ongDao->login($json);

            if($data){
                // inicia session da ong
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
                    "message" => "Usuário, cnpj ou senha incorretos",
                    "data" => []
                ];
            }
        }
    }