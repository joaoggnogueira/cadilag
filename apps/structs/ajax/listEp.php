<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Sessão fechada"));
    return;
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/EpPDO.php';
include '../controladores/ControladorEp.php';
include '../entidades/EntradaProgramada.php';

$id = (int) filter_input(INPUT_POST, 'idEstrutura', FILTER_VALIDATE_INT);

$email = $_SESSION['email'];

$controladorEp = new controladores\ControladorEp();

if ($controladorEp->checkAcess($email)) {
    $lista = $controladorEp->listEp($id);
    echo json_encode(array("resultado" => true, "resposta" => "Sucesso", "lista" => $lista));
} else {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Sessão"));
}

    
