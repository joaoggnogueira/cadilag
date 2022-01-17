<?php

/**
 * Verifica se possui alguém já cadastrado com o Email
 * @param email: o email a ser verificado
 */
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';

$email = $_POST['email'];
$controlador = new ControladorUsuario();

$checkemail = $controlador->checkEmail($email);

echo json_encode(array("resultado" => true,"resposta" => "Sucesso ao requisitar!", "exists" => $checkemail));
