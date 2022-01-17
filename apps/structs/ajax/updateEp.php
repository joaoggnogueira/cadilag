<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("resultado" => false, "resposta" => "Erro de Interno, falta de parâmetros"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/EpPDO.php';
include '../controladores/ControladorEp.php';
include '../../../controladores/log.php';

$rotulo = filter_input(INPUT_POST, 'rotulo', FILTER_SANITIZE_STRING);
$lista = $_POST['lista'];
$id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
$email = $_SESSION['email'];

$controladorEp = new controladores\ControladorEp();
$iduser = -1;
if (($iduser = $controladorEp->checkAcess($email))) {
    if (($result = $controladorEp->updateEP($rotulo, $id, count($lista), json_encode($lista, JSON_UNESCAPED_UNICODE)))) {
        $response = array(
            "resultado" => true, 
            "resposta" => "Sucesso ao atualizar a Entrada", 
            "fetch" => $result,
            "log" => log::TYPE_NORMAL,
            "debug" => array("id_entrada" => $id)
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array("rotulo" => $rotulo, "id_entrada" => $id)
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
$log->log("ALTERANDO ENTRADA PROGRAMADA: " . $response['resposta'], $response['debug'], $response['log']);
