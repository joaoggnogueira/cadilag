<?PHP
code::init();
code::initFunction("Insere ou Enqueue(INFO,Prioridade)");

code::l("novo,leitor,anterior : NoFila;","Declarando novo elemento e cursores");
code::l("novo := alocar();","Alocando o novo elemento");
code::l("novo.info := INFO;","Definindo valor do elemento");
code::l("novo.prioridade := Prioridade;","Definindo a prioridade do elemento");
code::l("novo.proximo := nulo;","Definindo próximo como nulo");
code::l("leitor := Fila.inicio;","Cursor 'leitor' aponta para o inicio da fila");
code::l();
code::l("Enquanto leitor != nulo e leitor.prioridade >= PRIORIDADE então", "Percorrendo elementos da fila para buscar a posição correta");
code::begin();
    code::l("anterior := leitor;", "Cursor 'anterior' aponta para o atual elemento da leitura");
    code::l("leitor := leitor.proximo;", "Cursor 'leitor' aponta para o próximo elemento da leitura");
code::end();
code::l();
code::l("Se leitor != nulo então", "Inserindo numa posição diferente da última");
code::begin();
    code::l("Se anterior == nulo então", "Inserindo na primeira posição");
    code::begin();
        code::l("novo.proximo := Fila.inicio;", false);
        code::l("Fila.inicio := novo;", false);
    code::end();
    code::l("Senão", "Inserindo em posição intermediária");
    code::begin();
        code::l("novo.proximo := leitor;", false);
        code::l("anterior.proximo := novo;", false);
    code::end();
code::end();
code::l("Senão", false);
code::begin();
    code::l("Se anterior == nulo então", "Inserindo o primeiro elemento");
    code::begin();
        code::l("Fila.inicio := novo;", "Novo primeiro elemento da fila");
    code::end();
    code::l("Senão", "Inserindo na última posição");
    code::begin();
        code::l("Fila.fim.proximo := novo;",false);
    code::end();
    code::l("Fila.fim := novo;","Novo elemento é o fim da fila");
code::end();

code::write();