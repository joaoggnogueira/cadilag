<div class="arquivo" onclick="abrirArquivo(<?= $arquivo->getId() ?>,this)">
    <div class="descricao"><?= $arquivo->getFilename() ?></div>
    <div class="data"><?= $arquivo->getDataFormatada() ?></div>
    <div class="hora"><?= $arquivo->getHora() ?></div>                          
</div>