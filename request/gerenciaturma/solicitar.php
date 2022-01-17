<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Aluno.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {
    if ($_SESSION['ehAluno']) {
        $controlador = $controlador->getAluno();

        $idturma = (int) (filter_input(INPUT_POST, 'idturma', FILTER_VALIDATE_INT));
        if ($controlador->solicitarEntradaEmTurma($idturma)) {
            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao solicitar entrada na Turma",
                "log" => log::TYPE_NORMAL,
                "debug" => array("idturma" => $idturma)
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("idturma" => $idturma)
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Usuário não é um aluno",
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
$log->log("CRIANDO SOLICITAÇÃO: " . $response['resposta'], $response['debug'], $response['log']);
