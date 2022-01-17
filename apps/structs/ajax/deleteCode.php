<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Sessão Fechada, tente fazer login novamente"));
    exit();
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';
include '../../../controladores/log.php';

$id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
$email = $_SESSION['email'];


$controladorCode = new controladores\ControladorCodigos();
$iduser = -1;
if (($iduser = $controladorCode->checkAcess($email))) {
    if ($controladorCode->deleteCode($id)) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao remover código",
            "log" => log::TYPE_NORMAL,
            "debug" => array("id_codigo" => $id)
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array("id_codigo" => $id)
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

$log = new log($controladorCode->getConnection(), $iduser);
$log->log("REMOVENDO CODIGO: " . $response['resposta'], $response['debug'], $response['log']);
