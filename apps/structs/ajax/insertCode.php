<?php

session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';
include '../../../controladores/log.php';

$rotulo = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$language = filter_input(INPUT_POST, 'language', FILTER_SANITIZE_STRING);
$codeAdd = $_POST['dataAdd'];
$codeRem = $_POST['dataRem'];
$codeSearch = $_POST['dataSearch'];
$id = (int) (filter_input(INPUT_POST, 'idEstrutura', FILTER_VALIDATE_INT));

$email = $_SESSION['email'];

$controladorCode = new controladores\ControladorCodigos();
$iduser = -1;
if (($iduser = $controladorCode->checkAcess($email))) {

    if (($lastId = $controladorCode->registerNewCode($id, $rotulo, $language, json_encode($codeAdd, JSON_UNESCAPED_UNICODE), json_encode($codeRem, JSON_UNESCAPED_UNICODE), json_encode($codeSearch, JSON_UNESCAPED_UNICODE)))) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao registrar código",
            "lastId" => $lastId,
            "log" => log::TYPE_NORMAL,
            "debug" => array(
                "id_estrutura" => $id
            )
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha no banco",
            "log" => log::TYPE_ERROR,
            "debug" => array(
                "id_estrutura" => $id,
                "rotulo" => $rotulo,
                "language" => $language
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
$log->log("NOVO CODIGO: " . $response['resposta'], $response['debug'], $response['log']);
