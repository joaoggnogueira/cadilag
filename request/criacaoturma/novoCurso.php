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
 * Trata a requisição para criar um novo curso
 * @param nome: nome do curso
 * @param sigla: sigla do curso
 * @param idinstituicao: id da instituição no qual pertence o curso
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
        $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
        $sigla = filter_input(INPUT_POST, 'sigla', FILTER_SANITIZE_STRING);
        $idinst = (int) (filter_input(INPUT_POST, 'idinstituicao', FILTER_VALIDATE_INT));

        if (($lastId = $controlador->novoCurso($nome, $sigla, $idinst))) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao criar o Curso", 
                "lastId" => $lastId,
                "log" => log::TYPE_NORMAL,
                "debug" => array("id_curso" => $lastId)
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Falha no Banco",
                "log" => log::TYPE_ERROR,
                "debug" => array("nome" => $nome, "sigla" => $sigla, "id_instituicao" => $idinst)
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
$log->log("NOVO CURSO: " . $response['resposta'], $response['debug'], $response['log']);