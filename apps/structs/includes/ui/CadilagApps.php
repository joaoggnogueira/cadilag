<?PHP
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}

$includepath = './includes/';
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
        case "editcode":
            if (isset($_GET['idCode'])) {
                ?>
                <script>
                    (function () {
                        document.addEventListener("DOMContentLoaded", function (event) {
                            getDetailsCode(<?= $_GET['idCode'] ?>, function (title, language, idestrutura) {
                                if (idestrutura == <?= $idestrutura ?>) {
                                    getCode(<?= $_GET['idCode'] ?>, language, title,<?= $controlador->getUserId() ?>);
                                    $('#sourcecode-btn').click();
                                    setTimeout(function () {
                                        openEditLineAlgoritmo($(".algoritmo#insercao #l0"));
                                    }, 1000);
                                }
                            });
                        });
                    }());
                </script>
                <?PHP
            }
            break;
        case "openep":
            if (isset($_GET['idEp'])) {
                ?>
                <script>
                    (function () {
                        document.addEventListener("DOMContentLoaded", function (event) {
                            setTimeout(function () {
                                $('#eprogramada-btn').click();
                                post('./ajax/getEp.php', function (data) {
                                    if (data.idEstrutura == <?= $idestrutura ?>) {
                                        clearAllEp();
                                        writeEps(data);
                                    }
                                }, {idEp: <?= $_GET['idEp'] ?>});
                            }, 400);
                        });
                    }());
                </script>
                <?PHP
            }
            break;
    }
}
?>
<div id="main" class="main">
    <div id="title">
        <p id="subtitle"></p>
    </div>
</div>
<div id="StructDiv" style="display:none">
    <div class="title">Informa????es da Estrutura</div>
    <div class="info-head-line">Estrutura de Dados<br></div>
    <div class="code info-div">
        <?PHP include $includepath . 'estruturas/' . $name_struct; ?>
    </div>
    <?PHP
    $file = $includepath . 'constantes/' . $name_struct;
    if (file_exists($file) && is_readable($file)):
        ?>
        <div class="info-head-line">Constantes<br></div>
        <div class="code info-div">
            <?PHP include $file; ?> 
            <div id="parameters">
            </div>
        </div>
    <?PHP endif; ?>
    <?PHP
    $file = $includepath . 'info/' . $name_struct;
    if (file_exists($file) && is_readable($file)):
        ?>
        <div class="info-head-line">Descri????o<br></div>
        <div class="info-desc info-div">
            <?PHP include $includepath . 'info/' . $name_struct; ?>
        </div>
    <?PHP endif; ?>
</div>
<div id="AlgoritmoDiv" style="display:none">
    <div class="appbuttons" id="pseudocodigo-appbutons">
        <button title="Mostrar PseudoC??digo da Inser????o" class="selected" id="showinsercao">Inser????o</button>
        <button title="Mostrar PseudoC??digo da Remo????o" id="showremocao">Remo????o</button>
        <button title="Mostrar PseudoC??digo da Busca"  id="showbusca">Busca</button>
    </div>
    <?PHP if(!$acesso_livre): ?>
        <div class="appoptions" id="pseudocodigoedit-appbutons">
            <div class="label">C??digo</div>
            <select id="codeSelect" onchange="changeCodeSelector(this)">
                <optgroup id="onprotectedcodegp" label="Protegidos">
                    <option value="0">Padr??o (Pseudo-C??digo)</option>
                </optgroup>
            </select>
            <button id="newCode" title="Novo C??digo a partir do atual"></button>
            <button id="loadCode" title="Carregar c??digo salvo"></button>
            <button id="saveCode" disabled title="Salvar C??digo"></button>
        </div>
    <button id="toggleOptions">=</button>
    <?PHP endif; ?>
    <div class="algoritmo" id="insercao">
        <?php include $includepath . 'algoritmos/add/' . $name_struct; ?>
    </div> 
    <div class="algoritmo" id="remocao">
        <?php include $includepath . 'algoritmos/rem/' . $name_struct; ?>
    </div>
    <div class="algoritmo" id="busca">
        <?php include $includepath . 'algoritmos/busca/' . $name_struct; ?>
    </div>
</div>
<div id="RevisaoDiv" style="display: none">
    <div class="title">??ltima anima????o</div>
    <div class="content" id="empty-revisao-content">
        <p class="status"><span class="fa fa-info-circle"></span> Nenhuma anima????o dispon??vel para revisar!</p>   
    </div>
    <div class="content" id="onrun-revisao-content" style="display: none">
        <p class="status"><span class="fa fa-lock"></span> Executando anima????o ...</p>   
        <p class="status"> Aguarde encerrar ! </p>   
    </div>
    <div class="content" id="revisao-content" style="display: none">
        <p class="status">??ltima anima????o que foi executada: </p>
        <p class="status" id="lastsubtitle"></p>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descri????o</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>
<div id="EntradaProgramadaDiv" style="display:none">
    <div class="title">Entradas Programadas</div>
    <div class="appbuttons">
        <button id="eprun" title="Executar entradas"></button>
        <?PHP if(!$acesso_livre): ?>
        <button id="epsave" title="Salvar entradas"></button>
        <button id="epload" title="Carregar entradas" ></button>
        <?PHP endif; ?>
        <button id="epclear" title="Apagar entradas atuais"></button>
    </div>
    <p id="openedEpTitle"></p>
    <div class="Separator"></div>
    <table id="TableEp"></table>
    <ul id="EntradaProgramadaUl">
    </ul>
    <div class="appbuttons">
        <button id="ephistory" title="Puxar Hist??rico">Copiar entrada do Hist??rico</button>
    </div>
</div>
<div id="ConfigDiv" style="display:none">
    <div class="title">Configura????es</div>
    <div class="content">
        <p></p>
        <div class="subtitle">Entradas</div>
        <p></p>
        <span data-image="../../images/.png" class="cool-checkbox" id="clear-inputs"><span class="checkspan"></span></span>  
        <div class="label"><p>Limpar entrada ao final da anima????o</p></div>
        <p></p>
        <div><p>Chance de gerar n??mero negativo na entrada aleat??ria:</p></div>
        <b> <span id="chanceNegativeLabel">50%</span></b><input type="range" min="0" max="100" value="50" id="chanceNegativeInput"/>
        <p></p>
        <p></p>
        <div class="subtitle">Estrutura</div>
        <p></p>
        <span data-image="../../images/.png" class="cool-checkbox" id="hideNullPointer"><span class="checkspan"></span></span>  
        <div class="label"><p>Ocultar Ponteiros Nulos</p></div>
        <p></p>
        <span data-image="../../images/example-config6.png" class="cool-checkbox" id="repetirEntrada"><span class="checkspan"></span></span>  
        <div class="label"><p>Impedir inser????o de valores repetidos</p></div>
        <p></p>
        <span data-image="../../images/example-config2.png" class="cool-checkbox" id="enableDescritor"><span class="checkspan"></span></span>  
        <div class="label"><p>Mostrar Descritores</p></div>
        <div id="primaryColor" style="display: none">
            <p>
            <div class="label2">Cor do componente prim??rio</div>
            <div class="colorInput">
                <input title="Clique para editar cor do componente prim??rio" id="colorChooserAlt" class="jscolor {onFineChange:'window.UI.changeColorComponentPrimary(this.valueElement)'}" onchange="window.UI.updateColorPrimary(this.valueElement)" original-value="333333">
                <button title="Clique para resetar a cor do componente prim??rio" class="resetColor" for="colorChooserAlt"></button>
            </div>
        </div>
        <div id="secondaryColor" style="display: none">
            <p>
            <div class="label2">Cor do componente secund??rio</div>
            <div class="colorInput">
                <input title="Clique para editar cor do componente secund??rio" id="colorChooserAlt1" class="jscolor {onFineChange:'window.UI.changeColorComponentSecondary(this.valueElement)'}" onchange="window.UI.updateColorSecondary(this.valueElement)" original-value="FF532D">
                <button title="Clique para resetar a cor do componente secund??rio" class="resetColor" for="colorChooserAlt1"></button>
            </div>
        </div>
        <p></p>
        <p></p>
        <div class="subtitle">C??digo</div>
        <p></p>
        <span data-image="../../images/example-config3.png" class="cool-checkbox" id="delimiter"><span class="checkspan"></span></span>  
        <div class="label"><p>Usar delimitador em chaves</p></div>
        <p></p>
        <span data-image="../../images/example-config5.png" class="cool-checkbox" id="counterBlank"><span class="checkspan"></span></span>  
        <div class="label"><p>Contar linhas brancas</p></div>
        <p></p>
        <small>Configura????es ser??o salvas para este navegador</small>
    </div>
    <div class="arrowtip"></div>
</div>
<div id="HistoryDiv" style="display:none">
    <div class="title">Hist??rico</div>
    <form class="pure-form">
        <label for="historyorder">Ordenar por: </label>
        <select id="historyorder" onchange="History.invertHistory()">
            <option value="last" selected>Mais recente</option>
            <option value="first">Mais antigos</option>
        </select>
    </form>
    <ul id="history-head">
        <li>
            <ul id="title-history" style="float: right;">
                <li style="width: 91px; left: 0px;position: absolute; ">#</li>
                <li style="width: 250px;; position: absolute; border-left: 1px solid white;left:82px;">INFO</li>
            </ul>
        </li>
        <li>
            <div id="title-history-funtion"></div>
        </li>
    </ul>
    <ul id="history">
        <li>
            <ul class="item-list-history">
                <li style="width: 100%">Vazio</li>
            </ul>
            <span class="item-history-function"></span>
        </li>
    </ul>
</div>
<div id="huboptions" style="display:none;">
    <?PHP if(!$acesso_livre): ?>
        <a href="../../profile.php" class="option" title="Ir ao Menu Principal"><div class="option">Principal</div></a>
        <a href="../../editprofile.php" class="option" title="Editar o Perfil"><div class="option">Editar Perfil</div></a>
        <a href="../../arquivos.php" class="option" title="Ver Arquivos Salvos"><div class="option">Arquivos</div></a>
        <a href="../../class.php" class="option" title="Ir a turma"><div class="option">Turma</div></a>
        <details class="huboptions-container" open="">
            <summary class="huboptions-container-title">Estruturas</summary>
            <a href="#" class="option" onclick="toggleSidebar()" title="Mostrar Estruturas de Dados"><div class="option">Listar</div></a>
            <a href="./index.php" class="option" title="Menu"><div class="option">Ir para o Menu</div></a>
            <a href="./entradaProgramadas.php" class="option" title="Visualizar Entradas Programadas Salvas"><div class="option">Entradas Programadas</div></a>
            <a href="./codigos.php" class="option" title="Visualizar C??digos Salvos"><div class="option">C??digos</div></a>
        </details>
        <a href="#" onclick="quit();"  class="option" id="sair" title="Encerrar Sess??o"><div class="option">Log Off</div></a>
    <?PHP else: ?>
        <a href="../../acesso_livre.php" class="option" title="Ir ao Menu Principal"><div class="option">Principal</div></a>
        <a href="./index.php" class="option" title="Menu das Estruturas"><div class="option">Menu das Estruturas</div></a>
    <?PHP endif; ?>
</div>
<script>
    function quit() {
        swal({
            title: "Continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Encerrar Sess??o",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        },
                function () {
                    localStorage.setItem('emailCadilag', null);
                    localStorage.setItem('senhaCadilag', null);
                    window.location = '../../closesession.php';
                });

    }
</script>
<div id="sidebar">
    <button id="hidesidebar">Ocultar</button>
    <button id="navsidebar" title="Mais Detalhes">Aplicativos</button>
    <ul>
        <li id="sourcecode-btn" title="Pseudoc??digo"><p>Pseudo-c??digo</p></li>
        <li id="structview-btn" title="Informa????es da Estrutura"><p>Informa????es da Estrutura</p></li>
        <li id="eprogramada-btn" title="Entradas programadas"><p>Entradas Programadas</p></li>
        <li id="revisao-btn" title="Rever ??ltima anima????o"><p>Rever Passos</p></li>
        <li id="history-btn" title="Hist??rico" ><p>Hist??rico</p></li>
    </ul>
</div>
<label id="ClockAreaLabel">Velocidade da Anima????o</label>
<div id="ClockArea">
    <input type="range" id="time" min="0.25" max="10" value="1" step="0.05"/>
    <input id="timelabel" type="text" value="1x"/>
</div>
<div id="dialogOpenCode" style="display:none;">
    <div id="selectorCode">
        <p class="title"><?= strip_tags($nameestrutura) ?></p>
        <ul class="content">
            <li class="empty">Vazio</li>
        </ul>
        <div class="sidecontent">
            <button name="onlyUserCode" class="selected">Seus C??digos</button>
            <button name="anotherUsersCode">Outros C??digos</button>
        </div>
        <div class="buttons">
            <button id="cancel" class="pure-button">Voltar</button>
        </div>
    </div>
</div>
<button id="help" onclick="initIntro();">
    <span class="fa fa-question-circle"></span>
</button>
<button id="feedback" onclick="report();">
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path>
    </svg>
</button>
<button id="config" onclick="config();">
    <span class="fa fa-gear"></span>
</button>
<?PHP include $includepath . 'ui/StructSelector.php'; ?>
<script>
    var eProgramadasCompativeis = <?= json_encode($entradasProgramadasCompativeis)?>;
    var idestrutura = '<?= $idestrutura; ?>';
    var iduser = <?= $controlador->getUserId() ?>;
    var prefix_system = "../../";
</script>