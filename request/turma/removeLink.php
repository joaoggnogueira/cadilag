
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
        $idlink = (int) (filter_input(INPUT_POST, 'linkid', FILTER_VALIDATE_INT));
        $turma = $controlador->getTurmaByIndex($index);

        if ($turma) {
            if ($turma->removerLink($idlink)) {
                $response = array(
                    "resultado" => true, 
                    "resposta" => "Sucesso ao remover o link!"
                );
            } else {
                $response = array(
                    "resultado" => false, 
                    "resposta" => "Falha no Banco!"
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
        "resposta" => "Usuário não é encontrado"
    );
}

echo json_encode($response); 

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("REMOVENDO LINK: " . $response['resposta']);