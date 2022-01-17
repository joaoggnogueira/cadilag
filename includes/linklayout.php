
<div class="link">
    <img class="icon" alt="Icone" src="<?= $link->getExternalIcon() ?>" height="20"/>
    <a target="_blank" title="Ir para <?= $link->getTitulo() ?>" rel="noopener" href="<?= $link->getUrl() ?>">
        <div class="title"><?= $link->getTitulo() ?></div>
    </a>
    <?PHP if (!defined('CLASSVIEW')): ?>
        <div class="buttonrem" onclick="deletarLink(<?= $link->getId() ?>,this);"></div>
    <?PHP endif; ?>
    <p class="foot">
        <?= substr($link->getExternalTitle(),0,150); ?>
    </p>
</div>
