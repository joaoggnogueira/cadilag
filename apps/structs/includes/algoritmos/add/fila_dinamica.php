<?PHP
code::init();
code::initFunction("Insere(INFO) ou Enqueue(INFO)");

code::l("novo : NoFila;", "Declarando novo elemento");
code::l("novo := alocar();", "Alocando novo elemento");
code::l("novo.info := info;", "Defindo valor do elemento");
code::l();
code::l("Se Fila.inicio == nulo então", "Caso a fila estiver vazia");
code::begin();
    code::l("Fila.inicio := novo;", "O inicio da fila aponta para o novo elemento");
code::end();
code::l("Senão", "Caso a fila não estiver vazia");
code::begin();
    code::l("Fila.fim.proximo := novo;", false);
code::end();
code::l();
code::l("Fila.fim := novo;", "O fim da fila aponta para o novo elemento");

code::write();
