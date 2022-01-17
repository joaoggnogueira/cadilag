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
 * Trata a requisição para remover uma solicitação para entrar em um turma
 * Acessível somente para o aluno, autor da solicitação
 */
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Aluno.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {
    if ($_SESSION['ehAluno']) {
        $controlador = $controlador->getAluno();

        if (($id = $controlador->cancelarSolicitacao())) {
            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao cancelar a solicitação",
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_solicitacao" => $id)
            );
        } else {
            $solicitacao = $controlador->getSolicitacao();
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("id_solicitacao" => $solicitacao['id'])
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Usuário não é um aluno!",
            "log" => log::TYPE_ANORMAL,
            "debug" => array()
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

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("SOLICITAÇÃO CANCELADA: " . $response['resposta'], $response['debug'], $response['log']);
