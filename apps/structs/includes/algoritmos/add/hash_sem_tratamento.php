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
code::l("TabelaHash[indice] := INFO;", "Array recebe 'INFO' na posição calculada");

code::write();
generateHashCode();
