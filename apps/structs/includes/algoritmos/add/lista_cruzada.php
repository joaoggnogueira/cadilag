<?PHP
code::init();
code::initFunction("Insere(INFO,Linha,Coluna)");


code::l("leitorColuna,leitorLinha : NoLista;","Declarando variáveis para leitura");
code::l("anteriorColuna,anteriorLinha : NoLista;","Declarando variáveis para leitura");
code::l("i,j : inteiro;","Declarando variáveis para leitura");
code::l();
code::l("novo : NoLista;","Declarando o novo elemento");
code::l("novo := alocar();","Alocando novo elemento");
code::l("novo.linha := Linha;","Definindo linha do novo elemento");
code::l("novo.coluna := Coluna;","Definindo coluna do novo elemento");
code::l("novo.info := INFO;","Definindo o valor do novo elemento");
code::l();
code::l("leitorColuna := Colunas[Coluna];","Posicionando leitor no inicio da Coluna de inserção");
code::l("leitorLinha := Linhas[Linha];","Posicionando leitor no inicio da Linha de inserção");
code::l();
//Inserção na Coluna
code::l("Se leitorColuna != nulo então", "Se a Coluna não estiver vazia");
code::begin();
    code::l("i := Colunas[Coluna].linha;","Variável de leitura recebe primeira linha que cruza com a coluna de inserção");
    code::l();
    code::l("Enquanto leitorColuna.abaixo != nulo e i < Linha faça","Percorrendo linhas que cruzam com a coluna até a linha de inserção");
    code::begin();
        code::l("anteriorColuna := leitorColuna;","Armazenando elemento atual");
        code::l("leitorColuna := leitorColuna.abaixo;","Leitor avança para o elemento abaixo na coluna");
        code::l("i := leitorColuna.linha;","Variável de leitura recebe a linha atual que cruza com a coluna");
    code::end();
    code::l();
    code::l("Se i == Linha então","Caso o elementa já esteja inserido");
    code::begin();
        code::l("leitorColuna.info := INFO;", "Valor do elemento é atualizado");
        code::l("Retornar;", "Termina a inserção");
    code::end();
    code::l();
    code::l("Se leitorColuna.abaixo != nulo então", "Se não for o último elemento da coluna");
    code::begin();
        code::l("Se anteriorColuna == nulo então", "Se for antes do primeiro elemento da coluna");
        code::begin();
            code::l("novo.abaixo := leitorColuna;", "Novo elemento aponta para o primeiro elemento da coluna");
            code::l("Colunas[Coluna] := novo;","Primeiro elemento da coluna passa a ser o novo elemento");
        code::end();
        code::l("Senão", "Se for depois do primeiro elemento da coluna");
        code::begin();
            code::l("novo.abaixo := leitorColuna;", "Novo elemento aponta para a leitor");
            code::l("anteriorColuna.abaixo := novo;","Elemento anterior aponta para o novo elemento");
        code::end();
    code::end();
    code::l("Senão", "Se for o último elemento da coluna");
    code::begin();
        code::l("novo.abaixo := nulo;", "Novo elemento aponta para nulo");
        code::l("anteriorColuna.abaixo := novo;","Elemento anterior aponta para o novo");
    code::end();
code::end();
code::l("Senão", "Caso a coluna estiver vázia");
code::begin();
    code::l("Colunas[Coluna] := novo;","Novo elemento tornasse o primeiro elemento da coluna");
    code::l("novo.abaixo := nulo;", "Novo elemento aponta para nulo");
code::end();
code::l();
//Inserção na Linha
code::l("Se leitorLinha != nulo então", "Se a linha não estiver vazia");
code::begin();
    code::l("j := Linhas[Linha].coluna;","Variável de leitura aponta para o primeira coluna que cruza com a linha de inserção");
    code::l();
    code::l("Enquanto leitorLinha.direita != nulo e j < Coluna faça", "Percorrendo colunas que cruzam com a linha até a coluna de inserção");
    code::begin();
        code::l("anteriorLinha := leitorLinha;","Armazenando elemento atual");
        code::l("leitorLinha := leitorLinha.direita;","Leitor avança para o elemento abaixo na linha");
        code::l("j := leitorLinha.coluna;","Variável de leitura recebe a coluna atual que cruza com a linha");
    code::end();
    code::l();
    code::l("Se leitorLinha.direita != nulo então", "Se não for o último elemento da linha");
    code::begin();
        code::l("Se anteriorLinha == nulo então", "Se for antes do primeiro elemento da linha");
        code::begin();
            code::l("novo.direita := leitorLinha;","Novo elemento aponta para o primeiro elemento da linha");
            code::l("Linhas[Linha] := novo;","Primeiro elemento da coluna passa a ser o novo elemento");
        code::end();
        code::l("Senão", "Se for depois do primeiro elemento da colun");
        code::begin();
            code::l("novo.direita := leitorLinha;","Novo elemento aponta para a leitor");
            code::l("anteriorLinha.direita := novo;","Elemento anterior aponta para o novo elemento");
        code::end();  
    code::end();  
    code::l("Senão", "Se for o último elemento da linha");
    code::begin();
        code::l("novo.direita := nulo;","Novo elemento aponta para nulo");
        code::l("anteriorLinha.direita := novo;","Elemento anterior aponta para o novo");
    code::end();
code::end();
code::l("Senão", "Caso a linha estiver vazia");
code::begin();
    code::l("Linhas[Linha] := novo;","Novo elemento tornasse o primeiro elemento da linha");
    code::l("novo.direita := nulo;","Novo elemento aponta para nulo");
code::end();
code::write();