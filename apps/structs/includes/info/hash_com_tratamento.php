<i>A função HASH, ou função de espalhamento, mapeia um conjunto de chaves em uma 
    tabela de tamanho fixo de acordo com um conjunto de valores. Ou seja, dado um 
    valor existe uma chave respectiva e de modo unidirecional.</i> 
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> Realizada por meio de um vetor de tamanho fixo e listas encadeadas.
    <br/><br/>
    <b>Regras:</b> Cada valor possui uma chave respectiva obtida por uma função.
    <br/><br/>
    <b>Aplicação:</b> Utilizada na otimização de algoritmos e armazenamento de dados. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> <i>Nenhum</i> .
    <br/><br/>
        <b>Vantagem:</b> Pode se armazenar em qualquer ordem, dados não são perdidos ou sobrescrevidos e é de fácil implementação.
        <br/>
        <b>Desvantagem:</b> A tabela não pode ser muito grande, pois terá grande gasto de memória. A função Hash tem que
        possuir um perfeito nível de espalhamento para evitar colisões, caso contrário, o tempo de busca será maior.
    <br/>
    <b>Obs:</b> É possível que a inserção possa ser também no fim da lista.
</details>