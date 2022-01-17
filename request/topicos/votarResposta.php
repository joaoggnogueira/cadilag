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
    //$id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $idresp = (int) filter_input(INPUT_POST, 'idresp', FILTER_VALIDATE_INT);
    $valor = (boolean) (filter_input(INPUT_POST, 'valor', FILTER_VALIDATE_BOOLEAN));

    if ($controlador->setVoto($idresp, $valor)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao computar voto",
            "debug" => array("id_resposta" => $idresp, "voto" => $valor),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "debug" => array("id_resposta" => $idresp, "voto" => $valor),
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
$log->log("VOTO PARA A RESPOSTA: " . $response['resposta'], $response['debug'], $response['log']);

