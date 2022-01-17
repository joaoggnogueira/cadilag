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
 * Acessível somente para o aluno
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {
    if ($_SESSION['ehAluno']) {
        include '../../controladores/Aluno.php';
        $aluno = $controlador->getAluno();

        if ($aluno->desvincularTurma()) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao desvincular",
                "log" => log::TYPE_NORMAL,
                "debug" => array()
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_NORMAL,
                "debug" => array()
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Usuário não é um aluno",
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

$log = new log($controlador->getConnection(),$controlador->getUserId());
$log->log("ALUNO SE DESVINCULANDO: ".$response['resposta'], $response['debug'], $response['log']);