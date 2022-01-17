<?PHP
code::init();
code::initFunction("Remove(INFO)", "A posição na fila");

code::l("Se Fila.inicio != nulo então", "Verificando se a fila não está vazia");
code::begin();
    code::l("retorno : String;", "Declarando variável de retorno");
    code::l("retorno := Fila.fim.info;", "Definindo valor da variável para retorno");
    code::l("Rem : NoFila;","Declarando pointeiro para remoção");
    code::l("Rem := Fila.fim", "Armazendo elemento a ser removido");
    code::l();
    code::l("Se Fila.inicio.prox == Fila.inicio então", "Se a fila só possuir um elemento");
    code::begin();
        code::l("Fila.inicio := nulo;", "Reiniciando o inicio da fila");
        code::l("Fila.fim := nulo;", "Reiniciando o fim da fila");
    code::end();
    code::l("Senão", "Se a fila possuir mais de um elemento");
    code::begin();
        code::l("Fila.inicio := Fila.inicio.proximo;", "Definindo inicio da fila");
        code::l("Fila.fim.proximo := Fila.inicio;", "Fim da fila aponta para o novo inicio");
    code::end();
    code::l("Liberar(Rem)","Libera memória alocada para o elemento");
    code::l("Retornar retorno;","Retorna o valor do primeiro elemento a ser inserido");
code::end();
code::l("Retornar nulo;","Retorna nulo, pois a lista está vazia");

code::write();