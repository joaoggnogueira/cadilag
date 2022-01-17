
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
if ($_SESSION['ehAluno']) {
    header("Location: profile.php");
}
$imageurl = $controlador->getFilteredImage();
$index = 0;
$highlight = '';

if (isset($_GET['highlight'])) {
    $highlight = $_GET['highlight'];
}


if (isset($_GET['index'])) {
    $index = $_GET['index'];
} else {
    $_GET['index'] = 0;
}

include './controladores/Professor.php';
include './controladores/Turma.php';
include './entidades/Link.php';


$controlador = $controlador->getProfessor();
$turma = $controlador->getTurmaByIndex($index);
$details = $turma->getDescricaoTurma();
$title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();
$links = $turma->listarLinks();
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width"/>
        <meta charset="UTF-8" />
        <title>Editar Turma - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg"/>

        <link rel="preload" href="css/classeditstyle.css" as="style"/>

        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet">
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/classeditstyle.css" rel="stylesheet"/>
        <link async href="css/classeditstyle_responsive.css" rel="stylesheet" media="(max-width: 510px)">

        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
        <script src="js/request.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Editar Turma</h1>
            </div>
            <a class="pure-button" href='./class.php?index=<?= $index ?>' id="voltar">Voltar</a>
            <div class='title'>
                <?= $title; ?>
            </div> 
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="linkedit">
                <div class="title">Links</div>
                <div class="subtitle">
                    Links são atalhos para outros materiais fora do Cadilag<br>
                    relacionado á disciplina que serão exibidos somente <br>
                    para os membros da Turma
                </div>
                <form class="pure-form">
                    <input name="index" type="hidden" value="<?= $index; ?>"/>
                    <label class="label" for="link">Título</label>
                    <input id="link" required="required" placeholder="Máximo 45 caracteres" autocomplete="off" name="titulo"  maxlength="45"/>
                    <label class="label" for="url">URL</label>
                    <input id="url" required="required" autocomplete="off" name="url"/>
                    <br/><br/>
                    <button onclick="submitLink()" type="button" class="pure-button pure-button-primary">Adicionar</button>
                </form>
                <div class='links'>
                    <div class='title'>Links Atuais</div>
                    <div id='listlink'> 
                        <?php
                        foreach ($links as $i => $link) {
                            include './includes/linklayout.php';
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
<?PHP include './includes/navbar.php'; ?>
        <script async>
            function deletarLink(id, obj) {
                swal({
                    title: "Continuar?",
                    text: "Deseja remover o link?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Continuar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post('./request/turma/removeLink.php', function () {
                                    $($(obj).parents(".link")[0]).remove();
                                }, {linkid: id, index:<?= $index ?>});
                            }
                        }
                );
            }

            function submitLink() {
                var loading = document.createElement("div");
                loading.id = "loadinglink";
                loading.innerHTML = "Carregando ...";
                $("#listlink").prepend(loading);

                post("./request/turma/novoLink.php", function (data) {
                    $("#loadinglink").remove();
                    $("#listlink").prepend(data.html);
                }, {index:<?= $index ?>, titulo: $("#link").val(), url: $("#url").val()});
            }

        </script>
<?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
