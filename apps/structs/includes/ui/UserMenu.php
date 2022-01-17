<?PHP

if (! defined('STRUCTVIEW')) {
    exit('No direct script access allowed');
}
?>

<ul class="usermenu mobile">
    <li style="margin-left:0px;">
        <div title="Abrir Menu" id="UserDiv">
            <div class="title mobile">
                <p>HUB</p>
            </div>
            <img id='imgUser' title="<?= $controlador->getTitleName(); ?>"  alt='<?= $controlador->getTitleName(); ?>' src='<?= $imageurl ?>'/>
        </div>
    </li>
    <li style="margin-left:0px;">
        <div style="display: none" id="EpRunDiv">
            <div id="counterEp"><p>1/1</p></div>
        </div>
    </li>
</ul>