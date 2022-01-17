<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Sessão Fechada, tente fazer login novamente"));
    exit();
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/EpPDO.php';
include '../controladores/ControladorEp.php';
include '../../../controladores/log.php';

$id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
$email = $_SESSION['email'];

$controladorEp = new controladores\ControladorEp();
$iduser = -1;
if (($iduser = $controladorEp->checkAcess($email))) {
    if ($controladorEp->deleteEp($id)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao remover Entrada Programada",
            "log" => log::TYPE_NORMAL,
            "debug" => array("id_entradaProgramada" => $id)
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array(),
            "debug" => array("id_entradaProgramada" => $id)
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Erro de Sessão",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controladorEp->getConnection(), $iduser);
$log->log("REMOVENDO ENTRADA PROGRAMADA: " . $response['resposta'], $response['debug'], $response['log']);
