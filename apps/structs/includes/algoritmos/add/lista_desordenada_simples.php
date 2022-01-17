<?PHP 
code::init();
code::initFunction("Insere(INFO)");

code::l("novo : NoLista;","Declarando o novo elemento");
code::l("novo := alocar();","Alocando o novo elemento");
code::l("novo.info := INFO;","Definindo valor do elemento");
code::l();
code::l("novo.proximo := Lista;","Novo elemento aponta o primeiro da lista");
code::l("Lista := novo;","Novo elemento se torna o primeiro da lista");

code::write();