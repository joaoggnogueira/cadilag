<?PHP 
code::init();
code::initFunction("Busca(INFO,P)","A posição da primeira ocorrência na pilha");

code::l("indice : inteiro;","Declarando variável indice");
code::l("indice := inicios[P];", "Indice recebe o inicio da pilha");
code::l("Enquanto indice  < topos[P] então","Pesquisando do inicio até o topo");
code::begin();
    code::l("Se Pilha[indice] == INFO","Caso o valor for encontrado");
    code::begin();
        code::l("Retornar indice;","Retorna a posição do elemento na pilha");
    code::end();
    code::l("indice := indice + 1;", "Busca avança para o próximo elemento");
code::end();
code::l("Retornar -1;", "Retorna -1 pois o elemento não foi encontrado");

code::write();
