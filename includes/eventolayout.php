<?PHP if($isAluno): ?> 
    <li>
        <div class="descricao">"<?= $evento->getTitulo() ?>" em <?= $evento->getDataFormatada() ?></div>
    </li> 
<?PHP else:?>
    <li>
        <div class="remove" onclick="removeEvent(<?= $evento->getId() ?>,this)"></div>
        <div class="descricao">"<?= $evento->getTitulo() ?>" em <?= $evento->getDataFormatada() ?></div>
    </li> 
<?PHP endif; ?>
