<?php
if (!defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
$thispage = basename($_SERVER['PHP_SELF']);
$pages = array(
    array('class'=>"select-struture-img",'title' => 'Listagem', 'href' => 'index.php', 'icon' => '../../images/hierarchical-structure.svg'),
    array('class'=>"entradas-programadas-img",'title' => 'Entradas Programadas', 'href' => 'entradaProgramadas.php', 'icon' => '../../images/multiple-users-silhouette.svg'),
    array('class'=>"coding-img",'title' => 'Códigos', 'href' => 'codigos.php', 'icon' => '../../images/coding.svg')
    )
?>
<table id="menu">
    <tr><td><a href="../../profile.php"><button class="buttonW back-img">Área Colaborativa</button></a></td></tr>
    <tr><th>Estruturas</th></tr>
    <?PHP foreach ($pages as $page):
        ?>
        <tr><td><a href="./<?= $page['href'] ?>"><button class="buttonW <?= $page['class']." ".($thispage === $page['href'] ? "selected" : "") ?>"><?= $page['title'] ?></button></a></td></tr>
    <?PHP endforeach; ?>
</table>