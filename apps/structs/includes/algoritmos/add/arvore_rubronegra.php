
<?PHP 
code::init();
code::initFunction("Insere(INFO)");

//BUSCA E INSERÃ‡ÃƒO
code::l("leitor : NoRN;","Declarando variável para percorrer a Árvore");

code::l("caminho : EstruturaPilha &lt; NoRN &gt; ;","Declarando pilha para armazenar o caminho percorrido");
code::l("leitor := RAIZ;","Varredura inicia no nó raiz da Árvore");
code::l();
code::l("Enquanto leitor != nulo faça","Enquanto nó não for nulo");
code::begin();
    code::l("Empilha(caminho,leitor);","Adiciona na pilha de caminho, o nó atual");
    code::l("Se leitor.info < INFO então","Se o valor do nó for menor que o valor a ser inserido");
    code::begin();
        code::l("leitor := leitor.dir;","Varredura continua pelo nó-filho a direita");
    code::end();
    code::l("Senão se leitor.info > INFO então","Se o valor do nó for maior que o valor a ser inserido");
    code::begin();
        code::l("leitor := leitor.esq;","Varredura continua pelo nó-filho a esquerda");
    code::end();
    code::l("Senão se leitor.info == INFO então","Se o valor do nó for igual que o valor a ser inserido");
    code::begin();
        code::l("Retornar;","Inserção cancelada");
    code::end();
code::end();
code::l();
code::l("alocarNo(leitor,INFO)","Alocando novo elemento");
code::l("Empilha(caminho,leitor);","Insere o novo elemento no caminho");
code::l("caso1_insercao(caminho);","Inicia-se a verificação e tratamento de balanceamento");
code::write();

//ALOCAR NO
code::initFunction("alocarNo(NO,INFO)");
code::l("NO = alocar();","Aloca memória para o novo elemento");
code::l("NO.dir := nulo;","Defini nó-filho a direita como nulo");
code::l("NO.esq := nulo;","Defini nó-filho a esquerda como nulo");
code::l("NO.info := INFO;","Defini o valor do nó");
code::l("NO.cor := VERMELHO;","Todos nós começam vermelho");

code::write();

//CASO 1
code::initFunction("caso1_insercao(CAMINHO)");
code::l("Se CAMINHO.novo == RAIZ então","Se o nó inserido for a Raiz da Árvore");
code::begin();
    code::l("CAMINHO.novo.cor = PRETO;","Muda cor do nó raiz da Árvore para Preta");
code::end();
code::l("Senão","Se o nó inserido não for a Raiz da Árvore");
code::begin();
    code::l("caso2_insercao(CAMINHO)","Verificação continua para o Caso 2");
code::end();
code::write();

//CASO 2
code::initFunction("caso2_insercao(CAMINHO)");
code::l("Se CAMINHO.pai.cor == VERMELHO então","Se o pai e o filho forem ambos vermelhos");
code::begin();
    code::l("caso3_insercao(CAMINHO)","Verificação segue para o Caso 3");
code::end();
code::write();

//CASO 3
code::initFunction("caso3_insercao(CAMINHO)");
code::l("Se CAMINHO.tio != nulo e CAMINHO.tio.cor == VERMELHO então","Se o tio e o pai forem ambos vermelhos");
code::begin();
    code::l("CAMINHO.tio.cor = PRETO;","Altera a cor do nó tio para Preta");
    code::l("CAMINHO.pai.cor = PRETO;","Altera a cor do nó pai para Preta");
    code::l("CAMINHO.avo.cor = VERMELHO;","Altera a cor do nó avô para Vermelho");
    code::l("Desempilha(CAMINHO);","Remove o último nó inserido no caminho");
    code::l("Desempilha(CAMINHO);","Remove o penultimo nó inserido no caminho");
    code::l("caso1_insercao(CAMINHO);","Verificação volta para o Caso 1 com o nó avô");
code::end();
code::l("Senão","Se a cor do nó tio for Preta");
code::begin();
    code::l("caso4_insercao(CAMINHO);","Verificação segue para o Caso 4");
code::end();
code::write();

//CASO 4
code::initFunction("caso4_insercao(CAMINHO)");
code::l("Se possuiJoelhoESQUERDO(CAMINHO) então","Verificando se possui uma 'lista curva para esquerda' na estrutura");
code::begin();
    code::l("RotacaoAEsquerda(CAMINHO.avo,CAMINHO.pai);","Rotação simples a esquerda");
    code::l("rotacionarCaminho(CAMINHO);","Rotação na pilha do caminho");
code::end();
code::l("Senão possuiJoelhoDIREITO(CAMINHO) então","Verificando se possui uma 'lista curva para direita' na estrutura");
code::begin();
    code::l("RotacaoADireita(CAMINHO.avo,CAMINHO.pai);","Rotação simples a direita");
    code::l("rotacionarCaminho(CAMINHO);","Rotação na pilha do caminho");
code::end();
code::l("caso5_insercao(CAMINHO);","Verificação segue para o Caso 5");
code::write();

//CASO 5
code::initFunction("caso5_insercao(CAMINHO)");
    code::l("CAMINHO.pai.cor = PRETO;","Muda a cor do nó-pai para Preta");
    code::l("CAMINHO.avo.cor = VERMELHO;","Muda a cor do nó-avô para Vermelha");
    code::l("Se ehFilhoESQUERDO(CAMINHO.pai,CAMINHO.novo) então","Se o novo elemento foi inserido a esquerda do pai");
    code::begin();
        code::l("RotacaoADireita(CAMINHO.bisavo,CAMINHO.avo);","Rotação simples a direita");
    code::end();
    code::l("Se ehFilhoDIREITO(CAMINHO.pai,CAMINHO.novo) então","Se o novo elemento foi inserido a direita do pai");
    code::begin();
        code::l("RotacaoAEsquerda(CAMINHO.bisavo,CAMINHO.avo);","Rotação simples a esquerda");
    code::end();
code::write();

//JOELHO ESQUERDO
code::initFunction("possuiJoelhoESQUERDO(CAMINHO)");
    code::l("Retornar CAMINHO.avo.esq == CAMINHO.pai e CAMINHO.pai.dir == CAMINHO.novo;","Verificando se possui uma 'lista curva para esquerda' na estrutura");
code::write();

//JOELHO DIREITO
code::initFunction("possuiJoelhoDIREITO(CAMINHO)");
    code::l("Retornar CAMINHO.avo.dir == CAMINHO.pai e CAMINHO.pai.esq == CAMINHO.novo;","Verificando se possui uma 'lista curva para direita' na estrutura");
code::write();

//FILHO ESQUERDO
code::initFunction("ehFilhoESQUERDO(PAI,FILHO)");
    code::l("Retornar PAI.esq == FILHO;","Verificando se o nó-filho está a esquerda do nó-pai");
code::write();

//FILHO DIREITO
code::initFunction("ehFilhoDIREITO(PAI,FILHO)","Verificando se o nó-filho está a direita do nó-pai");
    code::l("Retornar PAI.dir == FILHO;");
code::write();

//ROTAÃ‡ÃƒO ESQUERDA
code::initFunction("RotacaoAEsquerda(Pai,No)");

code::l("q, temp : NoRN;", "Declarando variáveis auxiliares");
code::l("q := No.dir;", "Armazenando nó a direita");
code::l("temp := q.esq;", "Armazenando nó á esquerda do nó á direita");
code::l();
code::l("q.esq := No;", false);
code::l("No.dir := temp;", false);
code::l();
code::l("Se Pai != nulo então", false);
code::begin();
    code::l("Se Pai.dir == No então", false);
    code::begin();
        code::l("Pai.dir := q;", false);
    code::end();
    code::l("Senão", false);
    code::begin();
        code::l("Pai.esq := q;", false);
    code::end();
code::end();
code::l("Senão", false);
code::begin();
    code::l("No := q;", false);
code::end();

code::write();

//ROTAÃ‡ÃƒO DIREITA
code::initFunction("RotacaoADireita(Pai,No)");

code::l("q, temp : NoRN;", "Declarando variáveis auxiliares");
code::l("q := No.esq;", "Armazenando nó a esquerda");
code::l("temp := q.dir;", "Armazenando nó á direita do nó á esquerda");
code::l();
code::l("q.dir := No;", false);
code::l("No.esq := temp;", false);
code::l();
code::l("Se Pai != nulo então", false);
code::begin();
    code::l("Se Pai.dir == No então", false);
    code::begin();
        code::l("Pai.dir := q;", false);
    code::end();
    code::l("Senão", false);
    code::begin();
        code::l("Pai.esq := q;", false);
    code::end();
code::end();
code::l("Senão", false);
code::begin();
    code::l("No := q;", false);
code::end();

code::write();

//ROTACIONAR CAMINHO
code::initFunction("rotacionarCaminho(CAMINHO)");
    code::l("no, pai : NoRN;");
    code::l("no := Desempilha(CAMINHO);");
    code::l("pai := Desempilha(CAMINHO);");
    code::l("Empilha(CAMINHO,no);");
    code::l("Empilha(CAMINHO,pai);");
code::write();

//TIO
code::initFunction("tio(CAMINHO)","Retorna o TIO do último nó da pilha CAMINHO");
    code::l("Se CAMINHO.avo.dir == pai");
    code::begin();
        code::l("return CAMINHO.avo.esq");
    code::end();
    code::l("Senão");
    code::begin();
        code::l("return CAMINHO.avo.dir");
    code::end();
code::write();

?>