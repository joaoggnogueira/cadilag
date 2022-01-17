<?PHP 
code::init();
code::initFunction("Pop() ou Remove() ou Desempilha()","Último Elemento inserido, caso exista");
    
code::l("Se TOPO != 0 então","Se a pilha não estiver vazia");
code::begin();
    code::l("TOPO := TOPO - 1;","TOPO retrocede um índice");
    code::l("Retornar pilha[TOPO];","Retorna o última posição");
code::end();
code::l("Retornar nulo;","Retorna o nulo pois a pilha está vazia");

code::write();
