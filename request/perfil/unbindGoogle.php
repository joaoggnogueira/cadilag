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
    $idGg = $_POST['id'];
    $emailGg = $_POST['email'];

    if ($controlador->unbindGoogle($idGg, $emailGg)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao desvincular",
            "debug" => array("emailGg" => $emailGg),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha ao desvincular",
            "debug" => array("emailGg" => $emailGg),
            "log" => log::TYPE_ANORMAL
        );
    }
} else {
    $response = array(
        "resultado" => true, 
        "resposta" => "Usuário não encontrado",
        "debug" => array("email" => $email),
        "log" => log::TYPE_ANORMAL
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("DESNVICULANDO GOOGLE: " . $response['resposta'], $response['debug'], $response['log']);