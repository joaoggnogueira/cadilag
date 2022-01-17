<!DOCTYPE html>
<?PHP
session_start();

if (!isset($_SESSION['emailc']) || !isset($_SESSION['senhac']) || !isset($_SESSION['ehAluno']) || !isset($_SESSION['nickname']) || !isset($_SESSION['firstname']) || !isset($_SESSION['lastname'])) {
    header("Location: login.php");
}

$email = $_SESSION['emailc'];
$senha = $_SESSION['senhac'];
$ehAluno = $_SESSION['ehAluno'];
$nickname = $_SESSION['nickname'];
$firstname = $_SESSION['firstname'];
$lastname = $_SESSION['lastname'];
if (isset($_SESSION['facebookbind'])) {
    $facebook = $_SESSION['facebookbind'];
} else {
    $google = false;
}
if (isset($_SESSION['googlebind'])) {
    $google = $_SESSION['googlebind'];
} else {
    $google = false;
}


include './config/Facebook.php';
include './config/Google.php';

use config\Facebook;
use config\Google;
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <title>Confirmar Cadastro</title>
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <link rel="shortcut icon" href="images/cadilag.svg">
        <link rel="stylesheet" href="css/yui.yahooapis.com_pure_0.6.0_pure-min.css"/>
        <link href="css/confirmarCadastrostyle.css" rel="stylesheet"/>
        <link async href="css/sweetalert.css" rel="stylesheet"/>
        <link async href="css/font-awesome.min.css" rel="stylesheet"/>
        <script async src="js/sweetalert.min.js"></script>
        <script src="js/jquery.min.js"></script>
        <script src="js/jquery-ui.min.js"></script>
        <link href="css/request.css" rel="stylesheet"/>
        <script src="js/request.js"></script>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <script src="https://apis.google.com/js/api:client.js"></script>
    </head>
    <body>
        <div class="overlayer-bg"></div>
        <div class="overlayer">
            <div class="details">
                <div class="title">
                    <p>Confirmar Cadastro</p>
                </div>
                <p><label>E-mail: </label><?= $email ?></p>
                <p><label>Nível de Acesso: </label><?= $ehAluno == 'true' ? 'Aluno' : 'Professor' ?></p>
                <p><label>Apelido: </label><?= $nickname != '' ? $nickname : 'Não definido' ?></p>
                <p><label>Primeiro Nome: </label><?= $firstname != '' ? $firstname : 'Não definido' ?></p>
                <p><label>Último Nome: </label><?= $lastname != '' ? $lastname : 'Não definido' ?></p>
                <p style="margin-top: 10px;margin-bottom: 10px" id="gbind" data-onsuccess="checkLoginStateGoogle">
                    <span class="fa fa-google"></span>
                    <span class="col-status">
                        <span class="status"><?= $google ? 'Vinculado' : 'Não Vinculado' ?></span>
                        <span class="status-info"><?= $google ? $google['email'] : 'Clique para fazer login' ?></span>
                    </span>
                </p>
                <p><button class="pure-button confirm" id="confirm">Confirmar</button></p>
            </div>

        </div>
        <div class="loading">
            <p>Carregando<br>...</p>
        </div>
        <form style="display: none" class="pure-form" id="submit">
            <div class="g-recaptcha" data-sitekey="6LfMWCMTAAAAAKosa3Kly65fvko_BmibtrRraAvS"></div>
            <button class="pure-button">Continuar</button>
        </form>

        <script>

            var facebookbind = JSON.parse('<?= json_encode($facebook) ?>');
            var googlebind = JSON.parse('<?= json_encode($google) ?>');
            $(document).ready(function () {

                $(".formconfirm").hide();
                $("form").submit(function (e) {
                    submit(e);
                });

                $("#confirm").click(function () {
                    $(".overlayer").animate({'height': '10px'}, 1000, 'easeOutCubic');
                    $(".overlayer-bg").animate({'height': '0px'}, 1000, 'easeOutCubic');
                    $(".details").animate({'top': '-100px', 'opacity': '0'}, 1000, 'easeOutCubic', function () {
                        $(".details").hide();
                        $(".overlayer-bg").remove();
                        showCodeConfirm();

                    });
                });

                showCodeConfirm = function () {
                    $(".loading").fadeOut(400, function () {
                        $(".loading").remove();
                        $("#submit").fadeIn(400);
//                    submit();
                    });
                };

                submit = function (event) {
                    if (event) {
                        event.preventDefault();
                    }
                    var dataPost = {
                        'facebook': facebookbind,
                        'google': googlebind,
                        'g-recaptcha-response': $("#g-recaptcha-response").val()
                    };

                    post('./request/cadastro/novo.php', function (data) {
                        swal({title: 'Cadastrado', text: 'Você já pode utilizar sua conta'}, function () {
                            redirect('./index.php');
                        });
                    }, dataPost);
                };
            });

        </script>
        <script title="google">

            function checkLoginStateGoogle(googleUser) {
                var profile = googleUser.getBasicProfile();
                post("./request/login/googleAccess.php", function (data) {
                    swal({
                        title: '<span class="fa fa-google"></span>oogle',
                        text: "Parece que você já cadastro com vinculo pelo Google!",
                        confirmButtonColor: "#D66",
                        confirmButtonText: "Entrar",
                        html: true
                    },
                            function () {
                                redirect("./profile.php");
                            });
                }, {id: profile.getId(), email: profile.getEmail()}, {callbackFalse: function () {
                        if (googlebind) {
                            swal({
                                title: '<span class="fa fa-google"></span>oogle',
                                text: "Você poderá acessar rapidamente o Cadilag,\
                                    quando estiver logado na sua conta do Google do email : <b>" + googlebind['email'] + "</b>.\
                                    Não se preocupe, nenhuma informação sua será exibida para outros usuários e nenhum post será publicado!",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Não quero vincular com Google!",
                                cancelButtonText: "OK!",
                                html: true
                            },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            googlebind = false;
                                            $("#fbind .status").html("Não Vinculado");
                                            $("#fbind .status-info").html("Clique para fazer login");
                                        }
                                    });
                        } else {
                            swal({
                                title: '<span class="fa fa-google"></span>oogle',
                                text: "Você poderá acessar rapidamente o Cadilag,\
                                    quando estiver logado na sua conta do Google.\
                                    Não se preocupe, nenhuma informação sua será exibida para outros usuários e nenhum post será publicado!",
                                showCancelButton: true,
                                confirmButtonColor: "#66D",
                                confirmButtonText: "Vincular",
                                cancelButtonText: "Cancelar",
                                html: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    googlebind = {
                                        idGg: profile.getId(),
                                        email: profile.getEmail()
                                    };
                                    $("#gbind .status").html("Vinculado");
                                    $("#gbind .status-info").html(googlebind.email);
                                }
                            });
                        }
                    }, hideFalseMessage: true});
            }

            var googleUser = {};

            var startAppGoogle = function () {
                if (typeof (gapi) !== 'undefined') {
                    gapi.load('auth2', function () {
                        auth2 = gapi.auth2.init({
                            client_id: '<?= Google::$client_id ?>',
                            cookiepolicy: 'single_host_origin'
                        });
                        attachSignin(document.getElementById('gbind'));
                    });
                } else {
                    $("#gbind").hide();
                }
            };

            function attachSignin(element) {
                auth2.attachClickHandler(element, {}, checkLoginStateGoogle, function (error) {
                    alert(JSON.stringify(error, undefined, 2));
                });
            }

        </script>
        <script>startAppGoogle();</script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>

</html>
