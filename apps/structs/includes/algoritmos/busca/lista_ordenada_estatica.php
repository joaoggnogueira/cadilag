<?PHP 
code::init();
code::initFunction("Busca(INFO)","Se o valor está na lista");

code::l("i : inteiro;", "Declarando variável para leitura");
code::l("i := PRIM;", "Variável de leitura aponta para o primeiro índice");
code::l();
code::l("Enquanto i != -1 e lista[i].info <= INFO então", "Percorrendo a lista, enquanto o valor do elemento percorrido for menor ou igual do que aquele a ser inserido");
code::begin();
    code::l("Se lista[i].info == INFO então", "Se o valor do elemento percorrido for igual ao pesquisado");
    code::begin();
        code::l("retonar Verdadeiro;", "Elemento está contido na lista");
    code::end();
    code::l("i := lista[i].prox;","Variável de leitura aponta para o próximo elemento da lista");
code::end();
code::l("Retornar Falso;", "Elemento não está contido");
code::write();