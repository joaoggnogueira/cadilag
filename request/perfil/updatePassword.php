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
include '../../controladores/log.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    echo json_encode(array("resultado" => false, "resposta" => "Sessão aberta mas usuário não cadastrado!"));
    return;
}

if (isset($_POST['oldpassword']) && isset($_POST['newpassword'])) {
    $old = filter_input(INPUT_POST, 'oldpassword');
    $new = filter_input(INPUT_POST, 'newpassword');

    if ($controlador->checkAcess($email, $old)) {

        if($controlador->changePassword($new)){
            $_SESSION['senha'] = $new;
            $response = array(
                "resultado" => true, 
                "resposta" => "Senha alterada",
                "debug" => array(),
                "log" => log::TYPE_NORMAL
            );
        } else {
            $response = array(
                "resultado" => false, 
                "resposta" => "Operação não permitida",
                "debug" => array(),
                "log" => log::TYPE_ANORMAL
            );
        }
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Senha atual incorreta",
            "debug" => array(),
            "log" => log::TYPE_ERROR
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Erro de Parâmetros",
        "debug" => array("email" => $email),
        "log" => log::TYPE_ANORMAL
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("ATUALIZANDO SENHA DA CONTA: " . $response['resposta'], $response['debug'], $response['log']);