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

    if (($result = $controladorCode->getCodes($id))) {
        $jsonAdd = json_decode($result['add']);
        $jsonRem = json_decode($result['rem']);
        $jsonSearch = json_decode($result['search']);
        echo json_encode(array("resultado" => true, "resposta" => "Sucesso ao recuperar códigos", "addLines" => $jsonAdd, "remLines" => $jsonRem, "searchLines" => $jsonSearch));
    } else {
        echo json_encode(array("resultado" => false, "resposta" => "Falha ao executar o script"));
    }
} else {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Sessão"));
}
