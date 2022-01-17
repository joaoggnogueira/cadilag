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
include '../../entidades/Resposta.php';
include '../../controladores/log.php';

$email = $_SESSION['email'];
$controlador = new ControladorUsuario();
if ($controlador->setUser($email)) {

    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $text = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['text'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));

    if (($resposta = $controlador->updateResposta($id, $text))) {
        $text = preg_replace("/\t/", "&nbsp&nbsp&nbsp&nbsp", nl2br($resposta->getTexto()));
        function linkCallback($match){
            return "<a style='color:white;' href='$match[0]'>$match[0]</a>";
        }

        $text = preg_replace_callback('#\bhttps?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))#', 'linkCallback', $text);

        $response = array(
            "resultado" => true, 
            "resposta" => "Resposta atualizada", 
            "text" => $text, 
            "revisao" => $resposta->getDataFormatada() . "<b> ás </b>" . $resposta->getHora(),
            "debug" => array("id_resposta" => $id),
            "log" => log::TYPE_NORMAL
        );
    } else {
        $response = array(
            "resultado" => false, 
            "resposta" => "Falha no Banco",
            "debug" => array("id_resposta" => $id, "text" => $text),
            "log" => log::TYPE_ERROR
        );
    }
} else {
    $response = array(
        "resultado" => false, 
        "resposta" => "Usuário não encontrado",
        "debug" => array("email" => $email),
        "log" => log::TYPE_ANORMAL
    );
}

echo json_encode($response);

$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("ATUALIZANDO RESPOSTA: " . $response['resposta'], $response['debug'], $response['log']);

