<?php
define('STRUCTVIEW', true);

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';
if (file_exists('./generator/code.php')) {
    include './generator/code.php';
}
$controlador = new ControladorUsuario();
$acesso_livre = false;
if (isset($_SESSION['email']) && isset($_SESSION['senha'])) {
    $email = $_SESSION['email'];

    $controlador->setUser($email);

    if (isset($idestrutura)) {
        $log = new log($controlador->getConnection(), $controlador->getUserId());
        $log->log("access", array("id_estrutura" => $idestrutura), log::TYPE_NORMAL);
    }

    $imageurl = "../../" . $controlador->getFilteredImage();
} else {
    $acesso_livre = true;
    $imageurl = "../../" . $controlador->getFilteredImage();
}
    