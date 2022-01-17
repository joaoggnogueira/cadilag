<?PHP 
code::init();
code::initFunction("Insere(INFO)");

code::l("novo : NoLista;","Declarando o novo elemento");
code::l("novo := alocar();","Alocando o novo elemento");
code::l("novo.info := INFO;","Definindo valor do elemento");
code::l("novo.proximo := nulo;","Definindo próximo como nulo");
code::l("novo.anteiror := nulo;","Definindo anterior como nulo");
code::l();
code::l("Se Lista != nulo então", "Caso a lista não estiver estiver vazia");
code::begin();
    code::l("novo.proximo := Lista;","Novo elemento aponta o primeiro da lista");
    code::l("Lista.anterior := novo;","Primeiro elemento da lista aponta para o novo");
code::end();
code::l();
code::l("Lista := novo;","Novo elemento se torna o primeiro da lista");

code::write();