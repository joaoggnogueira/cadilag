<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo 'erro: sessão fechada';
    return;
}

include '../../../config/Database.php';
include '../../../controladores/ControladorUsuario.php';
include '../../../controladores/Professor.php';
include '../../../controladores/Turma.php';
include '../../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
$controlador->setUser($email);

if (!$controlador->ehAluno()) {
    $controlador = $controlador->getProfessor();
    if ($controlador->possuiAcesso()) {
        $index = (int) $_POST['index'];
        $pseudo = $_POST['pseudo'];
        $value = ($_POST['value'] === 'true');
        $idestrutura = (int) $_POST['edid'];
        $turma = $controlador->getTurmaByIndex($index);
        
        if ($turma->setPermission($idestrutura, $pseudo, $value)) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Acesso alterado",
                "log" => log::TYPE_NORMAL,
                "debug" => array(
                    "id_estrutura" => $idestrutura, 
                    "codigo" => $pseudo,
                    "valor" => $value
                )
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha na execução",
                "log" => log::TYPE_ERROR,
                "debug" => array(
                    "id_estrutura" => $idestrutura, 
                    "codigo" => $pseudo,
                    "valor" => $value
                )
            );
        }
        
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Professor não possui acesso",
            "log" => log::TYPE_ANORMAL,
            "debug" => array()
        );
    } 
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Usuário é aluno",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("email" => $email)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("PERMISSOES: " . $response['resposta'], $response['debug'], $response['log']);
