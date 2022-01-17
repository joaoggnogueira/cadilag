<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo 'Erro: Sessão fechada';
}
include '../config/Database.php';
include '../controladores/ControladorUsuario.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();

if ($controlador->setUser($email)) {

    $isAluno = $_SESSION['ehAluno'];
    include '../controladores/Turma.php';
    include '../entidades/BinaryFile.php';
    if ($isAluno) {
        include '../controladores/Aluno.php';
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $aluno = $controlador->getAluno();
        $turma = $aluno->getTurma($id);
    } else {
        $index = filter_input(INPUT_POST, 'index', FILTER_VALIDATE_INT);
        include '../controladores/Professor.php';
        $professor = $controlador->getProfessor();
        $turma = $professor->getTurmaByIndex($index);
    }
    $binaryFile = $turma->getBlobPlanoEnsino();
    if ($binaryFile) {
        $size = $binaryFile->getSize();
        $name = $binaryFile->getName();
        $type = $binaryFile->getType();
        $content = $binaryFile->getContent();

        if ($type == "application/pdf") {
            header("Content-Type: $type");
            header('Content-Disposition: inline; filename=' . $path);
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
        } else {
            header("Content-length: $size");
            header("Content-type: $type");
            header("Content-Disposition: attachment; filename=\"$name\";");
        }
//
//        header("Content-length: $size");
//        header("Content-type: $type");
//        header("Content-Disposition: attachment; filename=\"$name\";");
        echo $content;
    } else {
        echo "Arquivo não encontrado";
        var_dump($binaryFile);
    }
}