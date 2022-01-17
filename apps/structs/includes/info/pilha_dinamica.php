<i>"Uma pilha é um conjunto  ordenado de itens no qual novos itens  podem ser
inseridos e a partir do qual podem ser eliminados itens em uma extremidade
chamada topo da pilha"</i> <b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de uma lista encadeada de registros (em C, struct)
    <br/><br/>
    <b>Regras:</b> Primeiro a entrar é o último a sair, ou, First in, Last out (FILO).
    <br/><br/>
    <b>Aplicação:</b> Geralmente utilizada para substituir chamadas recursivas. 
    Por exemplo, em vez de uma função (ou método) realizar várias chamadas a si mesma (o que 
    poderia gastar muita memória para alocar toda a instância da chamada), 
    uma pilha poderia, dentro de uma laço iterativo que remove e adiciona novos elementos, 
    armazenar somente as variáveis necessárias de cada recursão (sendo representada por uma iteração).
    <br/><br/>
    <b>Requisitos para aplicação:</b> A aplicação não envolve recuperação de elementos diferentes 
    do último que foi inserido, e o número máximo de elementos que a pilha vai armazenar é desconhecido,
    caso contrário, utiliza-se pilha estática.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Pilha</b>
    <ul>
        <li>
            <b>Vantagem:</b> Armazena somente o número necessário de elementos.
        </li>
        <li>
            <b>Desvantagem:</b> Um pouco mais complexa de implementar que a estática.
        </li>
    </ul>
</details>