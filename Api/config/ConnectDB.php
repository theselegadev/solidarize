<?php
    namespace Api\config;

    // classe de conexão com o banco de dados
    class ConnectDB{
        private static $connect;

        public static function getConnect(){
            if(!isset(self::$connect)){
                try{
                    self::$connect = new \PDO("mysql:host=localhost;dbname=;charset=utf8","root", "");
                    self::$connect->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION);
                }catch(\PDOException $e){
                    throw new \Exception("Erro: ". $e->getMessage());
                }
            }
            
            return self::$connect;
        } 
    }