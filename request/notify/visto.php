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

$controlador = new ControladorUsuario();
$email = $_SESSION['email'];

if ($controlador->setUser($email)) {
    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    if($controlador->setNotificacaoLida($id)){
        $response = array("resultado" => true, "reply" => "Notificação Lida");
    } else {
        $response = array("resultado" => false, "reply" => "Falha no Banco", "resposta" => "Falha no Banco");
    }
} else {
    $response = array("resultado" => false, "reply" => "Usuário não encontrado", "resposta" => "Usuário não encontrado");
}

echo json_encode($response);
