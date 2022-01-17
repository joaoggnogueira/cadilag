<?PHP 
code::init();
code::initFunction("Busca(Linha,Coluna)","O valor linha i e coluna j");

code::l("leitor : NoLista;","Declarando variável para leitura");
code::l("leitor := Linhas[Linha];","Posicionando leitor no início da lista");
code::l();
code::l("Enquanto leitor != nulo então","Percorrendo cada coluna que intercepta a linha");
code::begin();
    code::l("Se leitor.coluna == Coluna então","Se a coluna atual for igual a da busca");
    code::begin();
        code::l("Retornar leitor.info;","Retorna o valor da parâmetro encontrado");
    code::end();
    code::l("leitor := leitor.direita;","Leitor aponta para a próxima coluna que intercepta a linha");
code::end();
code::l("Retornar nulo;","Retorna nulo em caso do parâmetro não ser encontrado");

code::write();