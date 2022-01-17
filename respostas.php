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
include './entidades/Resposta.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    header("Location: login.php");
}

$imageurl = $controlador->getFilteredImage();
$title = $controlador->getTitleName();
$gruporespostas = $controlador->listarRespostasDoUsuario();

?>
<html>
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Suas Respostas - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link rel="stylesheet" href="css/yui.yahooapis.com_pure_0.6.0_pure-min.css"/>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/repostasstyle.css" rel="stylesheet"/>
        <link href="css/repostas_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <script src="js/jquery.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Suas Respostas</h1>
            </div>
            <button class="pure-button " onclick="window.location = './profile.php';">Voltar</button>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="respostasarea">
                <div class="title"><p>Respostas</p></div>
                <div class="repostas">
                    <?PHP foreach ($gruporespostas as $grupo): try {
                            $r = $grupo[0];
                            ?>
                            <div class="grupo">
                                <div class="toparea">
                                    <div class="assunto">
                                        <div class="label">Assunto</div>
                                        <?= $r->getTopicoAssunto() ?>
                                    </div>
                                    <div class="info">
                                        <div class="label"><p>Autor do Tópico</p></div>
                                        <div class="userlabel">
                                            <img src="<?= $r->getUserImage() ?>" alt="foto do criador do tópico" width="50" height="50"/>
                                            <div class="title"><p><?= $controlador->getTitleNameBy($r->getUserNome(), $r->getUserSobrenome(), $r->getUserApelido(), $r->getUserEmail()); ?></p></div>
                                        </div>
                                        <a class="pure-button showbtn" href="./topicoview.php?id=<?= $r->getTopicoId() ?>">Visualizar Tópico Completo</a>
                                    </div>
                                </div>
                                <?PHP foreach ($grupo as $resposta): try { ?>
                                        <div class="resposta">
                                            <div class="vote" >
                                                <div class="title"><p>Votos</p></div>
                                                <div title="Votar Positivo" class="up"><p><?= $resposta->getVotosPositivos() ?></p></div>
                                                <div title="Votar Negativo" class="down"><p><?= $resposta->getVotosNegativos() ?></p></div>
                                            </div>
                                            <div class="text"><p><?= nl2br($resposta->getTexto()) ?></p></div>
                                            <div class="data"><p><b>Última revisão: </b><?= $resposta->getDataFormatada() ?><b> ás </b><?= $resposta->getHora() ?></p></div>                            
                                        </div>
                                    <?PHP
                                    } catch (Exception $e) {
                                        echo $e;
                                    } endforeach;
                                ?>
                            </div>
                        <?PHP
                        } catch (Exception $e) {
                            echo $e;
                        } endforeach;
                    ?>
                </div>
            </div>
        </div>

        <?PHP include './includes/navbar.php'; ?>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
