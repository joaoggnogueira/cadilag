<i>"Uma fila é um conjunto ordenado de itens a partir do qual podem-se 
    eliminar itens numa extremidade (chamada início da fila) e no qual 
    podem-se inserir itens na outra extremidade (chamada fim da fila)."</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b>  Feita por meio de um vetor unidimensional 
    que possui tamanho fixo, ou seja, possui um número máximo de elementos que podem
    ser armazenados.
    <br/><br/>
    <b>Regras:</b> Primeiro a entrar é o primeiro a sair, ou, First in, First out (FIFO).
    <br/><br/>
    <b>Aplicação:</b> Utilizado em algoritmos de busca em Grafos, sistemas distribuídos, operações internas de sistemas operacionais, algoritmos de política de cache, entre outros.
    <br/><br/>
    <b>Requisitos para aplicação:</b>  A aplicação não envolve recuperação de elementos diferentes 
    do primeiro que foi inserido, e o número máximo de elementos que a pilha vai armazenar é conhecido,
    caso contrário, utiliza-se fila dinâmica.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Fila</b>
    <ul>
        <li>
            <b>Vantagem:</b>  Rápida implementação, e ordem de complexidade baixa.
        </li>
        <li>
            <b>Desvantagem:</b> Pode alocar muito mais memória do que o necessário,
            e dependendo do tamanho do vetor, caso for muito grande, pode ser que não seja 
            possível alocar tanta memória contiguá. Além disso, não reaproveita o espaços
            removidos, até que a fila seja totalmente removida, e os contadores reiniciados.
        </li>
    </ul>
</details>