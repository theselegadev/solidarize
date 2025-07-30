<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisições do Router e passar para o Dao de Objetivos

    class ControllerObjective{
        private $objectiveDao;

        public function __construct()
        {
            $this->objectiveDao = new \Api\Models\objectiveDao();
        }

        public function createObjectiveUser($id,$json,$user_type){
            $this->objectiveDao->createObjectiveUser($id,$json,$user_type);
                
            return [
                'status' => 'success',
                'message' => 'Objetivos escolhidos com sucesso',
                'data' => [],
                'status_code' => 201
            ];
        }

        public function getObjectivesUser($id,$user_type){
            $data = $this->objectiveDao->getObjectivesUser($id,$user_type);

            return [
                "status" => !empty($data) ? "success" : "empty",
                "message" => !empty($data) ? "Objetivos retornados com sucesso" : "Nenhum objetivo encontrado",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }

        public function getAllObjectives(){
            $data = $this->objectiveDao->getAllObjectives();

            return [
                "status" => "success",
                "message" => "Todos os objetivos retornados com sucesso",
                "status_code" => 200,
                "data" => $data
            ];
        }

        public function updateObjectivesUser($id,$json,$user_type){
            $this->objectiveDao->updateObjectivesUser($id,$json,$user_type);

            return [
                "status" => "success",
                "message" => "Objetivos atualizados como sucesso",
                "status_code" => 200,
                "data" => []
            ];
        }
    }