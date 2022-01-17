<?php

session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';
include '../../../controladores/log.php';

$codeAdd = $_POST['dataAdd'];
$codeRem = $_POST['dataRem'];
$codeSearch = $_POST['dataSearch'];

$id = (int) (filter_input(INPUT_POST, 'idCode', FILTER_VALIDATE_INT));
$rotulo = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$language = filter_input(INPUT_POST, 'language', FILTER_SANITIZE_STRING);

$email = $_SESSION['email'];

$controladorCode = new controladores\ControladorCodigos();

$iduser = -1;
if (($iduser = $controladorCode->checkAcess($email))) {
    $jsonAdd = json_encode($codeAdd, JSON_UNESCAPED_UNICODE);
    $jsonRem = json_encode($codeRem, JSON_UNESCAPED_UNICODE);
    $jsonSearch = json_encode($codeSearch, JSON_UNESCAPED_UNICODE);
    if ($controladorCode->updateCode($id, $rotulo, $language, $jsonAdd, $jsonRem, $jsonSearch)) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao registrar código",
            "log" => log::TYPE_NORMAL,
            "debug" => array(
                "id_código" => $id,
                "rotulo" => $rotulo,
                "linguagem" => $language
            )
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Erro no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array(
                "id_código" => $id,
                "rotulo" => $rotulo,
                "linguagem" => $language
            )
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
$log->log("ALTERANDO CODIGO: " . $response['resposta'], $response['debug'], $response['log']);
