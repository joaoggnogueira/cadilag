<?PHP
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
?>
<div class="subsidebar" style="display: none">
    <a href="../../<?= ($acesso_livre?"acesso_livre.php":"profile.php") ?>" id="logoSidebar" title="Ir ao Menu Principal">
        <img src="../../images/cadilag.svg" height="75" alt="Logo"/>
    </a>
    <div class="title"><p>Estruturas</p></div>
    <input type="search" id="searchestrutura" name="busca"/>
    <div class="estruturas">
        <div class="container1">
            <div class="item" title="Mostrar Estruturas de Lista"><p>Listas</p></div>
            <div class="subitens">
                <div class="container2">
                    <div class="item-bg item-bg1">
                        <div class="item" title="Mostrar Estruturas de Lista sem ordenação"><p>Sem ordenação</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3 listnonordened-bg">
                                <a href="./lista_desord_simples.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Simples</p></div></div></a>
                                <!--<a href="./lista_desord_simples_1.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Simples alternativo</p></div></div></a>-->
                                <a href="./lista_desord_dupla.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Dupla</p></div></div></a>
                            </div>
                        </div>
                    </div>
                    <div class="item-bg item-bg1">
                        <div class="item" title="Mostrar Estruturas de Lista com ordenação"><p>Com ordenação</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3 list-bg">
                                <a href="./lista_ord_simples.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Simples</p></div></div></a>
                                <a href="./lista_ord_dupla.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Dupla</p></div></div></a>
                                <a href="./lista_ord_estatica.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Estática</p></div></div></a>
                            </div>
                        </div>
                    </div>
                    <a href="./lista_cruzada.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Cruzada</p></div></div></a>
                </div>
            </div>
            <div class="item" title="Mostrar Estruturas de Fila"><p>Filas</p></div>
            <div class="subitens">
                <div class="container2">
                    <div class="item-bg item-bg1">
                        <div class="item" title="Mostrar Estruturas de Fila Estáticas"><p>Estáticas</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3 queuestatic-bg">
                                <a href="./fila_estatica.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Simples</p></div></div></a>
                                <a href="./fila_estatica_circular.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Circular</p></div></div></a>
                            </div>
                        </div>
                    </div>
                    <div class="item-bg item-bg2">
                        <div class="item"><p>Dinâmicas</p></div>
                    </div>
                    <div class="subitens" title="Mostrar Estruturas de Fila Dinâmica">
                        <div class="container3 queue-bg">
                            <a href="./fila_normal.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Normal</p></div></div></a>
                            <a href="./fila_priori.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Com Prioridade</p></div></div></a>
                            <a href="./fila_circ.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Circular</p></div></div></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item" title="Mostrar Estruturas em Pilha"><p>Pilhas</p></div>
            <div class="subitens">
                <div class="container2">
                    <div class="item-bg item-bg1">
                        <div class="item" title="Mostrar Estruturas de Pilha Estática"><p>Estáticas</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3">
                                <a href="./pilha_estatica.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Simples</p></div></div></a>
                                <a href="./pilha_multipla.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Múltipla</p></div></div></a>
                            </div>
                        </div>
                    </div>
                    <div class="item-bg item-bg2">
                        <div class="item" title="Mostrar Estruturas de Pilha Dinâmica"><p>Dinâmicas</p></div>
                    </div>
                    <div class="subitens">
                        <div class="container3">
                            <a href="./pilha_normal.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Simples</p></div></div></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item"  title="Mostrar Estruturas de Hashing"><p>Hashing</p></div>
            <div class="subitens">
                <div class="container2">
                    <div class="item-bg item-bg1">
                        <div class="item"  title="Mostrar Estruturas de Hashing sem Tratamento"><p>Sem Tratamento</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3">
                                <a href="./hash_colisao.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Simples</p></div></div></a>
                            </div>
                        </div>
                    </div>
                    <div class="item-bg item-bg2">
                        <div class="item" title="Mostrar Estruturas de Hashing com Tratamento"><p>Com Tratamento</p></div>
                    </div>
                    <div class="subitens">
                        <div class="container3">
                            <a href="./hash_sem_colisao.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Listas Encadeadas</p></div></div></a>
                            <a href="./hash_overflow.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Área de Overflow</p></div></div></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item" title="Mostrar Estruturas de Árvore"><p>Árvores</p></div>
            <div class="subitens">
                <div class="container2">
                    <div class="item-bg item-bg1">
                        <div class="item"  title="Mostrar Estruturas de Árvore Balanceada"><p>Balanceadas</p></div>
                    </div>
                    <div class="item-bg item-bg3">
                        <div class="subitens">
                            <div class="container3">
                                <a href="./arv_avl.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>AVL</p></div></div></a>
                                <a href="./arv_rn.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Rubro-Negra</p></div></div></a>
                                <a href="./arv_b.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>B</p></div></div></a>
                                <!--<a href="./arv_b_plus.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>B+</p></div></div></a>-->
                            </div>
                        </div>
                    </div>
                    <div class="item-bg item-bg2">
                        <div class="item" title="Mostrar Estruturas de Árvore não Balanceada"><p>Não Balanceadas</p></div>
                    </div>
                    <div class="subitens">
                        <div class="container3">
                            <a href="./arv_binaria.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Binária</p></div></div></a>
                            <a href="./arv_trie.php"><div class="item-bg item-bg1"><div class="item itemfinal"><p>Trie</p></div></div></a>
                            <a href="./arv_patricia.php"><div class="item-bg item-bg2"><div class="item itemfinal"><p>Patricia</p></div></div></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <details id="lastViews">
            <summary title="Mostrar últimas estruturas visualizadas">Histórico</summary>
            <ul>
            </ul>
        </details>
    </div>
    <div class="selectestrutura" style="display:none;">
        <div class="optionestrutura" id="0" title="Lista Ordenada Simples" tags="ordenada,simples,dinamica">
            <a href="./lista_ord_simples.php">
                <p>Lista Ordenada Simples</p>
                <div class="subtag" id="subtag0"></div>
            </a>
        </div>
        <div class="optionestrutura" id="1" title="Lista Ordenada Estática" tags="ordenada,simples,estatica">
            <a href="./lista_ord_estatica.php">
                <p>Lista Ordenada Estática</p>
                <div class="subtag" id="subtag1"></div>
            </a>
        </div>
        <div class="optionestrutura" id="2" title="Lista Ordenada Dupla" tags="ordenada,dupla,dinamica">
            <a href="./lista_ord_dupla.php">
                <p>Lista Ordenada Dupla</p>
                <div class="subtag" id="subtag2"></div>
            </a>
        </div>
        <div class="optionestrutura" id="3" title="Lista Sem Ordenação Simples" tags="sem,desordenada,simples,dinamica">
            <a href="./lista_desord_simples.php">
                <p>Lista Sem Ordenação Simples</p>
                <div class="subtag" id="subtag3"></div>
            </a>
        </div>
        <!--        <div class="optionestrutura" id="3b" title="Lista S.O. Simples Altertiva" tags="sem,desordenada,simples,dinamica">
                    <a href="./lista_desord_simples_1.php">
                        <p>Lista S.O. Simples Altertiva</p>
                        <div class="subtag"></div>
                    </a>
                </div>-->
        <div class="optionestrutura" id="4" title="Lista Sem Ordeneção Dupla" tags="dinamica,desordenada">
            <a href="./lista_desord_dupla.php">
                <p>Lista Sem Ordeneção Dupla</p>
                <div class="subtag" id="subtag4"></div>
            </a>
        </div>
        <div class="optionestrutura" id="5" title="Lista Cruzada" tags="matriz,esparsa,dinamica,desordenada">
            <a href="./lista_cruzada.php">
                <p>Lista Cruzada</p>
                <div class="subtag" id="subtag5"></div>
            </a>
        </div>
        <div class="optionestrutura" id="6"  title="Fila Estática" tags="simples,semprioridade,fifo,first-in,first-out,estática">
            <a href="./fila_estatica.php">
                <p>Fila Estática</p>
                <div class="subtag" id="subtag6"></div>
            </a>
        </div>
        <div class="optionestrutura" id="23"  title="Fila Estática Circular" tags="simples,semprioridade,fifo,first-in,first-out,circular,estática">
            <a href="./fila_estatica_circular.php">
                <p>Fila Estática Circular</p>
                <div class="subtag" id="subtag23"></div>
            </a>
        </div>
        <div class="optionestrutura" id="7" title="Fila com Prioridade" tags="dinamica,simples,ordenada,fifo,first-in,first-out">
            <a href="./fila_priori.php">
                <p>Fila com Prioridade</p>
                <div class="subtag" id="subtag7"></div>
            </a>
        </div>
        <div class="optionestrutura" id="8" title="Fila Dinâmica" tags="simples,fifo,first-in,first-out">
            <a href="./fila_normal.php">
                <p>Fila Dinâmica</p>
                <div class="subtag" id="subtag8"></div>
            </a>
        </div>
        <div class="optionestrutura" id="9" title="Fila Circular" tags="dinamica,simples,fifo,first-in,first-out">
            <a href="./fila_circ.php">
                <p>Fila Circular</p>
                <div class="subtag" id="subtag9"></div>
            </a>
        </div>
        <div class="optionestrutura" id="10" title="Pilha Estática" tags="estatica,simples,lifo,last-in,first-out">
            <a href="./pilha_estatica.php">
                <p>Pilha Estática</p>
                <div class="subtag" id="subtag10"></div>
            </a>
        </div>
        <div class="optionestrutura" id="11" title="Pilha Múltipla" tags="estatica,simples,lifo,last-in,first-out">
            <a href="./pilha_multipla.php">
                <p>Pilha Múltipla</p>
                <div class="subtag" id="subtag11"></div>
            </a>
        </div>
        <div class="optionestrutura" id="12" title="Pilha Dinâmica" tags="simples,lif,last-in,first-outo">
            <a href="./pilha_normal.php">
                <p>Pilha Dinâmica</p>
                <div class="subtag" id="subtag12"></div>
            </a>
        </div>
        <div class="optionestrutura" id="13" title="Hash sem Tratamento" tags="estatica,simples,colisao">
            <a href="./hash_colisao.php">
                <p>Hash sem Tratamento</p>
                <div class="subtag" id="subtag13"></div>
            </a>
        </div>
        <div class="optionestrutura" id="14"  title="Hash com Tratamento" tags="estatica,simples,colisao,lista">
            <a href="./hash_sem_colisao.php">
                <p>Hash com Tratamento</p>
                <div class="subtag" id="subtag14"></div>
            </a>
        </div>
        <div class="optionestrutura" id="24"  title="Hash com Overflow" tags="estatica,simples,overflow,colisao,lista">
            <a href="./hash_overflow.php">
                <p>Hash com Overflow</p>
                <div class="subtag" id="subtag14"></div>
            </a>
        </div>
        <div class="optionestrutura" id="15" title="Árvore AVL" tags="balanceada,dinamica,simples">
            <a href="./arv_avl.php">
                <p>Árvore AVL</p>
                <div class="subtag" id="subtag15"></div>
            </a>
        </div>
        <div class="optionestrutura" id="16" title="Árvore B" tags="balanceada,simples,dinamica">
            <a href="./arv_b.php">
                <p>Árvore B</p>
                <div class="subtag" id="subtag16"></div>
            </a>
        </div>
<!--        <div class="optionestrutura" id="17" title="Árvore B+" tags="balanceada,simples,dinamica">
            <a href="./arv_b_plus.php">
                <p>Árvore B+</p>
                <div class="subtag" id="subtag17"></div>
            </a>
        </div>-->
        <div class="optionestrutura" id="18" title="Árvore RubroNegra" tags="balanceada,simples,cores,dinamica,rn">
            <a  href="./arv_rn.php">
                <p>Árvore RubroNegra</p>
                <div class="subtag" id="subtag18"></div>
            </a>
        </div>
        <div class="optionestrutura" id="19" title="Árvore Binária" tags="desbalanceada,simples,dinamica,busca">
            <a href="./arv_binaria.php">
                <p>Árvore Binária</p>
                <div class="subtag" id="subtag19"></div>
            </a>
        </div>
        <div class="optionestrutura" id="20" title="Árvore Trie" tags="desbalanceada,simples,dicionario,palavra">
            <a href="./arv_trie.php">
                <p>Árvore Trie</p>
                <div class="subtag" id="subtag20"></div>
            </a>
        </div>
        <div class="optionestrutura" id="21" title="Árvore Patricia" tags="desbalanceada,simples,dicionario,palavra,silaba,dinamica,radix">
            <a href="./arv_patricia.php">
                <p>Árvore Patricia</p>
                <div class="subtag" id="subtag21"></div>
            </a>
        </div>
        <p id="emptyestrutura" style="display:none;">Estrutura não encontrada</p>
    </div>
</div>
<script src="./js/writeEstruturaSelector.js"></script>
