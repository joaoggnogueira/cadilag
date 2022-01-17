<?php
    session_start();
    $idestrutura = 7;
    $nameestrutura = 'Fila Estática Simples<br/>(FIFO)';
    $name_struct = 'fila_estatica.php';
    $entradasProgramadasCompativeis = [1,2,3,4,5,7,9,10,11,13,14,15,16,17,20,18,19];
    include '../LoadVar.php';
?>
<html dir="ltr" lang="pt-BR">
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
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <div id="subtopbar">
            <ul>
                <li><p class="label">Tamanho do Vetor: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="10" type="number" min="2" max="99" id="sizeArray"/></form></li>
                <li><button class="pure-button pure-button-primary" id="newStruct">Criar</button></li>
            </ul>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/fila_estatica.js"></script>

    </body>
</html>