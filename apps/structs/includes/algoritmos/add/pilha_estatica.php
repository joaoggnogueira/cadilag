<?PHP 
code::init();
code::initFunction("Push(INFO) ou Insere(INFO) ou Empilha(INFO)");

code::l("Se TOPO != MAX então","Verificando se a pilha não está cheia");
code::begin();
    code::l("pilha[TOPO] := INFO;","Topo recebe novo valor");
    code::l("TOPO := TOPO + 1;", "Topo avança para o proximo índice");
code::end();

code::write();