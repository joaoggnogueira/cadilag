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
    <b>Regras:</b> Elemento sempre adicionado em ordem crescente (ou decrescente), e a remoção pode ser em uma posição arbitrária.
    <br/><br/>
    <b>Aplicação:</b> Utilizado como um conjunto de dados (List, Arraylist, Set ,...). 
    <br/><br/>
    <b>Requisitos para aplicação:</b> Geralmente a utilização
    requer iteração de todos os elementos em ordem crescente (ou decrescente). 
    Utilizar a estrutura como base de dados é ineficiente.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Lista</b>
    <ul>
        <li>
            <b>Vantagem:</b> A busca por elemento é mais rápida pois não necessita percorrer 
            elementos com valores maiores (ou menores, dependendo se a lista estiver em ordem crescente, ou decrescente, 
            respectivamente) do que o valor pesquisado. Armazena somente o número necessário de elementos.
        </li>
        <li>
            <b>Desvantagem:</b> A inserção requer mais tempo
        </li>
    </ul>
</details>