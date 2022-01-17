<?php

session_start();

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$controlador = new ControladorUsuario();
$browser = "undefined";

if (isset($_SERVER['HTTP_USER_AGENT'])) {
    $browser = $_SERVER['HTTP_USER_AGENT'];
}

try {
    $emailGg = $_POST['email'];
    $idGg = $_POST['id'];

    if ($controlador->checkLoginGoogle($idGg, $emailGg)) {
        $_SESSION['email'] = $controlador->getEmail();
        $_SESSION['senha'] = "Login By Google";
        $_SESSION['ehAluno'] = $controlador->ehAluno();
        $usuario = array("nome" => $controlador->getTitleName());
        $usuario['image'] = $controlador->getFilteredImage();
        $response = array(
            "resultado" => true, 
            "resposta" => "Acesso concedido", 
            "usuario" => $usuario,
            "log" => log::TYPE_NORMAL,
            "debug" => array("browser" => $browser)
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Ninguem está vinculado a esta conta do Google",
            "log" => log::TYPE_ERROR,
            "debug" => array("emailGg" => $emailGg,"browser" => $browser)
        );
    }
} catch (Exception $e) {
    $response = array(
        "resultado" => false, 
        "resposta" => "Erro na inexperado na Requisição",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("emailGg" => $emailGg,"browser" => $browser)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(),$controlador->getUserId());
$log->log("LOGIN GOOGLE : ".$response['resposta'], $response['debug'], $response['log']);