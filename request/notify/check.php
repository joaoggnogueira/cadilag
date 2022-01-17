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
    $total = $controlador->getTotalNotificacoes();
    if($total !== false){
        $response = array("resultado" => true, "reply" => $total);
    } else {
        $response = array("resultado" => false, "reply" => "Falha no Banco", "data" => $total);
    }
} else {
    $response = array("resultado" => false, "reply" => "Usuário não encontrado", "resposta" => "Usuário não encontrado");
}

echo json_encode($response);
