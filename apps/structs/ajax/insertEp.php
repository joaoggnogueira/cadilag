<?php

session_start();

if (!isset($_SESSION['email']) ||
        !isset($_SESSION['senha'])) {
    echo json_encode(array("resultado" => false, "resposta" => "Sessão Fechada, tente reiniciar a Sessão"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/EpPDO.php';
include '../controladores/ControladorEp.php';
include '../../../controladores/log.php';

$rotulo = filter_input(INPUT_POST, 'rotulo', FILTER_SANITIZE_STRING);
$lista = $_POST['lista'];
$id = (int) (filter_input(INPUT_POST, 'idestrutura', FILTER_VALIDATE_INT));

$email = $_SESSION['email'];

$controladorEp = new controladores\ControladorEp();
$iduser = -1;
if (($iduser = $controladorEp->checkAcess($email))) {
    if (($lastid = $controladorEp->registerNewEP($rotulo, $id, count($lista), json_encode($lista)))) {
        $response = array(
            "resultado" => true,
            "resposta" => "Entrada Programada criada",
            "lastId" => $lastid,
            "log" => log::TYPE_NORMAL,
            "debug" => array("id_entrada" => $lastid)
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha no banco",
            "log" => log::TYPE_ERROR,
            "debug" => array("rotulo" => $rotulo, "id_estrutura" => $id)
        );
    }
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Usuário não encontrado",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controladorEp->getConnection(), $iduser);
$log->log("NOVA ENTRADA PROGRAMADA: " . $response['resposta'], $response['debug'], $response['log']);
