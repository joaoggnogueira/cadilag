<?PHP 
code::init();
code::initFunction("Busca(INFO)","Se o valor está na pilha");

code::l("Para ind de 0 até TOPO passo 1 faça", "Percorrendo toda Pilha até o TOPO");
code::begin();
    code::l("Se pilha[ind] == INFO então", "Verificando se o valor é similar igual ao pesquisado");
    code::begin();
        code::l("Retornar Verdadeiro;","Elemento encontrado");
    code::end();
code::end();
code::l("Retornar Falso", "Elemento não encontrado");
        
code::write();