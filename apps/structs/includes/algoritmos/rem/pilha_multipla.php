<?PHP 
code::init();
code::initFunction("Remove(P)","O topo da pilha informada");

code::l("Se topos[P] != inicios[P]","Verificando se a Pilha não está vázia");
code::begin();
    code::l("topos[P] := topos[P] - 1;","Decrementando o TOPO da Pilha");
    code::l("aux : String;", "Declarando variável auxiliar de tipo String (Cadeia de caracteres)");
    code::l("aux := Pilha[topos[P]];", "Auxiliar recebe o valor do topo");
    code::l("Retornar aux;", "Retorna o valor do Topo da Pilha");
code::end();
code::l("Retornar nulo;", "Retorna nulo pois a pilha está vazia");

code::write();