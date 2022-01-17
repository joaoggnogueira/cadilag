<?PHP 
code::init();
code::initFunction("Busca(INFO)","A posição na fila");

code::l("Leitor : NoFila;","Declarando variável para leitura");
code::l("Leitor := Fila.inicio;","Leitor posicionado no fim da fila");
code::l("i : inteiro;","Declarando contador para armazenar a atual posição da leitura");
code::l("i := 0;","Inicializando contador");
code::l();
code::l("Enquanto Leitor != nulo faça", "Percorrendo cada elemento da fila, a expressão booliana sempre sera 'Verdadeira'");
code::begin();
    code::l("Se Leitor.info == INFO então", "Caso o valor do elemento atual for igual o da pesquisa");
    code::begin();
        code::l("Retornar i;","Retorna a posição atual na fila");
    code::end();
    code::l("Leitor := Leitor.proximo;", "Leitor avança para o próximo elemento na fila");
    code::l("i := i + 1;", "Contador incrementa uma unidade");
    code::l("Se Leitor == Fila.ini então", "Se a fila voltar ao início a busca termina");
    code::begin();
        code::l("Break","O Laço é quebrado pois toda a fila já foi lida");
    code::end();
code::end();
code::l("Retornar -1;", "Retorna -1, pois o elemento não foi encontrado na lista");

code::write();