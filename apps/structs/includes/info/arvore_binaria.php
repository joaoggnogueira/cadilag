<i>"Uma árvore binária é um conjunto finito de elementos que está vazio 
    ou é particionado em três subconjuntos disjuntos. O primeiro subconjunto 
    contém um único elemento, chamado raiz da árvore. Os outros dois subconjuntos 
    são em si mesmos árvores binárias, chamadas subárvores esquerda e direita da 
    árvore original. Uma subárvore esquerda ou direita pode estar vazia. 
    Cada elemento de uma árvore binária é chamado nó da árvore.
"</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Elemento com valor maior ao do nó, é adicionado a subárvore da direita, caso o valor seja menor é adicionado a subárvore da esquerda.
    <br/><br/>
    <b>Aplicação:</b> Ilustração de problemas em estruturas implementadas em árvore, do algoritmo de busca binária e recursividade. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> A inserção não pode ser em ordem crescente, ou decrescente,
    pois a árvore ficará desbalanceada rapidamente e se tornará uma lista encadeada, e o armazenamento não deve
    ser realizado em arquivo (problemas de fragmentação).
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b> A implementação é a mais simples.
        </li>
        <li>
            <b>Desvantagem:</b> A árvore não trata desbalanceamento, o que pode, 
            no pior caso, se transformar em uma lista encadeada, onde a busca ocorre em ordem linear.
            Além disso, quando é implementado em arquivo pode resultar em fragmentação.
        </li>
    </ul>
</details>