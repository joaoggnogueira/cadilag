"A árvore B, possui uma técnica de inserção em árvores de busca multidirecionais mais
complexa. Entretanto, para compensar essa complexidade, a técnica apresenta um benefício, 
de reduzir a fragmentação interna durante a implementação em arquivo"
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de registros (em C, struct) e arrays estáticos de chaves e nó-filhos
    <br/><br/>
    <b>Regras:</b> Na ordem N, cada nó deve possuir:
    <ul>
        <li>&#10004; N chaves</li>
        <li>&#10004; N+1 nó-filhos</li>
        <li>&#10004; no mínimo N/2 chaves não nulas</li>
    </ul>
    <br/><br/>
    <b>Aplicação:</b> Banco de dados, armazenamento em arquivo. 
    <br/><br/>
    <b>Requisitos para aplicação:</b>
    Cada dado deve possuir uma chave relacional.
    Para definir a ordem, deve se conhecer o tamanho do bloco de memória no disco para evitar fragmentação de disco.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Árvore</b>
    <ul>
        <li>
            <b>Vantagem:</b> Reutiliza um mesmo bloco de memória no disco rígido para n chaves e é auto-balanceável, aprimorando a busca.
        </li>
        <li>
            <b>Desvantagem:</b> Possui operações muito complexas de serem implementadas em arquivo.
        </li>
    </ul>
</details>