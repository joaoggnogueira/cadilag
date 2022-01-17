
<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}

include './config/Database.php';
include './controladores/ControladorUsuario.php';

$email = $_SESSION['email'];

if (isset($_GET['index'])) {
    $index = (int) $_GET['index'];
} else {
    $index = 0;
}

$controlador = new ControladorUsuario();
$controlador->setUser($email);
$firstname = $controlador->getFirstname();
$lastname = $controlador->getLastname();
$nickname = $controlador->getNickname();
$imageurl = $controlador->getFilteredImage();
$totalarquivos = $controlador->getTotalArquivos();
$totaltopicos = $controlador->getTotalTopicosDoUsuario();
$totalrespostas = $controlador->getTotalRespostaDoUsuario();
$style = 'style="border-bottom: 4px solid chartreuse;"';
include './controladores/Turma.php';
include './entidades/Topico.php';

$max = 8;
$maxpersonal = 3;
$maxbusca = 8;

$ini = $index * $max;
$fi = $ini + $max;
$inipersonal = 0;
$isAluno = $_SESSION["ehAluno"];

if (isset($_GET['busca'])) {
    $busca = $_GET['busca'];
    $topicosbusca = $controlador->buscarTopicosPublicos($ini, $maxbusca, $busca);
} else {
    $busca = false;
}

if ($isAluno) {
    include './controladores/Aluno.php';
    $controlador = $controlador->getAluno();
    $turma = $controlador->getTurma();

    if ($turma) {
        $totalatv = $turma->getTotalAtividadesAbertas();
        $descricao = $turma->getDescricaoTurma();
        $linkstatus = "./class.php";
        $status = 'Vinculado a turma de ' . $descricao['disciplina_nome'] . '(' . $descricao['curso_sigla'] . ') de ' . $turma->getAno();
    } else {
        $solicitacao = $controlador->getSolicitacao();

        if (!$solicitacao) {
            $linkstatus = "./classmanager.php";
            $status = 'Sem turma';
            $style = 'style="border-bottom: 4px solid crimson;"';
        } else {
            $linkstatus = "./class.php";
            $status = 'Aguardando solicitação para a turma ' . $solicitacao['disciplina_nome'] . ' (' . $solicitacao['curso_sigla'] . ') de ' . $solicitacao['ano'] . ' ser aceita';
            $style = 'style="border-bottom: 4px solid yellow;"';
        }
    }
} else {

    include './controladores/Professor.php';
    $controlador = $controlador->getProfessor();
    $turmas = $controlador->getTurmas();
    $total = count($turmas);
    $totalsolicitacoes = $controlador->getTotalSolicitacoes();

    if ($total === 0) {
        $linkstatus = "./classmanager.php";
        $status = 'Não possui turmas';
    } else if ($total === 1) {
        $descricao = $turmas[0]->getDescricaoTurma();
        $linkstatus = "./class.php";
        $status = 'Gerenciando uma turma de ' . $descricao['disciplina_nome'] . ' (' . $descricao['curso_sigla'] . ') de ' . $turmas[0]->getAno();
    } else {
        $linkstatus = "./class.php";
        $status = 'Gerenciando ' . $total . ' turmas';
    }
    $acesso = $controlador->possuiAcesso();
    if ($acesso) {
        $style = 'style="border-bottom: 4px solid aqua;"';
    } else {
        $style = 'style="border-bottom: 4px solid crimson;"';
        $status = 'Usuário não confirmado (Sem acesso á criação de turmas)';
    }
}

$title = $controlador->getTitleName();
$topicos = $controlador->listarTopicosPublicos($ini, $max);
$total = $controlador->getTotalTopicosPublicos();
$floor = ceil($total / $max) - 1;
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <title>Principal - <?= $title; ?></title>    
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link rel="manifest" href="manifest.json"/>
        
        <link rel="preload" href="css/principalstyle.css" as="style"/>
        
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="css/principalstyle.css" rel="stylesheet"/>
        
        <link async href="css/profile_responsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async href="css/request.css" rel="stylesheet"/>
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/request.js"></script>
        <link async href="css/notifyStyle.css" rel="stylesheet"/>
        <link async href="css/notifyResponsiveStyle.css" rel="stylesheet" media="(max-width: 510px)">
        <script async src="js/notifyManager.js"></script>
    </head>
    <body class="responsive-menu-0">
        <div class='topbar'>
            <div id="icon"></div>
            <div class="subtitle">
                <h1>Principal</h1>
            </div>
            <div class='title'>
                <p> <?= $title; ?> </p>
            </div> 
            <div class='resposives_buttons'>
                <button title="Menu do usuário" class="resposives_button selected"><i class='fa fa-id-badge'></i></button>
                <button title="Fórum" class="resposives_button"><i class='fa fa-inbox'></i></button>
                <button title="Outros" class="resposives_button"><i class='fa fa-info'></i></button>
            </div>
            <a title="Mostrar Notificações" href="#notificacoes" class="notify-btn" count="?"></a>
            <button title="Encerrar Sessão" class="pure-button" id="quit" onclick="quit()"><i class="fa fa-sign-out"></i></button>
        </div>
        <div class='sidebar'>
            <img async id='imguser' alt='Imagem do Perfil' src='<?= $imageurl; ?>'/>
            <div class="title"><p>Menu</p></div>
            <a id="edit" class="buttonW edit-img" href="./editprofile.php">Editar</a>
            <div id='options'>
                <a href="./class.php" class="buttonW class-img">Turma</a>
                <a href="./apps/structs" class="buttonW structure-img">Estruturas</a>
                <a href="./apps/graphs" class="buttonW nodegraph-img">Grafos</a>
            </div>
        </div>
        <div class="area">
            <a class="subarea" id="status" href="<?= $linkstatus; ?>" <?= $style; ?>>
                <b><i class="fa fa-info-circle"></i> </b><?= $status; ?>
            </a>
            <?PHP if ($isAluno && $turma !== null && isset($totalatv) && $totalatv !== 0): ?>                 
                <a href="./class.php?highlight=openatv" id="atvcont" class="subarea">
                    <b><?= $totalatv ?></b> Atividades em andamento
                </a>
            <?PHP endif; ?>
            <a href="./topicos.php" id="myTopic" class="buttonW mytopic-img">Meus Tópico</a>
            <a href="./novotopico.php" id="newTopic" class="buttonW newtopic-img">Novo</a>
            <?PHP if (!$busca): ?>
                <div class="subarea topicosarea">
                    <div class="title"><p>Tópicos Públicos</p></div>
                    <div class="topicos">
                        <?PHP if (!empty($topicos)): foreach ($topicos as $topico): try { ?>
                                    <a href="./topicoview.php?id=<?= $topico->getId() ?>">
                                        <div class="topico">
                                            <div class="title"><p><?= $topico->getTituloCortado(30) ?></p></div>
                                            <div class="comment"><p><?= $controlador->getTotalRespostaTopico($topico->getId()) ?></p></div>                                 
                                            <div class="time"><p><?= $topico->getDataFormatada() ?> ás <?= $topico->getHoraMinimizada() ?></p></div>
                                            <div class="topicoinfos">
                                                <div class="topicouser"><p>Por: <?= $topico->getTitleNameUser() ?></p></div>
                                                <?PHP if ($topico->getTurma() !== null): ?>
                                                    <div class="abouttopic"><p><i class="fa fa-users"></i>  Vinculado com turma</p></div>
                                                <?PHP endif; ?>
                                                <?PHP if ($topico->getReport()): ?>
                                                    <div class="abouttopic"><p><i class="fa fa-bug"></i> Report</p></div>
                                                <?PHP endif; ?>
                                            </div>
                                        </div>
                                    </a>
                                    <?PHP
                                } catch (Exception $e) {
                                    echo $e;
                                } endforeach;
                            ?>
                        <?PHP else: ?> 
                            <p id="empty">Vazio</p>
                        <?PHP endif; ?>
                    </div>
                    <?PHP if ($total > $max): ?>
                        <div class="pageselect">
                            <button id="prev" onclick="loadpage(<?= ($index - 1) ?>)" <?= ($index === 0 ? 'disabled' : '') ?>><</button>
                            <button id="first"<?= ($index === 0 ? 'atual="atual"' : '') ?> onclick="loadpage(0)">0</button>
                            <?PHP
                            if ((int) $floor !== 1):
                                $minI = max(array($index - 2, 1));
                                $maxI = min(array($index + 3, $floor));
                                if ($minI !== 1):
                                    ?>
                                    <button disabled>...</button>
                                    <?PHP
                                endif;
                                for ($i = $minI; $i < $maxI; $i++):
                                    ?>
                                    <button <?= ($index === $i ? 'atual="atual"' : '') ?> onclick="loadpage(<?= $i ?>)"><?= $i ?></button>
                                    <?PHP
                                endfor;
                                if ($maxI < (int) $floor):
                                    ?>
                                    <button disabled>...</button>
                                <?PHP endif; ?>
                            <?PHP endif; ?>
                            <button id="last" <?= ($index === (int) $floor ? 'atual="atual"' : '') ?> onclick="loadpage(<?= $floor ?>)"><?= $floor ?></button>
                            <button id="next" onclick="loadpage(<?= ($index + 1) ?>)" <?= ($index === (int) $floor ? 'disabled' : '') ?>>></button>
                        </div>   
                    <?PHP endif; ?>
                </div>
            <?PHP else: ?>
                <button style="background:rgba(0,0,0,0.4);color:white" onclick="window.location = './profile.php'">Sair da busca</button>
                <div class="subarea topicosarea">
                    <div class="title"><p>Resultado da Busca</p></div>
                    <div class="topicos">
                        <?PHP if (!empty($topicosbusca)): foreach ($topicosbusca as $topico): try { ?>
                                    <a href="./topicoview.php?id=<?= $topico->getId() ?>">
                                        <div class="topico">
                                            <div class="title"><p><?= $topico->getTituloCortado(30) ?></p></div>
                                            <div class="comment"><p><?= $controlador->getTotalRespostaTopico($topico->getId()) ?></p></div>                                 
                                            <div class="time"><p><?= $topico->getDataFormatada() ?> ás <?= $topico->getHoraMinimizada() ?></p></div>
                                            <div class="topicoinfos">
                                                <div class="topicouser"><p>Por: <?= $topico->getTitleNameUser() ?></p></div>
                                                <?PHP if ($topico->getTurma() !== null): ?>
                                                    <div class="bound"><p>Vinculado com turma</p></div>
                                                <?PHP endif; ?>
                                                <?PHP if ($topico->getReport()): ?>
                                                    <div class="bug"><p>Report</p></div>
                                                <?PHP endif; ?>
                                            </div>
                                        </div>
                                    </a>
                                    <?PHP
                                } catch (Exception $e) {
                                    echo $e;
                                } endforeach;
                            ?>
                        <?PHP else: ?> 
                            <p id="empty">Vazio</p>
                        <?PHP endif; ?>
                    </div>
                    <?PHP if ($total > $maxbusca): ?>
                        <div class="pageselect">
                            <button id="prev" onclick="loadpage(<?= ($index - 1) ?>)" <?= ($index === 0 ? 'disabled' : '') ?>><</button>
                            <button id="first"<?= ($index === 0 ? 'atual="atual"' : '') ?> onclick="loadpage(0)">0</button>
                            <?PHP
                            if ((int) $floor !== 1):
                                $minI = max(array($index - 2, 1));
                                $maxI = min(array($index + 3, $floor));
                                if ($minI !== 1):
                                    ?>
                                    <button disabled>...</button>
                                    <?PHP
                                endif;
                                for ($i = $minI; $i < $maxI; $i++):
                                    ?>
                                    <button <?= ($index === $i ? 'atual="atual"' : '') ?> onclick="loadpage(<?= $i ?>)"><?= $i ?></button>
                                    <?PHP
                                endfor;
                                if ($maxI < (int) $floor):
                                    ?>
                                    <button disabled>...</button>
                                <?PHP endif; ?>
                            <?PHP endif; ?>
                            <button id="last" <?= ($index === (int) $floor ? 'atual="atual"' : '') ?> onclick="loadpage(<?= $floor ?>)"><?= $floor ?></button>
                            <button id="next" onclick="loadpage(<?= ($index + 1) ?>)" <?= ($index === (int) $floor ? 'disabled' : '') ?>>></button>
                        </div>   
                    <?PHP endif; ?>
                <?PHP endif; ?>
            </div>
        </div>
        <div class="sidecontent">
            <div class="subarea">
                <form action="./profile.php" method="GET" class="pure-form">
                    <input placeholder="Buscar tópicos públicos" style="color:black" name="busca" value="<?= ($busca?$busca:"") ?>">
                </form>
            </div>
            <div class="subarea contadores">
                <div class="title">Você possui</div>
                <a class="contador" href="./arquivos.php">
                    <?php if ($totalarquivos !== 1): ?>
                        <b><?= $totalarquivos ?></b> Arquivos
                    <?php else: ?>
                        <b>Um</b> Arquivo
                    <?php endif; ?>
                </a>
                <a class="contador" href="./topicos.php">
                    <?php if ($totaltopicos !== 1): ?>
                        <b><?= $totaltopicos ?></b> Tópicos
                    <?php else: ?>
                        <b>Um</b> Tópico
                    <?php endif; ?>
                </a>
                <a class="contador" href="./respostas.php">
                    <?php if ($totalrespostas !== 1): ?>
                        <b><?= $totalrespostas ?></b> Respostas
                    <?php else: ?>
                        <b>Uma</b> Resposta
                    <?php endif; ?>
                </a>
                <?PHP if (!$isAluno && $totalsolicitacoes !== 0): ?>
                    <a class="contador" href="./solicitacoes.php">
                        <?php if ($totalsolicitacoes !== 1): ?>
                            <b><?= $totalsolicitacoes ?></b> Solicitações
                        <?php else: ?>
                            <b>Uma</b> Solicitação
                        <?php endif; ?>
                    </a>
                <?PHP endif; ?>
            </div>
            <div class="footer">
                <p>Versão Alpha 0.97</p>
                <p><small>Cadilag WEB @ 2016-2018</small></p>
                <p>Universidade Estadual Paulista<br>
                    Faculdade de Ciências e Tecnologia<br>
                    "Júlio de Mesquita Filho" - UNESP
                </p>
            </div>
        </div>
        <script async>
            
            $(".resposives_buttons button").click(function(){
                $(".resposives_buttons button").removeClass("selected");
                $(this).addClass("selected");
                var pos = $(".resposives_buttons button").index(this);
                document.body.className = "responsive-menu-"+pos;
            });
            
            function deletarTopico(id) {
                swal({
                    title: "Você tem certeza?",
                    text: "Deseja remover por completo o tópico!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post("./request/topicos/deleteTopico.php", function (data) {
                                    redirect('./profile.php');
                                }, {id: id});
                            }
                        }
                );
            }

            $(".topico-navbar").each(function () {
                $(this).next(".topico-options").hide();
                $(this).click(function () {
                    if ($(this).next(".topico-options").css('display') == 'none') {
                        $(".topico-options").slideUp(400);
                        $(this).next(".topico-options").slideDown(400);
                    } else {
                        $(this).next(".topico-options").slideUp(400);
                    }
                });
            });
            $(".topico-area").each(function () {
                $(this).mouseleave(function () {
                    $(this).find('.topico-options').slideUp(400);
                });
            });

            loadpage = function (number) {
                redirect("./profile.php",{index:number<?= (!$busca ? '' : ',busca:' . $busca) ?>});
            };

            toggleuserinfos = function (element) {
                $(element).toggleClass('open');
                $('#infos').toggleClass('open');
            };
            
            function quit() {
                 swal({
                     title: "Continuar?",
                     type: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#DD6B55",
                     confirmButtonText: "Encerrar Sessão",
                     cancelButtonText: "Cancelar",
                     closeOnConfirm: false
                 },
                 function () {
                     localStorage.setItem('emailCadilag', null);
                     localStorage.setItem('senhaCadilag', null);
                     window.location = './closesession.php';
                 });

             }
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
