<?PHP
session_start();
$nameestrutura = 'Grafos<br/>';
$name_struct = '../graphs/index.php';
include '../LoadVar.php';
?>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="UTF-8" /> 
        <link href="../../images/cadilag.svg" rel="shortcut icon"/>
        <title>Grafos - Cadilag</title>
        <script src="../../js/jquery.min.js"></script>
        <script src="../../js/jquery-ui.min.js"></script>
        <script src='../../js/jquery.tipsy.js' type='text/javascript'></script>
        <script src="../../js/sweetalert.min.js"></script>
        <script src="./javascripts/jquery.contextMenu.min.js"></script>
        <script src="./javascripts/jsplumb.js"></script>
        <script src="./javascripts/LookAndFeels/postLook.js"></script>
        <script src="./javascripts/factory.js"></script>
        <script src="./javascripts/ui.js"></script>
        <script src="./javascripts/jquery.cookie.js"></script>
        <script src="./javascripts/persistencia.js"></script>
        <script src="./javascripts/matrix.js"></script>
        <script src="./javascripts/CadilagApps.js"></script>
        <script src="./javascripts/algoritmos.js"></script>
        <link href='./stylesheets/tipsy.css' rel='stylesheet'/>
        <link href="../../css/request.css" rel="stylesheet"/>
        <link href='../../css/sweetalert.css' rel='stylesheet'/>
        <link href="../../css/font-awesome.min.css" rel="stylesheet"/>
        <!--Area destinada para LookAndFeel e Script da Estrutura-->
        <link rel="stylesheet" href="./stylesheets/pure.css">
        <link rel="stylesheet" href="./stylesheets/jquery.contextMenu.css">
        <link rel="stylesheet" href="./stylesheets/default.css">
        <script src="./javascripts/app.js"></script>
        <script src="./javascripts/LookAndFeels/appLook.js"></script>

    </head>
    <body class="withGrid">
        <div id="topbar">
            <ul class="cssmenu">
                <?PHP include './includes/navbar.php'; ?>
            </ul>
            <?PHP include './includes/UserMenu.php'; ?>
        </div>
        <?PHP
        include './includes/workspace.php';
        include './includes/sidebar.php';
        ?>
        <script>
            document.body.onload = function(){
                Persistencia.carregarRascunho();
            };
        </script>
    </body>
</html>