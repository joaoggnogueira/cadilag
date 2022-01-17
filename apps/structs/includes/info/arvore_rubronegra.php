A Árvore Rubronegra [RN] (ou Preto-Vermelha [PV], Red-Black [RB]) é uma Árvore Binária de Busca Auto-Balanceável.
A estrutura possui uma flag que registra a cor do nó, que é utilizada para realizar verificações de balaceamento 
mais rápidas que a Árvore AVL. Todo nó começa vermelho e depois da inserção muda de cor ou realiza-se rotações 
necessárias para respeitar as seguintes regras:
<ul>
    <li><i class="fa fa-check"></i> O nó raiz da árvore deve ser sempre preta;</li>
    <li><i class="fa fa-check"></i> Um nó-pai vermelho não pode possuir um nó-filho vermelho;</li>
    <li><i class="fa fa-check"></i> Ao percorrer cada ramificação, existe a mesma quantidade de nós pretos (Black-Height);</li>
    <li><i class="fa fa-check"></i> Todos nós nulos devem ser pretos;</li>
</ul>    
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b>Elemento com valor maior ao do nó, é adicionado a subárvore da direita, caso o valor seja menor é adicionado a subárvore da esquerda.
    <br/><br/>
    <b>Aplicação:</b> Utilizado como um conjunto de dados (Map, TreeSet ,...), Sistemas de busca. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> O armazenamento não deve ser realizado em arquivo (problemas de fragmentação).
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b> A árvore RN possui um balanceamento mais rápido que a árvore AVL.
        </li>
        <li>
            <b>Desvantagem:</b> Mais complexo de ser implementado e o baleaceamento 
            não é tão completo que a árvore AVL.
        </li>
    </ul>
</details>