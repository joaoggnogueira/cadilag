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
 * Trata a requisição para remover uma atividade e seus arquivos
 * Acessível somente para professores
 * @param email email a ser testado
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {

    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if (!$_SESSION['ehAluno']) {
        include '../../controladores/Professor.php';
        $professor = $controlador->getProfessor();

        if ($professor->deleteArquivosAtividade($id)) {
            if ($professor->deleteAtividade($id)) {
                $response = array("resultado" => true, "resposta" => "Sucesso ao deletar a atividade", "log" => log::TYPE_NORMAL);
            } else {
                $response = array("resultado" => false, "resposta" => "Erro ao deletar a atividade", "log" => log::TYPE_ERROR);
            }
        } else {
            $response = array("resultado" => false, "resposta" => "Erro ao deletar arquivos", "log" => log::TYPE_ERROR);
        }
    } else {
        $response = array("resultado" => false, "resposta" => "Aluno não possui permissão para esta operação", "log" => log::TYPE_ANORMAL);
    }
} else {
    $response = array("resultado" => false, "resposta" => "Usuário não encontrado", "log" => log::TYPE_ANORMAL);
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("REMOVENDO ATIVIDADE: " . $response['resposta'], array("id_atividade" => $id), $response['log']);
