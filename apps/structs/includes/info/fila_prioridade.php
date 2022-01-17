<i>"Uma fila é um conjunto ordenado de itens a partir do qual podem-se 
    eliminar itens numa extremidade (chamada início da fila) e no qual 
    podem-se inserir itens na outra extremidade (chamada fim da fila)."<br/>
    "A fila de prioridade é uma estrutura de dados na qual a classificação 
    intrínseca dos elementos determina os resultados de suas operações básicas."</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> 
    Realizada por meio de uma lista encadeada de registros (em C, struct), onde cada elemento é inserido ordenadamente
    por meio do campo que classifica sua prioridade.
    <br/><br/>
    <b>Regras:</b> Dependendo da aplicação o elemento com maior prioridade deve sair primeiro, e quando dois elementos 
    possui a mesma prioridade, respeita-se a regra da fila (FIFO), o primeiro a entrar é o primeiro a sair.
    <br/><br/>
    <b>Aplicação:</b> Utilizado em algoritmos de busca em Grafos, sistemas distribuídos, operações internas de sistemas operacionais, algoritmos de política de cache, entre outros.
    <br/><br/>
    <b>Requisitos para aplicação:</b>  A aplicação não envolve recuperação de elementos diferentes 
    do primeiro que foi inserido, e deve existir uma relação entre cada valor que o campo de 
    prioridade do elemento pode representar, ou seja, deve ser possível determinar se um elemento possui maior 
    ou menor (ou igual) que outro elemento.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Fila</b>
    <ul>
        <li>
            <b>Vantagem:</b>  Armazena somente o número necessário de elementos.
        </li>
        <li>
            <b>Desvantagem:</b> Mais complexa de ser implementada.
        </li>
    </ul>
</details>