<i>"Uma pilha é um conjunto  ordenado de itens no qual novos itens  podem ser
inseridos e a partir do qual podem ser eliminados itens em uma extremidade
chamada topo da pilha"</i> <b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Feita por meio de um vetor unidimensional 
    que possui tamanho fixo, ou seja, possui um número máximo de elementos que podem
    ser armazenados.
    <br/><br/>
    <b>Regras:</b> Primeiro a entrar é o último a sair, ou, First in, Last out (FILO).
    <br/><br/>
    <b>Aplicação:</b> Geralmente utilizada para substituir a utilização de chamadas recursivas. 
    Por exemplo, em vez de uma função (ou método) realizar várias chamadas a si mesma (o que 
    poderia gastar muita memória para alocar toda a instância da chamada), 
    uma pilha poderia, dentro de uma laço iterativo que remove e adiciona novos elementos, 
    armazenar somente as variáveis necessárias de cada recursão (sendo representada por uma iteração).
    <br/><br/>
    <b>Requisitos para aplicação:</b> Deve se conhecer o número máximo de valores a ser armazenado na pilha e,
    geralmente a utilização requer iteração de todos os elementos em ordem crescente (ou decrescente) 
    pois ao utilizar a estrutura como base de dados é ineficiente.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Pilha</b>
    <ul>
        <li>
            <b>Vantagem:</b> Rápida implementação, e ordem de complexidade baixa.
        </li>
        <li>
            <b>Desvantagem:</b> Pode alocar muito mais memória do que o necessário, 
            e dependendo do tamanho do vetor, caso for muito grande, pode ser que não seja 
            possível alocar tanta memória contiguá
        </li>
    </ul>
</details>