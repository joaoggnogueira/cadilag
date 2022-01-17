<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}

$email = $_SESSION['email'];

$firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING);
$lastname = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING);
$nickname = filter_input(INPUT_POST, 'nickname', FILTER_SANITIZE_STRING);

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {
    if ($controlador->updateUser($nickname, $firstname, $lastname)) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao atualizar perfil",
            "debug" => array(),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha no Banco",
            "debug" => array("fname" => $firstname, "lname" => $lastname, "nname" => $nickname),
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
$log->log("EDITANDO PERFIL: " . $response['resposta'], $response['debug'], $response['log']);
