<?PHP
code::init();
code::initFunction("Busca(INFO)", "Retorna a posição na fila");
    code::l("Leitor : NoFila;", "Declarando cursor");
    code::l("Leitor := Fila.inicio;", "Cursor 'leitor' aponta para o inicio da Fila");
    code::l("i := 0;", "Inicializando posição");
    code::l();
    code::l("Enquanto Leitor != nulo faça", "Percorrendo elementos da Fila");
    code::begin();
        code::l("Se Leitor.info == INFO então", "Caso o elemento for encontrado");
        code::begin();
            code::l("Retornar i;", "Retornando posição atual");
        code::end();
        code::l("i := i + 1;","Incrementando posição atual");
        code::l("Leitor := Leitor.proximo;","Cursor 'leitor' aponta para o proximo elemento");
    code::end();
    code::l("Retornar -1;","O elemento não encontrado na fila");
code::write();
