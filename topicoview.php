
<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}
include './config/Database.php';
include './entidades/Topico.php';
include './entidades/Resposta.php';
include './controladores/ControladorUsuario.php';
$email = $_SESSION['email'];

$controlador = new ControladorUsuario();
if (!$controlador->setUser($email)) {
    header("Location: login.php");
}

if (!isset($_GET['id'])) {
    $mensagem = "Tópico não encontrado";
    include "./includes/notfound.php";
    exit();
}

$id = (int) $_GET['id'];
$topico = $controlador->getTopico($id);

if(!$topico){
    $mensagem = "Tópico não encontrado";
    include "./includes/notfound.php";
    exit();
}

$idturmatopico = $topico->getTurma();
include './controladores/Turma.php';
if ($_SESSION['ehAluno']) {
    include './controladores/Aluno.php';

    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();
} else {
    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $acesso = $controlador->possuiAcesso();
}

if ($idturmatopico !== null) {
    $turmatopico = $controlador->getTurmaById($idturmatopico);
    $details = $turmatopico->getDescricaoTurma();
}

$imageurl = $controlador->getFilteredImage();
$respostas = array_reverse($controlador->listarRespotasAoTopico($id));
$texto  = preg_replace("/\t/", "&nbsp&nbsp&nbsp&nbsp", nl2br($topico->getTexto()));

function linkCallback($match){
    if(preg_match('/(\.png|\.jpg|\.jpeg|\.gif)$/i', $match[0])){
        $urlimage_include = $match[0];
        ob_start();
        include "./includes/includeImageOnTopico.php";
        $view = ob_get_contents();
        ob_clean();
        ob_end_flush();
        return $view;
    } else {
        return "<a style='color:white;' href='$match[0]'>$match[0]</a>";
    }
}

$texto = preg_replace_callback('#\bhttps?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))#', 'linkCallback', $texto);
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Tópico - <?= $topico->getTitulo(); ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        
        <link rel="preload" href="css/topicoviewstyle.css" as="style"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet">
        
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/topicoviewstyle.css" rel="stylesheet"/>
        <link href="css/topicoview_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async href="css/request.css" rel="stylesheet"/>
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
                <h1>Tópico</h1>
            </div>
            <a href="./profile.php"><button class="pure-button" id="voltarprincipal">Voltar para o Principal</button></a>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="area">
            <div class="topico">
                <div class="description">
                    <div class="title"><?= $topico->getTitulo() ?></div>
                    <div class="data"><b>Última revisão:</b> <?= $topico->getDataFormatada() ?> <b>ás</b> <?= $topico->getHoraMinimizada() ?></div>
                </div>
                <div class="userinfo">

                    <div class="label">Criado por</div>
                    <div class="userlabel">
                        <?PHP if (!$topico->getAnonimo()): ?>
                            <img alt="Foto de <?= $topico->getTitleNameUser() ?>" src="<?= $topico->getUserImage() ?>" width="50" height="50"/>
                        <?PHP else: ?>
                            <img alt="Foto de Anônimo" src="./images/userdefault.png" width="50" height="50"/>
                        <?PHP endif; ?>
                        <div class='title'><p><?= $topico->getTitleNameUser(); ?></p></div>
                    </div>

                    <div class="locked">
                        <div class="label">Visibilidade</div>
                        <div class="value"><?= ($topico->getParticular() ? 'Somente para a turma' : 'Pública') ?></div>
                    </div>
                    <div class="type">
                        <div class="label">Tipo</div>
                        <div class="value"><?= ($topico->getReport() ? 'Report' : 'Padrão') ?></div>
                    </div>
                    <?PHP if ($idturmatopico !== null): ?>
                        <div class="bound">
                            <div class="label">Vinculado á Turma</div>
                            <div class="value"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turmatopico->getAno() ?></div>
                        </div>
                    <?PHP endif; ?>
                    <?PHP if ($topico->getIduser() === (int) $controlador->getUserId()): ?>
                        <div class="label">Opções</div>
                        <button class="editbtn" onclick="window.location = './topicoedit.php?id=<?= $id ?>'" >Editar</button>                        
                        <button type="button" class="deletebtn" onclick="deletarTopico(<?= $id ?>)">Deletar</button>
                    <?PHP endif; ?>
                </div>
                <div class='text'>
                    <?= $texto ?>
                </div>

            </div>
            <div class="respostasarea">
                <div id="contresposta">Total<p id="cont"><?= count($respostas) ?></p></div>
                <label for="resposta" class="title">Respostas</label>
                <form id="novaResposta" class="pure-form">
                    <input type="hidden" name="id" value="<?= $id; ?>"/>
                    <textarea id="resposta" required="required" placeholder="Digite aqui uma nova Resposta!" name="text" ></textarea>
                    <button type="button" onclick="submitResposta()" class="pure-button pure-button-primary">Publicar</button>
                </form>
                <div class="repostas">
                    <?PHP
                    foreach ($respostas as $resposta) {
                        include './includes/respostaTopico.php';
                    }
                    ?>
                </div>
            </div>
        </div>

        <?PHP include './includes/navbar.php'; ?>
        <script async>
            
            function openImage(d){
                var container = $(d).parents(".image-container").eq(0);
                container.toggleClass("opened");
                container.find(".foot-image-container").html("Clique para ocultar a imagem");
            } 
            
            submitResposta = function () {
                post("./request/topicos/novaResposta.php", function (data) {
                    $(".repostas").prepend(data.html);
                    $("#cont").text(parseInt($("#cont").text()) + 1);
                    $("#resposta").val("");
                }, {id:<?= $id ?>, text: $("#resposta").val()});
            };

<?PHP if ($topico->getIduser() === (int) $controlador->getUserId()): ?>
                function deletarTopico(id) {
                    swal({
                        title: "Você tem certeza?",
                        text: "Deseja remover por completo o tópico!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Remover",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false,
                        closeOnCancel: true},
                            function (isConfirm) {
                                if (isConfirm) {
                                    post("./request/topicos/deleteTopico.php", function (result) {
                                        redirect('./topicos.php');
                                    }, {id: id});
                                }

                            }
                    );
                }
<?PHP endif; ?>

            editarResposta = function (id) {
                var obj = $(".resposta#" + id);
                obj.find(".text").hide();
                $(".resposta#" + id + " .editbtn").attr("disabled", "disabled");

                var textarea;
                var text = obj.find(".text").text();
                text = text.replace(/<br\s*[\/]?>/gi, "");
                text = text.replaceAll("&nbsp;&nbsp;&nbsp;&nbsp;","\t");
                
                
                var cancel_btn,save_btn;
                
                obj.append(
                        (textarea = $("<textarea/>")
                        .css("color", "white")
                        .css("margin-top", "10px")
                        .css("margin-left", "120px")
                        .css("width", "366px")
                        .css("height", "155px")
                        .css("background", "rgba(255,255,255,0.1)")
                        .css("border", "none")
                        .css("padding", "5px")
                        .css("resize", "vertical")
                        .coolTagText()
                        .text(text)
                        ));
                obj.append(
                        save_btn = $("<button/>")
                        .addClass("pure-button")
                        .addClass("pure-button-primary")
                        .attr("type", "buttton")
                        .css("margin","5px")
                        .text("Alterar")
                        .click(function () {
                            var text = obj.find("textarea").val();
                            post('./request/topicos/updateResposta.php', function (data) {
                                $('.resposta#' + id + " .text").html(data.text);
                                $('.resposta#' + id + " .data").html("<p><b>Última revisão:</b> " + data.revisao + " </p>");
                                obj.find("textarea").remove();
                                cancel_btn.remove();
                                save_btn.remove();
                                obj.find(".text").show();
                                $(".resposta#" + id + " .editbtn").removeAttr("disabled");
                            }, {id: id, text: text});
                        })
                        );
                obj.append(
                        cancel_btn = $("<button/>")
                        .addClass("pure-button")
                        .attr("type", "buttton")
                        .text("Cancelar")
                        .css("margin-left", "10px")
                        .click(function () {
                            obj.find("textarea").remove();
                            cancel_btn.remove();
                            save_btn.remove();
                            obj.find(".text").show();
                            $(".resposta#" + id + " .editbtn").removeAttr("disabled");
                        })
                        );
                textarea.trigger("appendCooltexttag");
            };
            $("#resposta").coolTagText();
            $("#resposta").trigger("appendCooltexttag");

            $(".up").click(function () {
                var id = $(this).parent().parent().attr("id");
                if ($(this).parent().attr('disabled') !== 'disabled')
                {
                    postVote(id, true);
                }
            });

            $(".down").click(function () {
                var id = $(this).parent().parent().attr("id");
                if ($(this).parent().attr('disabled') !== 'disabled')
                {
                    postVote(id, false);
                }
            });

            postVote = function (id, valor) {

                var postData = {
                    'idresp': id,
                    'valor': valor,
                    'id': '<?= $id ?>'
                };

                post('./request/topicos/votarResposta.php', function () {
                    if (valor)
                    {
                        if ($(".resposta[id='" + id + "'] .up").attr('voted') !== 'voted')
                        {
                            $(".resposta[id='" + id + "'] .up").attr("voted", "voted");
                            $(".resposta[id='" + id + "'] .up").html(parseInt($(".resposta[id='" + id + "'] .up p").html()) + 1);
                            $(".resposta[id='" + id + "'] .down").removeAttr("voted");
                            $(".resposta[id='" + id + "'] .down").html(Math.max(parseInt($(".resposta[id='" + id + "'] .down p").html()) - 1, 0));
                        } else {
                            $(".resposta[id='" + id + "'] .up").removeAttr("voted");
                            $(".resposta[id='" + id + "'] .up").html(Math.max(parseInt($(".resposta[id='" + id + "'] .up p").html()) - 1, 0));
                        }
                    } else
                    {
                        if ($(".resposta[id='" + id + "'] .down").attr('voted') !== 'voted')
                        {
                            $(".resposta[id='" + id + "'] .down").html(parseInt($(".resposta[id='" + id + "'] .down p").html()) + 1);
                            $(".resposta[id='" + id + "'] .down").attr("voted", "voted");
                            $(".resposta[id='" + id + "'] .up").removeAttr("voted");
                            $(".resposta[id='" + id + "'] .up").html(Math.max(parseInt($(".resposta[id='" + id + "'] .up p").html()) - 1, 0));
                        } else
                        {
                            $(".resposta[id='" + id + "'] .down").removeAttr("voted");
                            $(".resposta[id='" + id + "'] .down").html(Math.max(parseInt($(".resposta[id='" + id + "'] .down p").html()) - 1, 0));
                        }
                    }
                }, postData);


            };

            function removeResposta(id) {
                swal({
                    title: "Você tem certeza?",
                    text: "Deseja remover por completo a resposta!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post('./request/topicos/deleteResposta.php', function () {
                                    $(".resposta#" + id).remove();
                                    $("#cont").html(parseInt($("#cont").html()) - 1);
                                }, {id: id});
                            }
                            return;
                        });
            }
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
