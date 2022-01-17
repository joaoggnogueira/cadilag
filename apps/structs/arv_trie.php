<?php
    session_start();
    $idestrutura = 21;
    $nameestrutura = 'Árvore Trie';
    $name_struct = 'arvore_trie.php';
    $entradasProgramadasCompativeis = [22,21];
    include '../LoadVar.php';
?>
<html dir="ltr" lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
        <script src='./js/dicionario.js' type='text/javascript'></script>
        <link href="./css/trieStyle.css" rel="stylesheet"/>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li><p class="label mobile">Entrada: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input class="p_string" style="width:100px;text-transform: lowercase" name="info" id="valor"/></form></li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/arv_trie.js"></script>
    </body>
</html>
