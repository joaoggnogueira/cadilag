<?PHP
code::init();
code::initFunction("Remove(INFO)");

code::l("leitor,anterior : NoLista;","Declarando cursores");
code::l("leitor := Lista;","Inicializando o cursor no primeiro elemento");
code::l();
code::l("Enquanto leitor != nulo e leitor.info != INFO faça","Percorrendo lista para encontrar elemento");
code::begin();
    code::l("anterior := leitor;", "Cursor 'anterior' aponta para o atual elemento");
    code::l("leitor := leitor.proximo;", "Cursor 'leitor' aponta para o próximo elemento");
code::end();
code::l();
code::l("Se leitor != nulo e leitor.info == INFO então", "Caso o elemento for encontrado");
code::begin();
    code::l("Se anterior == nulo então", "Removendo o primeiro elemento");
    code::begin();
        code::l("Lista := Lista.proximo;", "Novo primeiro elemento da lista");
    code::end();
    code::l();
    code::l("Senão", "Removendo um elemento diferente do primeiro");
    code::begin();
        code::l("anterior.proximo := leitor.proximo;", "Elemento anterior aponta para o próximo");
    code::end();
    code::l();
    code::l("Liberar(leitor);","Liberando memória");
code::end();

code::write();