<?php

session_start();
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$email = filter_input(INPUT_POST, 'email');
$password = filter_input(INPUT_POST, 'senha');
$controlador = new ControladorUsuario();

$browser = "undefined";

if (isset($_SERVER['HTTP_USER_AGENT'])) {
    $browser = $_SERVER['HTTP_USER_AGENT'];
}

if ($controlador->checkAcess($email, $password)) {
    $_SESSION['email'] = $email;
    $_SESSION['senha'] = $password;
    $controlador->setUser($email);
    $_SESSION['ehAluno'] = $controlador->ehAluno();
    $usuario = array("nome" => $controlador->getTitleName());
    $usuario['image'] = $controlador->getFilteredImage();
    $response = array(
        "resultado" => true,
        "resposta" => "Acesso concedido",
        "usuario" => $usuario,
        "log" => log::TYPE_NORMAL,
        "debug" => array("browser" => $browser)
    );
} else {
    $response = array(
        "resultado" => false,
        "resposta" => "Email ou Senha incorreta!",
        "log" => log::TYPE_ERROR,
        "debug" => array("email" => $email, "browser" => $browser)
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("LOGIN : " . $response['resposta'], $response['debug'], $response['log']);
