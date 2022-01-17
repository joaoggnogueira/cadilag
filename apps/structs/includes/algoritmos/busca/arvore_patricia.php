<?PHP

code::init();

code::initFunction("Busca(No,INFO)","Se o valor está na Árvore");

code::l("compBusca,compBuscaNo : inteiro;","Declarando variáveis auxiliares");
code::l("compBusca := Comprimento(INFO);","Recuperando quantidade de letras da Palavra a ser encontrada");
code::l("compBuscaNo := Comprimento(No.Palavra);","Recuperando quantidade de letras da Sílaba do nó");
code::l();
code::l("Se compBusca < compBuscaNo então","Se a palavra pesquisada tiver tamanho menor que a sílaba do nó");
code::begin();
    code::l("Se INFO[0] > No.Palavra[0] então","Se o primeira letra da palavra pesquisada possuir um código maior que o código da sílaba do nó");
    code::begin();
        code::l("Se No.Direita != nulo então","Se possuir um nó a direita");
        code::begin();
            code::l("Retornar Busca(No.Direita,INFO);","Varredura continua para o nó a direita");
        code::end();
        code::l("Senão","Se não possuir um nó a direita");
        code::begin();
            code::l("Retornar Falso;","Varredura se encerra pois elemento não foi encontrado");
        code::end();
    code::end();
code::end();
code::l();
code::l("b : vetor de caracteres;","Declarando variável auxiliar para recuperar a parte da Palavra do mesmo tamanho da sílaba do nó");
code::l("b := SubPalavra(busca,0,compBuscaNo);","Recuperando a parte da Palavra do mesmo tamanho da sílaba do nó");
code::l();
code::l("Se b[0] > No.Palavra[0] então","Se o primeira letra da palavra pesquisada possuir um código maior que o código da sílaba do nó");
code::begin();
    code::l("Se No.Direita != nulo então","Se possuir um nó a direita");
    code::begin();
        code::l("Retornar Busca(No.Direita,busca);","Varredura continua par ao nó a direita");
    code::end();
    code::l("Senão","Senão possuir um nó a direita");
    code::begin();
        code::l("Retornar Falso;","Varredura se encerra pois o elemento não foi encontrado");
    code::end();
code::end();
code::l();
code::l("Se Igual(b,No.Palavra) então","Verifica se as palavras são iguais");
code::begin();
    code::l("Se compBusca == compBuscaNo então","Se ambas palavras possuem o mesmo tamanho");
    code::begin();
        code::l("Retornar No.PalavraFinal;","Retorna verdadeiro se a sílaba do nó for o final de uma palavra");
    code::end();
    code::l("Senão Se No.Abaixo != nulo então","Se possuir um nó a abaixo");
    code::begin();
        code::l("Retornar Busca(No.Abaixo,SubPalavra(INFO,compBuscaNo,compBusca));","Varredura continua para o nó abaixo com somente parte da palavra");
    code::end();
code::end();
code::l();
code::write("Retornar Falso;","Retorna falso pois a palavra não foi encontrada");

generateFunctions();

