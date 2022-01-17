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

$controlador = new ControladorUsuario();
$email = $_SESSION['email'];

if ($controlador->setUser($email)) {
    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $isAluno = $_SESSION['ehAluno'];
    if ($isAluno) {
        include '../../controladores/Aluno.php';
        $aluno = $controlador->getAluno();
        $access = $aluno->checkAcessToMaterial($id);
    } else {
        include '../../controladores/Professor.php';
        $professor = $controlador->getProfessor();
        $access = $professor->checkAcessToMaterial($id);
    }
    if ($access) {
        include '../../entidades/MaterialDidatico.php';
        $material = $controlador->getMaterialDidatico($id);
        $response = array("resultado" => true,
            "reply" => "Sucesso",
            "resposta" => array(
                "titulo" => $material->getTitulo(),
                "extensao" => $material->getType(),
                "detalhes" => $material->getDetalhes(),
                "name" => $material->getName(),
                "size" => $material->getSize()
            ),
        );
    } else {
        $response = array("resultado" => false, "reply" => "Turma não encontrada", "resposta" => "Turma não encontrada");
    }
} else {
    $response = array("resultado" => false, "reply" => "Usuário não encontrado", "resposta" => "Usuário não encontrado");
}

echo json_encode($response);
