<?php
    session_start();
    $idestrutura = 17;
    $nameestrutura = 'Árvore B';
    $name_struct = 'arvore_b.php';
    include '../LoadVar.php';
    $entradasProgramadasCompativeis = [1,2,3,4,5,7,9,10,11,13,14,15,16,17,20,18,19];
?>
<html lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
        <link href="./css/treeBStyle.css" rel="stylesheet"/>
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
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <div id="subtopbar">
            <ul>
                <li><p class="label">ORDEM: </p></li>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <select id="ordem">
                            <option selected value="3">3</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                            <option value="9">9</option>
                        </select>
                    </form>
                </li>
                <li><button class="pure-button pure-button-primary" id="newStruct">Criar</button></li>
            </ul>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/arv_bmodel.js"></script>
    </body>
</html>