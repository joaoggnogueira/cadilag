<?PHP
code::init(array("counterKeywordBloco" => true));
code::initFunction("Remove() ou Dequeue() ou Shift()", "Retorna o valor da primeira posição");

code::l("retorno : String;", "Declarando variável");
code::l("Se Fila.ini != nulo então","Caso a lista não estiver vazia");
code::begin();
    code::l("Se Fila.inicio == Fila.fim então","Se possuir um unico elemento");
    code::begin();
        code::l("Fila.fim := nulo;", false);
    code::end();
    code::l("Rem : NoFila;","Declarando variável para remoção");
    code::l("Rem := Fila.inicio;",false);
    code::l("retorno := Fila.inicio.info;","Inicializando auxiliar");
    code::l("Fila.inicio := Fila.inicio.proximo;",false);
    code::l("Liberar(Rem);","Desalocando memória");
code::end();
code::l();
code::l("Retornar retorno;", "Retornando valor da primeira posição");
code::write();
