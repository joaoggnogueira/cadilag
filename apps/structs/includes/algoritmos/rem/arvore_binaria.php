<?PHP 
code::init();
code::initFunction("Remove(INFO,ArvoreNo)");

code::l("Se ArvoreNo != nulo e ArvoreNo.info != INFO então","Se o nó for diferente de nulo e possuir valor diferente do pesquisado continua pesquisando");
code::begin();
    code::l("Se ArvoreNo.info < INFO então", 'Se o nó possuir valor menor que o pesquisado');
    code::begin();
        code::l("Remove(INFO,ArvoreNo.direita);", 'Continua pesquisa recursiva a direita');
    code::end();
    code::l("Senão se ArvoreNo.info > INFO então", 'Se o nó possuir valor maior que o pesquisado');
    code::begin();
        code::l("Remove(INFO,ArvoreNo.esquerda);",'Continua pesquisa recursiva a esquerda');
    code::end();
code::end();
code::l("Senão se ArvoreNo != nulo então","Se o no for encontrado");
code::begin();
    code::l("Rem : EstruturaArvore;", "Declarando auxiliar");
    code::l("Rem := ArvoreNo;", "Armazenando nó para ser removido");
    code::l();
    code::l("Se ArvoreNo.direita == nulo então", 'Verificando se possui filho a direita');
    code::begin();
        code::l("ArvoreNo := ArvoreNo.esquerda;", "O sucessor será o filho da esquerda");
        
    code::end();
    code::l("Senão se ArvoreNo.esquerda == nulo então",'Verificando se possui filho a esquerda');
    code::begin();
        code::l("ArvoreNo := ArvoreNo.direita;", "O sucessor será o filho da direita");
    code::end();
    code::l("Senão", 'Caso possua filho em ambos lados');
    code::begin();
        code::l("Sucessor : EstruturaArvore;", "Declarando cursor para pesquisa do sucessor");
        code::l("Sucessor := ArvoreNo.direita;", "Posicionando cursor a direita do elemento encontrado");
        code::l();
        code::l("Enquanto Sucessor.esquerda != nulo faça", "Seguindo sempre a esquerda");
        code::begin();
            code::l("Sucessor := Sucessor.esquerda;", "Cursor 'sucessor' aponta para o filho a esquerda");
        code::end();
        code::l();
        code::l("ArvoreNo.info := Sucessor.info;", "Trocando valor com o do sucessor");
        code::l("Sucessor := Sucessor.direita;");
        code::l("Rem := Sucessor;", "Definindo o elemento a ser removido");
    code::end();
    code::l();
    code::l("Liberar(Rem);","Liberando a memória");
code::end();

code::write();
