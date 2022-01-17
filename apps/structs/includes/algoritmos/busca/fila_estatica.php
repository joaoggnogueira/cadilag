<?PHP
code::init();
code::initFunction("Busca(INFO)", "A posição na Fila");

code::l("i : inteiro;","Declarando variável para iteração");
code::l("i := Inicio;","Defindo a variável no inicio da Fila");
code::l();
code::l("Enquanto i != fim faça", "Percorrendo cada indice da Fila");
code::begin();
    code::l("Se Fila[i] == info então", "Caso o valor for igual ao pesquisado");
    code::begin();
        code::l("Retornar (i - Inicio);","retornando a distancia com o primeiro elemento");
    code::end();
    code::l("i := i + 1;","Indice incrementa uma posição");
code::end();
code::l("Retornar -1;","O elemento não foi encontrado");

code::write();