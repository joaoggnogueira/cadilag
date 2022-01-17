<div class = "material" onclick = "openMaterial(<?= $material->getId() ?>, this)">
    <div class = "columnntitulo"><?= $material->getTitulo() ?></div>
    <div class="columnndata"><?= $material->getDataFormatada() ?></div>
    <div class="columnnhora"><?= $material->getHoraMinimizada() ?></div>
</div>