<?PHP

function generateFunctions(){

    code::initFunction("SubPalavra(Palavra,inicio,fim)","Parte de uma Palavra");

    code::l("saida : String tamanho fim - inicio;","Declarando variável para retornar a subpalavra");
    code::l("j : inteiro;","Declarando variável auxiliar para percorrer a Palavra");
    code::l("j := inicio;","Inicializando varredura no início da Subpalavra");
    code::l("Para i:inteiro de inicio até fim passo 1 faça","Enquanto a varredura não terminar");
    code::begin();
        code::l("saida[j-inicio] := Palavra[i];","Copiando letra para a variável de saída");
        code::l("j := j + 1;","Incrementando contador");
    code::end();
    code::l("Retornar saida;","retornando a subpalavra");

    code::write();

    code::initFunction("Comprimento(Palavra)","Total de letras possui a Palavra");

    code::l("i : inteiro;","Declarando contador");
    code::l("i := 0;","Inicializando contador");
    code::l("Enquanto Palavra[i] == nulo ou Palavra[i]=='\0' faça","Enquanto a varredura não percorrer todas as letras da Palavra");
    code::begin();
        code::l("i := i + 1;","Incrementando contador");
    code::end();
    code::l("Retornar i;","Retornando o total de letras contadas");

    code::write();
}

code::init();
code::initFunction("Insere(No,Palavra)");

code::l("i,compPalavra,compPalavraNo : inteiro;","Declarando variáveis auxiliares");
code::l("i := 0;","Inicializando contador");
code::l("compPalavra := Comprimento(Palavra);","Recuperando quantidade de letras da Palavra a ser inserida");
code::l("compPalavraNo := Comprimento(No.Palavra);","Recuperando quantidade de letras da Sílaba do nó");
code::l();
code::l("Enquanto i < compPalavraNo e i < compPalavra e No.Palavra[i] == Palavra[i] faça","Percorrendo a silaba da Palavra do nó enquanto for igual a palavra a ser inserida ");
code::begin();
    code::l("i := i + 1;","Incrementando contador");
code::end();
code::l();
code::l("Se i < compPalavraNo e i < compPalavra então","Se a silaba do nó não é completamente compatível com a palavra");
code::begin();
    code::l("Se i == 0 então","Se o primeira letra for diferente a pesquisada");
    code::begin();
        code::l("Se Palavra[0] > No.Palavra[0] então","Se o código da primeira letra da Palavra for maior que o código da silaba do nó");
        code::begin();
            code::l("Se No.Direita != nulo então","Se possuir um nó a direita");
            code::begin();
                code::l("Insere(No.Direita,Palavra);","Varredura continua para o nó a direita");
            code::end();
            code::l("Senão","Se não possuir um elemento a direita");
            code::begin();
                code::l("No.Direita := alocar();","Alocando novo nó a direita");
                code::l("No.Direita.PalavraFinal := Verdadeiro;","Novo nó recebe a flag indicando ser a silaba final de uma palavra");
                code::l("No.Direita.Palavra := Palavra;","Definindo a sílaba do novo nó");
                code::l("No.Direita.Direita := nulo;","Inicializando ponteiro nulo");
                code::l("No.Direita.Abaixo := nulo;","Inicializando ponteiro nulo");
                //falta códigoa aqui
            code::end();
        code::end();
        code::l("Senão","Se o código da primeira letra da Palavra for menor que o código da silaba do nó");
        code::begin();
            code::l("novo : EstruturaPatricia;","Declarando novo nó");
            code::l("novo := alocar();","Alocando o novo nó");
            code::l("novo.Direita := No;","Novo nó aponta para o nó atual da varredura");
            code::l("novo.Abaixo := nulo;","Inicializando ponteiro nulo");
            code::l("novo.Palavra := Palavra;","Definindo a sílaba do novo nó");
            code::l("novo.PalavraFinal := Verdadeiro;","Novo nó recebe a flag indicando ser a silaba final de uma palavra");
            code::l("No := novo;","Novo nó se torna o início da lista");
        code::end();
    code::end();
    code::l("Senão","Se parte da sílaba já foi inserida, ocorre a quebra dela");
    code::begin();
        code::l("primeira_parte : String;","Declarando String para a primeira parte da quebra da palavra");
        code::l("segunda_parte : String;","Declarando String para a segunda parte da quebra da palavra");
        code::l("primeira_parte := SubPalavra(No.Palavra,0,i);","Recuperando a parte inicial da palavra");
        code::l("segunda_parte := SubPalavra(No.Palavra,i,compPalavraNo);","Recuperando o resto da palavra");
        code::l();
        code::l("novo: EstruturaPatricia;","Declarando o novo nó");
        code::l("novo := alocar();","Alocando o novo nó");
        code::l("novo.Palavra := segunda_parte;","Definindo a sílaba do novo nó");
        code::l("novo.Abaixo := No.Abaixo;","Novo nó aponta para o nó abaixo do nó atual da varredura");
        code::l("novo.Direita := nulo","Inicializando ponteiro nulo");
        code::l();
        code::l("No.Abaixo := novo;","Nó atual da varredura aponta para o novo nó");
        code::l("No.Palavra := primeira_parte;","Altera a sílaba armazenada no nó atual");
        code::l();
        code::l("Se No.PalavraFinal == Verdadeiro então","Se a sílaba do nó atual da varredura for o final de uma palavra");
        code::begin();
            code::l("No.PalavraFinal := Falso;","No atual deixa de ser uma sílaba de final de palavra");
            code::l("novo.PalavraFinal := Verdadeiro;","Novo nó tornasse uma sílaba de final de palavra");
        code::end();
        code::l();
        code::l("Insere(novo,SubPalavra(Palavra,i,compPalavra));","Varredura continua para o novo nó");
    code::end();
    code::l("Retonar;","Inserção já foi realizado em alguma das funções anteriores, logo não necessita de mais tratamentos");
code::end();
code::l();
code::l("Se compPalavra == compPalavraNo então","Se o comprimento da Palavra e da sílaba forem iguais");
code::begin();
    code::l("No.PalavraFinal := Verdadeiro;","Palavra já está adicionada, basta alterar a flag");
code::end();
code::l("Senão","Se o comprimento da Palavra e da sílaba não forem iguais");
code::begin();
    code::l("Se i == compPalavraNo então","Se todo o nó já foi percorrido");
    code::begin();
        code::l("Se No.Abaixo != nulo então","Se possuir um nó abaixo");
        code::begin();
            code::l("Insere(No.Abaixo,SubPalavra(Palavra,i,compPalavra));","Varredura continua para o nó abaixo");
        code::end();
        code::l("Senão","Se não possuir um nó abaixo");
        code::begin();
            code::l("No.Abaixo := alocar();","Alocando novo nó");
            code::l("No.Abaixo.PalavraFinal := Verdadeiro;","Novo nó recebe a flag indicando ser a silaba final de uma palavra");
            code::l("No.Abaixo.Palavra := SubPalavra(Palavra,i,compPalavra);","Novo nó recebe a parte que ainda não está na Árvore");
            code::l("No.Abaixo.Direita := nulo;","Inicializando ponteiro nulo");
            code::l("No.Abaixo.Abaixo := nulo;","Inicializando ponteiro nulo");
        code::end();
    code::end();
    code::l("Senão","Se todo a Palavra já foi percorrida, ocorre quebra");
    code::begin();
        code::l("novo : EstruturaPatricia;","Declarando novo nó");
        code::l("novo := alocar();","Alocando o novo nó");
        code::l("novo.Abaixo := No.Abaixo;","Novo nó aponta para nó abaixo do nó atual");
        code::l("No.Abaixo := novo;","Nó atual aponta para o novo");
        code::l("No.Direita := nulo;","Inicializando ponteiro nulo");
        code::l("novo.Palavra := SubPalavra(No.Palavra,i,compPalavraNo);","Recuperando a primeira parte da quebra da sílaba");
        code::l("No.Palavra := SubPalavra(No.Palavra,0,i);","Recuperando a segunda parte da quebra da sílaba");
        code::l("No.PalavraFinal := Verdadeiro;","Nó atual tornasse uma sílaba de final de palavra");
        code::l("novo.PalavraFinal := Verdadeiro;","Novo nó tornasse uma sílaba de final de palavra");
    code::end();
code::end();

code::write();

generateFunctions();