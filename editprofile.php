<?php
session_start();
if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "./includes/session_expired.php";
    exit();
}

use config\Facebook;
use config\Google;

include './config/Database.php';
include './controladores/ControladorUsuario.php';
include './config/Facebook.php';
include './config/Google.php';
$email = $_SESSION['email'];


$controlador = new ControladorUsuario();
$controlador->setUser($email);
$firstname = $controlador->getFirstname();
$lastname = $controlador->getLastname();
$nickname = $controlador->getNickname();
$userid = $controlador->getUserId();
$allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];

if (isset($_FILES['imagefile'])) {
    $imageFileType = pathinfo(basename($_FILES['imagefile']["name"]), PATHINFO_EXTENSION);
    $target_dir = './temp/' . $controlador->getUserId() . '.' . $imageFileType;
    $sample_image = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($_FILES["imagefile"]["tmp_name"]));
    foreach ($allowedTypes as $type) {
        if (file_exists("temp/" . $userid . "." . $type)) {
            unlink("temp/" . $userid . "." . $type);
        }
    }
    if (move_uploaded_file($_FILES["imagefile"]["tmp_name"], $target_dir)) {
        
    } else {
         ?>
        <script>
            $(document).ready(function(){
                swal({title:"Opss",text:"Houve um erro ao fazer upload da imagem",type:'error'});
            });
        </script>
        <?PHP
    }
    $visibility = '';
    $imageurl = $target_dir;
    $imageprofile = $target_dir;
} else {
    $imageurl = $controlador->getFilteredImageWithoutRand();
    $imageprofile = $imageurl;
    $visibility = 'style="display: none;"';
    $search = false;
    foreach ($allowedTypes as $type) {
        if (file_exists("temp/" . $userid . "." . $type)) {
            $sample_image = "temp/" . $userid . "." . $type;
            $search = true;
        }
    }
    if (!$search) {
        $sample_image = $imageurl;
    } else {
        $imageurl = $sample_image;
    }
}

$facebookId = $controlador->getFacebookId();
$facebookEmail = $controlador->getFacebookEmail();

$googleId = $controlador->getGoogleId();
$googleEmail = $controlador->getGoogleEmail();

if (isset($_GET['highlight'])) {
    $highlight = $_GET['highlight'];
} else {
    $highlight = '';
}
?>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width">
        <meta charset="UTF-8" />
        <meta name="google-signin-client_id" content="<?= Google::$client_id ?>">
        <link rel="shortcut icon" href="images/cadilag.svg">
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="Ferramenta de Simulação de Estruturas de Dados">
        <meta name="author" content="João G. G. Nogueira">
        <meta name="keywords" content="Data Structure Simulation, AVA, Cadilag">
        <link rel="manifest" href="manifest.json"/>
        <title>Editar perfil</title>
        <link href='css/jquery.guillotine.css' media='all' rel='stylesheet'>
        
        <link rel="preload" href="css/editprofilestyle.css" as="stylesheet"/>
        
        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500" rel="stylesheet">
        <script src="https://apis.google.com/js/api:client.js"></script>
        <link async href="plugins/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="css/editprofilestyle.css" rel="stylesheet"/>
        <link href="css/editprofile_responsive.css" rel="stylesheet" media="(max-width: 510px)">

        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/request.js"></script>
        <link async href="css/request.css" rel="stylesheet"/>
        
        <script src='js/jquery.guillotine.min.js'></script>
        <script src="js/jquery.complexify.min.js"></script>
        <script async src="https://cdn.bootcss.com/jquery.complexify.js/0.5.1/jquery.complexify.banlist.js"></script>
    </head>
    <body class="responsive-menu-principal">
        <div class='topbar'>
            <a href="./profile.php" title="Ir para o Menu Principal">
                <div id="icon"></div>
            </a>
            <div class="subtitle">
                <h1>Editar perfil</h1>
            </div>
        </div>
        <script>
            function oncomplete() {

                jQuery(function () {
                    var picture = $('#sample_picture');

                    // Make sure the image is completely loaded before calling the plugin
                    picture.on('load', function () {
                        // Initialize plugin (with custom event)
                        picture.guillotine({eventOnChange: 'guillotinechange'});

                        // Bind button actions
                        $('#fit').click(function () {
                            picture.guillotine('fit');
                        });
                        $('#zoom_in').click(function () {
                            picture.guillotine('zoomIn');
                        });
                        $('#zoom_out').click(function () {
                            picture.guillotine('zoomOut');
                        });


                    });

                    picture.guillotine({
                        width: 500,
                        height: 500,
                        init: {width: 500, height: 500},
                        onChange: function (data, action) {
                            data = picture.guillotine('getData');
                            $("#imageinfo")
                                .attr('x', data.x)
                                .attr('y', data.y)
                                .attr('w', data.w)
                                .attr('h', data.h)
                                .attr('s', data.scale);
                        }
                    });
                    picture.guillotine('fit');
                    var data = picture.guillotine('getData');
                    $("#imageinfo")
                            .attr('x', data.x)
                            .attr('y', data.y)
                            .attr('w', data.w)
                            .attr('h', data.h)
                            .attr('s', data.scale)
                            .attr('si', data.scale);
                    picture.on('guillotinechange', function (ev, data, action) {
                        data.scale = parseFloat(data.scale.toFixed(4));
                        for (var k in data) {
                            $('#' + k).html(data[k]);
                        }
                    });

                    switch ('<?= $highlight ?>')
                    {
                        case 'image':
                            $("#imageoptions").fadeIn(100);
                            $(".editimage").fadeIn(100,
                                    function () {
                                        $(".editimage").animate({'box-shadow': '0px 0px 10px rgba(255,255,255,1)'}, 400, function () {
                                            $(".editimage").animate({'box-shadow': '0px 0px 10px rgba(255,255,255,0)'}, 400);
                                        });
                                    });
                            $(".socialBinds").hide();
                            break;
                    }


                });
            }
        </script>
        <div class="socialBinds">
            <div class="label title"><p><i class="fa fa-google-plus"></i> | Google+</p></div>
            <div class="g-signin2" data-onsuccess="onSignIn"></div>
            <?PHP if ($googleId == null): ?>
                <div id="forlogingoogle" style="display: none">
                    <div class="label" id="logingooglename"><p> Logado como <br/><b></b></p></div>
                    <div class="small-label"><p>No próximo login, você poderá utilizar esta conta do Facebook para acessar o Cadilag</p></div>
                    <button type='button' id='bindgoogle' onclick="bindGg()">Vincular</button>
                </div>
            <?PHP else: ?>
                <div class="label" id="logingooglename"><p> Vinculado com <br/><b><?= $googleEmail ?></b></p></div>
                <div class="small-label"><p>Para desvincular, você precisa estar logado na conta!</p></div>
                <div id="forlogingoogle" style="display: none">
                    <button type='button' id='bindgoogle' onclick="unbindGg()">Desvincular</button>
                </div>
            <?PHP endif; ?>
            <button class="pure-button" id="closeSocial">Voltar</button>
        </div>
        <div class='area'>
            <div class='title'>
                <p>Principal</p>
            </div>
            <button id="editsocial" title="Mostrar vinculações">
                <i class="fa fa-google-plus"></i>
            </button>
            <div id='inputs'>
                <form class="pure-form">
                    <label class="label" for="nickname">Apelido</label>
                    <input id='nickname' value="<?= $nickname; ?>" maxlength="40"/>
                    <label class="label" for="firstname">Primeiro Nome</label>
                    <input id='firstname' value="<?= $firstname; ?>" maxlength="40"/>
                    <label class="label" for="lastname">Último Nome</label>
                    <input id='lastname' value="<?= $lastname; ?>" maxlength="40"/>
                    <button type='button' id='editpassword'>Alterar senha</button>
                </form>
            </div>
            <div id='imageuser'>
                <div class="label">Imagem do Perfil</div>
                <div id='imguser' style='background-image: url(<?= $imageprofile ?>?=<?= rand() ?>)'></div>
                <button type='button' id='editimage'>Alterar imagem</button>
            </div>
        </div>
        <div class='editpassword' style="display: none">
            <div class='title'>
                Alterar Senha
            </div>
            <form class="pure-form">
                <div class="label">Digite a senha atual</div>
                <input required="required" id="oldpassword" type="password"/>
                <div class="label">Digite a nova senha</div>
                <input required="required" onkeypress="capsLockDetector(event)" status="scan" id="password" type="password"/>
                <div id="alertCaps" style="display:none;clear: both;top:5px;">Caps Lock está ativo</div>
                <div style="margin-top:10px;" class="progress"><div id="float"></div></div>
                <div class="label"><p>Redigite a nova senha</p></div>
                <input style="margin-top:10px" class='pure-input-1' onkeypress="capsLockDetector(event)" id="passwordC" type="password" name="passwordC"  />
                <button type="button" class="pure-button pure-button-primary" id="action">Alterar</button>
                <button type="button" id='closeEditPass' class='pure-button'>Cancelar</button>
            </form>
        </div>
        <div class='editimage' <?= $visibility; ?>>
            <div class='frame'>
                <img onload="oncomplete();" id='sample_picture' alt='pre-visualização' src='<?= $sample_image ?>'>
                <form onsubmit="submitImage(event)" class="pure-form" id='imageupdate' method='POST' action="editprofile.php" enctype="multipart/form-data">
                    <input accept="image/*" id='imagefile' type='file' name='imagefile'/>
                </form>
                <form class="pure-form" id="usechar">
                    <button type="button" class="pure-button">Utilizar caractere</button>
                </form>
                <form class="pure-form" id="usedefault">
                    <button type="button" class="pure-button">Utilizar padr&atilde;o</button>
                </form>
            </div>
            <form class="pure-form">
                <table id='controls'>
                    <tr>
                        <td><button id='saveimage' class="pure-button"  type='button' title='Save'> Salvar Imagem </button></td>
                        <td><button id='zoom_out'  class="pure-button"  type='button' title='Zoom out'> <i class="fa fa-search-minus"></i> </button></td>
                        <td><button id='fit' class="pure-button"   type='button' title='Fit image'> <i class="fa fa-expand"></i> </button></td>
                        <td><button id='zoom_in' class="pure-button"   type='button' title='Zoom in'> <i class="fa fa-search-plus"></i> </button></td>
                        <td><button id='closeimage' class="pure-button"  type='button' title='Fechar'> Fechar </button></td>
                    </tr>
                </table>
            </form>
        </div>
        <div class='buttons'>
            <button id='save'>Salvar</button>
            <button id='cancel'>Voltar</button>
        </div>
        <div id='imageinfo' style="visibility: hidden;"></div>
        <script async>

            function capsLockDetector(e) {
                kc = e.keyCode ? e.keyCode : e.which;
                sk = e.shiftKey ? e.shiftKey : ((kc === 16) ? true : false);
                if (((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk))
                    document.getElementById('alertCaps').style.display = 'block';
                else
                    document.getElementById('alertCaps').style.display = 'none';
            }
            $(".editpassword #action").click(function () {

                var senha = $('.editpassword #password').val();
                var senhaC = $('.editpassword #passwordC').val();

                if (senha === '') {
                    swal("Senha nova", 'está faltando', 'error');
                    return;
                }
                if (senha !== senhaC) {
                    swal("As senhas são diferentes", 'Isso evita que você insira uma senha incorreta ou aleatória!', 'error');
                    return;
                }

                var form = $(".editpassword form");
                var postData = {oldpassword: form.find("#oldpassword").val(), newpassword: form.find("#password").val()};
                post("./request/perfil/updatePassword.php", function (data) {
                    swal({title: 'Senha alterada', text: 'Ao iniciar a sessão novamente, utilize a nova senha!', type: "success"});
                    $(".editpassword").fadeOut(400);
                }, postData);
            });
            $("#usechar button").click(function () {

                var char = '<?= substr($controlador->getTitleName(), 0, 1) ?>';
                char = char.toLowerCase();
                var postData = {"url": "users/image/" + char + ".png"};

                post("./request/perfil/updateImage.php", function (data) {
                    $(".editimage").fadeOut(400);
                    location.reload();
                }, postData);

            });

            $("#usedefault button").click(function () {

                var postData = {"url": "images/userdefault.png"};

                post("./request/perfil/updateImage.php", function (data) {
                    $(".editimage").fadeOut(400);
                    location.reload();
                }, postData);

            });

            $("#sample_picture").on('DOMMouseScroll mousewheel', function (event) {
                if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
                    $(this).guillotine('zoomOut');
                } else {
                    $(this).guillotine('zoomIn');
                }
                return false;
            });

            $("#cancel").click(function () {
                window.location.replace("./profile.php");
            });

            $("#save").click(function () {
                var nickname = $("#nickname").val();
                var firstname = $("#firstname").val();
                var lastname = $("#lastname").val();

                nickname = nickname.replace(/[0-9]*/g, "");

                firstname = firstname.replace(/[0-9]*/g, "");

                lastname = lastname.replace(/[0-9]*/g, "");

                var postData = {
                    "nickname": nickname, "firstname": firstname, "lastname": lastname
                };
                post("./request/perfil/edit.php", function (data) {
                    redirect("./profile.php");
                }, postData);

            });
            
            document.getElementById("imagefile").onchange = function () {
                $("#typefile").val('1');
                if (validateFile("imagefile", 2 * 1024 * 1024, [
                    "image/gif",
                    "image/jpeg",
                    "image/png"])) {
                    document.getElementById("imageupdate").submit();
                }
            };

            $('#imageurl').keyup(function (e) {
                if (e.keyCode === 13) {
                    document.getElementById("imageupdate").submit();
                }
            });

            $("#saveimage").click(function () {

                var x = $("#imageinfo").attr('x');
                var y = $("#imageinfo").attr('y');
                var w = $("#imageinfo").attr('w');
                var h = $("#imageinfo").attr('h');
                var s = $("#imageinfo").attr('s');
                var si = $("#imageinfo").attr('si');
                var url = "<?= $imageurl ?>";

                var postData = {
                    "url": url, "x": x, "y": y, "w": w, "h": h, "s": s, 'is': si
                };
                post("./request/perfil/uploadImage.php", function (data1) {
                    
                    postData = {
                        "url": data1.src
                    };

                    post("./request/perfil/updateImage.php", function () {
                        swal({title: 'Sucesso', type:"success"});
                        $(".editimage").fadeOut(400);
                        $("#imguser").css('background-image', "url(" + data1.src + '?=' + Math.random() + ")");
                    }, postData);
                }, postData);

            });
            
            $("#editsocial").click(function(){
                $(document.body).addClass("responsive-menu-social").removeClass("responsive-menu-principal");
            });

            $("#closeSocial").click(function(){
                $(document.body).removeClass("responsive-menu-social").addClass("responsive-menu-principal");
            });
            
            $("#closeEditPass").click(function () {
                $(".editpassword").fadeOut(400);
                $(".socialBinds").fadeIn(400);
                $(document.body).removeClass("responsive-menu-password").addClass("responsive-menu-principal");
            });

            $("#editpassword").click(function () {
                $(document.body).removeClass("responsive-menu-principal").addClass("responsive-menu-password");
                $(".editimage").fadeOut(400);
                $("#imageoptions").fadeOut(400);
                $(".editpassword").fadeIn(400);
                $(".socialBinds").fadeOut(400);
            });
            
            $("#editimage").click(function () {
                $(".editimage").fadeIn(400);
                $("#imageoptions").fadeIn(400);
                $(".editpassword").fadeOut(400);
                $(".socialBinds").fadeOut(400);
                $(document.body).removeClass("responsive-menu-principal").addClass("responsive-menu-editimage");
            });

            $("#closeimage").click(function () {
                $(".editimage").fadeOut(400);
                $("#imageoptions").fadeOut(400);
                $(".socialBinds").fadeIn(400);
                $(document.body).removeClass("responsive-menu-editimage").addClass("responsive-menu-principal");
            });

            
        </script>
        <div id="fb-root"></div>
        <script async>

            <?PHP if ($googleId == null): ?>
            function bindGg() {
                if (googleUser) {
                    var profile = googleUser.getBasicProfile();
                    post("./request/perfil/bindGoogle.php", function (data) {
                        swal(
                        {title:"Sucesso", 
                        text:"Na próxima vez que for fazer login no Cadilag, você pode utilizar está conta do Google",
                        type:"success"},
                        function(){
                            reload();
                        });
                    }, {id: profile.getId(),email:profile.getEmail()});
                }
            }
            <?PHP else: ?>
            function unbindGg() {
                if (googleUser) {
                    var profile = googleUser.getBasicProfile();
                    post("./request/perfil/unbindGoogle.php", function (data) {
                        swal({title:"Sucesso", 
                            text:"Conta do Google desvinculada",
                            type:"success"},
                            function(){
                                reload();
                            });
                    }, {id: profile.getId(),email:profile.getEmail()});
                }
            }
            <?PHP endif; ?>
            var auth2; // The Sign-In object.
            var googleUser; // The current user.

            var appStartGoogle = function() {
                 gapi.load('auth2', initSigninV2);
            };

            var initSigninV2 = function() {
              auth2 = gapi.auth2.init({
                  client_id: '<?= Google::$client_id ?>'
              });

              auth2.isSignedIn.listen(signinChanged);
              auth2.currentUser.listen(userChanged);

              if (auth2.isSignedIn.get()) {
                auth2.signIn();
              }

              refreshValues();
            };

            var signinChanged = function (val) {
                console.log("signinChange:"+val);
            };

            var userChanged = function (user) {
                console.log('User now: ', user);
                googleUser = user;
                updateGoogleUser();
            };

            var updateGoogleUser = function () {
                if (googleUser) {
                    <?PHP if ($googleId == null): ?>
                        $("#logingooglename p b").text(googleUser.getBasicProfile().getName());
                    <?PHP endif; ?>
                    $("#forlogingoogle").show();
                } else {
                    $("#forlogingoogle").hide();
                }

            };
            
            var refreshValues = function() {
                if (auth2){
                    googleUser = auth2.currentUser.get();
                    updateGoogleUser();
                }
            };

        </script>
        <script src="https://apis.google.com/js/platform.js?onload=appStartGoogle" async defer></script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>
