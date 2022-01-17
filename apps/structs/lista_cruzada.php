<!doctype html>
<?php
    session_start();
    $idestrutura = 6;
    $nameestrutura = 'Listas Cruzadas';
    $name_struct = 'lista_cruzada.php';
    $entradasProgramadasCompativeis = [6];
    include '../LoadVar.php';
?>
<html dir="ltr" lang="pt-BR">
    <head>
        <?PHP include './includes/ui/head.php'; ?>
        <script src='./js/ControladoraCanvas.js' type='text/javascript'></script>
        <link href="./css/CruzadaStyle.css" rel="stylesheet"/>
    </head>
    <body id="bd">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/ui/navbar.php';?>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <a class="label mobile">INFO:</a>
                        <input maxlength="4" class="p_number" name="info" id="valor"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="valor"></button></li>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <a class="label mobile" style="top: 5px; position: relative;">Linha : </a>
                        <input type="number" value="0" min="0" max="9" class="p_integer p_interval" name="linha" id="linha"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="linha"></button></li>
                <li>
                    <form onsubmit="event.preventDefault()" class="pure-form">
                        <a class="label mobile" style="top: 5px; position: relative;">Coluna : </a>
                        <input type="number" value="0" min="0" max="9" class="p_integer p_interval" name="coluna" id="coluna"/>
                    </form>
                </li>
                <li><button title="Gerar entrada aleatória" type="button" class="random-btn" itemscope itemref="coluna"></button></li>

                <?PHP include './includes/ui/FunctionsButtons.php';?>
            </ul>
            <?PHP include './includes/ui/UserMenu.php';?>
        </div>
        <div id="subtopbar">
            <ul>
                <li><p class="label">Linhas: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="8" type="number" min="2" max="99" id="sizeVer"/></form></li>
                <li><p class="label">Colunas: </p></li>
                <li><form onsubmit="event.preventDefault()" class="pure-form"><input value="10" type="number" min="2" max="99" id="sizeHor"/></form></li>
                <li><button class="pure-button pure-button-primary" id="newStruct">Criar</button></li>
            </ul>
        </div>
        <?PHP include './includes/ui/CadilagApps.php';?>
        <script src="./js/Estruturas/lista_cruzada.js"></script>
    </body>
</html>