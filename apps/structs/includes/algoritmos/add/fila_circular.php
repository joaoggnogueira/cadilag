<?PHP 
code::init();
code::initFunction("Insere(INFO)");
        
code::l("novo : NoFila;","Declaranado novo elemento a ser inserido");
code::l("novo := alocar();","Alocando novo elemento");
code::l("novo.info := INFO;","Definindo o valor do elemento");
code::l();
code::l("Se Fila.inicio == nulo então", "Se a fila estiver vazia");
code::begin();
    code::l("Fila.inicio := novo;", "Definindo o inicio da fila com o novo elemento");
code::end();
code::l("Senão", "Caso a fila não esteja vazia");
code::begin();
    code::l("Fila.fim.proximo := novo;", "Fim da fila aponta para novo elemento");
code::end();
code::l();
code::l("Fila.fim := novo;", "Definindo o novo elemento no fim da fila");
code::l("Fila.fim.proximo := Fila.inicio;", "Fim da fila aponta para o inicio");

code::write();
