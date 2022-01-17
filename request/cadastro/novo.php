<?php

/**
 * Realiza o cadastro do novo usuário
 * Observação: O Captcha Google foi desativado, pois estar causando problemas no servidor da faculdade
 * @param g-recaptcha-response: recaptcha token do Google
 * @param facebook: array com informações de email e id do facebook do usuário (opcional) 
 * @param google: array com informações de email e id do facebook do usuário (opcional) 
 */

session_start();

$email = $_SESSION['emailc'];
$senha = $_SESSION['senhac'];
$ehAluno = $_SESSION['ehAluno'];
$nickname = $_SESSION['nickname'];
$firstname = $_SESSION['firstname'];
$lastname = $_SESSION['lastname'];
$facebook = $_POST['facebook'];
$google = $_POST['google'];
$captcha = $_POST['g-recaptcha-response'];

//require('..\..\vendor\google\recaptcha\src\autoload.php'); //problemas no servidor da faculdade

$secret = "6LfMWCMTAAAAAOWQFgfqw9pToMzC-qOxm4tPGW7g";

$response = null;

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';

$controlador = new ControladorUsuario();

//$reCaptcha = new \ReCaptcha\ReCaptcha($secret);
//if ($_POST["g-recaptcha-response"]) {
//    error_reporting(E_ERROR | E_PARSE);
//    $response = $reCaptcha->verify($captcha);
//   if ($response != null && $response->isSuccess()) {

        if ($ehAluno == 'true') {
            $sucesso = $controlador->cadastrarAluno($email, $senha, $nickname, $firstname, $lastname, $facebook, $google);
        } else {
            $sucesso = $controlador->cadastrarProfessor($email, $senha, $nickname, $firstname, $lastname, $facebook, $google);
        }

        if ($sucesso) {
            $response = array(
                "resultado" => true, 
                "resposta" => "Sucesso ao cadastrar",
                "data" => array("email"=>$email),
                "log" => log::TYPE_NORMAL
            );
            session_unset();
        } else {
            $response = array("resultado" => false, "resposta" => "Falha no Banco ",
                "data" => array(
                    "Nivel" => ($ehAluno ? "Aluno" : "Professor"),
                    "Nickname" => $nickname,
                    "Firstname" => $firstname,
                    "Lastname" => $lastname,
                    "Email" => $email),
                "log" => log::TYPE_ERROR
            );
        }
//    } else {
//        $response = array(
//            "resultado" => false,
//            "resposta" => "Falha na requisição do Recaptcha",
//            "data" => array("captcha"=>$captcha),
//            "log" => log::TYPE_ANORMAL
//        );
//    }
//} else {
//    $response = array(
//        "resultado" => false,
//        "resposta" => "Por favor, valide o captcha!",
//        "data" => array(),
//        "log" => log::TYPE_ERROR
//    );
//}
echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("NOVO CADASTRO: " . $response['resposta'], $response['data'], $response['log']);
