<?PHP

code::init();

code::initFunction("Busca(INFO)", "Se o valor está na Tabela");

code::l("indice : inteiro;", "Declarando índice para armazenar resultado da função HASH");
code::l("leitor : EstruturaLista;", "Declarando o cursor");
code::l("indice := Hash(INFO);", "Calculando a função HASH");
code::l("leitor := TabelaHash[indice];", "Posicionando cursor 'leitor' para o início da lista");
code::l();
code::l("Enquanto leitor != nulo e leitor.info <= INFO faça", "Percorrendo elementos da lista com valores menores ao pesquisado");
code::begin();
    code::l("Se leitor.info == INFO então", "Verificando se valor do elemento atual é igual ao pesquisado");
    code::begin();
        code::l("Retornar Verdadeiro", false);
    code::end();
    code::l("leitor := leitor.proximo;","Cursor 'leitor' aponta para proximo elemento");
code::end();
code::l("Retornar Falso;", false);
code::write();
generateHashCode();

