<div id="projetohud" class="sidebarhud" style="display: none">
    <div class="title">
        Projeto
    </div>
    <form onsubmit="event.preventDefault()" class="pure-form">
        <ul>
            <li>
                <label>Nome</label>
                <input id="nameofproject" type="text" value="Sem Título"/>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="new">Novo Projeto</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="save">Salvar</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="saveas">Salvar como ...</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="load">Carregar</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="clearall">Limpar Tudo</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="clearconnections">Remover todas conexões</button>
            </li>
            <li>
                <button class="pure-button pure-button-primary" id="clearlabels">Remover todos rótulos</button>
            </li>
            <li>
                <div id="counterestados" class="counter">0</div>
                <div class="title">Estados</div>
            </li>
            <li>
                <div id="countertransicoes" class="counter">0</div>
                <div class="title">Transições</div>
            </li>
        </ul>
    </form>
</div>

<div id="operacoeshud" class="sidebarhud" style="display: none">
    <div class="title">
        Algoritmos
    </div>
    <form onsubmit="event.preventDefault()" class="pure-form">
        <select id="selectalgoritmo">
            <option value="busca_profundidade">Busca por Profundidade</option>
            <option value="busca_largura">Busca por Largura</option>
            <option>Árvore Geradora Mínima de Kruskal</option>
            <option>Árvore Geradora Mínima de Prim</option>
            <option>Caminho Mínimo de Bellman-Ford</option>
            <option>Caminho Mínimo de Dijkstra</option>
            <option>Verificação de Ciclo</option>
            <option>Verificação de Conectividade</option>
            <option>Grupos Fortemente Conexos</option>
            <option>Completar</option>
            <option>Complementar</option>
            <option>Transposição</option>
            <option>Coloração</option>
            <option>Ordenação Topológica</option>
            <option>Particionamento com Caminho Mínimo</option>
        </select>
        <?PHP include './includes/algoritmos/busca_profundidade.php'; ?>
        <?PHP include './includes/algoritmos/busca_largura.php'; ?>
        <button class="pure-button pure-button-primary">Executar</button>
    </form>
</div>
<div id="structhud" class="sidebarhud" style="display: none">
    <div class="title">
        Estruturas
    </div>
    <form onsubmit="event.preventDefault()" class="pure-form">
        <select id="selectorstruct">
            <option value="matrix-graph-wrapper">Matriz de Adjacências</option>
            <option value="list-graph-wrapper">Lista de Adjacências</option>
        </select>
        <div class="wrapperstruct" id="matrix-graph-wrapper">
            <table id="matrix-graph">

            </table>
        </div>
        <div class="wrapperstruct" id="list-graph-wrapper" style="display: none">
            <ul id="list-graph">

            </ul>
        </div>
    </form>
</div>

<div id="sidebarselect">
    <button id="hidesidebar">Ocultar</button>
    <button id="navsidebar" title="Mais Detalhes">Aplicativos</button>
    <ul>
        <li id="projeto-btn" title="Opções do Projeto"><p>Projeto</p></li>
        <li id="algoritmo-btn" title="Algoritmos e Operaçoes"><p>Algoritmos</p></li>
        <li id="estruturas-btn" title="Informações da Estrutura"><p>Estrutura</p></li>
    </ul>
</div>