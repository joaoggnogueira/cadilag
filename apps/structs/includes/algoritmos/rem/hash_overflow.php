<?PHP

code::init();

code::initFunction("Remove(INFO)");

code::l("ind : inteiro;","Declarando índice para armazenar resultado da função HASH");
code::l("ind := Hash(INFO);","Calculando a função HASH");
code::l("Se TabelaHash[ind] != nulo então","Se possui elemento alocado na posição");
code::begin();
    code::l("Se TabelaHash[ind].info == INFO então","Se o valor do elemento for igual ao pesquisado");
    code::begin();
        code::l("Se TabelaHash[ind].proximo == -1 então","Se não possuir uma lista na Área de Overflow");
        code::begin();
            code::l("Liberar(TabelaHash[ind]);","Desaloca área de memória do elemento");
            code::l("TabelaHash[ind] := nulo;","Desaloca o ponteiro do elemento");
        code::end();
        code::l("Senão","Se possuir uma lista na Àrea de Overflow");
        code::begin();
            code::l("prox : inteiro;","Declarando váriavel auxiliar");
            code::l("prox := TabelaHash[ind].prox;","Recuperando primeira posição do elemento na lista da Área de Overflow");
            code::l("TabelaHash[ind].info := AreaDeOverflow[prox].info;","Movendo valor do primeiro elemento da lista para o elemento da Tabela");
            code::l("TabelaHash[ind].proximo := AreaDeOverflow[prox].proximo;","Primeiro elemento da lista passa a ser o próximo da lista");
            code::l("AreaDeOverflow[prox].proximo := DISP;","Primeiro elemento da lista aponta para índice disponível");
            code::l("AreaDeOverflow[prox].info := nulo;","Desalocando valor do primeiro elemento da lista");
            code::l("DISP := prox;","Índíce disponível aponta para o primeiro elemento da lista");
        code::end();
    code::end();
    code::l("Senão Se TabelaHash[ind].proximo != -1 então","Se o valor do elemento não for igual ao pesquisado");
    code::begin();
        code::l("leitor, anterior : inteiro;","Declarando variável para varredura na lista da Área de Overflow");
        code::l("anterior := -1;","Inicializando o anterior como nulo");
        code::l("leitor := TabelaHash[ind].prox;","Inciando varredura no primeiro elemento na lista da Área de Overflow");
        code::l();
        code::l("Enquanto leitor != -1 e AreaDeOverflow[leitor].info então","Enquanto o elemento não for encontrado na lista da Área de Overflow");
        code::begin();
            code::l("anteiror := leitor;","Armazenando elemento anterior");
            code::l("leitor := AreaDeOverflow[leitor].proximo;","Verredura continua para o próximo elemento na lista");
        code::end();
        code::l();
        code::l("Se leitor != -1 então","Se o elemento não fôr o final da fila, então o elemento foi encontrado");
        code::begin();
            code::l("Se anterior != -1 então","Se não for o primeiro elemento da lista");
            code::begin();
                code::l("AreaDeOverflow[anterior].proximo := TabelaHash[leitor].proximo;");
            code::end();
            code::l("Senão","Se for o primeiro elemento da lista");
            code::begin();
                code::l("TabelaHash[ind].proximo := AreaDeOverflow[leitor].proximo;");
            code::end();
            code::l("AreaDeOverflow[leitor].proximo := DISP;","Próximo elemento aponta para o índice dísponível");
            code::l("AreaDeOverflow[leitor].info := nulo;","Desalocando a informação do elemento");
            code::l("DISP := leitor;","Índíce disponível aponta para o primeiro elemento da lista");
        code::end();
    code::end();    
code::end();
code::write();
generateHashCode();

