
<!DOCTYPE html>
<?php
    session_start();
    if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
        include "./includes/session_expired.php";
        exit();
    }
    include './config/Database.php';
    include './entidades/Arquivo.php';
    include './controladores/ControladorUsuario.php';
    $email = $_SESSION['email'];

    $controlador = new ControladorUsuario();
    if (!$controlador->setUser($email)) {
        header("Location: login.php");
    }

    $imageurl = $controlador->getFilteredImage();
    $title = $controlador->getTitleName();

    if ($_SESSION['ehAluno']) {
        include './controladores/Aluno.php';
        include './controladores/Turma.php';
        $controlador = $controlador->getAluno();
        $turma = $controlador->getTurma();
    } else {
        include './controladores/Professor.php';
        $controlador = $controlador->getProfessor();
        $acesso = $controlador->possuiAcesso();
    }

    $arquivos = $controlador->listarArquivos();
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Seus Arquivos - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link async href="css/request.css" rel="stylesheet"/>
        <link href="css/arquivosstyle.css" rel="stylesheet"/>
        <link href="css/arquivos_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Seus Arquivos</h1>
            </div>
            <button id="voltarprincipal" class="pure-button" onclick="window.location='./profile.php'">Voltar para o Principal</button>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="arquivosarea">
                <div class="title">Arquivos de Atividade</div>
                <div class="columnnames">
                    <div class="descricao">Arquivo</div>
                    <div class="data">Data</div>
                    <div class="hora">Hora</div>
                    <div class="nome">Tipo</div>
                    <div class="size">Tamanho</div>
                    <div class="atividade">Atividade</div>
                </div>
                <?PHP if(!empty($arquivos)): ?>
                    <div class="arquivos">
                        <?PHP foreach($arquivos as $i=>$arquivo): ?>
                        <div class="arquivo">
                            <div class="descricao"><?= $arquivo->getFilename() ?></div>
                            <div class="data"><?= $arquivo->getDataFormatada() ?></div>
                            <div class="hora"><?= $arquivo->getHora() ?></div>
                            <div class="nome"><?= $arquivo->getType() ?></div>
                            <div class="size"><?= $arquivo->getSize() ?></div>
                            <div class="atividade"><a href="./atividadeview.php?id=<?= $arquivo->getIdatividade() ?>" class="pure-button">Ir</a></div>
                        </div>
                        <?PHP endforeach; ?>
                    </div>
                <?PHP else: ?>
                    <p class="empty">Vazio</p>
                <?PHP endif;?>
            </div>
        </div>
        <?PHP include './includes/navbar.php';?>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
