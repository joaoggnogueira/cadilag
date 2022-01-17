<i>"Uma pilha é um conjunto  ordenado de itens no qual novos itens  podem ser
inseridos e a partir do qual podem ser eliminados itens em uma extremidade
chamada topo da pilha"</i> <b>(Tenenbaum)</b>
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Feita por meio de um vetor unidimensional 
    que possui tamanho fixo para todas as pilhas, ou seja, possui 
    um número máximo de elementos que podem ser armazenados. 
    A divisão das pilhas é feita definindo anteriormente o 
    índice de início de todas as pilhas dentro do vetor. 
    Cada pilha não precisa ser do mesmo tamanho.
    <br/><br/>
    <b>Regras:</b> Primeiro a entrar é o último a sair, ou, First in, Last out (FILO).
    <br/><br/>
    <b>Aplicação:</b> Utilizada para substituir a implementação de várias pilhas por meio de 
    diferentes vetores unidimensionais. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> A aplicação não envolve recuperação de elementos diferentes 
    do último que foi inserido, e o número máximo de elementos que a pilha poderá armazenar é conhecido,
    caso contrário, utiliza-se pilha múltipla dinâmica.
    <br/><br/>
    <b>Em relação a outras formas de implementação de Pilha</b>
    <ul>
        <li>
            <b>Vantagem:</b> Número de pilhas pode ser definido na execução, pilhas podem possuir tamanhos 
            diferentes, e pode ser utilizada por múltiplas threads (processos).
        </li>
        <li>
            <b>Desvantagem:</b> Implementação mais demorada, baixa legibilidade 
            e dependendo do tamanho do vetor, caso for muito grande, pode ser que não seja 
            possível alocar tanta memória contiguá
        </li>
    </ul>
</details>