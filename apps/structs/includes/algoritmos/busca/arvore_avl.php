<?PHP 
code::init();
code::initFunction("Busca(INFO,ArvoreNo)","Se o valor está na Árvore");

code::l("Se ArvoreNo != nulo então","Se o nó for diferente de nulo continua pesquisa");
code::begin();
    code::l("Se ArvoreNo.info > INFO então", 'Se o nó possuir valor maior que o pesquisado');
    code::begin();
        code::l("Busca(INFO,ArvoreNo.esquerda);",'Continua pesquisa recursiva a esquerda');
    code::end();
    code::l("Senão se ArvoreNo.info < INFO então", 'Se o nó possuir valor menor que o pesquisado');
    code::begin();
        code::l("Busca(INFO,ArvoreNo.direita);", 'Continua pesquisa recursiva a direita');
    code::end();
    code::l("Senão", 'O valor já está contido na árvore');
    code::begin();
        code::l("Retornar Verdadeiro;", "Retorna verdadeiro pois elemento foi encontrado");
    code::end();
code::end();
code::l("Senão", "Caso o nó for nulo");
code::begin();
    code::l("Retornar Falso;","Retorna falso pois elemento não foi encontrado");
code::end();

code::write();
