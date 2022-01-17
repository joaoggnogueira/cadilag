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

code::l("indice : inteiro;", "Declarando índice");
code::l("indice := Hash(INFO);", "Calculando hash da palavra info");
code::l("Se TabelaHash[indice] == nulo então","Caso nada foi alocado na posição");
code::begin();
    code::l("TabelaHash[indice] := alocar();", "Alocando o novo elemento");
    code::l("TabelaHash[indice].info := INFO;", "Definindo o valor do elemento");
    code::l("TabelaHash[indice].proximo := -1;", "Definindo o valor do próximo elemento");  
code::end();
code::l("Senão se DISP != -1 então", "Caso existir algo alocado na posição, e possuir espaço na Área de Overflow");
code::begin();
    code::l("Se TabelaHash[indice].proximo == -1 então","Se a posição não possuir uma lista na Área de Overflow");
    code::begin();
        code::l("TabelaHash[indice].prox := DISP;","Próximo elemento definido para o índice disponível na Área de Overflow");
    code::end();
    code::l("Senão","Se a posição já possuir uma lista na Área de Overflow");
    code::begin();
        code::l("leitor : inteiro;","Declarando nova variável para varredura");
        code::l("leitor := TabelaHash[indice].proximo;","Varredura inicia no primeiro elemento na lista na Área de Overflow");
        code::l("Enquanto AreaDeOverflow[leitor].prox != -1 faça","Enquanto a varredura não chegar no último elemento da lista na Área de Overflow");
        code::begin();
            code::l("leitor := AreaDeOverflow[leitor].prox;","Varredura avança para a próximo posição na lista na Área de Overflow");
        code::end();
        code::l("AreaDeOverflow[leitor].proximo := DISP;","Último elemento da varredura aponta o índice disponível");
    code::end();
    code::l();
    code::l("aux : inteiro;","Declarando variável auxiliar");
    code::l("aux := AreaDeOverflow[DISP].proximo;","Armazenando o próximo ínidice disponível na Área de Overflow");
    code::l("AreaDeOverflow[DISP].info := INFO;","Definindo o valor do novo elemento");
    code::l("AreaDeOverflow[DISP].proximo := -1;","Definindo novo elemento como fim da lista");
    code::l("DISP = aux;","Índice dísponível para a próxima posição na Área de Overflow");
code::end();
code::l("Senão","Caso existir algo alocado na posição, e não possuir mais espaço na Área de Overflow");
code::begin();
    code::l("TabelaHash[indice].info := INFO;","Ocorre colisão, e altera-se o valor da primeira posição");
code::end();
code::write();
generateHashCode();
