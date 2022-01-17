<?php

    session_start();
    if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
        include "./includes/session_expired.php";
        exit();
    }

    if(!isset($_POST['iddisc'])){
        echo 'iddisc not found';
        exit();
    }
    include './config/Database.php';
    include './controladores/ControladorUsuario.php';
    include './entidades/Disciplina.php';
    
    $email = $_SESSION['email'];
    
    $controlador = new ControladorUsuario();
    $controlador->setUser($email);
    
    $isAluno = $_SESSION['ehAluno'];
    $title = $controlador->getTitleName();
    $iddisc = $_POST['iddisc'];
    
    if(!$isAluno)
    {
        include './controladores/Professor.php';
        $controlador = $controlador->getProfessor();
        if(!$controlador->possuiAcesso())
        {
            header("Location: class.php");
        }
    } else {
        header("Location: class.php");
    }
    $disciplina = $controlador->getDisciplina($iddisc); 
    $imageurl = $controlador->getFilteredImage();
    
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Nova Turma - <?= $disciplina->getNome() ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        <link rel="preload" href="css/classmanagercreatestyle.css" as="style"/>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/classmanagercreatestyle.css" rel="stylesheet"/>
        <link async href="css/classmanagercreatestyle_responsive.css" rel="stylesheet" media="(max-width: 510px)">

        <link async href="css/request.css" rel="stylesheet"/>
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/request.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Nova Turma</h1>
            </div>
            <div class='title'><?= $disciplina->getNome() ?></div>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="subtitle">NOVA TURMA</div>
            <div class="title">Insira as informações abaixo</div>
            <form class="pure-form">
                <label for="semestre" class="label">Ano</label>
                <input id="semestre" maxlength="4" placeholder="Exemplo: 2016" name="ano" type="number"/>
                <label for="semestre" class="label">SEMESTRE</label>
                <select id="semestre" name="semestre">
                    <option value="1">1° Semestre</option>
                    <option value="2">2° Semestre</option>                    
                </select>
                <input type="hidden" name="iddisciplina" value='<?= $disciplina->getId() ?>'/>                          
                <button type="button" id="cadastrar" class="pure-button pure-button-primary">Cadastrar</button>
                <button type="button" class="pure-button" onclick="window.location='./classmanager.php';">Voltar</button>
            </form>
        </div>
        <?PHP include './includes/navbar.php';?>
        <script async>
            document.getElementById("cadastrar").addEventListener("click",function(){
                post("./request/criacaoturma/novaTurma.php",function(data){
                    redirect("./classedit.php?index="+data.lastId);
                },formdata("form"));
            });
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>