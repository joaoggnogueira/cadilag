<i>A função HASH, ou função de espalhamento, mapeia um conjunto de chaves em uma 
    tabela de tamanho fixo de acordo com um conjunto de valores. Ou seja, dado um 
    valor existe uma chave respectiva e de modo unidirecional.</i> 
A Área de Overflow é uma forma de tratamento de colisão onde se utiliza uma lista estática
para armazenar as colisões. Esta lista pode ser tanto com com ordenação quanto sem ordenação.
Caso a Área de Overflow estiver cheia, realiza a substituição do valor na Tabela.
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> 
    Realizada por meio de um vetor de tamanho fixo para armazenar a Tabela Hash e outro vetor de tamanho fixo
    para a Área de Overflow.
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
        possuir um perfeito nível de espalhamento para não ocorrer muitas colisões, caso contrário, muitos dados serão
        perdidos quando a área de overflow ficar cheia.
    <br/>
</details>