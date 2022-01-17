<?PHP
if (!defined('CLASSVIEW')) {
    exit('No direct script access allowed');
}
?>
<?PHP if (!empty($turmas)): ?>
    <div class='sub-topbar topbar'>
        <button onclick="redirect('./classmanager.php')" class="pure-button pure-button-primary"><i class="fa fa-plus"></i> Nova Turma</button>
        <form class="pure-form">
            <label for="selectturma">
                Visualizando Turma:
            </label>
            <select onchange="reload({index: this.value});" id="selectturma">
                <?PHP
                foreach ($turmas as $i => $turmafor):
                    try {
                        if ($i !== $index) {
                            $details = $turmafor->getDescricaoTurma();
                        } else {
                            $details = $indexdetail;
                        }
                    } catch (Exception $e) {
                        $details = "Error: " + $e;
                    }
                    ?>
                    <option <?= ($index == $i ? "selected" : "") ?> value="<?= $i ?>"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turmafor->getAno() . ($details['total_solicitacoes'] !== 0 ? ': +' . $details['total_solicitacoes'] . " " . ($details['total_solicitacoes'] == 1 ? "Solicitação" : "Solicitações") : '') ?></option>
                <?PHP endforeach; ?>
            </select>
        </form>
    </div>
    <div class="sidebar">
        <div class="title"><p>Gerenciar</p></div>
        <a href="./novaatividade.php?index=<?= $index ?>" class="buttonW newactivy-img" >
            Nova atividade
        </a>
        <a href='./solicitacoes.php?index=<?= $index ?>' class="buttonW new-users">
            <div class="notify" style="z-index:2">
                <?PHP if ($indexdetail['total_solicitacoes'] !== 0): ?>
                    <div class="log">+<?= $indexdetail['total_solicitacoes'] ?></div>
                <?PHP endif; ?>
                Solicitações
            </div>
        </a>
        <a href='./alunos.php?index=<?= $index ?>' class="buttonW users">Alunos</a>
        <a href="./materiaisdidaticosedit.php?index=<?= $index ?>" class="buttonW material">Material Didático</a>
        <a href="./topicosturma.php?index=<?= $index ?>" class="buttonW notepad">Tópicos Vinculados</a>

        <details class='titleclass' open="">
            <summary>Detalhes</summary>
            <div class="infos open">
                <p><?= $indexdetail['total_alunos'] ?> Aluno(s)</p>
                <p><?= $indexdetail['total_atividades'] ?> Atividade(s)</p>
                <div class="Separator"></div>
                <p><?= $turma->getSemestre() ?> ° Semestre de <?= $turma->getAno() ?></p>
                <label>Disciplina</label><p><?= $indexdetail['disciplina_nome'] ?></p>
                <label>Curso</label><p><?= $indexdetail['curso_nome'] ?>(<?= $indexdetail['curso_sigla'] ?>)</p>
                <label>Instituição</label><p><?= $indexdetail['instituicao_nome'] ?> (<?= $indexdetail['instituicao_uf'] ?>)</p>
                <label>Professor</label><p><?= $professortitle ?></p><p><?= $indexdetail['professor_email'] ?></p>
            </div>
        </details>
    </div>
    <div class="content">
        <div class="labelAboutHeader">
            <b>Turma</b>: <?= $indexdetail['disciplina_nome'] ?>
        </div>
        <div class="aboutHeader">
            <ul>
                <li data-div-class="status" class="selected"><i class="fa fa-info-circle"></i> Sobre</li>
                <li data-div-class="ensino"><i class="fa fa-paperclip"></i> Plano de Ensino</li>
                <li data-div-class="calendario"><i class="fa fa-calendar"></i> Calendário</li>
            </ul>
        </div>
        <div class="status">
            <?PHP if (!empty($turma->getStatus())): ?>
                <p id="statusP" onclick="editStatus(true)"><?= nl2br($turma->getStatus()) ?></p>
            <?PHP else: ?>
                <p id="statusP" onclick="editStatus(false)"><small>Insira aqui algumas informações que ficaram em destaque para turma, e para os ingressantes a disciplina</small></p>
            <?PHP endif; ?>
        </div>
        <div class="ensino" style="display: none">
            <form id="submitPlanoEnsino">
                <input value='<?= $index ?>' name='index' type="hidden"/>
                <label for='ensino_file'>Substituir arquivo: </label>
                <input style="width: 100%;" id='ensino_file' name="ensino_file"  type="file" onchange="submitPlanoEnsino()"/>
            </form>
            <p id="filename-planoensino"></p>
            <div id='options_ensino'>
                <button class="pure-button" onclick="deletePlanoEnsino()"><i class="fa fa-trash"></i> Remover arquivo</button>
                <button class="pure-button pure-button-primary" onclick="downloadPlanoEnsino()"><i class="fa fa-download"></i> Download</button>
                <button class="pure-button pure-button-primary" onclick="prewiePlanoEnsino()"><i class="fa fa-eye"></i> Visualizar</button>
            </div>
        </div>
        <div class="calendario" style='display: none'>
            <div class="title">Eventos</div>
            <ul>
            <?PHP if(empty($eventos)): ?>
                <li class="empty">Vazio</li>
            <?PHP 
            else: 
                foreach($eventos as $evento): 
                    include './includes/eventolayout.php';
                endforeach; 
            endif;
            ?>
            </ul>
            <form id="submitCalendario" class='pure-form'>
                <table id='headercalendario'>
                    <tr><th>Título</th><td><input maxlength="45" style="color:black" type='text' id='calendarioTitle'/></td></tr>
                    <tr><th>Data</th><td><input style="color:black" placeholder="DD/MM/AAAA" type='text' id='calendarioData'/></td></tr>
                    <tr><th></th><td><button onclick="submitNewEvent()" type="button" class='pure-button pure-button-primary'><i class="fa fa-plus-circle"></i> Adicionar Evento</button></td></tr>
                </table>
            </form>
        </div>
        <div class="labelAboutHeader">
            <b>Atividade</b>
        </div>
        <div class="aboutHeader about-atividade">
            <ul>
                <li data-div-class="atividades-open" class="selected"><i class="fa fa-calendar-check-o"></i> Em Andamento</li>
                <li data-div-class="atividades-close"><i class="fa fa-calendar-times-o"></i> Encerradas</li>
            </ul>
        </div>
        <div class="atividades atividades-open">
            <?PHP if (!empty($atividadesabertas)): ?> 
                <?PHP foreach ($atividadesabertas as $i => $atividade): try { ?>
                        <div class="atividade">
                            <div class="title"><p><?= $atividade->getTitulo() ?></p></div>
                            <div class="arquivos"><p><?= $turma->getTotalArquivo($atividade->getId(), $isAluno, $controlador->getUserId()) ?></p></div>
                            <div class="data"><b>até </b><?= $atividade->getDataLimiteFormatada() ?></div>
                            <div class="infos">
                                <?PHP if (strlen($atividade->getTexto()) >= 200): ?>
                                    <p><?= substr($atividade->getTexto(), 0, 200) ?> (...)</p>
                                    <p><a href="atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>">Continuar Lendo ...</a></p>
                                <?PHP else: ?>
                                    <p><?= $atividade->getTexto() ?></p>
                                <?PHP endif; ?>
                                <div class="details">
                                    <button class="showatv" onclick="window.location = 'atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Visualizar</button>
                                    <button class="editatv" onclick="window.location = 'atividadeedit.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Editar</button>
                                    <button class="deleteatv" onclick="deletarAtividade(<?= $atividade->getId() ?>, this)">Excluir</button>
                                    <p><b>Última revisão:</b> <?= $atividade->getDataRevisaoFormatada() ?><b> ás </b><?= $atividade->getHoraRevisao() ?></p>
                                </div>
                            </div>
                        </div>
                        <?PHP
                    } catch (Exception $e) {
                        echo $e;
                    } endforeach;
                ?>
            <?PHP else: ?>
                <p class="empty"><a href="./novaatividade.php?index=<?= $index ?>">Criar nova atividade</a></p>
            <?PHP endif; ?>
        </div>
        <div class="atividades atividades-close" style="display: none"> 
            <?PHP if (!empty($atividades)): ?> 
                <?PHP foreach ($atividades as $i => $atividade): try { ?>
                        <div class="atividade">
                            <div class="title"><p><?= $atividade->getTitulo() ?></p></div>
                            <div class="arquivos"><p><?= $turma->getTotalArquivo($atividade->getId(), $isAluno, $controlador->getUserId()) ?></p></div>
                            <div class="data"><b>até </b><?= $atividade->getDataLimiteFormatada() ?></div>
                            <div class="infos">
                                <?PHP if (strlen($atividade->getTexto()) >= 200): ?>
                                    <p><?= substr($atividade->getTexto(), 0, 200) ?> (...)</p>
                                    <p><a href="atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>">Continuar Lendo ...</a></p>
                                <?PHP else: ?>
                                    <p><?= $atividade->getTexto() ?></p>
                                <?PHP endif; ?>
                                <div class="details">
                                    <button class="showatv" onclick="window.location = 'atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Visualizar</button>
                                    <button class="editatv" onclick="window.location = 'atividadeedit.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Editar</button>
                                    <button class="deleteatv" onclick="deletarAtividade(<?= $atividade->getId() ?>, this)">Excluir</button>
                                    <p><b>Última revisão:</b> <?= $atividade->getDataRevisaoFormatada() ?><b> ás </b><?= $atividade->getHoraRevisao() ?></p>
                                </div>
                            </div>
                        </div>
                        <?PHP
                    } catch (Exception $e) {
                        echo $e;
                    } endforeach;
                ?>
            <?PHP else: ?>
                <p class="empty">Vazio</p>
            <?PHP endif; ?>
        </div>
        <div class="topicosarea">
            <div class="title"><p><i class="fa fa-comments-o"></i> Tópicos Vinculados</p></div>
            <div class="topicos">
                <?PHP
                if (!empty($topicospersonal)):
                    foreach ($topicospersonal as $topico):
                        try {
                            $totalcomments = $controlador->getTotalRespostaTopico($topico->getId());
                            ?>
                            <div class="topico" id="<?= $topico->getId() ?>">
                                <div class="title"><p><?= $topico->getTituloCortado(30) ?></p></div>
                                <div class="comment"><p><?= $totalcomments ?></p></div>                                 
                                <div class="time"><p><?= $topico->getDataFormatada() ?> ás <?= $topico->getHoraMinimizada() ?></p></div>
                                <?PHP if ($topico->getParticular()): ?>
                                    <div class="locked"><p></p></div>
                                <?PHP endif; ?>
                            </div>
                            <?PHP
                        } catch (Exception $e) {
                            echo $e;
                        } endforeach;
                    if ($controlador->getTotalTopicosDoUsuario() > $maxpersonal):
                        ?>
                        <a href="./topicosturma.php?index=<?= $index ?>"><div class="more"><p> Listar todos ... </p></div></a>
                    <?PHP endif; ?>
                <?PHP else: ?>
                    <p class="empty">Vazio</p>
                <?PHP endif; ?>
            </div>
        </div>
    </div>
    <link href="./css/cooltexttag.css" rel="stylesheet"/>
    <script src="./js/cool-tagtext.js"></script>
    <script async>

        $("#calendarioData").datetimepicker({timepicker: false, format: 'd/m/Y', lang: 'pt-br',minDate:0});

        submitPlanoEnsino = function () {
            postWithFile("./request/turma/postPlanoEnsino.php", function (data) {
                $("#options_ensino button").removeAttr("disabled");
                $("#filename-planoensino").html($("#ensino_file").get(0).files[0].name);
                swal({title: data.resposta, type: "success"});
                
            }, new FormData($("#submitPlanoEnsino")[0]));
        };

        deletePlanoEnsino = function () {
            swal({
                title: "Você tem certeza?",
                text: "O arquivo não será mais acessível pelos alunos",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Remover",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true},
                function (isConfirm) {
                    if (isConfirm) {
                        postWithFile("./request/turma/deletePlanoEnsino.php", function (data) {
                            $("#options_ensino button").attr("disabled", "disabled");
                            $("#filename-planoensino").html("Sem arquivo anexado");
                            swal({title: data.resposta, type: "success"});
                        }, {index:<?= $index ?>});
                    }
            });
        };
        
        prewiePlanoEnsino = function(){
            postSubmit("./submit/prewiePlanoEnsino.php", {index:<?= $index ?>});
        };

        downloadPlanoEnsino = function () {
            postSubmit("./submit/downloadPlanoEnsino.php", {index:<?= $index ?>});
        };

        <?PHP if ($turma->getIdFile() == null): ?>
            $("#options_ensino button").attr("disabled", "disabled");
            $("#filename-planoensino").html("Sem arquivo anexado");
        <?PHP else: ?>
            $("#filename-planoensino").html("Nome do arquivo: <b><?= $turma->getFilename() ?></b>");
        <?PHP endif; ?>

        var totalEventos = <?= count($eventos) ?>;

        removeEvent = function(id,element){
            swal({
                title: "Você tem certeza?",
                text: "O evento não será mais visível pelos alunos",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Remover",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true},
                function (isConfirm) {
                    if (isConfirm) {
                        post("./request/turma/deleteEvento.php", function (data) {
                            totalEventos--;
                            $($(element).parents("li")[0]).remove();
                            if(totalEventos===0){
                                $(".calendario ul").html("<li class='empty'>Vazio</li>");
                            }
                            swal({title:data.resposta,type:"success"});
                        }, {id:id,index:<?= $index ?>});
                    }
            });
        };

        submitNewEvent = function(){
            var date = $('#calendarioData').val().split("/");
            var data = {
                index:<?= $index ?>,
                titulo: $("#calendarioTitle").val(),
                dia: date[0],
                mes: date[1],
                ano: date[2]
            };
            post("./request/turma/novoEvento.php", function (data) {
                if(totalEventos===0){
                    $(".calendario ul").html("");
                }
                $(".calendario ul").append(data.html);
                totalEventos++;
                swal({title:data.resposta,type:"success"});
            }, data);
            
        };

        deletarAtividade = function (id, obj) {
            swal({
                title: "Você tem certeza?",
                text: "Não será possível recuperar as informações da atividade (como arquivos) e pode não haver necessidade de remover uma atividade!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Remover tudo",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true},
                    function (isConfirm) {
                        if (isConfirm) {
                            post("./request/atividade/delete.php", function () {
                                var atividade = $(obj).parents(".atividade")[0];
                                var atividades = $(atividade).parents(".atividades")[0];
                                $(atividade).remove();
                                if ($(atividades).find(".atividade").length == 0) {
                                    $(atividades).append("<p>Vazio</p>");
                                }
                            }, {id: id});
                        }
                    });
        };

        function editStatus(key) {
            $("#statusP").hide();
            var parent = $("#statusP").parents(".status");
            var text = (key ? $("#statusP").html() : "");
            text = text.replace(/<br\s*[\/]?>/gi, "");
            text = text.replaceAll("&nbsp;&nbsp;&nbsp;&nbsp;", "\t");

            var textarea = $("<textarea/>").
                    css("background-color", "rgba(0,0,0,0.2)").
                    css("border", "1px solid #ddd").
                    css("width", "calc(100% - 50px)").
                    css("margin", "20px").
                    css("margin-top", "10px").
                    css("padding", "5px").
                    css("margin-bottom", "0px").
                    css("resize", "vertical").
                    css("text-align", "center").
                    css("min-height", ($("#statusP").height()) + "px").
                    text(text).
                    coolTagText().
                    focus();

            var buttonprimary = $("<button/>").
                    addClass("pure-button").
                    addClass("pure-button-primary").
                    text("Salvar");

            var buttonsecondary = $("<button/>").
                    addClass("pure-button").
                    text("Cancelar");

            var close = function () {
                textarea.remove();
                buttonprimary.remove();
                buttonsecondary.remove();
                $("#statusP").show();
            };

            buttonprimary.click(function () {
                post("./request/turma/postStatusTurma.php", function (data) {
                    swal({title: "Sucesso", text: "Status atualizado", type: "success"});
                    $("#statusP").html(data.status);
                    close();
                }, {index:<?= $index ?>, status: textarea.val()});
            });
            buttonsecondary.click(function () {
                close();
            });
            parent.append(textarea);
            parent.append(buttonprimary);
            parent.append(buttonsecondary);

            textarea.trigger("appendCooltexttag");

        }

    </script>
    <div class="sidecontent">
        <div class="links">
            <div class="buttonedit" onclick="window.location = './classedit.php?index=<?= $index ?>& highlight=link';"></div>
            <div class="title"><p>Links</p></div>
            <?PHP if (!empty($links)): 
                    foreach ($links as $link){
                        include './includes/linklayout.php';
                    }
                 else: ?>
                <a href="./classedit.php?index=<?= $index ?>& highlight=link">Vazio ... Clique aqui para adicionar</a>
            <?PHP endif; ?>
        </div>
        <div class="materiais">
            <div class="buttonedit" onclick="window.location = './materiaisdidaticosedit.php?index=<?= $index ?>';"></div>
            <div class="title"><p>Materiais Didáticos</p></div>
            <?PHP if (!empty($materiais)): ?>
                <?PHP foreach ($materiais as $material): try { ?>
                        <div class="material" onclick="window.location = './materialdidaticoview.php?id=<?= $material->getId() ?>&index=<?= $index ?>'"><p><?= $material->getTitulo() ?></p></div>
                        <?PHP
                    } catch (Exception $e) {
                        echo $e;
                    } endforeach;
            else:
                ?>
                <a href="./materiaisdidaticosedit.php?index=<?= $index ?>">Vazio ... Clique aqui para adicionar</a>
            <?PHP endif; ?>
        </div>
        <div class="alunos">
            <div class="buttonedit" onclick="window.location = './alunos.php?index=<?= $index ?>';"></div>
            <div class="title"><p>Alunos</p></div>
            <?PHP if (!empty($alunos)): ?>
                <?PHP foreach ($alunos as $aluno): try { ?>
                        <div class="userimage" style="background-image:url(<?= $aluno['image'] ?>?=<?= rand() ?>);" title="<?= $controlador->getTitleNameBy($aluno['nome'], $aluno['sobrenome'], $aluno['apelido'], $aluno['email']) ?>"></div>
                        <?PHP
                    } catch (Exception $e) {
                        echo $e;
                    } endforeach;
                ?>
            <?PHP else: ?>
                <p>Vazio</p>
            <?PHP endif; ?>
        </div>

    </div>

<?PHP endif; ?>