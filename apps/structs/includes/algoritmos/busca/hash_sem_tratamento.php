<?PHP

code::init();

code::initFunction("Busca(INFO)","Se o valor está na tabela");

code::l("indice : inteiro;", "Declarando índice");
code::l("indice := Hash(INFO);", "Calculando hash da palavra info");
code::l("Se TabelaHash[indice] != nulo e TabelaHash[indice] == INFO então", "Verificando se existe algo diferente de nulo na posição 'indice' da tabela Hash e se o valor é igual ao pesquisado");
code::begin();
    code::l("Retornar Verdadeiro;", "O elemento foi encontrado");
code::end();
code::l("Retornar Falso;", "O elemento não foi encontrado");

code::write();
generateHashCode();

