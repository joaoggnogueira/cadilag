<?PHP
code::init();
code::initFunction("Busca(INFO)", "Se o valor está na Fila");

code::l("Se total != 0 então");
code::begin();
    code::l("i : inteiro;","Declarando variável para iteração");
    code::l("i := inicio;","Defindo a variável no inicio da Fila");
    code::l();
    code::l("Se Fila[i] == INFO então");
    code::begin();
        code::l("Retornar Verdadeiro;","retornando a distancia com o primeiro elemento");
    code::end();
    code::l("Senão");
    code::begin();
        code::l("i := (i + 1) mod MAX;","Indice incrementa uma posição");
        code::l("Enquanto i != fim faça", "Percorrendo cada indice da Fila");
        code::begin();
            code::l("Se Fila[i] == INFO então", "Caso o valor for igual ao pesquisado");
            code::begin();
                code::l("Retornar Verdadeiro;","retornando a distancia com o primeiro elemento");
            code::end();
            code::l("i := (i + 1) mod MAX;","Indice incrementa uma posição");
        code::end();
    code::end();
code::end();
code::l("Retornar Falso;","O elemento não foi encontrado");
code::write();