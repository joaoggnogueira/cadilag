
<!DOCTYPE html>
<?php
session_start();
define('CLASSVIEW', true);
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './controladores/ControladorUsuario.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
$controlador->setUser($email);
$imageurl = $controlador->getFilteredImage();
$isAluno = $_SESSION['ehAluno'];

if (isset($_GET['order'])) {
    $order = $_GET['order'];
} else {
    $order = 'revisao';
}

if (isset($_GET['highlight'])) {
    $highlight = $_GET['highlight'];
} else {
    $highlight = '';
}

include './entidades/Atividade.php';
include './entidades/Link.php';
include './entidades/Evento.php';
include './entidades/BinaryFile.php';
include './controladores/Turma.php';
include './entidades/Topico.php';
include './entidades/MaterialDidatico.php';

$maxpersonal = 3;
$inipersonal = 0;
$index = 0;
if ($isAluno) {
    include './controladores/Aluno.php';
    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();
    $solicitacao = $controlador->getSolicitacao();
    if ($turma) {
        $topicospersonal = $turma->listarTopicos($inipersonal, $maxpersonal);

        if (!$solicitacao) {
            $indexdetail = $turma->getDescricaoTurma();
            $id = $turma->getIdturma();
            $atividadesabertas = $turma->listarAtividadesAbertas($order);
            $atividades = $turma->listarAtividadesFechadas($order);
            $links = $turma->listarLinks();
            $alunos = $turma->getAlunos();
            $professortitle = $controlador->getTitleNameBy($indexdetail['professor_nome'], $indexdetail['professor_sobrenome'], $indexdetail['professor_apelido'], $indexdetail['professor_email']);
            $materiais = $turma->listarMateriaisDidaticos();
        }
        $eventos = $turma->listEventos();
    }
} else {
    if (isset($_GET['index'])) {
        $index = (int) $_GET['index'];
    }
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $acesso = $controlador->possuiAcesso();

    if ($acesso) {
        $turmas = $controlador->getTurmas();
        $turma = $controlador->getTurmaByIndex($index);
        if ($turma) {
            $topicospersonal = $turma->listarTopicos($inipersonal, $maxpersonal);
        }
        if (!empty($turma)) {
            $links = $turma->listarLinks();
            $alunos = $turma->getAlunos();
            $atividadesabertas = $turma->listarAtividadesAbertas($order);
            $atividades = $turma->listarAtividadesFechadas($order);
            $indexdetail = $turma->getDescricaoTurma();
            $professortitle = $controlador->getTitleNameBy($indexdetail['professor_nome'], $indexdetail['professor_sobrenome'], $indexdetail['professor_apelido'], $indexdetail['professor_email']);
            $materiais = $turma->listarMateriaisDidaticos();
            $plano_ensino = $turma->getBlobPlanoEnsino();
        }
        $eventos = $turma->listEventos();
    }
}

?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Turma - Cadilag</title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        
        <link rel="preload" href="css/classstyle.css" as="style"/>
        
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="css/jquery.datetimepicker.min.css" rel="stylesheet"/>
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link async href="css/request.css" rel="stylesheet"/>
        <link href="css/classstyle.css" rel="stylesheet"/>
        <link href="css/class_responsive.css" rel="stylesheet" media="(max-width: 510px)">

        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script src="js/request.js"></script>
        <script src="js/jquery.datetimepicker.full.min.js"></script>
        <link async href="css/notifyStyle.css" rel="stylesheet"/>
        <link async href="css/notifyResponsiveStyle.css" rel="stylesheet" media="(max-width: 510px)">
        <script async src="js/notifyManager.js"></script>
    </head>
    <body class="responsive-menu-0 <?= (empty($turma)?"hide-responsive-menu":"") ?>">
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o Menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Turma</h1>
            </div>
            <div class='resposives_buttons'>
                <button class="action" title="Voltar para a Menu Principal" onclick="redirect('./profile.php');"><i class='fa fa-chevron-left'></i></button>
                <button class="resposive_button selected" title="Menu da Turma"><i class='fa fa-users'></i></button>
                <button class="resposive_button" title="Fórum da Turma"><i class='fa fa-inbox'></i></button>
                <button class="resposive_button" title="Outros"><i class='fa fa-info'></i></button>
            </div>
            <a title="Mostrar Notificações" class="notify-btn" count="?" href='#notifylist'></a>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
            <button class="pure-button" id="voltarprincipal" onclick="redirect('./profile.php');">Voltar</button>
        </div>
        
        <?php
        if (!$isAluno):
            include './includes/includeclassprofessor.php';
        else:
            include './includes/includeclassaluno.php';
        endif;

        include './includes/navbar.php';
        ?>

        <script async>
            
            $(".resposive_button").click(function(){
                $(".resposive_button").removeClass("selected");
                $(this).addClass("selected");
                var pos = $(".resposive_button").index(this);
                document.body.className = "responsive-menu-"+pos;
            });
            
            $(".aboutHeader li").click(function () {
                var top = $($(this).parents("ul")[0]);
                var selected = top.find("li.selected");
                var selected_item = selected.attr("data-div-class");
                var obj = $(this);
                $("." + selected_item).fadeOut(200,function(){
                    selected.removeClass("selected");
                    obj.addClass("selected");
                    var item = obj.attr("data-div-class");
                    $("." + item).fadeIn(200);                    
                });

            });

            $("#order").change(function () {
                $(this).parents("form").submit();
            });

            switch ('<?= $highlight ?>')
            {
                case 'openatv':
                    $(".atividades-open").animate({'padding': '30px'}, 1000, 'easeOutQuint', function () {
                        $(".atividades-open").animate({'padding': '10px'}, 1000, 'easeOutQuint');
                    });
                    var obj = $(".atividades-open");
                    $('html, body').animate({scrollTop: obj.offset().top}, 500);
                    break;
            }

            var objsidebar = document.querySelector('.sidebar');
            if (objsidebar !== undefined && objsidebar !== null)
            {
                objsidebar.style.left = '-250px';
                objsidebar.style.left = '0px';
            }

            $(".atividade .title").click(function () {
                if ($(this).parent().attr('open') === 'open') {
                    $(this).parent().removeAttr('open');
                } else {
                    $(this).parent().attr("open", "");
                }
            });

            $(".topico").click(function () {
                var id = $(this).attr("id");
                window.location = './topicoview.php?id=' + id;
            });
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
