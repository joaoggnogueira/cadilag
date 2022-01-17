<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/EpPDO.php';
include '../controladores/ControladorEp.php';

$id = filter_input(INPUT_POST, "idEp", FILTER_VALIDATE_INT);
$email = $_SESSION['email'];

$controladorEp = new controladores\ControladorEp();
if ($controladorEp->checkAcess($email)) {
    $result = $controladorEp->getJSON($id);
    if ($result) {
        echo json_encode(
            array(
                "resultado" => true, 
                "resposta" => "Suceso ao recuperar entrada programada",
                "id"=>$id, 
                "lista" => json_decode($result['json']), 
                "rotulo" => $result['rotulo'], 
                "idEstrutura" => $result['idEstrutura'],
                "iduser" => $result['iduser']
            )
        );
    } else {
        echo json_encode(array("resultado" => false, "resposta" => "Falha no Banco"));
    }
} else {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Sessão"));
}
    