<i>A função HASH, ou função de espalhamento, mapeia um conjunto de chaves em uma 
    tabela de tamanho fixo de acordo com um conjunto de valores. Ou seja, dado um 
    valor existe uma chave respectiva e de modo unidirecional.</i> 
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> 
    Realizada por meio de um vetor de tamanho fixo.
    <br/><br/>
    <b>Regras:</b> Cada valor possui uma chave respectiva obtida por uma função.
    <br/><br/>
    <b>Aplicação:</b> Utilizada na otimização de algoritmos e armazenamento temporário de dados. 
    <br/><br/>
    <b>Requisitos para aplicação: </b> Dados podem ser sobrescrevidos.
    <br/><br/>
        <b>Vantagem:</b> Pode se armazenar em qualquer ordem e é de fácil implementação.
        <br/>
        <b>Desvantagem:</b> A tabela não pode ser muito grande, pois terá grande gasto de memória. A função Hash tem que
        possuir um perfeito nível de espalhamento para não ocorrer colisão, caso contrário, muitos dados serão perdidos.
    <br/>
</details>