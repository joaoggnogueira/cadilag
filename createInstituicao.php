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
$controlador->setUser($email);

$isAluno = $_SESSION['ehAluno'];
$title = $controlador->getTitleName();

if (!$isAluno) {
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    if (!$controlador->possuiAcesso()) {
        header("Location: class.php");
    }
} else {
    header("Location: class.php");
}

$imageurl = $controlador->getFilteredImage();
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width">
        <title>Nova instituição</title>
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
                <h1>Nova instituição</h1>
            </div>

            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="subtitle">NOVA INSTITUIÇÃO</div>
            <div class="title">Insira as informações abaixo</div>
            <form class="pure-form">
                <label class="label" for="nome">Nome</label>
                <input autocomplete="off" id="nome" maxlength="100" placeholder="Exemplo: Unesp Júlio de Mesquita Filho" name="nome" type="text"/>
                <label class="label" for="uf">UF</label>
                <select name="uf" id="uf">
                    <option value="AC">Acre - AC</option>
                    <option value="AL">Alagoas - AL</option>
                    <option value="AM">Amazonas - AM</option>
                    <option value="AP">Amapá - AP</option>
                    <option value="BA">Bahia - BA</option>
                    <option value="CE">Ceará - CE</option>
                    <option value="DF">Distrito Federal - DF</option>
                    <option value="ES">Espírito Santo - ES</option>
                    <option value="GO">Goiás - GO</option>
                    <option value="MA">Maranhão - MA</option>
                    <option value="MT">Mato Grosso - MT</option>
                    <option value="MS">Mato Grosso do Sul - MS</option>
                    <option value="MG">Minas Gerais - MG</option>
                    <option value="PA">Pará - PA</option>
                    <option value="PB">Paraíba - PB</option>
                    <option value="PR">Paraná - PR</option>
                    <option value="PE">Pernambuco - PE</option>
                    <option value="PI">Piauí - PI</option>
                    <option value="RJ">Rio de Janeiro - RJ</option>
                    <option value="RN">Rio Grande do Norte - RN</option>
                    <option value="RS">Rio Grande do Su - RS</option>
                    <option value="RO">Rondônia - RO</option>
                    <option value="RR">Roraima - RR</option>
                    <option value="SC">Santa Catarina - SC</option>
                    <option value="SP" selected>São Paulo - SP</option>
                    <option value="SE">Sergipe - SE</option>
                    <option value="TO">Tocantins - TO</option>
                </select>
                <button type="button" id="cadastrar" class="pure-button pure-button-primary">Cadastrar</button>
                <button type="button" class="pure-button" onclick="window.location = './classmanager.php';">Voltar</button>
            </form>
        </div>
        <?PHP include './includes/navbar.php'; ?>
        <script async>
            document.getElementById("cadastrar").addEventListener("click",function(){
                post("./request/criacaoturma/novaInstituicao.php", function (data) {
                    redirect("./classmanager.php",{inst_id:data.lastId});
                }, formdata("form"));
            });
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>