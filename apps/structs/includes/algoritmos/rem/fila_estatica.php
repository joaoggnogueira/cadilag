<?PHP
code::init();
code::initFunction("Remove() ou Dequeue() ou Shift()", "O valor do primeiro elemento, caso exista");

code::l("Se inicio != fim faça", "Verificando se fila está vázia");
code::begin();
    code::l("inicio := inicio + 1;", "Incrementando indice Inicio");
    code::l("aux := Fila[inicio - 1];", "Auxiliar receve o primeiro da fila");
    code::l();
    code::l("Se inicio == fim então", "Se a fila ficar vazia após a remoção");
    code::begin();
        code::l("inicio := 0;", "Reiniciando índice 'inicio'");
        code::l("fim := 0;", "Reiniciando índice 'fim'");
    code::end();
    code::l();
    code::l("Retornar aux;", false);
code::end();
code::l();
code::l("Retornar nulo;", "Retona nulo, pois a fila está vazia");

code::write();
