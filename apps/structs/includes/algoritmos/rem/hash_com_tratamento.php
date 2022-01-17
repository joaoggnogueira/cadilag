<?PHP

code::init();

code::initFunction("Remove(INFO)");

code::l("ind : inteiro;","Declarando índice para armazenar resultado da função HASH");
code::l("leitor, anterior : EstruturaLista;","Declarando cursores");
code::l("ind := Hash(INFO);","Calculando a função HASH");
code::l("leitor := TabelaHash[ind];","Posicionando cursor 'leitor' no inicio da lista");
code::l();
code::l("Enquanto leitor != nulo e leitor.info < INFO então","Percorrendo elementos da lista com valores menores ao pesquisado");
code::begin();
    code::l("anterior := leitor;","Cursor 'anterior' aponta para o atual elemento da leitura");
    code::l("leitor := leitor.proximo;","Cursor 'leitor' aponta para o próximo elemento da leitura");
code::end();
code::l();
code::l("Se leitor != nulo e leitor.info == INFO então","Caso o elemento for encontrado");
code::begin();
    code::l("Se anterior == nulo então","Removendo o primeiro elemento da lista");
    code::begin();
        code::l("TabelaHash[ind]  := TabelaHash[ind].proximo;", false);
    code::end();
    code::l("Senão","Removendo um elemento diferente do primeiro da lista");
    code::begin();
        code::l("anterior.proximo := leitor.proximo;", false);
    code::end();
code::end();

code::write();
generateHashCode();

