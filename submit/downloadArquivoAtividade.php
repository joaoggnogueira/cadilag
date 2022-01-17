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
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $isAluno = $_SESSION['ehAluno'];
    include '../entidades/BinaryFile.php';
    if ($isAluno) {
        include '../controladores/Aluno.php';
        $aluno = $controlador->getAluno();
        $binaryFile = $aluno->getBlobArquivoAtividade($id);
    } else {
        include '../controladores/Professor.php';
        $professor = $controlador->getProfessor();
        $binaryFile = $professor->getBlobArquivoAtividade($id);
    }
    if ($binaryFile) {
        $size = $binaryFile->getSize();
        $name = $binaryFile->getName();
        $type = $binaryFile->getType();
        $content = $binaryFile->getContent();

        header("Content-length: $size");
        header("Content-type: $type");
        header("Content-Disposition: attachment; filename=\"$name\";");
        echo $content;
    } else {
        echo "Arquivo não encontrado";
        var_dump($binaryFile);
    }
}