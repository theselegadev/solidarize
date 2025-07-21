<?php
    require_once __DIR__ . "/vendor/autoload.php";

    $router = new \Api\Router\Router();
    $response = $router->handleRequest($_SERVER['REQUEST_METHOD'],$_SERVER['REQUEST_URI']);

    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($response);
