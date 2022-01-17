<?PHP
code::init();
code::initFunction("busca(INFO)", "Se o valor está na pilha");

code::l("leitor : NoPilha;","Declarando um cursor");
code::l("leitor := Topo;","Cursor aponta para o Topo");
code::l();
code::l("Enquanto leitor != nulo faça","Percorrendo cada elemento da Pilha");
code::begin();
    code::l("Se leitor.info == INFO então", "Caso o elemento for encontrado");
    code::begin();
        code::l("Retornar Verdadeiro;",false);
    code::end();
    code::l("leitor := leitor.proximo;");
code::end();
code::l("Retornar Falso","Elemento não encontrado");
code::write();
