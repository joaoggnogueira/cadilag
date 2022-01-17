<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha']) ||
        !isset($_POST['descricao']) ||
        !isset($_POST['idestrutura']) ||
        !isset($_POST['historico'])) {
    $descricao = isset($_POST['descricao']) ? "1" : "0";
    $idestrutura = isset($_POST['idestrutura']) ? "1" : "0";
    $historico = isset($_POST['historico']) ? "1" : "0";
    echo json_encode(array("success" => false, "reply" => "Erro de Parametrização 0x" . $descricao . "" . $idestrutura . "" . $historico));
    exit();
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/ReportPDO.php';
include '../controladores/ControladorReport.php';
include '../../../controladores/log.php';

$descricao = filter_input(INPUT_POST, 'descricao', FILTER_SANITIZE_STRING);
$historico = filter_input(INPUT_POST, 'historico', FILTER_SANITIZE_STRING);
$idestrutura = (int) (filter_input(INPUT_POST, 'idestrutura', FILTER_VALIDATE_INT));

$email = $_SESSION['email'];

$controladorReport = new controladores\ControladorReport();

$iduser = -1;
if (($iduser = $controladorReport->checkAcess($email))) {
    if ($controladorReport->insertReport($idestrutura, $descricao, $historico)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao reportar",
            "log" => log::TYPE_NORMAL,
            "debug" => array()
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array()
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

$log = new log($controladorReport->getConnection(), $iduser);
$log->log("NOVO REPORT: " . $response['resposta'], $response['debug'], $response['log']);
