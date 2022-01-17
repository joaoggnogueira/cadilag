<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {
    $imageurl = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_STRING);

    if ($controlador->setImage($imageurl)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso",
            "debug" => array(),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "debug" => array("imageurl" => $imageurl),
            "log" => log::TYPE_ERROR
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não encontrado",
        "debug" => array("email" => $email),
        "log" => log::TYPE_ANORMAL
    );
}
echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("ATUALIZANDO IMAGEM URL DO PERFIL: " . $response['resposta'], $response['debug'], $response['log']);