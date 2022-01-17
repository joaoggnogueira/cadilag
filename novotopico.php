
<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './controladores/ControladorUsuario.php';
include './controladores/Turma.php';
$email = $_SESSION['email'];
$sennha = $_SESSION['senha'];
$controlador = new ControladorUsuario();
$controlador->setUser($email);

$imageurl = $controlador->getFilteredImage();
$title = $controlador->getTitleName();
$isAluno = $_SESSION['ehAluno'];
if ($isAluno) {
    include './controladores/Aluno.php';
    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();
    if ($turma) {
        $details = $turma->getDescricaoTurma();
    }
    if (isset($_GET['autocomplete'])) {
        $autocomplete = '0';
    } else {
        $autocomplete = null;
    }
} else {
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $turmas = $controlador->getTurmas();
    if (isset($_GET['autocomplete'])) {
        $autocomplete = $_GET['autocomplete'];
    } else {
        $autocomplete = null;
    }
}

?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Novo Tópico</title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
                
        <link rel="preload" href="css/novotopicostyle.css" as="style"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/novotopicostyle.css" rel="stylesheet"/>
        <link href="css/novotopico_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/css/bootstrap2/bootstrap-switch.min.css" rel="stylesheet"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js"></script> 
        <script async src="js/request.js"></script> 
        <link href="./css/cooltexttag.css" rel="stylesheet"/>
        <script src="./js/cool-tagtext.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu principal"><div id="icon"></div></a>
            <div class="subtitle"><h1>Novo Tópico</h1></div>
            <div class='title'> <?= $title; ?></div> 
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="area">
            <form class="pure-form" onsubmit="publicar(event)">
                <label for="titulo">Título</label>
                <input id="titulo" autocomplete="off" placeholder="Máximo 100 caracteres" maxlength="100" name='titulo' type="text" required="required">
                <label for="texto">Texto</label>
                <textarea id="texto" name='texto' required="required" ></textarea>
                <p>
                    <label for="turmaselector">Vincular á turma: </label>
                    <select name="turma" id="turmaselector">
                        <option value="null">Nenhuma</option>
                        <?php if ($isAluno): ?>
                            <?PHP if ($turma): ?>
                                <option value="0"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turma->getAno() ?></option>
                            <?PHP endif; ?>
                        <?PHP else: ?>
                            <?PHP foreach ($turmas as $i => $turma): $details = $turma->getDescricaoTurma(); ?>
                                <option value="<?= $i ?>"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turma->getAno() ?></option>
                            <?PHP endforeach; ?>
                        <?PHP endif; ?>
                    </select>
                </p>

                <hr/>
                <label for="anonimo">Assinatura:</label>
                <br/>
                <input type="checkbox" id="anonimo" name="anonimo"/>
                <div id="particular-div">
                    <label for="particular">Visibilidade:</label>
                    <br/>
                    <input type="checkbox" id="particular" name="particular" disabled=""/>
                </div>
                <hr/>
                </p>
                <p style="height: 13px;line-height: 13px;">
                    <input style="float: left;" type="checkbox" id="report" name="report"/>
                    <label for="report">Tópico de Report</label>
                </p>
                <button class="pure-button pure-button-primary" id='post'>Publicar</button>
                <button class="pure-button" onclick="window.location = './profile.php';"  type='button' >Cancelar</button>
            </form>
        </div>
        <?PHP include './includes/navbar.php'; ?>

        <script async>

            publicar = function (event) {
                event.preventDefault();
                post("./request/topicos/novoTopico.php", function (data) {
                    redirect("./topicoview.php", {id: data.lastId});
                }, {
                    titulo: $("#titulo").val(),
                    texto: $("#texto").val(),
                    turma: $("#turmaselector").val(),
                    particular: $("#particular").prop('checked'),
                    anonimo: $("#anonimo").prop('checked'),
                    report: $("#report").prop('checked')
                }
                );
            };
            $.fn.bootstrapSwitch.defaults.offColor = 'success';
            $.fn.bootstrapSwitch.defaults.offText = 'Pública';
            $.fn.bootstrapSwitch.defaults.onText = 'Somente Turma';
            $.fn.bootstrapSwitch.defaults.handleWidth = '120px';
            $("#particular").bootstrapSwitch();

            $.fn.bootstrapSwitch.defaults.offText = 'Visível';
            $.fn.bootstrapSwitch.defaults.onText = 'Anônima';
            $.fn.bootstrapSwitch.defaults.handleWidth = '60px';
            $("#anonimo").bootstrapSwitch();

<?PHP if ($autocomplete !== null): ?>
                $("#particular-div").show();
                $("#turmaselector").val('<?= ($autocomplete !== null ? $autocomplete : 'null') ?>');
                $("#particular").bootstrapSwitch('disabled', false);
<?PHP else: ?>
                $("#particular-div").hide();
<?PHP endif; ?>

            $("#turmaselector").change(function () {
                if ($(this).val() !== 'null') {
                    $("#particular-div").show();
                    $("#particular").bootstrapSwitch('disabled', false);
                } else {
                    $("#particular-div").hide();
                    $("#particular").bootstrapSwitch('state', false);
                    $("#particular").bootstrapSwitch('disabled', true);
                }
            });

            $("#texto").coolTagText();
            $("#texto").trigger("appendCooltexttag");
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
