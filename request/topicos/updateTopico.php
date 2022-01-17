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
include '../../controladores/log.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {
    $id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
    $title = filter_input(INPUT_POST, 'titulo', FILTER_SANITIZE_STRING);
    $text = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['texto'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));
    $indexturma = filter_input(INPUT_POST, 'turma', FILTER_SANITIZE_STRING);

    $particular = (boolean) (filter_input(INPUT_POST, 'particular', FILTER_VALIDATE_BOOLEAN));
    $report = (boolean) (filter_input(INPUT_POST, 'report', FILTER_VALIDATE_BOOLEAN));
    $anonimo = (boolean) (filter_input(INPUT_POST, 'anonimo', FILTER_VALIDATE_BOOLEAN));
    $isAluno = $_SESSION['ehAluno'];

    if ($indexturma == "null") {
        $idturma = null;
    } else {
        include '../../controladores/Turma.php';
        if ($isAluno) {
            include '../../controladores/Aluno.php';
            $aluno = $controlador->getAluno();
            $turma = $aluno->getTurma();
        } else {
            include '../../controladores/Professor.php';
            $professor = $controlador->getProfessor();
            $turma = $professor->getTurmaByIndex($indexturma);
        }
        if (!$turma) {
            echo json_encode(array("resultado" => false, "resposta" => "Turma não encontrada"));
            $log = new log($controlador->getConnection(), $controlador->getUserId());
            $log->log("ATUALIZANDO TÓPICO: Turma não encontrada", array("index" => $indexturma), log::TYPE_ANORMAL);
            return;
        }
        $idturma = $turma->getIdturma();
    }

    if ($controlador->updateTopico($id, $title, $text, $particular, $report, $anonimo, $idturma)) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao alterar o tópico",
            "debug" => array("id" => $id),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha no Banco",
            "debug" => array("id" => $id, "title" => $title, "text" => $text),
            "log" => log::TYPE_ERROR
        );
    }
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Usuário não é encontrado",
        "debug" => array("email" => $email),
        "log" => log::TYPE_ANORMAL
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("ATUALIZANDO TÓPICO: " . $response['resposta'], $response['debug'], $response['log']);
