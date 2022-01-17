
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

include './controladores/Turma.php';
$isAluno = $_SESSION['ehAluno'];
if ($isAluno) {
    include './controladores/Aluno.php';
    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();
    if (!$turma) {
        header("Location: class.php");
    }
} else {
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $index = 0;
    if (isset($_GET['index'])) {
        $index = (int) $_GET['index'];
    }

    $turma = $controlador->getTurmaByIndex($index);
    $turmas = $controlador->getTurmas();

    if (!$turma) {
        echo 'Turma não encontrada';
        return;
    }
}
$details = $turma->getDescricaoTurma();
$title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();
$alunos = $turma->getAlunos();
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Alunos - <?php echo $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet"/>
        
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link async href="css/request.css" rel="stylesheet"/>
        <link href="css/alunosstyle.css" rel="stylesheet"/>
        <link href="css/alunos_responsive.css"  rel="stylesheet" media="(max-width: 510px)">

        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
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
                <img src='images/cadilag.svg' alt='cadilag icone' id='icon'/>
            </a>
            <div class='resposives_buttons'>
                <button title="Voltar para o Menu da Turma" class="action" onclick="redirect('./class.php', {index:<?= $index ?>});"><i class='fa fa-chevron-left'></i></button>
            </div>
            <div class="subtitle">
                <h1>Alunos</h1>
            </div>
            <button id="voltarprincipal" class="pure-button" onclick="redirect('./class.php', {index:<?= $index ?>});">Voltar para a Turma</button>
            <?PHP if (!$isAluno): ?>
                <form class="pure-form">
                    <label for="turmaselect">Visualizando a Turma:</label>
                    <select id="turmaselect" onchange="reload({index: this.value});">
                        <?PHP foreach ($turmas as $i => $turmafor): ?>
                            <option <?= ($i == $index ? "selected" : "") ?>  value="<?= $i ?>"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turmafor->getAno() ?></option>
                        <?PHP endforeach; ?>
                    </select>
                </form>
            <?PHP endif; ?>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <button id="voltar" style="color: white" ><i class="fa fa-chevron-left"></i></button>
        <div class="area">
            <div id="title">Alunos vinculados á Turma (<a id="counterAlunos"><?= count($alunos) ?></a>)</div>
            <?php
            foreach ($alunos as $i => $aluno):
                $title = $controlador->getTitleNameBy($aluno['nome'], $aluno['sobrenome'], $aluno['apelido'], $aluno['email']);
                ?>
                <div onclick="mostrarDetalhes(<?= $i ?>)" attr_id="<?= $i ?>" class="aluno">
                    <img src="<?= $aluno['image']?>" alt="foto de <?= $title ?>"/>
                    <div class="title"><?= $title ?></div>
                    <div class="more"></div>
                </div>
                <div class="infos" attr_id="<?= $i ?>" style="display:none;">
                    <div class="title"><p>Detalhes</p></div>
                    <label>Apelido</label><?= ($aluno['apelido']!=""?$aluno['apelido']:"<i>Não informado</i>") ?>
                    <label>Primeiro nome</label><?=($aluno['nome']!=""?$aluno['nome']:"<i>Não informado</i>")?>
                    <label>Último nome</label><?= ($aluno['sobrenome']!=""?$aluno['sobrenome']:"<i>Não informado</i>")?>
                    <label>Data de Cadastro</label><?= $aluno['data_cadastro']?>
                    <?PHP if (!$isAluno): ?>
                        <div class="unbind">
                            <div class="remove" onclick="unbind(<?= $aluno['id'] ?>,<?= $i ?>)">Desvincular da Turma</div>
                        </div>
                    <?PHP endif; ?>
                </div>
            <?PHP endforeach; ?>
        </div>
        <?PHP include './includes/navbar.php'; ?>
        <script async>
<?PHP if (!$isAluno): ?>
                function unbind(id, i) {
                    swal({
                        title: "Você tem certeza?",
                        text: "Você irá desvincular o aluno da turma!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK, Desvincular!",
                        closeOnConfirm: true}, function (isConfirm) {
                        if (isConfirm) {
                            post("./request/gerenciaturma/desvincularAluno.php", function () {
                                swal({title: "Sucesso", text: "Aluno desvinculado", type: "success"});
                                $(".aluno[attr_id='" + i + "']").fadeOut(400);
                                $(".infos[attr_id='" + i + "']").fadeOut(400);
                                setTimeout(function () {
                                    $(".infos[attr_id='" + i+"']").remove();
                                    $(".aluno[attr_id='" + i + "']").remove();
                                    var count = parseInt($("#counterAlunos").text());
                                    count--;
                                    $("#counterAlunos").text(count);
                                }, 400);
                            }, {id: id, index:<?= $index ?>});
                        }
                    }
                    );
                }
<?PHP endif; ?>
            document.getElementById("voltar").addEventListener("click",function(){
                $(".more").removeClass('selected');
                $(".infos").fadeOut(100);
                $("body").removeClass("more");
            });

            mostrarDetalhes = function (i) {
                $(".more").removeClass('selected');
                $(".infos").fadeOut(100);
                $("body").addClass("more");
                if ($(".infos[attr_id='" + i + "']").css('display') == 'none') {
                    setTimeout(function () {
                        $(".aluno[attr_id='" + i + "'] .more").addClass('selected');
                        $(".infos[attr_id='" + i + "']").fadeIn(100);
                    }, 101);
                }
            };
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
