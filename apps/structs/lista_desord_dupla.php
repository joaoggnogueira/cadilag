<?php
    session_start();
    $idestrutura = 5;
    $nameestrutura = 'Lista Duplamente Encadeada - Sem Ordenação';
    $name_struct = "lista_desordenada_dupla.php";
    $entradasProgramadasCompativeis = [1,2,3,4,5,7,9,10,11,13,14,15,16,17,20,18,19];
    include '../LoadVar.php';
?>
<html dir="ltr" lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
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
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/lista_desord_dupla.js"></script>
    </body>
</html>