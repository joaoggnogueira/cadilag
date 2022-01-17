<?PHP
code::init();
code::initFunction("Pop() ou Remove() ou Desempilha()", "Último Elemento inserido, caso exista");

code::l("Se Pilha != nulo então", "Verificando se a pilha não está vázia");
code::begin();
    code::l("auxiliar : NoPilha;", "Declarando ponteiro para auxiliar o retorno");
    code::l("auxiliar := Topo", "Ponteiro auxiliar aponta para o elemento do Topo");
    code::l("Topo := Topo.proximo;", "Topo aponta para o proximo elemento");
    code::l("Retornar auxiliar.info;", "Retornando último elemento");
code::end();

code::write();
