<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}
/**
 * Trata a requisição de resposta a uma solicitação
 * Acessível somente pelo o professor
 * @param id: id na tabela solicitações
 * @param resposta: Booleano com a resposta do professor
 */
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/log.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {

    if (!$_SESSION["ehAluno"]) {
        $controlador = $controlador->getProfessor();

        $id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
        $resposta = (boolean) (filter_input(INPUT_POST, 'resposta', FILTER_VALIDATE_BOOLEAN));

        if ($controlador->responderSolicitacao($id, $resposta)) {
            $response = array(
                "resultado" => true,
                "resposta" => "Solicitação respondida com Sucesso",
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_solicitacao" => $id, "resposta" => $resposta)
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("id_solicitacao" => $id, "resposta" => $resposta)
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Usuário não é um professor",
            "log" => log::TYPE_ANORMAL,
            "debug" => array()
        );
    }
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Usuário não é encontrado",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("RESPOSTA SOLICITAÇÃO: " . $response['resposta'], $response['debug'], $response['log']);
