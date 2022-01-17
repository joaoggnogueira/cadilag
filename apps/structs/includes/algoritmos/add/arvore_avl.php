<?PHP 

function generateFunctions(){
    code::initFunction("FatorBalanceamento(No)","O nível de balanceamento da árvore abaixo do nó");
    code::l("direita, esquerda : inteiro", "Declarando variaveis auxiliares");
    code::l("direita := Altura(No.Direita);", "Recuperando maior altura do nó á direita");
    code::l("esquerda := Altura(No.Esquerda);", "Recuperando maior altura do nó á esquerda");
    code::l("Retornar direita - esquerda;", "Retornando fator de balanceamento");

    code::write();
    
    code::initFunction("Altura(No)", "A altura a partir do No");

    code::l("Se No == nulo então", "Se o nó pai for um nó folha");
    code::begin();
        code::l("Retornar -1;", "Esse nó tem altura -1, porém o nó folha tem altura zero");
    code::end();
    code::l();
    code::l("direita, esquerda : inteiro;", "Declarando variaveis auxiliares");
    code::l("direita := Altura(No.Direita);", "Recuperando maior altura do nó á direita");
    code::l("esquerda := Altura(No.Esquerda);", "Recuperando maior altura do nó á esquerda");
    code::l("Retornar Max(esquerda + 1 ,direita + 1 )", "Retornando altura do nó");

    code::write();

    code::initFunction("Verifica(Pai,No,fb)");

    code::l("Se fb > 0 então", "Se a arvore estiver desbalanceada á direita (Altura do nó direita for maior)");
    code::begin();
        code::l("Se FatorBalanceamento(No.Direita) > 0 então", "Se a sub-arvore á direita estiver desbalanceada á direita (Altura do nó direita for maior)");
        code::begin();
            code::l("RotaçãoEsquerda(Pai,No);", "Rotaciona arvore á esquerda");
        code::end();
        code::l("Senão", "Se a sub-arvore á direita estiver desbalanceada á esquerda (Altura do nó direita for maior)");
        code::begin();
            code::l("RotaçãoDireita(No,No.Direita);", "Rotaciona sub-árvore á direita para direita");
            code::l("RotaçãoEsquerda(Pai,No);", "Rotaciona árvore a esquerda");
        code::end();
    code::end();
    code::l("Senão", "Se a arvore estiver desbalanceada á esquerda (Altura do nó esquerda for maior)");
    code::begin();
        code::l("Se FatorBalanceamento(No.Esquerda) < 0 então", "Se a sub-arvore á esquerda estiver desbalanceada á esquerda (Altura do nó esquerda for maior)");
        code::begin();
            code::l("RotaçãoDireita(Pai,No);", "Rotaciona árvore a direita");
        code::end();
        code::l("Senão", "Se a sub-arvore á esquerda estiver desbalanceada á direita (Altura do nó direita for maior)");
        code::begin();
            code::l("RotaçãoEsquerda(No,No.Esquerda);", "Rotaciona da sub-árvore á esquerda para esquerda");
            code::l("RotaçãoDireita(Pai,No);", "Rotaciona árvore a direita");
        code::end();  
    code::end();

    code::write();

    code::initFunction("RotaçãoEsquerda(Pai,No)");

    code::l("q, temp : EstruturaAVL;", "Declarando variáveis auxiliares");
    code::l("q := No.Direita;", "Armazenando nó a direita");
    code::l("temp := q.Esquerda;", "Armazenando nó á esquerda do nó á direita");
    code::l();
    code::l("q.Esquerda := No;", false);
    code::l("No.Direita := temp;", false);
    code::l();
    code::l("Se Pai != nulo então", false);
    code::begin();
        code::l("Se Pai.Direita == No então", false);
        code::begin();
            code::l("Pai.Direita := q;", false);
        code::end();
        code::l("Senão", false);
        code::begin();
            code::l("Pai.Esquerda := q;", false);
        code::end();
    code::end();
    code::l("Senão", false);
    code::begin();
        code::l("No := q;", false);
    code::end();

    code::write();

    code::initFunction("RotaçãoDireita(Pai,No)");

    code::l("q, temp : EstruturaAVL;", "Declarando variáveis auxiliares");
    code::l("q := No.Esquerda;", "Armazenando nó a esquerda");
    code::l("temp := q.Direita;", "Armazenando nó á direita do nó á esquerda");
    code::l();
    code::l("q.Direita := No;", false);
    code::l("No.Esquerda := temp;", false);
    code::l();
    code::l("Se Pai != nulo então", false);
    code::begin();
        code::l("Se Pai.Direita == No então", false);
        code::begin();
            code::l("Pai.Direita := q;", false);
        code::end();
        code::l("Senão", false);
        code::begin();
            code::l("Pai.Esquerda := q;", false);
        code::end();
    code::end();
    code::l("Senão", false);
    code::begin();
        code::l("No := q;", false);
    code::end();

    code::write();
}

code::init();
code::initFunction("Insere(No,Pai,Info)");

code::l("Se No == nulo então","Se o nó atual for nulo, inicia a inserção");
code::begin();
    code::l("No := alocar();", "Alocando novo nó");
    code::l("No.Info := Info;", "Definindo valor do novo nó");
code::end();
code::l("Senão se No.Info != Info então", "Caso o nó atual não for nulo");
code::begin();
    code::l("Se No.Info < Info então", "Se o valor do nó for maior que o valor da pesquisa");
    code::begin();
        code::l("Insere(No.Direita,No,Info);","Pesquisa continua a direita");
    code::end();
    code::l("Senão No.Info > Info então","Se o valor do nó for menor que o valor da pesquisa");
    code::begin();
        code::l("Insere(No.Esquerda,No,Info);","Pesquisa continua a esquerda");
    code::end();
    code::l("Senão");
    code::begin();
        code::l("Retornar;","Inserção se encerra pois o elemento já foi inserido");
    code::end();
    code::l();
    code::l("fb : inteiro", "Declarando variável auxiliar");
    code::l("fb := FatorBalanceamento(No);", "Recuperando Fator de Balanceamento do nó");
    code::l("Se Abs(fb) >= 2 então","Se a árvore não estiver balanceada");
    code::begin();
        code::l("Verifica(Pai,No,fb);", "Realiza as rotações");
    code::end();
code::end();

code::write();

generateFunctions();
