<?PHP
if (!defined("OB_GET")) {
    exit("Não é possível acessar o script diretamente");
}

if(count($data)>5){
    
}
$count = 0;
?>

<div class="notify-tab">
    <span class="arrow"></span>
    <div class="title">Notificações</div>
    <div class="subtitle">Mais recentes</div>
    <ul>
        <?PHP 
            foreach ($data as $key => $row): 
            $count++;
            if($count>5){
                ?><a href="./notifacoes.php">Mostrar mais</a><?PHP
                break;
            }
        ?>
        <li onclick="window.notify.openNotify(<?= $row['id'] ?>)">
            <a class='anotify' href="#notify" title="<?=  utf8_encode($row['title']) ?>">
                <?PHP if($row['visto']==="0") { ?>
                    <i class="fa fa-envelope"></i>
                <?PHP } else { ?>
                    <i class="fa fa-envelope-open"></i>
                <?PHP } ?>
                <div class="content-notify"><?=  utf8_encode($row['title']) ?></div>
                <div class="data-notify"><?= date("d/m/Y", strtotime($row['data'])) ?></div>
            </a>
        </li>
        <?PHP 
            endforeach; 
        ?>
    </ul>
</div>