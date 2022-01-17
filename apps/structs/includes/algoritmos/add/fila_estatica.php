<?PHP
code::init();
code::initFunction("Insere(INFO) ou Enqueue(INFO)");

code::l("Se fim != MAX então", "Verificando se a filha está cheia");
code::begin();
    code::l("Fila[fim] := INFO;","Inserindo novo falor no final da fila");
    code::l("fim := fim + 1;","Indice fim incrementa uma posição");
code::end();

code::write();