<?PHP 
code::init();
code::initFunction("Insere(INFO,ArvoreNo)");

code::l("Se ArvoreNo != nulo então","Se o nó for diferente de nulo continua pesquisa");
code::begin();
    code::l("Se ArvoreNo.info > INFO então", 'Se o nó possuir valor maior que o pesquisado');
    code::begin();
        code::l("Insere(INFO,ArvoreNo.esquerda);",'Continua pesquisa recursiva a esquerda');
    code::end();
    code::l("Senão se ArvoreNo.info < INFO então", 'Se o nó possuir valor menor que o pesquisado');
    code::begin();
        code::l("Insere(INFO,ArvoreNo.direita);", 'Continua pesquisa recursiva a direita');
    code::end();
    code::l("Senão", 'O valor já está contido na árvore');
    code::begin();
        code::l("Retornar;", false);
    code::end();
code::end();
code::l("Senão", "Caso o nó for nulo");
code::begin();
    code::l("ArvoreNo := alocar();","Alocando o novo elemento");
    code::l("ArvoreNo.info := INFO;","Definindo o valor do elemento");
    code::l("ArvoreNo.esquerda := nulo;", "Definindo nó a esquerda como nulo");
    code::l("ArvoreNo.direita := nulo;", "Definindo nó a direita como nulo");
code::end();

code::write();