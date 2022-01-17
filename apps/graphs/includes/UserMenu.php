<?PHP

if (! defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
?>

<ul class="usermenu mobile">
    <li>
        <div title="Abrir Menu" id="UserDiv">
            <div class="title mobile">
                <p>HUB</p>
            </div>
            <img id='imgUser' title="<?= $controlador->getTitleName(); ?>"  alt='<?= $controlador->getTitleName(); ?>' src='<?= $imageurl ?>'/>
        </div>
    </li>
</ul>
