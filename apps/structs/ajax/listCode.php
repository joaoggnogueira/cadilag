<?php

session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';

$id = (int) (filter_input(INPUT_POST, 'idEstrutura', FILTER_VALIDATE_INT));
$email = $_SESSION['email'];

$controladorCode = new controladores\ControladorCodigos();

if ($controladorCode->checkAcess($email)) {
    $lista = $controladorCode->listCodes($id);
    echo json_encode(array("resultado" => true, "resposta" => "Sucesso ao listar Códigos", "lista" => $lista));
} else {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Sessão"));
}


