<?php
    session_start();
    $idestrutura = 16;
    $nameestrutura = 'Árvore AVL';
    $name_struct = 'arvore_avl.php';
    $entradasProgramadasCompativeis = [1,2,3,4,5,7,9,10,11,13,14,15,16,17,20,18,19];
    include '../LoadVar.php';
?>
<html lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
        <link href='./css/helperOthers.css' rel='stylesheet'/>
        <link href="./css/avlStyle.css" rel="stylesheet"/>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li><p class="label mobile">Entrada: </p></li>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <input maxlength="4" class="p_integer" pattern="-?\d*" name="info" id="valor"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" class="random-btn" type="button" itemscope itemref="valor"></button></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
                <li id="others-li"><button title="Outros algoritmos" class="lockable mobile" id="others"></button></li>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <div id="subtopbar" class="subtopbar-others">
            <ul>
                <li><button id="pre-ordem" class="pure-button pure-button-more">Varredura Pré-ordem</button></li>
                <li><button id="pos-ordem" class="pure-button pure-button-more">Varredura Pós-ordem</button></li>
                <li><button id="em-ordem" class="pure-button pure-button-more">Varredura em ordem</button></li>
                <li><button id="altura" class="pure-button pure-button-more">Varredura em nível</button></li>
                <li><div class="button-hide"><i class="fa fa-chevron-up"></i></div></li>
            </ul>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/arv_avl.js"></script>
    </body>
</html>