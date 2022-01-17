<?php
    session_start();
    $idestrutura = 12;
    $nameestrutura = 'Pilha Múltipla <br/>(LIFO)';
    $name_struct = 'pilha_multipla.php';
    $entradasProgramadasCompativeis = [12];
    include '../LoadVar.php';
?>
<html lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
        <script src='./js/ControladoraCanvas.js' type='text/javascript'></script>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li><p class="label mobile">INFO: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form">
                    <input maxlength="5" class="p_number" name="info" id="valor"/>
                </form></li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <li><p class="label mobile">Pilha:</p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="0" type="number" min="0" max="1" name="insere_pilha" id="pilha"/></form></li>		    	
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <div id="subtopbar">
            <ul>
                <li><p class="label">Tamanho do Vetor: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="10" type="number" min="2" max="99" id="sizeArray"/></form></li>
                <li><p class="label">Numero de Pilhas: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="2" type="number" min="2" max="99" id="totalStacks"/></form></li>
                <li><button class="pure-button pure-button-primary" id="newStruct">Criar</button></li>
            </ul>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/pilha_multipla.js"></script>
    </body>
</html>