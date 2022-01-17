
<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './controladores/ControladorUsuario.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email) || $_SESSION['ehAluno']) {
    header("Location: login.php");
}
$imageurl = $controlador->getFilteredImage();
$index = 0;

if (isset($_GET['index'])) {
    $index = $_GET['index'];
} else {
    $_GET['index'] = 0;
}

include './controladores/Professor.php';
include './controladores/Turma.php';


$controlador = $controlador->getProfessor();
$turma = $controlador->getTurmaByIndex($index);
$details = $turma->getDescricaoTurma();
$title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Nova atividade - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        
        <link rel="preload" href="css/novaatividadestyle.css" as="style"/>

        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/novaatividadestyle.css" rel="stylesheet"/>
        <link href="css/novaatividade_responsive.css" rel="stylesheet" media="(max-width: 510px)">

        <link href="css/jquery.datetimepicker.min.css" rel="stylesheet"/>
        
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
        
        <script async src="js/request.js"></script> 
        <link href="./css/cooltexttag.css" rel="stylesheet"/>
        <script src="./js/cool-tagtext.js"></script>
        <script src="./js/jquery.datetimepicker.full.min.js"></script>
    </head>
    <body>
        <div class="topbar">
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Nova Atividade</h1>
            </div>
            <div class="resposives_buttons">
                <button title="Voltar para o Menu da Turma" class="action" onclick="redirect('./class.php', {index:<?= $index ?>});"><i class='fa fa-chevron-left'></i></button>
            </div>
            <div class="title">
                <?= $title; ?>
            </div> 
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="area">
                <div class="pure-form" id="form">
                    <div class="title">Nova Atividade</div>
                    <table id='headeratividade'>
                        <tr>
                            <td>
                                <label for="titulo" class="subtitle">
                                    TÍTULO
                                </label>
                                <input id="titulo" placeholder="Máximo 45 caracteres" required="required" autocomplete="off" name="titulo" maxlength="45"/>
                            </td>
                            <td>
                                <label for="data" class="subtitle">
                                    Data
                                </label>
                                <input type='text' placeholder="DD/MM/AAAA" id='data'/>
                            </td>
                        </tr>
                    </table>
                    <label for="texto" class="subtitle">
                        DESCRIÇÃO
                    </label>
                    <textarea id="texto" required="required" name="texto"></textarea>
                    <p>
                        <button type="submit" onclick="submit()" class="pure-button pure-button-primary">Publicar</button>
                        <button type="button" class="pure-button" onclick="window.location = './class.php?index=<?= $index; ?>';">Cancelar</button>
                    </p>
                </div>
            </div>
        </div>

        <?PHP include './includes/navbar.php'; ?>
        <script async>
            $('#data').datetimepicker({timepicker: false, format: 'd/m/Y', lang: 'pt-br', minDate: 0});
            submit = function () {
                var date = $('#data').val().split("/");
                var data = {
                    index:<?= $index ?>,
                    titulo: $("#titulo").val(),
                    texto: $("#texto").val(),
                    dia: date[0],
                    mes: date[1],
                    ano: date[2]
                };
                post("./request/atividade/nova.php", function (data) {
                    redirect("./atividadeview.php", {index:<?= $index ?>, id: data.lastId});
                }, data);
            };
            $("#texto").coolTagText();
            $("#texto").trigger("appendCooltexttag");
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
