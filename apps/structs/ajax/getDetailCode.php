<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';

$id = (int) (filter_input(INPUT_POST, 'idCode', FILTER_VALIDATE_INT));
$email = $_SESSION['email'];

$controladorCode = new controladores\ControladorCodigos();

if ($controladorCode->checkAcess($email)) {
    if (($code = $controladorCode->getCodeDetail($id))) {
        echo json_encode(array("resultado" => true, "resposta" => "Sucesso ao obter detalhes sobre Código", "code" => $code));
    } else {
        echo json_encode(array("resultado" => false, "resposta" => "Falha no Banco"));
    }
} else {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Sessão"));
}
