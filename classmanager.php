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
    $controlador->setUser($email);

    $imageurl = $controlador->getFilteredImage();
    $isAluno = $_SESSION['ehAluno'];
    $title = $controlador->getTitleName();
    
    if(!$isAluno) {
        include './controladores/Professor.php';
        $controlador = $controlador->getProfessor();
        if(!$controlador->possuiAcesso()) {
            header("Location: class.php");
        }
    }
    include './entidades/Instituicao.php';
    include './entidades/Curso.php';
    include './controladores/Turma.php';
    include './entidades/Disciplina.php';
    $instituicoes = $controlador->listarInstituicoes();
    
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width">
        <title>Vincular Turma - <?= $title; ?></title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet">

        <link rel="preload" href="css/classmanagerstyle.css" as="style"/>

        <link href="css/genericstyle.css" rel="stylesheet"/>
        <link href="css/request.css" rel="stylesheet"/>
        <link href="css/classmanagerstyle.css" rel="stylesheet"/>
        <link async href="css/classmanagerstyle_reponsive.css" rel="stylesheet" media="(max-width: 510px)">
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script src="js/request.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o menu Principal">
                 <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Vincular Turma</h1>
            </div>
            <div class='title'><?= $title; ?> </div> 
            <a id='gotohub' href="#atalhos" title="Mostrar atalhos">
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </a>
        </div>
        <div class="scroll-area">
        <div class='descriptionbar'>
            <div class='description'>Instituição</div>
            <div class='description' style='width: 250px;'>Curso</div>
            <div class='description'>Disciplina</div>
            <div class='description' style='width: 235px;border-right:none;'>Turma</div>
        </div>
        <div class='area'>
            <div class='level' number='1'>
                <div class='subarea'>
                <?php foreach($instituicoes as $i=>$instituicao): ?>
                       <button class='optionl' subarea='<?= $instituicao->getId() ?>'>
                           <?= $instituicao->getNome() ?><br><b><?= $instituicao->getUf() ?></b>
                       </button>    
                <?php endforeach; ?>
                <?PHP if(!$isAluno): ?>
                    <form action="./createInstituicao.php">
                        <button class="optionl">Nova Instituição</button>
                    </form>
                <?php endif; ?>
                </div>
            </div>
            <div class='level' number='2'>
            <?PHP
                foreach($instituicoes as $i=>$instituicao): 
                    $cursos = $instituicao->getCursos();
                    if(!empty($cursos)):
                    ?>  
                        <div class='subarea' id='<?= $instituicao->getId() ?>' style='display:none;'>
                        <?PHP foreach($cursos as $j=>$curso): ?>
                            <button class="optionl" subarea="<?= $curso->getId() ?>"><?= $curso->getNome() ?><br><b><?= $curso->getSigla() ?></b></button>
                            <?PHP endforeach; if(!$isAluno): ?>    
                            <form action="./createCurso.php" method='POST'>
                                <input type='hidden' name='instid' value='<?= $instituicao->getId() ?>'/>
                                <button class="optionl">Novo Curso</button>
                            </form>
                            <?PHP endif; ?>
                        </div>
                    <?PHP else: ?>
                        <div class='subarea' id='<?= $instituicao->getId() ?>' style='display:none;'>
                            <?PHP if(!$isAluno): ?>
                            <form action="./createCurso.php" method='POST'>
                                <input type='hidden' name='instid' value='<?= $instituicao->getId() ?>'/>
                                <button class="optionl">Novo Curso</button>
                            </form>
                            <?PHP endif; ?>
                            <div class="vazio"><p>Vazio</p></div>
                        </div>   
            <?PHP endif; endforeach; ?>
            </div>
            <div class='level' number='3'>
            <?PHP
                foreach($instituicoes as $i=>$instituicao):
                    foreach($instituicao->getCursos() as $j=>$curso):
                        $disciplinas=$curso->getDisciplinas();?>
                        <div class='subarea' id='<?=$curso->getId()?>' style='display: none;'>
                        <?PHP if(!empty($disciplinas)): ?>
                            <?PHP foreach($disciplinas as $k=>$disciplina): ?>
                                <button class="optionl" subarea="<?= $disciplina->getId()?>"><?= $disciplina->getNome() ?></button>
                            <?PHP endforeach; if(!$isAluno): ?>
                                <form action="./createDisciplina.php" method='POST'>
                                    <input type='hidden' name='idcurso' value='<?= $curso->getId() ?>'/>
                                    <button class="optionl">Nova Disciplina</button>
                                </form>
                            <?PHP endif; ?>
                        <?PHP else: if(!$isAluno): ?>
                                <form action="./createDisciplina.php" method='POST'>
                                    <input type='hidden' name='idcurso' value='<?= $curso->getId() ?>'/>
                                    <button class="optionl">Nova Disciplina</button>
                                </form>
                            <?PHP endif; ?>
                                <div class="vazio"><p>Vazio</p></div>
                            <?PHP 
                        endif;?>
                        </div> <?PHP   
                    endforeach;
                endforeach;
            ?>
            </div>
            <div class='level' number='4' final='final'>
            <?PHP
                foreach($instituicoes as $i=>$instituicao):
                    foreach($instituicao->getCursos() as $j=>$curso):
                        foreach($curso->getDisciplinas() as $k=>$disciplina):
                            $turmas = $disciplina->getTurmas();        
                            if(count($turmas)!=0): ?>
                                <div class='subarea' id='<?= $disciplina->getId() ?>' style='display: none;'>
                                    <?PHP foreach($turmas as $m=>$turma): ?>
                                        <button class="optionl" subarea="<?=$turmas[$m]->getIdturma()?>"><?= $turmas[$m]->getAno() ?><br><?=($turmas[$m]->getSemestre()==1?'Primeiro':'Segundo')?> Semestre<finalbutton><br><br>Selecionar</finalbutton><selectedbutton><br>Selecionado</selectedbutton></button>    
                                    <?PHP endforeach; if(!$isAluno): ?>
                                        <form action="./createTurma.php" method='POST'>
                                            <input type='hidden' name='iddisc' value='<?= $disciplina->getId() ?>'/>
                                            <button class="optionl">Nova Turma</button>
                                        </form>
                                    <?PHP endif?>
                                </div>
                            <?PHP else: ?>
                            
                                <div class='subarea' id='<?= $disciplina->getId() ?>' style='display: none;'>
                                    <?PHP if(!$isAluno): ?>
                                        <form action="./createTurma.php" method='POST'>
                                            <input type='hidden' name='iddisc' value='<?= $disciplina->getId() ?>'/>
                                            <button class="optionl">Nova Turma</button>
                                        </form>
                                    <?PHP endif; ?>
                                    <div class="vazio"><p>Vazio</p></div>
                                </div>
                            <?PHP
                            endif;
                        endforeach;
                    endforeach;
                endforeach;
            ?>
        </div>
    </div>
    
        <?php foreach($controlador->listarTodasTurmas() as $turma): ?>
                
            <div class="infos" style="display:none" id="<?= $turma->getIdturma() ?>">
                <div class="title"><p>Status</p></div>
                <div class="description"><p><?= ($turma->getStatus()!==null && $turma->getStatus()!==''?$turma->getStatus():'Não definido') ?></p></div>
            </div>
    
        <?PHP endforeach; ?>
    </div>
            <div class="buttonarea">
                <?PHP if($isAluno): ?>
                <button class="pure-button" onclick="solicitar()" id="save" disabled>Solicitar</button>
                <?PHP endif; ?>
                <button class="pure-button" id="cancel">Voltar</button>
            </div>
            <?PHP include './includes/navbar.php';?>
        <script>
            var dicas = $(".dicas");
            
            $("#cancel").click(function(){
                 redirect("./class.php");
            });
            <?PHP if($isAluno): ?>
                solicitar = function(){
                    var selectedTurma = $(".level[final='final'] .optionl[selected='selected']");
                    if(selectedTurma.length!=0){
                        swal({
                            title: "Continuar?",
                            text: "Você irá solicitar acesso ao professor dessa disciplina",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Continuar",
                            cancelButtonText: "Voltar",
                            closeOnConfirm: false,
                            closeOnCancel: true},
                            function (isConfirm) {
                                if (isConfirm) {
                                    post("./request/gerenciaturma/solicitar.php",function(){
                                        redirect("./class.php");
                                    },{idturma:selectedTurma.attr('subarea')});
                                }
                            }
                        );
                    }
                };
            <?PHP endif; ?>
            $(".level[final='final'] .optionl").click(function(){
                dicas.fadeOut(400);
                $(".infos").fadeOut(400);
                
                $(".infos[id='"+$(this).attr('subarea')+"']").fadeIn(400);
                $("#save").removeAttr('disabled');
            });
            
            $(".optionl").click(function(){
                
                if($(this).parent().parent().attr('final')!=='final'){
                    $(".infos").fadeOut(400);
                    $("#save").attr("disabled","");
                    dicas.fadeIn(400);
                }
                
                var subarea = $(this).attr('subarea');
                var level = parseInt($(this).parents(".level").attr('number'))+1;
                if($(this).attr('selected')!==undefined)
                {
                    $(this).removeAttr('selected');  
                    $(".level[number='"+level+"']  .subarea").fadeOut(200);
                    var leftPos = $('.scroll-area').scrollLeft();
                    $(".scroll-area").animate({scrollLeft: leftPos - 200}, 200);
                    for(var i=level+1;i<5;i++)
                    {
                        $(".level[number='"+i+"']  .subarea").fadeOut(200);
                        $(".level[number='"+level+"']  .optionl").removeAttr('selected');
                    }
                    return;
                }
                
                $(".level[number='"+level+"']  .subarea").fadeOut(200);
                $(".level[number='"+(level-1)+"']  .optionl").removeAttr('selected');
                $(this).attr('selected','');
                setTimeout(function(){
                    $(".level[number='"+level+"']  .subarea[id='"+subarea+"']").fadeIn(200);
                    var leftPos = $('.scroll-area').scrollLeft();
                    $(".scroll-area").animate({scrollLeft: leftPos + 200}, 200);
                    for(var i=level+1;i<5;i++)
                    {
                        $(".level[number='"+i+"']  .subarea").fadeOut(200);
                            $(".level[number='"+level+"']  .optionl").removeAttr('selected');
                    }
                },200);
                
            });
                        
            <?PHP if(isset($_GET['inst_id'])): ?>
                $(".level[number='1'] .optionl[subarea='<?=$_GET['inst_id']?>']").click();
            <?PHP endif;?>
            <?PHP if(isset($_GET['curso_id'])): ?>
                setTimeout(function(){
                    $(".level[number='2'] .optionl[subarea='<?=$_GET['curso_id']?>']").click();
                },400);
            <?PHP endif;?>
            <?PHP if(isset($_GET['disc_id'])): ?>
                setTimeout(function(){
                    $(".level[number='3'] .optionl[subarea='<?=$_GET['disc_id']?>']").click();
                },800);
            <?PHP endif;?>
            
        </script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
