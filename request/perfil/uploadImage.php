<?php

session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    echo json_encode(array(
        "resultado" => false,
        "sessionexpired" => true
    ));
    exit();
}

$email = $_SESSION['email'];
$sennha = $_SESSION['senha'];

$x = $_POST['x'];
$y = $_POST['y'];
$w = $_POST['w'];
$h = $_POST['h'];
$s = $_POST['s'];
$is = $_POST['is'];
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../controladores/log.php';
$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    echo json_encode(array("resultado" => false, "resposta" => "Usuário desconhecido"));
    exit();
}
$imageurl = $_POST['url'];

if (!file_exists("../../" . $imageurl)) {
    echo json_encode(array("resultado" => false, "resposta" => "Arquivo não encontrado, tente fazer upload novamente"));
    exit();
}

$type = strtolower(pathinfo($imageurl, PATHINFO_EXTENSION));
switch ($type) {
    case 'jpeg':
    case 'jpg':
        $resource = imagecreatefromjpeg("../../" . $imageurl);
        break;

    case 'png':
        $resource = imagecreatefrompng("../../" . $imageurl);
        break;

    case 'gif':
        $resource = imagecreatefromgif("../../" . $imageurl);
        break;

    default:
        $resource = false;
        break;
}

if ($resource != false) {
    $oldw = imagesx($resource);
    $oldh = imagesy($resource);

    if ($oldh > $oldw) {
        $s = ((($s / $is) * 500) / $oldw);
    } else {
        $s = ((($s / $is) * 500) / $oldh);
    }


    $result = imagecreatetruecolor($s * $oldw, $s * $oldh);
    imagecopyresampled($result, $resource, 0, 0, 0, 0, $s * $oldw, $s * $oldh, $oldw, $oldh);

    $result = imagecrop($result, array("x" => $x, "y" => $y, "width" => $w, "height" => $h));

    $filePath = $controlador->getUserId() . '.png';
    $destino = 'users/image/' . $filePath;

    imagepng($result, "../../" . $destino);
    
    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string($d)) {
            return utf8_encode($d);
        }
        return $d;
    }
    flush();
    $data = array(
        "resultado" => true, 
        "resposta" => "Sucesso", 
        "src" => $destino,
        "debug" => array(),
        "log" => log::TYPE_NORMAL
    );
} else {
    $data = array(
        "resultado" => false, 
        "resposta" => "Formato invalido",
        "debug" => array("imageurl" => $imageurl),
        "log" => log::TYPE_ANORMAL
    );
}
echo json_encode($data,JSON_UNESCAPED_SLASHES);
    
$log = new log($controlador->getConnection(), $controlador->getUserId());
$log->log("UPLOAD DE IMAGEM DO PERFIL: " . $data['resposta'], $data['debug'], $data['log']);


