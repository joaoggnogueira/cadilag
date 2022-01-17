<?php
    session_start();
    $idestrutura = 22;
    $nameestrutura = 'Árvore Patrícia';
    $name_struct = 'arvore_patricia.php';
    $entradasProgramadasCompativeis = [22,21];
    include '../LoadVar.php';
?>
<html lang="pt-BR">
    <head>
        <meta name="description" content='A árvore Patricia (uma sílaba de "Practical Algorithm To Retrieve Information Coded In Alphanumeric") também conhecida como Árvore Radix, é uma uma árvore de busca para dicionário de palavras baseada na árvore Trie'>
        <?PHP include './includes/ui/head.php'; ?>
        <script src='./js/dicionario.js' type='text/javascript'></script>
        <link href="./css/patriciaStyle.css" rel='stylesheet'/>
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
        <script src="./js/Estruturas/arv_patricia.js"></script>
    </body>
</html>