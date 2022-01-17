<?PHP 
code::init();
code::initFunction("Busca(Palavra)","Se o valor está na Árvore");

code::l("leitor : NoTrie;","Declarando variável para percorrer a estrutura em busca da palavra");
code::l("ind, max : inteiro;","Declarando variáveis auxiliares para a varredura");
code::l("leitor := RAIZ;","Varredura inicia na raiz da Árvore");
code::l("ind := 0;","Inicializando a variável auxiliar");
code::l("max := Palavra.length - 1;","Definindo a variável auxiliar");
code::l();
code::l("Enquanto leitor != nulo faça","Percorrendo a estrutura em busca da palavra");
code::begin();
    code::l("Se leitor.info < Palavra[ind] então","Se a letra do nó for diferente da letra esperada da palavra");
    code::begin();
        code::l("leitor := leitor.direita;","Varredura continua para o nó a direita");
    code::end();
    code::l("Senão se leitor.info == Palavra[ind] então","Se a letra do nó for igual a letra esperada da palavra");
    code::begin();
        code::l("Se ind == max então");
        code::begin();
            code::l("Retornar leitor.fim;","Retorna se o nó é o final de uma palavra");
        code::end();
        code::l("leitor := leitor.abaixo;","Varredura continua para o nó abaixo");
        code::l("ind := ind + 1;","Varredura avança para a próxima letra de palavra");
    code::end();
code::end();
code::l();
code::l("Retornar Falso;","Retorna falso pois a Palavra não foi encontrada");
code::write();
