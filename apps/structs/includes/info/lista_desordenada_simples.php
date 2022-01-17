<i>"Um item é acessado numa lista ligada, percorrendo-se a lista a partir do início (...)
    E necessário atravessar cada um dos primeiros n - 1 elementos antes de alcançar o enésimo 
    elemento porque não existe relação entre a posição de memória ocupada por um elemento de uma 
    lista e sua posição dentro dessa lista."</i> 
<b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> 
    Realizada por meio de uma lista encadeada de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Elemento sempre adicionado no inicio, e a remoção pode ser em uma posição arbitrária.
    <br/><br/>
    <b>Aplicação:</b> Utilizado como um conjunto de dados (List, Arraylist, Set ,...). 
    <br/><br/>
    <b>Requisitos para aplicação:</b> Geralmente a utilização
    requer iteração de todos os elementos ao mesmo tempo pois a busca de dados é ineficiente.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Lista</b>
    <ul>
        <li>
            <b>Vantagem:</b> Rápida implementação, pode se armazenar em qualquer ordem, 
            armazena somente o número necessário de elementos, e é possível remover um 
            elemento intermediário sem causar gasto de memória.
        </li>
        <li>
            <b>Desvantagem:</b> Os valores não são ordenados, portanto, a busca de um elemento 
            é linear.
        </li>
    </ul>
    <br/>
    <b>Obs:</b> É possível que a inserção possa ser também no fim da lista.
</details>