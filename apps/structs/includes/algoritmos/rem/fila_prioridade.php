<?PHP
code::init();
code::initFunction("Remove() ou Dequeue() ou Shift()", "Retorna a primeira posição");
code::l("Se Fila.fim != nulo então", "Caso a fila não estiver vazia");
code::begin();
    code::l("rem,retorno : NoFila;","Declarando variaveis auxiliares");
    code::l("rem := Fila.inicio;",false);
    code::l("retorno :=  Fila.inicio.info;",false);
    code::l("Fila.inicio := Fila.inicio.proximo;","Primeiro elemento é removido");
    code::l();
    code::l("Se Fila.inicio == nulo então", "Se a Fila ficar vazia com a remoção");
    code::begin();
        code::l("Fila.fim := nulo", false);
    code::end();
    code::l();
    code::l("Liberar(rem);", "Desalocando memória");
    code::l("Retornar retorno;", "Retornando o elemento da primeira posição");
code::end();
code::l("Retornar nulo;", "Retorna nulo pois não foi encontrado");

code::write();
