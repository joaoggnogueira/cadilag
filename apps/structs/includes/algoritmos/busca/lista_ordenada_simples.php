<?PHP 
code::init();
code::initFunction("Busca(INFO)","Se o valor está na lista");

code::l("leitor : EstruturaLista;","Declarando cursor");
code::l("leitor := Lista;","Inicializando o cursor no primeiro elemento");
code::l();
code::l("Enquanto leitor != nulo e leitor.info <= INFO faça", "Percorrendo lista para encontrar elemento");
code::begin();
    code::l("Se leitor.info == INFO então","Caso o elemento for encontrado");
    code::begin();
        code::l("Retornar Verdadeiro;",false);
    code::end();
    code::l("leitor := leitor.proximo;","Apontando para o próximo elemento");
code::end();
code::l();
code::l("Retornar Falso",false);

code::write();
		