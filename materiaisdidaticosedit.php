
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

if (isset($_GET['index'])) {
    $index = $_GET['index'];
} else {
    $_GET['index'] = 0;
}

include './controladores/Professor.php';
include './controladores/Turma.php';
include './entidades/MaterialDidatico.php';

$controlador = $controlador->getProfessor();
$turma = $controlador->getTurmaByIndex($index);
$details = $turma->getDescricaoTurma();
$materiaisdidaticos = $turma->listarMateriaisDidaticos();
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
        
        <link rel="preload" href="css/materialdidaticoeditstyle.css" as="style"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">

        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/request.css" rel="stylesheet"/>
        <link async href="css/materialdidaticoeditstyle.css" rel="stylesheet"/>
        <link async href="css/materialdidaticoeditstyle_responsive.css" rel="stylesheet" media="(max-width: 510px)"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>

        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/request.js"></script>
        <link href="./css/cooltexttag.css" rel="stylesheet"/>
        <script src="./js/cool-tagtext.js"></script>
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
            <button class="pure-button" id="voltar" onclick="window.location = './class.php?index=<?= $index ?>';">Voltar para a Turma</button>
            <div class="area">
                <div class="novo">
                    <div class="title">Incluir</div>
                    <form class="pure-form" id="formMaterial" onsubmit="submitMaterial(event);">
                        <input type="hidden" name="index" value="<?= $index ?>"/>
                        <label class="label" for="titulo">Título</label>
                        <input required="required" autocomplete="off" id="titulo" maxlength="45" name="titulo" placeholder="Máximo 45 caracteres"/>
                        <label class="label" for="detalhes">Descricao</label>
                        <textarea required="required" id="detalhes" name="detalhes"></textarea>
                        <label class="label" for="arquivo">Arquivo</label>
                        <input required="required" id="arquivo" type="file" name="arquivo"/>
                        <div class="smalllabel">Não é permitido arquivos:</div>
                        <div class="smalllabel">- Executáveis (<b>.exe</b>)</div>
                        <div class="smalllabel">- Maiores que <b>5MB</b></div>
                        <button type="submit" class="pure-button pure-button-primary submit">Carregar novo Material</button>
                    </form>
                </div>
                <div class="lista">
                    <div class="title">Materiais</div>
                    <div class="columnnames">
                        <div class="columnntitulo">Título</div>
                        <div class="columnndata">Data</div>
                        <div class="columnnhora">Hora</div>
                    </div>
                    <div class="materiaistable">
                        <?PHP
                        if (!empty($materiaisdidaticos)):
                            foreach ($materiaisdidaticos as $i => $material):
                                include './includes/materiallayout.php';
                            endforeach;
                        else:
                            ?>
                            <p class="empty">Vazio</p>
                        <?PHP endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="materiadetails" style="display:none">
            <div class="title">Detalhes<a title="Fechar detalhes do material" onclick="closeMaterial()"><i class="fa fa-times"></i></a></div>
            <div class="label">Título</div>
            <div class="value" id="tituloAbout"></div>
            <div class="label">Detalhes</div>
            <div class="value" id="detalhesAbout"></div>
            <div class="label">Nome do Arquivo</div>
            <div class="value" id="nameAbout"></div>
            <div class="label">Extensão do Arquivo</div>
            <div class="value" id="extensaoAbout"></div>
            <div class="label">Tamanho do Arquivo</div>
            <div class="value" id="sizeAbout"></div>
            <a id="download" onclick="downloadMaterial()"><button class="pure-button pure-button-primary download">Baixar</button></a>
            <button class="pure-button delete" onclick="deletar()">Deletar</button>
        </div>
        <?PHP include './includes/navbar.php'; ?>
        <script async>

            function downloadMaterial() {
                postSubmit("./submit/downloadMaterial.php", {id: materialAberto.id});
            }

            function submitMaterial(event) {
                event.preventDefault();
                postWithFile("./request/material/novo.php", function (data) {
                    if ($(".materiaistable").find(".material").length === 0) {
                        $(".materiaistable").html(data.html);
                    } else {
                        $(".materiaistable").prepend(data.html);
                    }
                    swal({
                        title: "Material adicionado com sucesso!",
                        type: "success"
                    });
                }, new FormData($("#formMaterial")[0]));
            }

            function deletar() {
                if (materialAberto) {
                    var id = materialAberto.id;
                    swal({
                        title: "Você tem certeza?",
                        text: "Não será possível recuperar as informações do material (como arquivos)!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Remover",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: true,
                        closeOnCancel: true},
                            function (isConfirm) {
                                if (isConfirm) {
                                    post("./request/material/delete.php", function () {
                                        swal({
                                            title: "Material removido com sucesso!",
                                            type: "success"
                                        });
                                        var table = $(materialAberto.obj).parents(".materiaistable")[0];
                                        $(materialAberto.obj).remove();
                                        if ($(table).find(".material").length == 0) {
                                            $(table).append("<p id='empty'>Vazio</p>");
                                        }
                                        closeMaterial();
                                    }, {id: id});
                                }
                            });
                }
            }

            var materialAberto = false;

            function openMaterial(id, obj) {
                $(".materiadetails").hide();
                $("body").addClass("reponsive-menu-2");
                setTimeout(function () {
                    post("./request/material/get.php", function (data) {
                        for (var key in data.resposta) {
                            $("#" + key + "About").text(data.resposta[key]);
                        }
                        materialAberto = {id: id, obj: obj, nome: data.resposta["name"]};
                        $(".materiadetails").show();
                    }, {id: id});
                }, 400);

            }
            function closeMaterial() {
                $("body").removeClass("reponsive-menu-2");
                materialAberto = false;
                $(".materiadetails").hide();
            }

            $("#detalhes").coolTagText();
            $("#detalhes").trigger("appendCooltexttag");
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
