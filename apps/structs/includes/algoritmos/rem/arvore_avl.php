<?PHP

code::init();
code::initFunction("Remove(No,Pai,Info)");

code::l("Se No != nulo então", "Se o nó atual for diferente de nulo");
code::begin();
    code::l("Se No.Info != Info", "Se o valor não for igual ao pesquisado");
    code::begin();
        code::l("Se No.Info < Info então", "Se o valor do nó for maior que o pesquisado");
        code::begin();
            code::l("Remove(No.Direita,No,Info);", "Busca continua a direita");
        code::end();
        code::l("Senão", "Se o valor do nó for menor que o pesquisado");
        code::begin();
            code::l("Remove(No.Esquerda,No,Info);", "Busca continua a esquerda");
        code::end();
        code::l();
        code::l("fb : inteiro", "Declarando variável auxiliar");
        code::l("fb := FatorBalanceamento(No);", "Recuperando Fator de Balanceamento do nó");
        code::l("Se Abs(fb) >= 2 então", "Se a arvore estiver desbalanceada");
        code::begin();
            code::l("Verifica(Pai,No,fb);", "Realiza as rotações");
        code::end();
    code::end();
    code::l("Senão", "Se o valor for igual ao pesquisado");
    code::begin();
        code::l("Se No.Direita == nulo então", "Se o nó da direita for nulo");
        code::begin();
            code::l("No := No.Esquerda;", "O Nó é substituido pelo nó da esquerda");
        code::end();
        code::l("Senão Se No.Esquerda == nulo então", "Se o nó da esquerda for nulo");
        code::begin();
            code::l("No := No.Direita;", "O Nó é substituido pelo nó da direita");
        code::end();
        code::l("Senão", "Se o nó da direita e da esquerda não forem nulos");
        code::begin();
            code::l("RemoveSucessor(No,No.Direita,No);", "Inicia a remoção e substituição do nó pelo seu sucessor");
            code::l("fb : inteiro", "Declarando variável auxiliar");
            code::l("fb := FatorBalanceamento(No);", "Recuperando Fator de Balanceamento do nó");
            code::l("Se Abs(fb) >= 2 então", "Se a árvore estiver desbalanceada");
            code::begin();
                code::l("Verifica(Pai,No,Pai);", "Realiza a rotações");
            code::end();
        code::end();
    code::end();
code::end();
code::write();

code::initFunction("RemoveSucessor(Q,P,Pai)");

code::l("Se P.Esquerda == nulo então", "Se o nó á esquerda do nó de pesquisa for nulo");
code::begin();
    code::l("Q := P;","Sucessor substitui o nó a ser removido");
    code::l("P := P.Direita;","Antiga posição do sucessor recebe o nó a direita");
code::end();
code::l("Senão", "Se o nó á esquerda do nó de pesquisa não for nulo");
code::begin();
    code::l("RemoveSucessor(Q,P.Esquerda,P);", "Busca pelo sucessor continua á esquerda");
    code::l("fb : inteiro", "Declarando variável auxiliar");
    code::l("fb := FatorBalanceamento(Pai);", "Recuperando Fator de Balanceamento do nó");
    code::l("Se Abs(fb) >= 2 então", "Se a árvore estiver desbalanceada");
    code::begin();
        code::l("Verifica(Pai,P,fb);", "Realiza a rotações");
    code::end();
code::end();

code::write();
generateFunctions();
