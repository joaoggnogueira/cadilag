<?php

session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array("success" => false, "reply" => "Erro de Parametrização"));
}

include '../../../config/Database.php';
include '../controladores/PDOCadilag.php';
include '../controladores/CodePDO.php';
include '../controladores/ControladorCodigos.php';

$email = $_SESSION['email'];

$controladorCode = new controladores\ControladorCodigos();

if ($controladorCode->checkAcess($email)) {
    $lista = $controladorCode->listEstruturasDeDados();
    ?> 
        <select>
            <?PHP foreach ($lista as $estrutura): ?>
                <option value="<?= $estrutura['id']?>"><?= utf8_encode($estrutura['nome'])?></option>
            <?PHP endforeach; ?>
        </select>    
    <?PHP
} else {
    ?>
    <select>
        <option selected>Falha ao obter lista de Estruturas de Dados</option>
    </select>';
    <?PHP
}


