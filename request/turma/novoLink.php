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
        include '../../entidades/Link.php';

        $index = (int) (filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT));
        $titulo = filter_input(INPUT_POST, 'titulo', FILTER_SANITIZE_STRING);
        $url = filter_input(INPUT_POST, 'url', FILTER_SANITIZE_URL);
        $turma = $controlador->getTurmaByIndex($index);
        if ($turma) {
            if (($link = $turma->novoLink($titulo, $url))) {
                ob_start();
                include '../../includes/linklayout.php';
                $view = ob_get_clean();
                ob_end_flush();
                $response = array(
                    "resultado" => true, 
                    "resposta" => "Novo link adicionado", 
                    "html" => $view
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
$log->log("NOVO LINK: " . $response['resposta']);