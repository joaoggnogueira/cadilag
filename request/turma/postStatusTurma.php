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
include '../../controladores/Professor.php';
include '../../controladores/Turma.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {
    if (!$_SESSION['ehAluno']) {
        $controlador = $controlador->getProfessor();

        $index = (int) (filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT));
        $status = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['status'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));
        $turma = $controlador->getTurmaByIndex($index);

        if ($turma->setStatus($status)) {
            $status = preg_replace("/\t/", "&nbsp&nbsp&nbsp&nbsp", nl2br($status));
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao alterar Status", 
                "status" => $status
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco"
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Usuário não é um professor"
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não encontrado"
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVO STATUS DA TURMA: " . $response['resposta']);