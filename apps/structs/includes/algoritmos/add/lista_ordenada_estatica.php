<?PHP 
code::init();
code::initFunction("Insere(INFO)");

code::l("Se tamanho != MAXIMO então", "Se a Lista não estiver completa");
code::begin();
    code::l("lista[DISP].info := INFO;","Definindo o valor do novo elemento no indice disponível");
    code::l("auxiliar : inteiro;","Declarando variável auxiliar");
    code::l("auxiliar := lista[DISP].prox;","O ponteiro 'auxiliar' aponta para o proximo elemento do indice disponível");
    code::l("lista[DISP].prox := -1;","O ponteiro 'próximo' do indice disponível aponta para vazio");
    code::l("tamanho := tamanho + 1;", "O tamanho da fila incrementa");
    code::l();
    code::l("Se PRIM != -1 então", "Se o novo elemento não for o único da lista");
    code::begin();
        code::l("anterior, i : inteiro;", "Declarando variáveis para percorrer a lista");
        code::l("anterior := -1;", "Anterior aponta pra vazio");
        code::l("i := PRIM;", "A variável de leitura aponta para o primeiro elemento da lista");
        code::l();
        code::l("Enquanto i != -1 e lista[i].info < INFO então","Percorrendo a lista, enquanto o valor do elemento percorrido for menor do que aquele a ser inserido");
        code::begin();
            code::l("anterior := i;", "Anterior aponta para o elemento atual a ser percorrido");
            code::l("i := lista[i].prox;", "Variável de leitura aponta para o próximo elemento da lista");
        code::end();
        code::l();
        code::l("Se anterior != -1 então", "Se for inserido como primeiro elemento da lista");
        code::begin();
            code::l("lista[DISP].prox := PRIM;", "Proximo elemento do 'indice disponivel' aponta para o 'primeiro indice'");
            code::l("PRIM := DISP;", "'Primeiro indice' aponta agora para o 'indice disponivel', tornando o novo elemento o primeiro da lista");
        code::end();
        code::l("Senão", "Caso o novo elemento não for o primeiro da lista");
        code::begin();
            code::l("Se i != -1 então", "Se for diferente do última posição");
            code::begin();
                code::l("lista[DISP].prox := lista[anterior].prox;","Próximo elemento do 'indice disponivel' aponta para o proximo elemento do 'anterior'");
            code::end();
            code::l("lista[anterior].prox := DISP;", "Próximo elemento do 'anterior' aponta para o indice disponivel");
        code::end();
    code::end();
    code::l("Senão", "Caso contrário, se o novo elemento for o único da lista");
    code::begin();
        code::l("PRIM := DISP;","Primeiro indice aponta para o novo elemento");
    code::end();
    code::l("DISP := auxiliar;","Próximo elemento disponível aponta para o próximo");
code::end();

code::write();