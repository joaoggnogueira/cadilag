
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
if (!$controlador->setUser($email)) {
    header("Location: login.php");
}
$imageurl = $controlador->getFilteredImage();
$index = 0;

if (isset($_GET['index'])) {
    $index = $_GET['index'];
} else {
    $_GET['index'] = 0;
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];
} else {
    $mensagem = "Material Didático não encontrado";
    include "./includes/notfound.php";
    exit();
}

include './controladores/Turma.php';
include './entidades/MaterialDidatico.php';
if ($_SESSION['ehAluno']) {
    include './controladores/Aluno.php';
    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();
    $materialdidatico = $controlador->getMaterialDidatico($id);
    if(!$materialdidatico){
        $mensagem = "Material Didático não encontrado";
        include "./includes/notfound.php";
        exit();
    }
    if (!$turma) {
        header("Location: profile.php");
    }
} else {
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $materialdidatico = $controlador->getMaterialDidatico($id);
    if(!$materialdidatico){
        $mensagem = "Material Didático não encontrado";
        include "./includes/notfound.php";
        exit();
    }
    $turma = $controlador->getTurmaByIndex($index);
}

$details = $turma->getDescricaoTurma();
$title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();

?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Materiais Didáticos - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        
        <link rel="preload" href="css/materialdidaticoview.css" as="style"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet">

        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/materialdidaticoview.css" rel="stylesheet"/>
        <link async href="css/materialdidaticoview_responsive.css" rel="stylesheet" media="(max-width: 510px)"/>
        
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async async src="js/request.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Material Didático</h1>
            </div>
            <div class='title'>
                <?= $title; ?>
            </div> 
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <button id="voltar" class="pure-button" onclick="window.location = './class.php?index=<?= $index ?>';">Voltar para a Turma</button>
            <div class="wrapper">
                <div class="arquivo">
                    <div class="title">Arquivo</div>
                    <div class="label">Nome</div>
                    <div class="value"><?= $materialdidatico->getName() ?></div>
                    <div class="label">Extensão</div>
                    <div class="value"><?= $materialdidatico->getType() ?></div>
                    <div class="label">Tamanho</div>
                    <div class="value"><?= $materialdidatico->getSize() ?></div>
                    <a id="download" onclick="downloadMaterial()"><button class="pure-button pure-button-primary download">Baixar</button></a>
                </div>
                <div class="descricao">
                    <div class="title">Descrição</div>
                    <div class="label">Título</div>
                    <div class="value"><?= $materialdidatico->getTitulo() ?></div>
                    <div class="label">Detalhes</div>
                    <div class="value"><?= preg_replace("/\t/","&nbsp&nbsp&nbsp&nbsp",nl2br($materialdidatico->getDetalhes())) ?></div>
                    <div class="datetime">
                        <br/>Última Revisão: <?= $materialdidatico->getDataFormatada() ?> ás <?= $materialdidatico->getHoraMinimizada() ?>
                    </div>
                </div>
            </div> 
        </div>
        <?PHP include './includes/navbar.php'; ?>
        <script async>

            function downloadMaterial() {
                postSubmit("./submit/downloadMaterial.php", {id:<?= $id ?>});
            }

        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
