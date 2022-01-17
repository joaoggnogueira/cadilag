<?PHP

code::init();

code::initFunction("Busca(INFO)", "Se o valor está na Tabela");

code::l("indice : inteiro;", "Declarando índice para armazenar resultado da função HASH");
code::l("leitor : EstruturaLista;", "Declarando o cursor");
code::l("indice := Hash(INFO);", "Calculando a função HASH");
code::l();
code::l("Se TabelaHash[indice] != nulo então","Se possui elemento alocado na posição");
code::begin();
    code::l("Se TabelaHash[indice].info == INFO então","Se o valor do elemento for igual ao pesquisado");
    code::begin();
        code::l("Retornar Verdadeiro;","O elmento está inserido na Tabela");
    code::end();
    code::l("Senão","Se o valor do elemento não for igual ao pesquisado");
    code::begin();
        code::l("leitor : inteiro;","Declara variável para varredura na Área de Overflow");
        code::l("leitor := TabelaHash[indice].proximo;","Varredura inicia no ínicio da lista na Área de Overflow");
        code::l("Enquanto leitor != -1 faça");
        code::begin();
            code::l("Se AreaDeOverflow[leitor].info == INFO então", "Verificando se valor do elemento atual é igual ao pesquisado");
            code::begin();
                code::l("Retornar Verdadeiro;","O elmento está inserido na Área de Overflow");
            code::end();
            code::l("leitor := AreaDeOverflow[leitor].proximo;","Varredura continua para o proximo elemento na lista");
        code::end();
    code::end();
code::end();
code::l("Retornar Falso;","O elmento não está inserido na Tabela");
code::write();
generateHashCode();

