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
    }