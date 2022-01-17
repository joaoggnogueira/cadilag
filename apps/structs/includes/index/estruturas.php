<?php
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
if (isset($_GET['list']) && $_GET['list'] == "card"):
    ?>
    <div id="content" class="content-card">
        <div id="header">
            <a href="./index.php?list=tree"><button class="visualType" id="tree" title="Visualizar por Árvore"></button></a>
            <a href="./index.php?list=card"><button title="Visualizar por Card" class="visualType selected" id="card"></button></a>
            <input id="search" value="" placeholder="Pesquisar Estrutura"/>
        </div>
        <div id="card-main">
            <div id="card-content">
                <div id="card-list">
                    <div class="card-layout">
                        <div class="title">LISTA SEM ORDENAÇÃO</div>
                        <div class="card listnonordened-bg">
                            <ul>
                                <li><a href="./lista_desord_simples.php">SIMPES</a></li>
                                <li><a href="./lista_desord_dupla.php">DUPLA</a></li>
                                <li><a href="./lista_cruzada.php">CRUZADA</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="title">FILAS ESTÁTICAS</div>
                        <div class="card queuestatic-bg">
                            <ul>
                                <li><a href="./fila_estatica.php">SIMPLES</a></li>
                                <li><a href="./fila_estatica_circular.php">CIRCULAR</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="title">PILHAS ESTÁTICAS</div>
                        <div class="card stackstatic-bg">
                            <ul>
                                <li><a href="pilha_estatica.php">SIMPES</a></li>
                                <li><a href="pilha_multipla.php">MÚLTIPLA</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="title">LISTA COM ORDENAÇÃO</div>
                        <div class="card list-bg">
                            <ul>
                                <li><a href="./lista_ord_simples.php">SIMPES</a></li>
                                <li><a href="./lista_ord_dupla.php">DUPLA</a></li>
                                <li><a href="./lista_ord_estatica.php">ESTÁTICA</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">                    
                        <div class="title">FILAS DINÂMICAS</div>
                        <div class="card queue-bg">
                            <ul>
                                <li><a href="./fila_normal.php">NORMAL</a></li>
                                <li><a href="./fila_priori.php">COM PRIORIDADE</a></li>
                                <li><a href="./fila_circ.php">CIRCULAR</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="title">PILHAS DINÂMICAS</div>
                        <div class="card stack-bg">
                            <ul>
                                <li><a href="./pilha_normal.php">SIMPES</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout"> 
                        <div class="title">ÁRVORES NÃO BALANCEADAS</div>
                        <div class="card treeunbalanced-bg">
                            <ul>
                                <li><a href="./arv_binaria.php">BINÁRIA</a></li>
                                <li><a href="./arv_trie.php">TRIE</a></li>
                                <li><a href="./arv_patricia.php">PATRICIA</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout"> 
                        <div class="title">ÁRVORES BALANCEADA</div>
                        <div class="card treebalanced-bg">
                            <ul>
                                <li><a href="./arv_avl.php">AVL</a></li>
                                <li><a href="./arv_b.php">B</a></li>
                                <!--<li><a href="./arv_b_plus.php">B+</a></li>-->
                                <li><a href="./arv_rn.php">RUBRO-NEGRA</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="title">HASHING</div>
                        <div class="card hash-bg">
                            <ul>
                                <li><a href="./hash_colisao.php">SEM TRATAMENTO</a></li>
                                <li><a href="./hash_overflow.php">COM OVERFLOW</a></li>
                                <li><a href="./hash_sem_colisao.php">COM TRATAMENTO</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?PHP include './includes/ui/StructSelector.php'; ?>
    <script>
        addSearchInput("search", {addicionalContentToHide: ["#card-main"]});
        $(document).ready(function () {
            $("#").css("width", "calc(100% - 1180px)");
        });
    </script>
    <?PHP
else:
    ?>
    <div id="content" class="content-tree">
        <div id="header">
            <a href="./index.php?list=tree"><button title="Visualizar por Árvore" class="visualType selected" id="tree"></button></a>
            <a href="./index.php?list=card"><button title="Visualizar por Card" class="visualType" id="card"></button></a>
            <input id="search" value="" placeholder="Pesquisar Estrutura"/>
        </div>
    </div>
    <?PHP include './includes/ui/StructSelector.php'; ?>
    <script>
        $(".subsidebar").show();
        addSearchInput("search", {addicionalContentToHide: ["#card-content"]});
    </script>
<?PHP endif; ?>
<script>
    $("#logoSidebar").remove();
    $(".subsidebar > .title").remove();
    $("#searchestrutura").remove();
    $("#lastViews").attr("open", true);
    var obj = $("#lastViews");
    obj.remove();
    $("#history-tab").append(obj);
</script>