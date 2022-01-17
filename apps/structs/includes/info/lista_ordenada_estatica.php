<i>"Os nós de uma lista ordenada estática podem ser distribuídos pelo vetor em 
qualquer ordem arbitrária. Cada nó carrega dentro de si mesmo 
a posição de seu sucessor até o último nó na lista, cujo campo 
prox contém -1, que é o ponteiro nulo"</i> <b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Feita por meio de um vetor unidimensional 
    que possui tamanho fixo, ou seja, possui um número máximo de elementos que podem
    ser armazenados.
    <br/><br/>
    <b>Regras:</b> Elemento sempre adicionado em ordem crescente (ou decrescente), e a remoção pode ser em uma posição arbitrária.
    <br/><br/>
    <b>Aplicação:</b> Utilizado como um conjunto de dados (List, Arraylist, Set ,...) em arquivo. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> Deve se conhecer o número máximo de valores a ser armazenado na lista e,
    geralmente a utilização requer iteração de todos os elementos em ordem crescente (ou decrescente) 
    pois ao utilizar a estrutura como base de dados é ineficiente.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Lista</b>
    <ul>
        <li>
            <b>Vantagem:</b> A busca por elemento é mais rápida pois não necessita percorrer 
            elementos com valores maiores (ou menores, dependendo se a lista estiver em ordem crescente, ou decrescente, 
            respectivamente) do que o valor pesquisado.
        </li>
        <li>
            <b>Desvantagem:</b> A inserção requer mais tempo e gasta mais memória armazenar ponteiros próximos e pode armazenar mais dados que o necessário.
        </li>
    </ul>
</details>
