<?PHP
code::init();
code::initFunction("Remove() ou Dequeue() ou Shift()", "O valor do primeiro elemento, caso exista");

code::l("Se total != 0 faça", "Verificando se fila está vázia");
code::begin();
    code::l("aux := Fila[inicio];", "Auxiliar receve o primeiro da fila");
    code::l("Fila[inicio] := nulo;", "Incrementando indice Inicio");
    code::l("inicio := (inicio + 1) mod MAX;", "Incrementando indice Inicio");
    code::l("total := total - 1;", "Contador de dados na fila decrementado");
    code::l();
    code::l("Retornar aux;", false);
code::end();
code::l();
code::l("Retornar nulo;", "Retona nulo, pois a fila está vazia");

code::write();
