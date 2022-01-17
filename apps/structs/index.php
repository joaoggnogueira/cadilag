<?PHP
session_start();
include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
$controlador = new ControladorUsuario();

if (isset($_SESSION['email']) && isset($_SESSION['senha'])) {
    $email = $_SESSION['email'];
    $controlador->setUser($email);
    $isAluno = $controlador->ehAluno();
    $acesso_livre = false;
} else {
    $acesso_livre = true;
    $isAluno = true;
}

$imageurl = "../../" . $controlador->getFilteredImage();

$isProfessor = !$isAluno;


$prefix_navbar = "../../";
define('STRUCTVIEW', true);
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <link href="../../images/cadilag.svg" rel="shortcut icon"/>
        <title>Cadilag Estruturas</title>
        <link href="./css/index.css" rel="stylesheet"/>
        <link href="./css/estruturas.css" rel="stylesheet"/>
        <link href="./css/estruturaselectorstyleno-jquery.css" rel="stylesheet"/>
        <link href="../../css/genericstyle.css" rel="stylesheet"/>
        <link href="../../css/request.css" rel="stylesheet"/>
        <link href="../../css/sweetalert.css" rel="stylesheet"/>
        <script src="../../js/jquery.min.js" type='text/javascript'></script>
        <script src="../../js/jquery-ui.min.js" type='text/javascript'></script>
        <script src="../../js/request.js" type='text/javascript'></script>
        <script src='./js/jquery.ui.touch-punch.min.js' type='text/javascript'></script>
        <script src='../../js/sweetalert.min.js' type='text/javascript'></script>
    </head>
    <body>
        <?PHP if (isset($_GET['list'])): ?>
            <script>
                localStorage.setItem('listCadilag', "<?= $_GET['list'] ?>");
            </script>
        <?PHP else: ?>
            <script>
                var listtype = localStorage.getItem('listCadilag');
                if (listtype) {
                    reload({list: listtype});
                } else {
                    localStorage.setItem('listCadilag', "card");
                }
            </script>
        <?PHP endif; ?>
        <div class='topbar'>
            <a href="../../profile.php"><div id="icon"></div></a>
            <div class="subtitle"><h1>Listagem de Estruturas de Dados</h1></div>
            <div id='gotohub'>
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </div>
        </div>
        <div id="sidebar">
            <?PHP
            if ($acesso_livre) {
                ?>
                <table id="menu">
                    <tr><td><a href="../../acesso_livre.php"><button class="buttonW back-img">Área Principal</button></a></td></tr>
                </table>
                <span style="color:white">O <b>acesso sem cadastro</b> permite você acessar parte das ferramentas de simulação de estrutura de dados e grafos. 
                    <br/>Mas não permite acessar a área colaborativa, fórum, pseudocódigos de outros usuários e entradas programadas.</span>
                <?PHP
            } else {
                if ($isAluno) {
                    include '../../controladores/Aluno.php';
                    include '../../controladores/Turma.php';
                    $controlador = $controlador->getAluno();
                    $turma = $controlador->getTurma();
                    include './includes/index/sidebaraluno.php';
                    ?> <div id="history-tab"></div> <?PHP
                } elseif ($isProfessor) {
                    include '../../controladores/Professor.php';

                    $controlador = $controlador->getProfessor();
                    $acesso = $controlador->possuiAcesso();
                    if ($acesso) {
                        include './includes/index/sidebarprofessor.php';
                        ?> <div id="history-tab"></div> <?PHP
                    } else {
                        include './includes/index/sidebarprofessorbloqueado.php';
                    }
                }
            }
            ?>
        </div>
        <?PHP
        include './includes/index/estruturas.php';
        ?>
        <?PHP include '../../includes/navbar.php'; ?>
        <script>
            var browser = '';
            var browserVersion = 0;
            if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Opera';
            } else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                browser = 'MSIE';
            } else if (/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Netscape';
            } else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Chrome';
            } else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Safari';
                /Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
                browserVersion = new Number(RegExp.$1);
            } else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Firefox';
            } else if (/Edge[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                browser = 'Edge';
            }
            if (browserVersion === 0) {
                browserVersion = parseFloat(new Number(RegExp.$1));
            }
            if (browser !== "Firefox" && browser !== "Chrome") {
                swal({title: "Dica", type: "warning", text: "O seu navegador talvez não tenha compatibilidade com os recursos de simulação. Se acontecer algum problema tente utilizar <b>Mozilla Firefox</b> ou <b>Google Chrome</b>!", html: true});
            } else {
                if (browser === "Firefox") {
                    if (browserVersion < 56) {
                        swal({title: "Dica", type: "warning", text: "O seu navegador talvez não tenha compatibilidade com os recursos de simulação. Se acontecer algum problema tente atualizar o FIREFOX (>=56.0)", html: true});
                    }
                } else if (browser === "Chrome") {
                    if (browserVersion < 44) {
                        swal({title: "Dica", type: "warning", text: "O seu navegador talvez não tenha compatibilidade com os recursos de simulação. Se acontecer algum problema tente atualizar o CHROME (>=44.0)", html: true});
                    }
                }
            }

        </script>
    </body>
</html>
