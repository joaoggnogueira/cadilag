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
 * Trata a requisição para criar uma nova turma
 * @param ano: representa o ano no qual o curso é minitrado
 * @param semestre: 1 ou 2, representa o semestre no qual o curso é minitrado
 * @param iddisciplina: id da disciplina no qual pertence a turm
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$controlador = new ControladorUsuario();
$controlador->setUser($email);

if (!$_SESSION['ehAluno']) {
    $controlador = $controlador->getProfessor();
    if ($controlador->possuiAcesso()) {
        $ano = (int) (filter_input(INPUT_POST, 'ano', FILTER_VALIDATE_INT));
        $semestre = (int) (filter_input(INPUT_POST, 'semestre', FILTER_VALIDATE_INT));
        $iddisciplina = (int) (filter_input(INPUT_POST, 'iddisciplina', FILTER_VALIDATE_INT));
        
        $index = $controlador->getTotalTurmas();
        
        if (($lastid = $controlador->novaTurma($ano, $semestre, $iddisciplina))) {
            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao criar a Turma",
                "lastId" => $index,
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_turma" => $lastid)
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("semestre" => $semestre, "iddisciplina" => $iddisciplina, "ano" => $ano)
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
        "resposta" => "Usuário não tem nível de acesso",
        "log" => log::TYPE_ANORMAL,
        "debug" => array()
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVA TURMA: " . $response['resposta'], $response['debug'], $response['log']);
