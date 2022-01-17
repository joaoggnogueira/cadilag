<?PHP
if (!defined('CLASSVIEW')) {
    exit('No direct script access allowed');
}
?>
<div class='sub-topbar topbar'>
    <?PHP if (!$turma): ?>
        <?PHP if (!$solicitacao): ?>
            <button class="pure-button pure-button-primary" onclick="redirect('./classmanager.php');"><i class="fa fa-plus"></i>Escolher uma Turma</button>
            <div class="subtitleb"><p>Sem Turma</p></div>
        <?PHP else: ?>
            <div class="subtitleb" style="margin-top: -10px"><p>Solicitou a entrada na Turma de<br/><b><?= $solicitacao['disciplina_nome'] ?></b></p></div>
        <?PHP endif; ?>
    <?PHP else: ?>
        <div class='subtitleb'><br><?= $indexdetail['disciplina_nome'] ?> (<?= $indexdetail['curso_sigla'] ?>) - <?= $turma->getAno() ?></div>
    <?PHP endif; ?>
</div>
<?PHP if (!$turma): ?>
    <?PHP if ($solicitacao): ?>
        <div class="solicitacaoDetail">
            <div class="title"><p>Detalhes da Solicitação</p></div>
            <div class="details">
                <label>Instituição</label><p><?= utf8_encode($solicitacao['instituicao_nome']) ?> (<?= $solicitacao['instituicao_uf'] ?>)</p>
                <label>Curso</label><p><?= $solicitacao['curso_nome'] ?> (<?= $solicitacao['curso_sigla'] ?>)</p>
                <label>Disciplina</label><p><?= utf8_encode($solicitacao['disciplina_nome']) ?></p>
                <p><?= $solicitacao['semestre'] ?>° Semestre</p>
                <label>Ano</label><p><?= $solicitacao['ano'] ?>-<?= $solicitacao['semestre'] ?>° Semestre</p>
                <div class="Separator"></div>
            </div>
            <a id="cancel"><p>Cancelar Solicitação</p></a>
            <button class="pure-button pure-button-primary" onclick="window.location = './profile.php';">Voltar ao menu</button>
        </div>
        <div class="dicas">
            <p>A solicitação pode levar algum tempo para que o professor aceite.</p>
            <p>Quando a solicitação for aceita, você será notificado.</p>
            <p>Ao cancelar a solicitação, você poderá realizar uma nova.</p>
            <p><a href="./class.php">Atualizar Página</a></p>
        </div>
        <script>
            (function () {
                $("#cancel").click(function () {
                    swal({
                        title: "Cancelar solicitação?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Continuar",
                        cancelButtonText: "Voltar",
                        closeOnConfirm: false,
                        closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post("./request/gerenciaturma/cancelarSolicitacao.php", function () {
                                    redirect("./class.php");
                                }, {});
                            }
                        }
                    );
                    
                });
            })();
        </script>
    <?PHP endif; ?>
<?PHP else: ?>
    <div class="sidebar">
        <div class="title"><p>Menu</p></div>
        <a href='./alunos.php' class="buttonW users">Alunos</a>
        <a href='./topicosturma.php' class="buttonW notepad">Tópicos Vinculados</a>
        <details class='titleclass' open="">
            <summary>Detalhes</summary>
            <div class="infos open">
                <p><?= $indexdetail['total_alunos'] ?> Aluno(s)</p>
                <p><?= $indexdetail['total_atividades'] ?> Atividade(s)</p>
                <div class="Separator"></div>
                <p><?= $turma->getSemestre() ?> ° Semestre de <?= $turma->getAno() ?></p>
                <label>Disciplina</label><p><?= $indexdetail['disciplina_nome'] ?></p>
                <label>Curso</label><p><?= utf8_decode($indexdetail['curso_nome']) ?>(<?= $indexdetail['curso_sigla'] ?>)</p>
                <label>Instituição</label><p><?= $indexdetail['instituicao_nome'] ?> (<?= $indexdetail['instituicao_uf'] ?>)</p>
                <label>Professor</label><p><?= $indexdetail['professor_email'] ?></p>
            </div>
        </details>
        <a href='#' class="buttonW" onclick="unbindclass();">Desvincular-se</a>
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
            <p><?= $turma->getStatus() ?></p>
        </div>
        <div class="ensino" style="display: none">
            <div id='options_ensino'>
                <?PHP if ($turma->getIdFile() != null): ?>
                    <p>Nome do Arquivo: <b><?= $turma->getFilename() ?></b></p>
                    <button class="pure-button pure-button-primary" onclick="downloadPlanoEnsino()"><i class="fa fa-download"></i> Download</button>
                    <button class="pure-button pure-button-primary" onclick="prewiePlanoEnsino()"><i class="fa fa-eye"></i> Visualizar</button>
                <?PHP else: ?>
                    <p>O professor não fez upload do arquivo</p>
                <?PHP endif; ?>
            </div>
        </div>
        <div class="calendario" style='display: none'>
            <div class="title">Eventos</div>
            <ul>
                <?PHP if (empty($eventos)): ?>
                    <li class="empty">Vazio</li>
                    <?PHP
                else:
                    foreach ($eventos as $evento):
                        include './includes/eventolayout.php';
                    endforeach;
                endif;
                ?>
            </ul>
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
                        <div class="atividade" id="<?= $i ?>">
                            <div class="title"><p><?= $atividade->getTitulo() ?></p></div>
                            <div class="arquivos"><p><?= $turma->getTotalArquivo($atividade->getId(), $isAluno, $controlador->getUserId()) ?></p></div>
                            <div class="data"><b>até </b><?= $atividade->getDataLimiteFormatada() ?></div>
                            <div class="infos">
                                <?PHP if (strlen($atividade->getTexto()) >= 200): ?>
                                    <p><?= substr($atividade->getTexto(), 0, 200) ?> (...)</p>
                                    <a href="atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>"><p>Continuar Lendo ...</p></a>
                                <?PHP else: ?>
                                    <p><?= $atividade->getTexto() ?></p>
                                <?PHP endif; ?>
                                <div class="details">
                                    <button class="showatv" onclick="window.location = 'atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Visualizar</button>
                                    <p><b>Última revisão:</b> <?= $atividade->getDataRevisaoFormatada() ?> ás <?= $atividade->getHoraRevisao() ?></p>
                                </div>
                            </div>
                        </div>
                    <?PHP
                    } catch (Exception $e) {
                        echo $e;
                    } endforeach;
                ?>
            <?PHP else: ?>
                <p>Vazio</p>
            <?PHP endif; ?>
        </div>
        <div class="atividades atividades-close" style="display: none">
    <?PHP if (!empty($atividades)): ?> 
        <?PHP foreach ($atividades as $i => $atividade): try { ?>
                        <div class="atividade" id="<?= $i ?>">
                            <div class="title"><p><?= $atividade->getTitulo() ?></p></div>
                            <div class="arquivos"><p><?= $turma->getTotalArquivo($atividade->getId(), $isAluno, $controlador->getUserId()) ?></p></div>
                            <div class="data"><b>até </b><?= $atividade->getDataLimiteFormatada() ?></div>
                            <div class="infos">
                                <?PHP if (strlen($atividade->getTexto()) >= 200): ?>
                                    <p><?= substr($atividade->getTexto(), 0, 200) ?> (...)</p>
                                    <a href="atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>"><p>Continuar Lendo ...</p></a>
                                <?PHP else: ?>
                                    <p><?= $atividade->getTexto() ?></p>
                <?PHP endif; ?>
                                <div class="details">
                                    <button class="showatv" onclick="window.location = 'atividadeview.php?id=<?= $atividade->getId() ?>& index=<?= $index ?>';">Visualizar</button>
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
                <p>Vazio</p>
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
                        <a href="./topicosturma.php"><div class="more"><p> Listar todos ... </p></div></a>
        <?PHP endif; ?>
    <?PHP else: ?>
                    <p class="empty">Vazio</p>
    <?PHP endif; ?>
            </div>
        </div>

    </div>

    <div class="sidecontent">
        <div class="links">
            <div class="title"><p>Links</p></div>
            <?PHP if (!empty($links)): 
                foreach ($links as $link) {
                    include './includes/linklayout.php';
                }
                 else: ?>
                <p>Vazio</p>
            <?PHP endif; ?>
        </div>
        <div class="materiais">
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
                <p>Vazio</p>
            <?PHP endif; ?>
        </div>
        <div class="alunos">
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
    <script>

        downloadPlanoEnsino = function () {
            postSubmit("./submit/downloadPlanoEnsino.php", {id:<?= $id ?>});
        };

        prewiePlanoEnsino = function () {
            postSubmit("./submit/prewiePlanoEnsino.php", {id:<?= $id ?>});
        };

        unbindclass = function () {
            swal({
                title: "Você tem certeza?",
                text: "Você não terá acesso a esta turma e perderá o acesso as estruturas",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sair",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false,
                closeOnCancel: true},
                    function (isConfirm) {
                        if (isConfirm) {
                            post('./request/gerenciaturma/desvincular.php', function () {
                                redirect('./class.php');
                            }, {});
                        }
                    }
            );

        };
    </script>
<?PHP endif; ?>

