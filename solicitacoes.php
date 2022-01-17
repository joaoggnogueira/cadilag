
<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './controladores/ControladorUsuario.php';
include './controladores/Professor.php';
include './controladores/Turma.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    header("Location: login.php");
}

$imageurl = $controlador->getFilteredImage();
if ($_SESSION['ehAluno']) {
    header("Location: profile.php");
}
$id = 0;

if (isset($_GET['index'])) {
    $id = $_GET['index'];
} else {
    $_GET['index'] = 0;
}
$controlador = $controlador->getProfessor();

$turma = $controlador->getTurmaByIndex($id);
$details = $turma->getDescricaoTurma();
$title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();

$solicitacoes = $turma->getSolicitacoes();
$turmas = $controlador->getTurmas();
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Solicitações - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>

        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/solicitacoessstyle.css" rel="stylesheet"/>
        <link href="css/solicitacoes_responsive.css"  rel="stylesheet" media="(max-width: 510px)">
        <link async href="css/request.css" rel="stylesheet"/>
        <script async src="js/request.js"></script> 
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                <div id="icon"></div>
            </a>
            <div class='resposives_buttons'>
                <button class="action" title="Voltar para o Menu da Turma" onclick="redirect('./class.php', {index:<?= $id ?>});"><i class='fa fa-chevron-left'></i></button>
            </div>
            <div class="subtitle">
                <h1>Solicitações</h1>
            </div>
            <button id="voltarprincipal" class="pure-button" onclick="redirect('./class.php', {index:<?= $id ?>});">Voltar para a Turma</button>
            <form class="pure-form">
                <label for="turmaselect">Visualizando Turma: </label>
                <select id="turmaselect" onchange="reload({index: this.value});">
                    <?PHP
                    foreach ($turmas as $i => $turmafor):
                        try {
                            if ($i !== $id) {
                                $details = $turmafor->getDescricaoTurma();
                            } else {
                                $details = $indexdetail;
                            }
                        } catch (Exception $e) {
                            $details = "Error: " + $e;
                        }
                        ?>
                        <option <?= ($i == $id ? "selected" : "") ?>  value="<?= $i ?>"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turmafor->getAno() . ($details['total_solicitacoes'] !== 0 ? ': +' . $details['total_solicitacoes'] : '') ?></option>
                        <?PHP endforeach; ?>
                </select>
            </form>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class='area'>
            <div class="title">Solicitações pendentes (<a id="count"><?= count($solicitacoes) ?></a>)</div> 
<?php foreach ($solicitacoes as $i => $solicitacao): ?>
                <div class="solicitacao">
                    <img src="<?= $solicitacao['image'] ?>" alt="foto de <?= $solicitacao['nome'] ?>"/>
                    <div class="title">
                        <?= $solicitacao['email'] ?>
                    </div>
                    <button onclick="aceitar(<?= $solicitacao['id'] ?>, this)" class="aceitar pure-button pure-button-primary">Aceitar</button>
                    <button onclick="rejeitar(<?= $solicitacao['id'] ?>, this)" class="recusar pure-button">Recusar</button>
                </div>
        <?PHP endforeach; ?>
        </div>
<?PHP include './includes/navbar.php'; ?>

        <script async>

            aceitar = function (id, obj) {
                post("./request/gerenciaturma/responderSolicitacao.php", function () {
                    swal({title: "Sucesso", text: "Aluno vinculado", type: "success"});
                    removerSolcitacao(obj);
                }, {id: id, resposta: true});
            };

            rejeitar = function (id, obj) {
                post("./request/gerenciaturma/responderSolicitacao.php", function () {
                    swal({title: "Sucesso", text: "Aluno recusado", type: "success"});
                    removerSolcitacao(obj);
                }, {id: id, resposta: false});
            };

            removerSolcitacao = function (obj) {
                $($(obj).parents(".solicitacao")[0]).remove();
                $("#count").html(parseInt($("#count").html()) - 1);
            };

        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
