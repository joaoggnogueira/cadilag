<?php
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
?>
<tr><th><div class="thead title-prm">Entradas Programadas</div></th></tr>
<?PHP
$empty = true;
foreach ($estruturas as $estrutura):
    $listaEp = $controladorEp->listEp($estrutura->getId());
    if (count($listaEp)):
        $empty = false;
        ?>
        <tr>
            <th>
                <div class="thead title-scn"><?= $estrutura->getNome() ?> ></div>
            </th>
            <td>
                <div class="title"><b><?= count($listaEp) ?></b> entradas salvas</div>
                <ul class="list">
                    <?PHP 
                        foreach ($listaEp as $epRow): 
                        $ep = new entidades\EntradaProgramada($epRow);
                        ?>
                        <li class="card">
                            <div class="head">
                                <?= $ep->getRotulo(); ?>
                            </div>
                            <table class="body">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><b class='total'><?= $ep->getTotal() ?></b> entradas</p>
                                        </td>
                                        <td></td>
                                        <td class="small">
                                            <p><small class='time'><?= $ep->getHora() ?></small></p>
                                            <p><small class='date'><?= $ep->getData() ?></small></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button class="optionEp edit" onclick="editEp(<?= $ep->getId() ?>, this, '<?= $ep->getRotulo(); ?>')">Editar</button>
                                        </td>
                                        <td>
                                            <button class="optionEp delete" onclick="deleteEp(<?= $ep->getId() ?>, this)">Deletar</button>
                                        </td>
                                        <td>
                                            <button class="optionEp open" onclick="openEp(<?= $ep->getId() ?>, this,<?= $estrutura->getId() ?>)">Abrir</button>
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
if ($empty):
    ?><tr><td id="empty">Vazio</td></tr><?PHP
endif;
?>