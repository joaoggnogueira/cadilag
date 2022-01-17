<?PHP 
$texto_topico = preg_replace("/\t/","&nbsp&nbsp&nbsp&nbsp",nl2br($resposta->getTexto()));

if(!function_exists("linkCallback")){
    function linkCallback($match){
        return "<a style='color:white;' href='$match[0]'>$match[0]</a>";
    }
}

$texto_topico = preg_replace_callback('#\bhttps?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))#', 'linkCallback', $texto_topico);
try { ?>
    <div class="resposta" id="<?= $resposta->getId() ?>" <?= ($controlador->getUserId() === $resposta->getUserId() ? ' editable="editable"' : '') ?>>
        <div class="vote" <?= ((int) $resposta->getUserId() === (int) $controlador->getUserId() ? 'disabled="disabled"' : '') ?> >
            <?PHP if ($resposta->getVoto() !== null): ?>
                <div title="Votar Positivo" class="up" <?= ($resposta->getVoto() ? 'voted="voted"' : '') ?> ><p><?= $resposta->getVotosPositivos() ?></p></div>
                <div title="Votar Negativo" class="down" <?= (!$resposta->getVoto() ? 'voted="voted"' : '') ?>><p><?= $resposta->getVotosNegativos() ?></p></div>
            <?PHP else: ?>
                <div title="Votar Positivo" class="up"><?= $resposta->getVotosPositivos() ?></div>
                <div title="Votar Negativo" class="down"><?= $resposta->getVotosNegativos() ?></div>
            <?PHP endif; ?>
        </div>
        <div class="info">
            <table class="userlabel">
                <tr>
                    <td>
                        <img src="<?= $resposta->getUserImage() ?>" alt="foto do auto da resposta" width="50" height="50"/>
                    </td>
                    <td>
                        <div class="title">
                            <?= ($resposta->getUserId() == $controlador->getUserId()) ? "Você" : $controlador->getMinimalTitleNameBy($resposta->getUserNome(), $resposta->getUserSobrenome(), $resposta->getUserApelido(), $resposta->getUserEmail()); ?>
                        </div>
                    </td>
                </tr>
            </table>
            <?PHP if ($controlador->getUserId() === $resposta->getUserId()): ?>
                <button onclick="editarResposta(<?= $resposta->getId() ?>)" class="pure-button editbtn" >Editar</button>
                <button onclick="removeResposta(<?= $resposta->getId() ?>)" class="pure-button deletebtn">Remover</button>
            <?PHP endif; ?>
        </div>
        <div class="text"><?= $texto_topico ?></div>
        <div class="data"><?= $resposta->getDataFormatada() ?> ás <?= $resposta->getHora() ?></div>                            
    </div>
    <?PHP
} catch (Exception $e) {
    echo $e;
}

