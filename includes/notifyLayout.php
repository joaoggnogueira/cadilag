<?PHP
if (!defined("OB_GET")) {
    exit("Não é possível acessar o script diretamente");
}
?>
<div class="notify-dialog-subtitle"><?= date("d/m/Y", strtotime($data['data'])) ?></div>
<div class="notify-dialog">
    <?= utf8_encode($data['html']) ?>
</div>