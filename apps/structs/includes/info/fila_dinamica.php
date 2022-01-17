<i>"Uma fila é um conjunto ordenado de itens a partir do qual podem-se 
    eliminar itens numa extremidade (chamada início da fila) e no qual 
    podem-se inserir itens na outra extremidade (chamada fim da fila)."</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b>  Realizada por meio de uma lista encadeada de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Primeiro a entrar é o primeiro a sair, ou, First in, First out (FIFO).
    <br/><br/>
    <b>Aplicação:</b> Utilizado em algoritmos de busca em Grafos, sistemas distribuídos, operações internas de sistemas operacionais, algoritmos de política de cache, entre outros.
    <br/><br/>
    <b>Requisitos para aplicação:</b>  A aplicação não envolve recuperação de elementos diferentes 
    do primeiro que foi inserido, e o número máximo de elementos que a pilha vai armazenar é desconhecido,
    caso contrário, utiliza-se fila estática.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Fila</b>
    <ul>
        <li>
            <b>Vantagem:</b>  Armazena somente o número necessário de elementos.
        </li>
        <li>
            <b>Desvantagem:</b> Um pouco mais complexa de ser implementada.
        </li>
    </ul>
</details>