<?php

use config\Facebook;

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
        $responseFB = $fb->get('/me?fields=email,name,id,first_name,last_name', $token);
    } catch (\Facebook\Exceptions\FacebookResponseException $e) {
        // When Graph returns an error
        echo 'Graph returned an error: ' . $e->getMessage();
        exit;
    } catch (\Facebook\Exceptions\FacebookSDKException $e) {
        // When validation fails or other local issues
        echo 'Facebook SDK returned an error: ' . $e->getMessage();
        exit;
    }

    $me = $responseFB->getGraphUser();
    $response = array(
        "resultado" => true,
        "resposta" => "Sucesso",
        "id" => $me->getId(),
        "name" => $me->getName(),
        "fields" => $me->getFieldNames(),
        "email" => $me->getEmail(),
        "cover" => $me->getField("cover"),
        "firstname" => $me->getFirstName(),
        "lastname" => $me->getLastName(),
        "picture" => $me->getPicture());
} catch (Exception $e) {
    $response = array("resultado" => false, "resposta" => "Falha ao Recuperar dados do Facebook API");
}
echo json_encode($response);
