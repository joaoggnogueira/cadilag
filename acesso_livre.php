<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Cadilag - Acesso Livre</title>    
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link rel="manifest" href="manifest.json"/>

        <link async href="css/profile_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link rel="preload" href="css/principalstyle.css" as="style"/>

        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="css/principalstyle.css" rel="stylesheet"/>>

        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <div id="icon"></div>
            <div class="subtitle">
                <h1>Principal</h1>
            </div>
            <div class='title'>
                <p> Acesso Livre </p>
            </div> 
            <div class='resposives_buttons'>
                <button title="Menu do usuário" class="resposives_button selected"><i class='fa fa-id-badge'></i></button>
                <button title="Fórum" class="resposives_button"><i class='fa fa-inbox'></i></button>
                <button title="Outros" class="resposives_button"><i class='fa fa-info'></i></button>
            </div>
            <a title="Mostrar Notificações" href="#notificacoes" class="notify-btn" count="?"></a>
        </div>
        <div class='sidebar' style="padding-top: 30px;height: calc(100% - 60px);">
            <div id='options'>
                <a href="./login.php" class="buttonW" style="height: 70px;">Acesso completo<br/><small>Entrar e Cadastrar</small></a>
                <a href="./apps/structs" class="buttonW structure-img">Estruturas</a>
                <a href="./apps/graphs" class="buttonW nodegraph-img">Grafos</a>
            </div>
        </div>
        <div class="area">
            <a class="subarea" id="status" href="./login.php" style="border-bottom: 4px solid crimson;">
                <b><i class="fa fa-info-circle"></i> </b> &nbsp;&nbsp;Faça o login para acesso completo
            </a>
            <div class="subarea">
                <p>
                    O <b>acesso sem cadastro</b> permite você acessar parte das ferramentas de simulação de estrutura de dados e grafos. 
                    <br/>Mas não permite acessar a área colaborativa, fórum, pseudocódigos de outros usuários e entradas programadas.
                </p>
            </div>
        </div>
    </body>
</html>
