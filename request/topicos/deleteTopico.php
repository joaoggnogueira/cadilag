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
    $id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));

    if ($id) {
        if ($controlador->deleteTopico($id)) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao remover tópico",
                "debug" => array("id_topico" => $id),
                "log" => log::TYPE_NORMAL
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco",
                "debug" => array("id_topico" => $id),
                "log" => log::TYPE_ANORMAL
            );
        }
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
$log->log("REMOVENDO TOPICO: " . $response['resposta'], $response['debug'], $response['log']);

