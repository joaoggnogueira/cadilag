
<!DOCTYPE html>
<?php
/**
 * Tópicos do Usuário
 */
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './controladores/ControladorUsuario.php';
include './entidades/Topico.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    header("Location: login.php");
}

$imageurl = $controlador->getFilteredImage();
$title = $controlador->getTitleName();
$total = $controlador->getTotalTopicosDoUsuario();
$topicos = $controlador->listarTopicosDoUsuario(0, $total);
if ($total !== count($topicos)) {
    echo 'Falha na contagem dos tópicos, Atualize a página!';
}

?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Seus tópicos - <?= $title; ?></title>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        
        <link rel="preload" href="css/topicosstyle.css" as="style"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet"/>
        
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/topicosstyle.css" rel="stylesheet"/>
        <link href="css/topicos_responsive.css" rel="stylesheet" media="(max-width: 510px)"/>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o Menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Seus Tópicos</h1>
            </div>
            <a class="pure-button" href="./profile.php">Voltar</a>
            <a class="pure-button pure-button-primary" href="./novotopico.php">Novo</a>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="area">
            <div class="title">Tópicos (<?= $total; ?>)</div>
            <div class="topicos">
<?PHP if (!empty($topicos)): ?>
    <?PHP foreach ($topicos as $topico): try { ?>
                            <a href="./topicoview.php?id=<?= $topico->getId() ?>">
                                <div class="topico">
                                    <div class="title"><?= $topico->getMediumTitulo() ?></div>
                                    <div class="comment"><?= $controlador->getTotalRespostaTopico($topico->getId()) ?></div>                               
                                    <div class="time"><?= $topico->getDataFormatada() ?> ás <?= $topico->getHoraMinimizada() ?></div>
                            <?PHP if ($topico->getParticular()): ?>
                                        <div class="locked"></div>
            <?PHP endif; ?>
            <?PHP if ($topico->getTurma() !== null): ?>
                                        <div class="bound"></div>
                                    <?PHP endif; ?>
                                </div>
                            </a>
                                <?PHP } catch (Exception $e) {
                                    echo $e;
                                } endforeach; ?>
                        <?PHP else: ?>
                    <p class="empty">Vazio</p>
                <?PHP endif; ?>
            </div>
        </div>
        <?PHP include './includes/navbar.php';?>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
