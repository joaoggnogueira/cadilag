<?php 

code::init();
code::initFunction("Busca(INFO)");

//BUSCA
code::l("leitor : NoRN;","Declarando variável para percorrer a Árvore");

code::l("leitor := RAIZ;","Inicializando a verredura na raiz a Árvore");
code::l();
code::l("Enquanto leitor != nulo faça","Enquanto o leitor não for nulo");
code::begin();
    code::l("Se leitor.info < INFO então","Se o valor do nó for menor que o valor a ser pesquisado");
    code::begin();
        code::l("leitor := leitor.dir;","Varredura continua a direita");
    code::end();
    code::l("Senão se leitor.info > INFO então","Se o valor do nó for maior que o valor a ser pesquisado");
    code::begin();
        code::l("leitor := leitor.esq;","Varredura continua a esquerda");
    code::end();
    code::l("Senão se leitor.info == INFO então","Se o valor do nó for igual que o valor a ser pesquisado");
    code::begin();
        code::l("Retornar Verdadeiro;","Varredura encerrada e elemento foi encontrado");
    code::end();
code::end();
code::l();
code::l("Retornar Falso;","Varredura encerrada pois elemento não foi encontrado");
code::write();
?>