<?php
    session_start();
    $nameestrutura = 'Fila Dinâmica com Prioridade<br/>(FIFO)';
    $idestrutura = 8;
    $name_struct = 'fila_prioridade.php';
    $entradasProgramadasCompativeis = [8];
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
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <a class="label mobile">INFO: </a>    
                        <input maxlength="5" class="p_number" name="info" id="valor"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <a class="label mobile">Prioridade: </a>
                        <input class="p_number" maxlength="4" pattern="^-?[0-9][0-9]*([.,][0-9]{1,4})?$" name="prioridade" id="prioridade"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="prioridade"></button></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/fila_priori.js"></script>
    </body>
</html>