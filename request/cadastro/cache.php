<?php

session_start();
session_unset();

/**
 * Armazena temporariamente informações para cadastro, entre a tela de login e confirmação de cadastro
 * @param emailc: email do usuário 
 * @param senhac: senha do usuário 
 * @param ehAluno: boolean informa se o usuáirio é aluno
 * @param nickname: apelido do usuário (opcional)
 * @param firstname: primeiro nome do usuário (opcional)
 * @param lastname: último nome do usuário (opcional)
 * @param facebookbind: array com informações de email e id do facebook do usuário (opcional) 
 * @param googlebind: array com informações de email e id do facebook do usuário (opcional) 
 */

$_SESSION['emailc'] = $_POST['emailc'];
$_SESSION['senhac'] = $_POST['senhac'];
$_SESSION['ehAluno'] = $_POST['ehAluno'];
$_SESSION['nickname'] = $_POST['nickname'];
$_SESSION['firstname'] = $_POST['firstname'];
$_SESSION['lastname'] = $_POST['lastname'];
if (isset($_POST['facebookbind'])) {
    $_SESSION['facebookbind'] = $_POST['facebookbind'];
}
if (isset($_POST['googlebind'])) {
    $_SESSION['googlebind'] = $_POST['googlebind'];
}

echo json_encode(array("resultado" => true, "resposta" => "Informações anexadas"));
