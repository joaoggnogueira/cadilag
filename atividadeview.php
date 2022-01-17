
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

$firstname = $controlador->getFirstname();
$lastname = $controlador->getLastname();
$nickname = $controlador->getNickname();
$imageurl = $controlador->getFilteredImage();

$isAluno = $_SESSION['ehAluno'];
include './controladores/Turma.php';
include './entidades/Arquivo.php';

if (!isset($_GET['id'])) {
    $mensagem = "Atividade não encontrada";
    include "./includes/notfound.php";
    exit();
}
$id = (int) $_GET['id'];

if ($isAluno) {
    include './controladores/Aluno.php';
    $aluno = $controlador->getAluno();
    $turma = $aluno->getTurma();
    if (!$turma) {
        header("Location: profile.php");
    }
    $selfarquivos = $aluno->listarArquivosDaAtividade($id);
} else {
    include './controladores/Professor.php';
    $professor = $controlador->getProfessor();

    if (isset($_GET['index'])) {
        $index = $_GET['index'];
    } else {
        $index = 0;
    }
    $turma = $professor->getTurmaByIndex($index);
    if (!$turma) {
        header("Location: class.php");
    }
    $arquivos = $turma->listarArquivosDaAtividade($id);
}

include './entidades/Atividade.php';

$atividade = $turma->getAtividade($id);
if (!$atividade) {
    $mensagem = "Atividade não encontrada";
    include "./includes/notfound.php";
    exit();
}

$arquivosabertos = $turma->listarArquivosAbertosDaAtividade($id);

$estadoatual = $turma->getTotaisAtividade($id);
$faltam = $estadoatual['total'] - $estadoatual['fizeram'];
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Atividade - <?= $atividade->getTitulo() ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        
        <link rel="preload" href="css/atividadeviewstyle.css" as="style"/>

        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/atividadeviewstyle.css" rel="stylesheet"/>
        <link href="css/atividadeviewstyle_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/request.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o Menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Atividade</h1>
            </div>
            <button class="pure-button" onclick="window.location = '<?= (!$isAluno ? './class.php?index=' . $index : './class.php') ?>';">Voltar</button>
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="content">
            <div class="atividadearea">
                <div class="description">
                    <div class="text" id="titulo-atividade"><?= $atividade->getTitulo() ?></div>                    
                    <div class="text" id="descricao-atividade"><?= preg_replace("/\t/", "&nbsp&nbsp&nbsp&nbsp", nl2br($atividade->getTexto())) ?></div>
                    <div class="label"><b> <?= ($estadoatual['fizeram'] ? $estadoatual['fizeram'] : "0") ?></b> de <b><?= ($estadoatual['total'] ? $estadoatual['total'] : "0")?></b> já responderam a atividade</div>
                </div>
                <div class="info">
                    <div class="label"><b>Última Revisão: </b></div>
                    <div class="text"><?= $atividade->getDataRevisaoFormatada() ?><b> ás </b><?= $atividade->getHoraRevisao() ?></div>
                    <div class="label"><b>Data Limite: </b></div>
                    <div class="text"><?= $atividade->getDataLimiteFormatada() ?></div>
                    <?PHP if (!$isAluno): ?>
                        <button class="editatv" onclick="window.location = './atividadeedit.php?id=<?= $id ?>& index=<?= $index ?>'">Editar</button>
                        <button type="button" class="deleteatv" onclick="deletarAtividade()">Remover</button>
                    <?php endif; ?>
                </div>
            </div>

            <div class="arquivoarea">
                <div class="title">Arquivos</div>
                <div class="subtitle">Arquivos do Professor</div>
                <div class="columnnames">
                    <div class="descricao">Arquivo</div>
                    <div class="data">Data</div>
                    <div class="hora">Hora</div>                    
                </div>
                <div class="arquivosarea" id="professorarea">
                    <?PHP if (empty($arquivosabertos)): ?>
                        <p class="vazio">Vazio</p>
                        <?PHP
                    else:
                        foreach ($arquivosabertos as $i => $arquivo) {
                            include './includes/arquivolayout.php';
                        }
                    endif;
                    ?>
                </div>

                <?PHP if (!$isAluno): ?>
                    <div class="subtitle">Arquivos dos Alunos</div>
                    <div class="columnnames">
                        <div class="descricao">Arquivo</div>
                        <div class="data">Data</div>
                        <div class="hora">Hora</div>                    
                    </div>
                    <div class="arquivosarea">
                        <?PHP if (empty($arquivos)): ?>
                            <p class="vazio">Vazio</p>
                            <?PHP
                        else:
                            foreach ($arquivos as $i => $arquivo) {
                                include './includes/arquivolayout.php';
                            }
                        endif;
                        ?>
                    </div>
                <?PHP else: ?>
                    <div class="subtitle">Seus Arquivos</div>
                    <div class="columnnames">
                        <div class="descricao">Descrição</div>
                        <div class="data">Data</div>
                        <div class="hora">Hora</div>                    
                    </div>
                    <div class="arquivosarea" id="alunoarea">
                        <?PHP if (empty($selfarquivos)): ?>
                            <p class="vazio">Vazio</p>
                            <?PHP
                        else: foreach ($selfarquivos as $i => $arquivo) {
                                include './includes/arquivolayout.php';
                            } endif;
                        ?>
                    </div> 
                <?PHP endif; ?>
                <div class="subtitle">Adicionar</div>
                <form class="pure-form" id="formArquivo" onsubmit="submitArquivo(event)">
                    <input type="hidden" name="id" value="<?= $id ?>"/>
                    <label for="inputfile">Incluir novo arquivo:</label>
                    <input required="required" id="inputfile" type="file" name="url"/>
                    <div class="smalllabel">Não é permitido arquivo:</div>
                    <div class="smalllabel">- Executável (<b>.exe</b>)</div>
                    <div class="smalllabel">- Maior que <b>2MB</b> (Se puder utilizar arquivo comprimido sem arquivos compilados, como .jar):</div>
                    <button id="submitnewfile" class="pure-button pure-button-primary" >Carregar novo Arquivo</button>
                </form>
            </div>
            <button class="fechar pure-button" onclick="fechararquivo();" style="display:none">Voltar para a Lista</button>
            <div class="arquivodetail" style="display:none">
                <div class="title">Detalhes</div>
                <?PHP if (!$isAluno): ?>
                    <div id="alunoDetails">
                        <div class="label">Autor</div>
                        <div class="text" id="alunoAbout"></div>
                    </div>
                <?PHP endif; ?>
                <div class="label">Nome</div>
                <div class="text" id="purenomeAbout"></div>
                <div class="label">Extensão</div>
                <div class="text" id="extensionAbout"></div>
                <div class="label">Tamanho</div>
                <div class="text" id="sizeAbout"></div>
                <div class="label">Data de Upload</div>
                <div class="text" id="dataAbout"></div>
                <div class="label">Hora de Upload</div>
                <div class="text" id="horaAbout"></div>
                <button id="download-btn" onclick="downloadArquivo()" class="pure-button pure-button-primary download">Download</button>
                <button id="delete-btn" class="pure-button delete" onclick="deleteArquivo()">Remover</button>
            </div>
        </div>
        <?PHP include './includes/navbar.php'; ?>
        <script async>
<?PHP if (!$isAluno): ?>
                deletarAtividade = function () {
                    swal({
                        title: "Você tem certeza?",
                        text: "Não será possível recuperar as informações da atividade (como arquivos) e pode não haver necessidade de remover uma atividade!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Remover tudo",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false,
                        closeOnCancel: true},
                            function (isConfirm) {
                                if (isConfirm) {
                                    post("./request/atividade/delete.php", function () {
                                        redirect("./class.php", {index:<?= $index ?>});
                                    }, {id:<?= $id ?>, index: <?= $index ?>});
                                }
                            });
                };
<?PHP endif; ?>

            var arquivoAberto = false;

            downloadArquivo = function () {
                postSubmit("./submit/downloadArquivoAtividade.php", {id: arquivoAberto.id});
            };

            deleteArquivo = function () {
                swal({
                    title: "Você tem certeza?",
                    text: "Não será possível recuperar o arquivo!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post("./request/atividade/deleteArquivo.php", function () {
                                    if (arquivoAberto) {
                                        var arquivoarea = $(arquivoAberto.obj).parents(".arquivosarea")[0];
                                        $(arquivoAberto.obj).remove();
                                        if ($(arquivoarea).find(".arquivo").length === 0) {
                                            $(arquivoarea).html("<p class='vazio'>Vazio</p>");
                                        }
                                        fechararquivo();
                                        setTimeout(function () {
                                            swal({title: "Arquivo Removido", type: "success"});
                                        }, 400);
                                    }
                                }, {id: arquivoAberto.id});
                            }
                        }
                );
            };

            submitArquivo = function (event) {
                event.preventDefault();
                postWithFile("./request/atividade/novoArquivo.php", function (data) {
<?PHP if (!$isAluno): ?>
                        if ($(".arquivosarea#professorarea").find(".arquivo").length === 0) {
                            $(".arquivosarea#professorarea").html(data.html);
                        } else {
                            $(".arquivosarea#professorarea").prepend(data.html);
                        }
<?PHP else: ?>
                        if ($(".arquivosarea#alunoarea").find(".arquivo").length === 0) {
                            $(".arquivosarea#alunoarea").html(data.html);
                        } else {
                            $(".arquivosarea#alunoarea").prepend(data.html);
                        }
<?PHP endif; ?>
                    swal({
                        title: "Arquivo adicionado com sucesso!",
                        type: "success"
                    });
                }, new FormData($("#formArquivo")[0]));
            };

            var fechararquivo = function () {
                arquivoAberto = false;
                $(".arquivoarea").show();
                $(".arquivodetail").hide();
                $(".fechar").hide();        
            };
            setDetails = function (data) {
                for (var key in data.resposta) {
                    $("#" + key + "About").text(data.resposta[key]);
                }
                if (data.resposta.isYour) {
                    $("#delete-btn").show();
                    <?PHP if (!$isAluno): ?>
                        $("#alunoDetails").hide();
                    <?PHP endif; ?>
                } else {
                    $("#delete-btn").hide();
                    <?PHP if (!$isAluno): ?>
                        $("#alunoDetails").show();
                    <?PHP endif; ?>
                }

            };
            abrirArquivo = function (id, obj) {
                post("./request/atividade/getArquivo.php", function (data) {
                    data.id = id;
                    data.obj = obj;
                    arquivoAberto = data;
                    setDetails(data);
                    $(".fechar").show();
                    $(".arquivoarea").hide();
                    $(".arquivodetail").show();
                }, {id: id});

            };

        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>