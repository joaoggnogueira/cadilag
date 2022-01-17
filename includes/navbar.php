<?php
if (!isset($prefix_navbar)) {
    $prefix_navbar = "./";
}

$thispage = basename($_SERVER['PHP_SELF']);
$pages = array(
    array(
        'title' => 'Principal',
        'href' => 'profile.php'
    ), array(
        'title' => 'Meus Tópcos',
        'href' => 'topicos.php'
    ), array(
        'title' => 'Editar Perfil',
        'href' => 'editprofile.php'
    ), array(
        'title' => 'Arquivos',
        'href' => 'arquivos.php'
    ), array(
        'title' => 'Turma',
        'href' => 'class.php'
    ), array(
        'title' => 'Estruturas',
        'href' => 'apps/structs/index.php'
    )
)
?>
<div id='huboptions' style="display:none;">
    <?PHP
    foreach ($pages as $page):
        if ($page['href'] != $thispage):
            ?> <a class='option' href="<?=$prefix_navbar . $page['href'] ?>"><?= $page['title'] ?></a> <?PHP
        endif;
    endforeach;
    ?>
    <a class='option' href="#" onclick="quit()">Sair</a>
</div>
<script async>
    (function () {
        document.getElementById("gotohub").addEventListener("click",function(){
            var tab = document.getElementById("huboptions");
            if(tab.style.display === "block"){
                 tab.style.display = "none";
            } else {
                 tab.style.display = "block";
            };
        });
    })();

    function quit() {
        swal({
            title: "Continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Encerrar Sessão",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        },
        function () {
            localStorage.setItem('emailCadilag', null);
            localStorage.setItem('senhaCadilag', null);
            window.location = '<?= $prefix_navbar ?>closesession.php';
        });

    }
</script>