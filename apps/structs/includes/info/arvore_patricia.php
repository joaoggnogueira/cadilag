"A árvore Patricia (uma sílaba de "<b>P</b>ractical <b>A</b>lgorithm <b>T</b>o <b>R</b>etrieve <b>I</b>nformation <b>C</b>oded <b>I</b>n <b>A</b>lphanumeric") 
também conhecida como Árvore Radix, é uma uma árvore de busca para dicionário de palavras baseada na árvore Trie, porém em vez de
armazenar uma letra em cada nó, armazena-se a maior quantidade possível de letras juntas (chamadas de sílabas). Toda vez que é adicionada uma nova palavra
ocorre uma fragmentação de outras palavras já inseridas, reaproveitando os caracteres inicialmente similiares.
<br/>

<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação: Realizada por meio de registros (em C, struct)</b>
    <br/><br/>
    <b>Regras:</b> Cada nó aponta somente para o primeiro filho de uma lista de silabas, 
     e para os outros filhos do seu mesmo pai.
    <br/><br/>
    <b>Aplicação:</b> Dicionário de interpretadores, compiladores, geometria computacional, implementação de conjuntos, entre outros. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> O armazenamento não deve ser realizado em arquivo (problemas de fragmentação).
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b> Teoricamente, a árvore possui um número ilimitado de filhos, e em relação a Trie economiza memória.
        </li>
        <li>
            <b>Desvantagem:</b> Implementação mais complexa, causa fragmentação quando implementada em arquivo.
        </li>
    </ul>
</details>