<?PHP

code::init();
code::initFunction("Busca(No,Info)", "Se o valor está na árvore");

code::l("indice : inteiro;", "Declarando variável para leitura");
code::l("indice := 0;", "Declarando variável para leitura");
code::l();
code::l("Enquanto indice != ORDEM e No.info[i] != nulo então", "Percorrendo elementos do nó");
code::begin();
    code::l("Se No.info[i] == info então", "Se o valor do elemento for igual da inserção");
    code::begin();
        code::l("Retornar Verdadeiro;", "Busca se encerrado, e elemento foi encontrado");
    code::end();
    code::l("Senão se No.info[i] > info então", "Se o valor do elemento for maior que o valor da inserção");
    code::begin();
        code::l("Se No.filho[i] != nulo então", "Se possuir um filho na posição 'i'");
        code::begin();
            code::l("Retornar Busca(No.filho[i],info);", "Busca continua no filho");
        code::end();
        code::l("Senão", "Senão possuir filho para continuar a pesquisa");
        code::begin();
            code::l("Break;", "Pesquisa se encerra, a inserção será neste nó");
        code::end();
    code::end();
code::end();
code::l();
code::l("Se No.filho[i] != nulo então", "Se existir um filho da posição 'i', ou seja, na última posição");
code::begin();
    code::l("Retornar Busca(No.filho[i],info);", "Busca continua no último nó filho");
code::end();
code::l("Senão","Se não existir um filho da posição 'i', inicia a inserção");
code::begin();
    code::l("Retornar Falso;","Busca se encerrado, e elemento não foi encontrado");
code::end();

code::write();

