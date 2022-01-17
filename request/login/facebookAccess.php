<?php

session_start();

ob_start();

use config\Facebook;
try {
    include '../../config/Database.php';
    include '../../controladores/ControladorUsuario.php';
    include '../../controladores/log.php';
    $controlador = new ControladorUsuario();

    $browser = "undefined";

    if (isset($_SERVER['HTTP_USER_AGENT'])) {
        $browser = $_SERVER['HTTP_USER_AGENT'];
    }

    try {
        $loader = require __DIR__ . '\..\..\vendor\autoload.php';
        $token = $_POST['token'];

        include '../../config/Facebook.php';

        $fb = new \Facebook\Facebook([
            'app_id' => Facebook::$app_id,
            'app_secret' => Facebook::$app_secret,
            'default_graph_version' => Facebook::$version,
            'default_access_token' => $token
        ]);

        $helper = $fb->getRedirectLoginHelper();

        try {
            $response = $fb->get('/me?fields=email,name,id,first_name,last_name,picture', $token);
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
        $emailFb = $me->getEmail();
        $idFb = $me->getId();

        if ($controlador->checkLoginFacebook($idFb, $emailFb)) {
            $_SESSION['email'] = $controlador->getEmail();
            $_SESSION['senha'] = "Login By Facebook";
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
                "resposta" => "Ninguem está vinculado a esta conta do Facebook",
                "email" => $emailFb,
                "idFb" => $idFb,
                "name" => $me->getField("name"),
                "first_name" => $me->getField("first_name"),
                "last_name" => $me->getField("last_name"),
                "log" => log::TYPE_ERROR,
                "debug" => array("emailFb" => $emailFb, "browser" => $browser)
            );
        }
    } catch (Exception $e) {
        $response = array(
            "resultado" => false,
            "resposta" => "Erro na inexperado na Requisão",
            "log" => log::TYPE_ANORMAL,
            "debug" => array("token" => $token, "browser" => $browser)
        );
    }
    throw new Exception("Fudeu o barraco");
} catch (Exception $e) {
   echo $e->getMessage();   
}
$view = ob_get_clean();
ob_end_flush();

if (strlen($view) != 0) {
    $response = array(
        "resultado" => false,
        "resposta" => "Falha no Servidor",
        "log" => log::TYPE_ANORMAL,
        "debug" => array("error" => $view)
    );
    //echo "Lixo foi gerado\n";
    //echo $view;
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("LOGIN FACEBOOK: " . $response['resposta'], $response['debug'], $response['log']);
