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
if ($controlador->setUser($email)) {
    $id = (int) (filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT));
    $text = preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i", '<$1$2>', strip_tags($_POST['text'], '<u><b><i><big><small><center><h1><h2><h3><h4><h5><h6>'));
    include '../../entidades/Topico.php';
    include '../../entidades/Resposta.php';

    if (strlen($text) != 0) {
        $topico = $controlador->getTopico($id);

        if (($resposta = $controlador->novaRespostaAoTopico($id, $text))) {
            ob_start();
            include '../../includes/respostaTopico.php';
            $view = ob_get_clean();
            ob_end_flush();

            $response = array(
                "resultado" => true,
                "resposta" => "Sucesso ao publicar a resposta",
                "html" => $view,
                "debug" => array("id_resposta" => $resposta->getId()),
                "log" => log::TYPE_NORMAL
            );
        } else {
            $response = array(
                "resultado" => false,
                "resposta" => "Falha no Banco",
                "debug" => array("email" => $email),
                "log" => log::TYPE_ERROR
            );
        }
    } else {
        $response = array(
            "resultado" => false,
            "resposta" => "Texto não pode ser vázio",
            "debug" => array("id_topico" => $id),
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
$log->log("NOVA RESPOSTA: " . $response['resposta'], $response['debug'], $response['log']);




