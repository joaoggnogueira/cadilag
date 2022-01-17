<?php
    session_start();
    $idestrutura = 18;
    $nameestrutura = 'Árvore B+';
    $name_struct = 'arvore_bplus.php';
    include '../LoadVar.php';
?>
<html lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li><p class='workingimg' style="line-height: 40px;margin: 0px;">Estrutura não implementada</p></li>
                <li><p class="label mobile" style="display: none">Entrada: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input name="info" id="valor" style="display:none;"/></form></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/arv_b_plus.js"></script>
    </body>
</html>