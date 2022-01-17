<?PHP
    if (! defined('STRUCTVIEW')) {
        exit('No direct script access allowed');
    }
?>
<li id="add-li"><button title="Inserir" class="lockable mobile" id="add"></button></li>
<li id="remove-li"><button title="Remover" class="lockable mobile" id="remove"></button></li>
<li id="search-li"><button title="Buscar" class="lockable mobile" id="search"></button></li>
<li><button style="display: none" onclick="UI.stop()" id="stop">Pausar</button></li>
<li><button style="display: none" onclick="UI.resume()" id="resume">Continuar</button></li>
<li><button style="display: none" onclick="UI.next()" id="step">Próxima Instrução</button></li>