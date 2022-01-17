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
 * Trata a requisição para desnvincular um aluno da turma
 * Acessível somente para o professor
 * @param id: id na tabela de alunos
 * @param index: Representa a posição da turma
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

$id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
$index = (int) (filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT));

if ($controlador->setUser($email)) {
    if (!$_SESSION['ehAluno']) {
        include '../../controladores/Professor.php';
        include '../../controladores/Turma.php';
        $professor = $controlador->getProfessor();
        $turma = $professor->getTurmaByIndex($index);
        if ($turma) {
            if ($turma->desvincularAluno($id)) {
                $response = array(
                    "resultado" => true,
                    "resposta" => "Sucesso ao desvincular aluno",
                    "log" => log::TYPE_NORMAL,
                    "debug" => array("id_aluno" => $id)
                );
            } else {
                $response = array(
                    "resultado" => false,
                    "resposta" => "Falha no Banco",
                    "log" => log::TYPE_ERROR,
                    "debug" => array("id_aluno" => $id)
                );
            }
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Turma não encontrada",
                "log" => log::TYPE_ANORMAL,
                "debug" => array("index" => $index)
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
        "resposta" => "Usuário não encontrado",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("PROFESSOR DESVINCULANDO ALUNO: " . $response['resposta'], $response['debug'], $response['log']);
