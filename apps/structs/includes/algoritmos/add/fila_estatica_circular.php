<?PHP
code::init();
code::initFunction("Insere(INFO) ou Enqueue(INFO)");

code::l("Se total != MAX então", "Verificando se a filha está cheia");
code::begin();
    code::l("Fila[fim] := INFO;","Inserindo novo falor no final da fila");
    code::l("fim := (fim + 1) mod MAX;","Índice fim incrementa uma posição");
    code::l("total := total + 1;", "Contador de dados na fila incrementado");
code::end();

code::write();