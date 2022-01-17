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
 * Trata a requisição para remover um arquivo de atividade
 * Acessível somente para o dono do arquivo
 * @param id id do arquivo de atividade a ser removido
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if ($controlador->deletarArquivo($id)) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao deletar arquivo!",
            "log" => log::TYPE_NORMAL,
            "debug" => array("id" => $id)
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Erro no Banco",
            "log" => log::TYPE_ERROR,
            "debug" => array("id" => $id)
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
$log->log("REMOVENDO ARQUIVO DA ATIVIDADE: " . $response['resposta'], $response['debug'], $response['log']);
