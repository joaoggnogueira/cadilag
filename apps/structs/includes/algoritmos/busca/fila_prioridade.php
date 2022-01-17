<?PHP
code::init();
code::initFunction("Busca(INFO)", "Retorna a posição de saída");

code::l("leitor : NoFila;", "Declarando um cursor");
code::l("posicao : inteiro;", "Declarando variável de retorno");
code::l("leitor := Fila.ini;", "Cursor aponta para o fim da fila");
code::l("posicao := 0;", "Inicializando variável de retorno");
code::l();
code::l("Enquanto leitor != null então", "Percorrendo elementos da fila");
code::begin();
    code::l("Se leitor.info == INFO então", "Caso o elemento possuir um valor igual ao procurado");
    code::begin();
        code::l("Retornar posicao;", "Retornar a distancia com o fim da fila");
    code::end();
    code::l("leitor := leitor.proximo;", "Cursor aponta para o proximo elemento");
    code::l("posicao := posicao  + 1;", "Incrementando a posição");
code::end();
code::l("Retornar -1;", "Retorna caso não foi encontrado");

code::write();
