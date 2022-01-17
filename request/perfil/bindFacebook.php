<?php

session_start();

use config\Facebook;

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../config/Facebook.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    echo json_encode(array("resultado" => true, "resposta" => "Usuário não encontrado"));
    return;
}

$loader = require __DIR__ . '\..\..\vendor\autoload.php';
$token = $_POST['token'];

$fb = new \Facebook\Facebook([
    'app_id' => Facebook::$app_id,
    'app_secret' => Facebook::$app_secret,
    'default_graph_version' => Facebook::$version,
    'default_access_token' => $token
        ]);

$helper = $fb->getRedirectLoginHelper();

try {
    $response = $fb->get('/me?fields=email,id', $token);
} catch (\Facebook\Exceptions\FacebookResponseException $e) {
    echo json_encode(array("resultado" => false, "resposta" => "Erro na API do Facebook (Response)"));
    $log = new log($controlador->getConnection(), $controlador->getUserId());
    $log->log("LOGIN FACEBOOK: Erro na API do Facebook (Response)", array(), log::TYPE_ANORMAL);
    exit;
} catch (\Facebook\Exceptions\FacebookSDKException $e) {
    echo json_encode(array("resultado" => false, "resposta" => "Erro na API do Facebook (SDK)"));
    $log = new log($controlador->getConnection(), $controlador->getUserId());
    $log->log("LOGIN FACEBOOK: Erro na API do Facebook (SDK)", array(), log::TYPE_ANORMAL);
    exit;
}

$me = $response->getGraphUser();
$idFb = $me->getId();
$emailFb = $me->getEmail();

if ($controlador->checkLoginFacebook($idFb, $emailFb)) {
    $response = array(
        "resultado" => false,
        "resposta" => "Alguém já vinculou está conta do Facebook",
        "debug" => array("emailFb" => $emailFb),
        "log" => log::TYPE_ANORMAL
    );
} else {
    if ($controlador->bindFacebook($idFb, $emailFb)) {
        $response = array(
            "resultado" => true,
            "resposta" => "Sucesso ao vincular",
            "debug" => array("emailFb" => $emailFb),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Falha ao vincular",
            "debug" => array("emailFb" => $emailFb),
            "log" => log::TYPE_ANORMAL
        );
    }
}
echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("BIND FACEBOOK: " . $response['resposta'], $response['debug'], $response['log']);
