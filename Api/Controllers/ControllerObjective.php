<?php
    namespace Api\Controllers;
    // Classe responsável por receber as requisições do Router e passar para o Dao de Objetivos

    class ControllerObjective{
        private $objectiveDao;

        public function __construct()
        {
            $this->objectiveDao = new \Api\Models\objectiveDao();
        }

        public function createObjective($id,$json){
            $this->objectiveDao->createObjective($id,$json);
                
            return [
                'status' => 'success',
                'message' => 'Objetivos escolhidos com sucesso',
                'status_code' => 201
            ];
        }

        public function getObjectives($id,$user_type){
            $data = $this->objectiveDao->getObjectives($id,$user_type);

            return [
                "status" => !empty($data) ? "success" : "empty",
                "message" => !empty($data) ? "Objetivos retornados com sucesso" : "Nenhum objetivo encontrado",
                "status_code" => !empty($data) ? 200 : 404,
                "data" => $data
            ];
        }
    }