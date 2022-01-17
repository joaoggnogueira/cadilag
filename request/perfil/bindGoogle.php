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

    if ($controlador->checkLoginGoogle($idGg, $emailGg)) {
        $response = array(
            "resultado" => false,
            "resposta" => "Alguém já vinculou está conta do Google",
            "debug" => array("emailGg" => $emailGg),
            "log" => log::TYPE_ANORMAL
        );
    } else {
        if ($controlador->bindGoogle($idGg, $emailGg)) {
            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao vincular",
                "debug" => array("emailGg" => $emailGg),
                "log" => log::TYPE_NORMAL
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha ao vincular",
                "debug" => array("emailGg" => $emailGg),
                "log" => log::TYPE_ANORMAL
            );
        }
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
$log->log("BIND GOOGLE: " . $response['resposta'], $response['debug'], $response['log']);
