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
 * Trata a requisição para criar uma nova instituição
 * @param nome: nome da instituilão
 * @param uf: Sigla do Estado Federal da instituição
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    echo 'erro: usuário não encontrado';
    return;
}
if (!$_SESSION['ehAluno']) {
    $controlador = $controlador->getProfessor();
    if ($controlador->possuiAcesso()) {
        $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
        $uf = filter_input(INPUT_POST, 'uf', FILTER_SANITIZE_STRING);

        if (($lastId = $controlador->novaInstituicao($nome, $uf))) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao criar a Instituição", 
                "lastId" => $lastId,
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_instituicao"=>$lastId)
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("nome" => $nome, "uf" => $uf)
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Usuário professor sem acesso confirmado",
            "log" => log::TYPE_ANORMAL,
            "debug" => array()
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não é professor",
        "log" => log::TYPE_ANORMAL,
        "debug" => array()
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVA INSTITUICAO: " . $response['resposta'], $response['debug'], $response['log']);