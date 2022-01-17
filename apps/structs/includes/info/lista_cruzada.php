<i>
    Matrizes Esparsas possuem uma grande quantidade elementos nulos ou repetidos, nos quais ocupam
    quantidade desnecessária de memória. A estrutura em lista cruzada é uma das soluções para este
    problema. A Matriz é representada por várias listas que se entrelaçam, onde cada elemento na estrutura
    é um elemento não-nulo que está ligado com o próximo elemento na coluna, ou na linha, também não-nulo.
    A informação dentro do nó não afeta o fluxo de execução do algoritmo, apenas a posição da linha e da coluna.
</i> 
<br/><br/>
<details>
<summary>Mais informações</summary>
    <br/>
    <b>Implementação:</b> 
    Realizada por meio de dois vetores de tamanho fixo onde cada uma possui listas encadeadas que se entrelaçam.
    <br/><br/>
    <b>Regras:</b> Cada elemento na estrutura é um elemento não-nulo que está ligado com o próximo elemento na 
    coluna, ou na linha, também não-nulo.
    <br/><br/>
    <b>Aplicação:</b> Armazenamento, Grafos, entre outros. 
    <br/><br/>
    <b>Requisitos para aplicação:</b> Geralmente a aplicação requer que os dados permaneçam intactos, 
    caso contrário, utiliza-se compreensão de dados.
    <br/><br/>
        <b>Vantagem:</b> Armazena somente o número necessário de elementos.
        <br/><br/>
        <b>Desvantagem:</b> Maior complexidade no algoritmo e custo pode aumentar devido aos ponteiros não utilizados.
    <br/>
</details>