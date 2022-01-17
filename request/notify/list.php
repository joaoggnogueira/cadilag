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
    $data = $controlador->listNotificacoes();
    if($data !== false){
        
        define("OB_GET",true);
        ob_start();
        include '../../includes/notifyListLayout.php';
        $view = ob_get_clean();
        ob_end_flush();
        
        $response = array("resultado" => true, "reply" => $view);
    } else {
        $response = array("resultado" => false, "reply" => "Falha no Banco");
    }
} else {
    $response = array("resultado" => false, "reply" => "Usuário não encontrado", "resposta" => "Usuário não encontrado");
}

echo json_encode($response);
