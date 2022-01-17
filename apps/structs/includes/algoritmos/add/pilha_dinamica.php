<?PHP 
code::init();
code::initFunction("Push(INFO) ou Insere(INFO) ou Empilha(INFO)");

code::l("novo : NoPilha;","Declarando o novo elemento");
code::l("novo := alocar();","Alocando o novo elemento");
code::l("novo.info := INFO;","Definindo valor do novo elemento");
code::l();
code::l("novo.proximo := Topo;","Novo elemento aponta para o Topo");
code::l("Topo := novo;", "Topo aponta para o novo elemento");

code::write();
