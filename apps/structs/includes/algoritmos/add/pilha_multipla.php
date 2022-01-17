<?PHP 
code::init();
code::initFunction("Push(INFO, P) ou Insere(INFO, P) ou Empilha(INFO, P)");

code::l("Se topos[P] < inicios[P+1] e  então","Verificando se a pilha não está cheia");
code::begin();
    code::l("Pilha[topos[P]] := INFO;","Pilha recebe INFO na posição atual do TOPO");
    code::l("topos[P] := topos[P] + 1;", "TOPO da Pilha avança");
code::end();

code::write();

