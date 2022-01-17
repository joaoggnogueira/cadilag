<?php 

code::init();
code::initFunction("Remove(INFO)");

//BUSCA E REMOÇÃO
code::l("caminho : EstruturaPilha &lt; NoRN &gt; ;","Declarando estrutura para armazenar o caminho");
code::l("leitor : NoRN;","Declarando variável para varredura da árvore");
code::l("leitor := RAIZ;","Varredura se inicia na raiz da árvore");
code::l();
code::l("Enquanto leitor != nulo e leitor.info == INFO faça","Varredura continua até encontrar um nó com o mesmo valor");
code::begin();
    code::l("Empilha(caminho,leitor);","Adiciona o nó atual ao caminho percorrido");
    code::l("Se leitor.info < INFO então","Se o valor do nó for menor ao procurado");
    code::begin();
        code::l("leitor := leitor.dir;","Varredura segue para o nó-filho a direita");
    code::end();
    code::l("Senão se leitor.info > INFO então","Se o valor do nó for maior ao procurado");
    code::begin();
        code::l("leitor := leitor.esq;","Varredura segue para o nó-filho a esquerda");
    code::end();
code::end();
code::l();
code::l("Se leitor != nulo então","Se o nó for encontrado");
code::begin();
    code::l("Rem : NoRN;", "Declarando auxiliar");
    code::l("Rem := leitor;", "Armazenando nó para ser removido");
    code::l();
    code::l("Se leitor.dir == nulo então", 'Verificando se possui filho a direita');
    code::begin();
        code::l("leitor := leitor.esq;", "O sucessor será o filho da esquerda");
        code::l("Empilha(caminho,leitor);","Adiciona nó ao caminho já percorrido");
    code::end();
    code::l("Senão se leitor.esq == nulo então",'Verificando se possui filho a esquerda');
    code::begin();
        code::l("leitor := leitor.dir;", "O sucessor será o filho da direita");
        code::l("Empilha(caminho,leitor);","Adiciona nó ao caminho já percorrido");
    code::end();
    code::l("Senão", 'Caso possua filho em ambos lados');
    code::begin();
        code::l("Empilha(caminho,leitor);","Adiciona nó ao caminho já percorrido");
        code::l("Sucessor : NoRN;", "Declarando cursor para pesquisa do sucessor");
        code::l("Sucessor := leitor.dir;", "Posicionando cursor a direita do elemento encontrado");
        code::l();
        code::l("Enquanto Sucessor.esq != nulo faça", "Seguindo sempre a esquerda");
        code::begin();
            code::l("Empilha(caminho,Sucessor);","Adiciona nó ao caminho já percorrido");
            code::l("Sucessor := Sucessor.esq;", "Cursor 'sucessor' aponta para o filho a esquerda");
        code::end();
        code::l();
        code::l("leitor.info := Sucessor.info;", "Trocando valor com o do sucessor");
        code::l("Sucessor := Sucessor.dir;","Nó do Sucessor é removido");
        code::l("Empilha(caminho,Sucessor);","Adiciona nó ao caminho já percorrido");
        code::l("Rem := Sucessor;", "Definindo o elemento a ser removido");
    code::end();
    code::l();
    code::l("Se Rem.cor === PRETO então","Se a cor do nó removido for preto");
    code::begin();
        code::l("caso1_remocao(caminho);","Inicia-se a verificação e tratamento de balanceamento");
    code::end();
    code::l("Liberar(Rem);","Liberando a memória");
code::end();
code::write();

//CASO 1
code::initFunction("caso1_remocao(CAMINHO)");
    code::l("Se pai != nulo então","Verifica se o nó removido possui pai");
    code::begin();
        code::l("caso2_remocao(CAMINHO);","Verificação segue para o Caso 2");
    code::end();
code::write();

//CASO 2
code::initFunction("caso2_remocao(CAMINHO)");
    code::l("Se CAMINHO.irmao.cor == VERMELHO então","Se a cor do nó-irmão for vermelho");
    code::begin();
        code::l("CAMINHO.pai.cor := VERMELHO;","Altera a cor do nó-pai para vermelha");
        code::l("CAMINHO.irmao.cor := PRETO;","Altera a cor do nó-irmão para preta");
        code::l();
        code::l("Se ehFilhoDIREITO(CAMINHO.pai,CAMINHO.no) então","Se o nó removido estiver a esquerda do nó-pai");
        code::begin();
            code::l("RotacaoAEsquerda(CAMINHO.avo,CAMINHO.pai);","Realiza a rotação a esquerda no nó-pai");
        code::end();
        code::l("Senão","Se o nó removido estiver a direita do nó-pai");
        code::begin();
            code::l("RotacaoADireita(CAMINHO.avo,CAMINHO.pai);","Realiza a rotação a direita no nó-pai");
        code::end();
    code::end();
    code::l("caso3_remocao(CAMINHO);","Verificação segue para o Caso 3");
code::write();

//CASO 3
code::initFunction("caso3_remocao(CAMINHO)");
    code::l("Se CAMINHO.pai.cor == PRETO e CAMINHO.irmao != nulo e CAMINHO.irmao.cor == PRETO e CAMINHO.irmao.esq.cor == PRETO e CAMINHO.irmao.dir.cor == PRETO então");
    code::begin();
        code::l("CAMINHO.irmao.cor := VERMELHO;","Altera a cor do nó-irmão para vermelha");
        code::l("Desempilha(CAMINHO);","Remove o nó-removido do caminho");
        code::l();
        code::l("caso1_remocao(CAMINHO);","Verificação segue para o Caso 1, a partir do nó-pai");
    code::end();
    code::l("Senão");
    code::begin();
        code::l("caso4_remocao(CAMINHO);","Verificação segue para o Caso 4");
    code::end();
code::write();

//CASO 4
code::initFunction("caso4_remocao(CAMINHO)");
    code::l("Se CAMINHO.pai.cor == VERMELHO e CAMINHO.irmao != nulo e CAMINHO.irmao.cor == PRETO e CAMINHO.irmao.esq.cor == PRETO e CAMINHO.irmao.dir.cor == PRETO então");
    code::begin();
        code::l("CAMINHO.irmao.cor := VERMELHO;","Altera a cor do nó-irmão para vermelha");
        code::l("CAMINHO.pai.cor := PRETO;","Altera a cor do nó-pai para preta");
    code::end();
    code::l("Senão");
    code::begin();
        code::l("caso5_remocao(CAMINHO);","Verificação segue para o Caso 5");
    code::end();
code::write();

//CASO 5
code::initFunction("caso5_remocao(CAMINHO)");
    code::l("Se CAMINHO.irmao != nulo e CAMINHO.irmao.cor == PRETO então","Se a cor do nó-irmão for vermelha");
    code::begin();
        code::l("Se ehFilhoESQUERDO(CAMINHO.pai,CAMINHO.no) e CAMINHO.irmao.dir.cor == PRETO e CAMINHO.irmao.esq.cor == VERMELHO então ");
        code::begin();
            code::l("CAMINHO.irmao.cor = VERMELHO;","Altera a cor do nó-irmão para vermelha");
            code::l("CAMINHO.irmao.esq.cor = PRETO;","Altera a cor do nó-filho a esquerda do nó-irmão para preta");
            code::l("RotacaoADireita(CAMINHO.pai,CAMINHO.irmao);","Realiza a rotação a direita no nó-irmão");
        code::end();
        code::l("Se ehFilhoDIREITO(CAMINHO.pai,CAMINHO.no) e CAMINHO.irmao.esq.cor == PRETO e CAMINHO.irmao.dir.cor == VERMELHO então");
        code::begin();
            code::l("CAMINHO.irmao.cor = VERMELHO;","Altera a cor do nó-irmão para vermelha");
            code::l("CAMINHO.irmao.dir.cor = PRETO;","Altera a cor do nó-filho a direita do nó-irmão para preta");
            code::l("RotacaoAEsquerda(CAMINHO.pai,CAMINHO.irmao);","Realiza a rotação a esquerda no nó-irmão");
        code::end();
    code::end();
    
    code::l("caso6_remocao(CAMINHO);","Verificação segue para o Caso 6");
code::write();

//CASO 6
code::initFunction("caso6_remocao(CAMINHO)");
    code::l("CAMINHO.irmao.cor = CAMINHO.pai.cor;","Altera a cor do nó-irmão para cor do nó-pai");
    code::l("CAMINHo.pai.cor = PRETO;","Altera a cor do nó-pai para preta");
    code::l();
    code::l("Se CAMINHO.irmao != nulo então","Se possuir um nó-irmão");
    code::begin();
        code::l("Se ehFilhoESQUERDO(CAMINHO.pai,CAMINHO.no) então","Se o nó removido estiver a esquerda do nó-pai");
        code::begin();
            code::l("CAMINHO.irmao.dir.cor = PRETO;","Altera a cor do nó-filho a direita do nó-irmão para preta");
            code::l("RotacaoAEsquerda(CAMINHO.avo,CAMINHO.pai);","Realiza rotação a esquerda do nó-pai");
        code::end();
        code::l("Senão");
        code::begin();
            code::l("CAMINHO.irmao.esq.cor = PRETO;","Altera a cor do nó-filho a esquerda do nó-irmão para preta");
            code::l("RotacaoADireita(CAMINHO.avo,CAMINHO.pai);","Realiza rotação a direita do nó-pai");
        code::end();
    code::end();
code::write();

//FILHO ESQUERDO
code::initFunction("ehFilhoESQUERDO(PAI,FILHO)");
    code::l("Retornar PAI.esq == FILHO;","Verificando se o nó-filho está a esquerda do nó-pai");
code::write();

//FILHO DIREITO
code::initFunction("ehFilhoDIREITO(PAI,FILHO)","Verificando se o nó-filho está a direita do nó-pai");
    code::l("Retornar PAI.dir == FILHO;");
code::write();

//ROTAÇÃO ESQUERDA
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

//ROTAÇÃO DIREITA
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


//IRMAO
code::initFunction("irmao(CAMINHO)");
    code::l("Se CAMINHO.pai.dir == no");
    code::begin();
        code::l("return CAMINHO.pai.esq;");
    code::end();
    code::l("Senão ");
    code::begin();
        code::l("return CAMINHO.pai.dir;");
    code::end();
code::write();

?>