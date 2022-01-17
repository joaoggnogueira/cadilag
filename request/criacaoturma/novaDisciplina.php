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
 * Trata a requisição para criar uma nova disciplina
 * @param nome: nome da disciplina
 * @param idcurso: id na tabela curso
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$sennha = $_SESSION['senha'];
$controlador = new ControladorUsuario();
$controlador->setUser($email);

if (!$_SESSION['ehAluno']) {
    $professor = $controlador->getProfessor();
    if ($professor->possuiAcesso()) {
        $nome = (filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING));
        $idcurso = (filter_input(INPUT_POST, 'idcurso', FILTER_VALIDATE_INT));

        if (($lastId = $professor->novaDisciplina($nome, $idcurso))) {
            $response = array(
                "resultado" => true,
                "resposta" => "Disciplina criada com Sucesso",
                "lastId" => $lastId,
                "log" => log::TYPE_NORMAL,
                "debug" => array('id_disciplina' => $lastId)
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array('nome' => $nome, "idcurso" => $idcurso)
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
$log->log("NOVA DISCIPLINA: " . $response['resposta'], $response['debug'], $response['log']);
