<i>"A árvore AVL, também conhecida como árvore binária balanceada, é uma árvore 
    na qual as alturas das duas subárvores, de qualquer nó, nunca diferem 
    em mais de 1. O <b>balanceamento</b>, ou fator balanceamento, de um nó numa 
    árvore binária é definido como a altura de sua subárvore direita menos a 
    altura de sua subárvore esquerda (ou vice-versa). A <b>altura</b> de uma árvore binária é o 
    nível máximo de suas folhas (ocasionalmente conhecida como profundidade da árvore).
"</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Elemento com valor maior ao do nó, é adicionado a subárvore da direita,
    caso o valor seja menor é adicionado a subárvore da esquerda. Quando o valor absoluto do fator de balanceamento
    for maior que 1, deve se realizar as devidas rotações.
    <br/><br/>
    <b>Aplicação:</b> Dicionário de interpretadores, compiladores, geometria computacional, implementação de conjuntos, entre outros. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> O armazenamento não deve ser realizado em arquivo (problemas de fragmentação).
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b> A árvore trata balanceamento, logo realizara a busca no menor tempo possível.
        </li>
        <li>
            <b>Desvantagem:</b> Implementação mais complexa, e causa fragmentação quando implementado em arquivo.
        </li>
    </ul>
</details>