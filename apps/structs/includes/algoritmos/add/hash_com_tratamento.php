<?PHP

function generateHashCode() {
    
    code::initFunction("Hash(INFO)", "O índice do respectivo valor");
    
    code::l("soma,total : inteiro;", "Declarando variáveis");
    code::l("soma := 0;", "Inicializando a soma");
    code::l("total := INFO.comprimento;", "total recebe o tamanho da palavra");
    code::l();
    code::l("Para i de 0 até total passo 1 faça", "Percorrendo cada letra da palavra");
    code::begin();
        code::l("soma := soma + (i+1)*INFO.caracter(i);", "Info.caracter retorna a posição (do tipo inteiro) na tabela ASCII");
    code::end();
    code::l("soma := soma%TAMANHO_DA_TABELA;","Recuperando resto da divisão, limitando o resultado entre 0 e o tamanho total da tabela Hash");
    code::l("Retornar soma;","Retornando um valor entre 0 e o tamanho total da tabela Hash correspondente a entrada");
    code::write();
}


code::init();

code::initFunction("Insere(INFO)");

code::l("novo : EstruturaLista;", "Declarando o novo elemento");
code::l("novo := alocar();", "Alocando o novo elemento");
code::l("novo.info := INFO;", "Definindo valor do novo elemento");
code::l("novo.proximo := nulo;", "Definindo próximo como nulo");
code::l("ind : inteiro;", "Declarando índice para armazenar resultado da função HASH");
code::l("ind := Hash(INFO);", "Calculando a função HASH para o valor de INFO");
code::l();
code::l("Se TabelaHash[ind] == nulo então", "Verificando se a lista está vazia");
code::begin();
    code::l("TabelaHash[ind] := novo;", "Lista recebe novo elemento");
code::end();
code::l("Senão", "Caso a lista não estiver vazia");
code::begin();
    code::l("leitor, anterior : EstruturaLista;", "Declarando cursores para leitura");
    code::l("leitor := TabelaHash[ind];", "Posicionando cursor 'leitor' no início da lista");
    code::l();
    code::l("Enquanto leitor != nulo e leitor.info <= INFO faça", "Percorrendo elementos da lista com valores menores ao pesquisado");
    code::begin();
        code::l("anterior := leitor;", "Cursor 'anterior' aponta para o atual elemento da leitura");
        code::l("leitor := leitor.proximo;", "Cursor 'leitor' aponta para o próximo elemento da leitura");
    code::end();
    code::l();
    code::l("Se leitor != nulo então", "Inserindo numa posição diferente da última");
    code::begin();
        code::l("Se anterior != nulo então", "Inserindo em posição intermediária");
        code::begin();
            code::l("novo.proximo := leitor;", false);
            code::l("anterior.proximo := novo;", false);
        code::end();
        code::l("Senão", "Inserindo na primeira posição");
        code::begin();
            code::l("novo.proximo := TabelaHash[ind];", false);
            code::l("TabelaHash[ind] := novo;", false);        
        code::end();
    code::end();
    code::l("Senão", "Inserindo na última posição");
    code::begin();
        code::l("anterior.proximo := novo;", false);
    code::end();
code::end();

code::write();
generateHashCode();
