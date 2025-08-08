<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisições do Router e passar para o Dao de Objetivos

    class ControllerObjective{
        private $objectiveDao;

        public function __construct()
        {
            $this->objectiveDao = new \Api\Models\objectiveDao();
        }
        // método que chama o dao para criar os objetivos do usuário e retorna a resposta
        public function createObjectiveUser($id,$json,$user_type){
            $this->objectiveDao->createObjectiveUser($id,$json,$user_type);
                
            return [
                'status' => 'success',
                'message' => 'Objetivos escolhidos com sucesso',
                'data' => [],
                'status_code' => 201
            ];
        }
        // método que chama o dao para buscar os objetivos do usuário e retorna a resposta
        public function getObjectivesUser($id,$user_type){
            $data = $this->objectiveDao->getObjectivesUser($id,$user_type);

            return [
                "status" => !empty($data) ? "success" : "empty",
                "message" => !empty($data) ? "Objetivos retornados com sucesso" : "Nenhum objetivo encontrado",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }
        // método que chama o dao para buscar os objetivos e retorna a resposta
        public function getAllObjectives(){
            $data = $this->objectiveDao->getAllObjectives();

            return [
                "status" => "success",
                "message" => "Todos os objetivos retornados com sucesso",
                "status_code" => 200,
                "data" => $data
            ];
        }
        // método que chama o dao para atualizar os objetivos do usuário e retorna a resposta
        public function updateObjectivesUser($id,$json,$user_type){
            $this->objectiveDao->updateObjectivesUser($id,$json,$user_type);

            return [
                "status" => "success",
                "message" => "Objetivos atualizados como sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
        // método que chama o dao para buscar as ongs recomendadas para o usuário e retorna a resposta
        public function recommendOng($id,$page){
            $data = $this->objectiveDao->recommendOng($id,$page);

            return [
                "status" => !empty($data) ? "success" : "error",
                "message" => !empty($data) ? "Dados retornados com sucesso" : "Nenhuma ong encontrada com seus objetivos",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }
        // método que chama o dao para buscar os users volutarios recomendados para as ongs e retorna a resposta
        public function recommendUser($id,$page){
            $data = $this->objectiveDao->recommendUser($id,$page);

            return [
                "status" => !empty($data) ? "succes" : "error",
                "message" => !empty($data) ? "usuários encontrados" : "Nenhum usuário encontrado",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }
    }