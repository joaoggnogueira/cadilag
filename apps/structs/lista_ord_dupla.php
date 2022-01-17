<?php
    session_start();
    $idestrutura = 3;
    $nameestrutura = 'Lista Duplamente Encadeada - Ordenada';
    $name_struct = "lista_ordenada_dupla.php";
    $entradasProgramadasCompativeis = [1,2,3,4,5,7,9,10,11,13,14,15,16,17,20,18,19];
    include '../LoadVar.php';
?>
<html dir="ltr" lang="pt-BR">
    <head>
        <meta name="description" content='A Lista Duplamente Encadeada Ordenada, ou somente Lista Ordenada Dupla, é uma lista onde cada nó possui 2 ponteiros para o nó próximo e o nó anterior.'>
        <?PHP include './includes/ui/head.php'; ?>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li><p class="label mobile">INFO: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form">
                        <input maxlength="5" class="p_number" pattern="^-?[0-9][0-9]*([.,][0-9]{1,4})?$" name="info" id="valor"/>
                    </form></li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/lista_ord_dupla.js"></script>
    </body>
</html>