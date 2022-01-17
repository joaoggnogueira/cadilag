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
 * Trata a requisição para atualizar uma atividade
 * Acessível somente para professores
 * @param texto a descrição da atividade
 * @param titulo título da atividade
 * @param dia dia de encerramento da atividade
 * @param mes mes de encerramento da atividade
 * @param ano ano de encerramento da atividade
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/Professor.php';
include '../../controladores/Turma.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {

    if (!$_SESSION['ehAluno']) {
        $controlador = $controlador->getProfessor();

        $texto = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['texto'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));
        $titulo = filter_input(INPUT_POST, 'titulo', FILTER_SANITIZE_STRING);

        $dia = filter_input(INPUT_POST, 'dia', FILTER_SANITIZE_STRING);
        $mes = filter_input(INPUT_POST, 'mes', FILTER_SANITIZE_STRING);
        $ano = filter_input(INPUT_POST, 'ano', FILTER_SANITIZE_STRING);
        $data = $ano . "-" . $mes . "-" . $dia;

        if (strlen($titulo) == 0) {
            echo json_encode(array("resultado" => false, "resposta" => "Título da Atividade não pode ser vazio"));
            $log = new log($controlador->getConnection(), $controlador->getUserId());
            $log->log("Título da Atividado vazio", array(), log::TYPE_ERROR);
            exit();
        }
        if (strlen($texto) == 0) {
            echo json_encode(array("resultado" => false, "resposta" => "Texto da Atividade não pode ser vazio"));
            $log = new log($controlador->getConnection(), $controlador->getUserId());
            $log->log("Texto da Atividade vazio", array(), log::TYPE_ERROR);
            exit();
        }

        if ($data == "--") {
            echo json_encode(array("resultado" => false, "resposta" => "Campo Data não pode ser vazio"));
            $log = new log($controlador->getConnection(), $controlador->getUserId());
            $log->log("Campo Data vazio", array(), log::TYPE_ERROR);
            exit();
        }

        $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $index = (int) filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT);
        $turma = $controlador->getTurmaByIndex($index);

        if ($turma->updateAtividade($id, $titulo, $texto, $data)) {
            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao atualizar Atividade",
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_atividade" => $id)
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Erro no banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("id_atividade" => $id, "titulo" => $titulo, "texto" => $texto, "data" => $data)
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
        "debug" => array('email' => $email)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVA ATIVIDADE: " . $response['resposta'], $response['debug'], $response['log']);
