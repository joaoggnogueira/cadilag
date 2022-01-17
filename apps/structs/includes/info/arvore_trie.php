<i>"A árvore Trie (uma sílaba da palavra "re<u>trie</u>val" [recuperação em inglês]) 
    é uma uma árvore de busca, onde cada nó na árvore poderá conter n ponteiros, 
    correspondendo aos n possíveis símbolos em cada posição da chave. Conseqüentemente, se as chaves
    fossem numéricas, existiriam 10 ponteiros num nó e, se fossem estritamente alfabéticas, existiriam 26.
"</i> 
<br/>
<b>(Tenenbaum)</b>
<br/>
<br/>

<i>
    Porém este tipo de implementação com array de n ponteiros pode ocupar muita memória,
    armazenando vários ponteiros que apontam para nulo. Outra forma de implementação é que cada
    nó aponta para primeiro filho de uma lista encadeada simples ordenada (pelo código ASCII) dos filhos.
</i>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Cada nó aponta somente para o primeiro filho, 
     e para os outros filhos do seu mesmo pai, além disso, cada nó só armazena um caractere.
    <br/><br/>
    <b>Aplicação:</b> Dicionário de interpretadores, compiladores, geometria computacional, implementação de conjuntos, entre outros. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> O armazenamento não deve ser realizado em arquivo (problemas de fragmentação).
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b>Teoricamente, a árvore possui um número ilimitado de filhos.
        </li>
        <li>
            <b>Desvantagem:</b> Implementação mais complexa, causa fragmentação quando implementada em arquivo
            , além de fragmentar um dado em muitas partes.
        </li>
    </ul>
</details>