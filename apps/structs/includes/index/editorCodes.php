<?php
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
?>
<tr><th><div class="thead title-prm">Seus Códigos</div></th></tr>
<?PHP
$empty = true;
foreach ($estruturas as $estrutura):
    $listaCode = $controladorCode->listOwnCodes($estrutura->getId());
    if (count($listaCode)):
        $empty = false;
        ?>
        <tr>
            <th>
                <div class="thead title-scn"><?= $estrutura->getNome() ?> ></div>
            </th>
            <td>
                <div class="title"><b><?= count($listaCode) ?></b> código(s) salvo(s)</div>
                <ul class="list">
                    <?PHP foreach ($listaCode as $code): ?>
                        <li class="card">
                            <div class="head">
                                <?= $code->getRotulo(); ?>
                            </div>
                            <table class="body">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p>Em <b class='language'><?= $code->getLinguagem() ?></b></p>
                                        </td>
                                        <td class="small">
                                            <p><small class='time'><?= $code->getData() ?></small></p>
                                            <p><small class='date'><?= $code->getHora() ?></small></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button class="optionCode edit" onclick="editCode(<?= $code->getId() ?>, this,<?= $estrutura->getId() ?>)">Editar</button>
                                        </td>
                                        <td>
                                            <button class="optionCode delete" onclick="deleteCode(<?= $code->getId() ?>, this)">Deletar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </li>
                        <?PHP
                    endforeach;
                ?></ul>
            </td>
        </tr>
        <?PHP
    endif;
endforeach;
if($empty):
    ?><tr><td id="empty">Vazio</td></tr><?PHP
endif;
?>