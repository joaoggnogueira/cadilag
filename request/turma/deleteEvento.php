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
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $turma = $controlador->getTurmaByIndex($index);
        if ($turma) {
            if (($evento = $turma->deleteEvento($id))) {
                $response = array(
                    "resultado" => true, 
                    "resposta" => "Evento removido"
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
                "resposta" => "Turma não encontrada"
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
$log->log("REMOVENDO EVENTO: " . $response['resposta']);
