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
 * Trata a requisição para recuperar informações sobre um arquivo de atividade
 * Acessível somente para o dono do arquivo, ou caso o usuário for professor, qualquer arquivo de uma de suas atividades
 * @param id id do arquivo de atividade
 */

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';

$controlador = new ControladorUsuario();
$email = $_SESSION['email'];

if ($controlador->setUser($email)) {
    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $isAluno = $_SESSION['ehAluno'];
    if ($isAluno) {
        include '../../controladores/Aluno.php';
        $aluno = $controlador->getAluno();
        $access = $aluno->checkAcessToArquivo($id);
    } else {
        include '../../controladores/Professor.php';
        $professor = $controlador->getProfessor();
        $access = $professor->checkAcessToArquivo($id);
    }
    if ($access) {
        include '../../entidades/Arquivo.php';
        $arquivo = $controlador->getArquivo($id);
        $response = array("resultado" => true, "reply" => "Sucesso" ,"resposta" =>
            array("purenome" => $arquivo->getFilename(),
                "extension" => $arquivo->getType(),
                "size" => $arquivo->getSize(),
                "data" => $arquivo->getDataFormatada(),
                "hora" => $arquivo->getHora(),
                "aluno" => $arquivo->getTitleAluno(),
                "isYour" => $arquivo->getIduser()==$controlador->getUserId()));
    } else {
        $response = array("resultado" => false, "reply" => "Turma não encontrada", "resposta" => "Turma não encontrada");
    }
} else {
    $response = array("resultado" => false, "reply" => "Usuário não encontrado", "resposta" => "Usuário não encontrada");
}

echo json_encode($response);
