<?PHP
session_start();
include './config/Google.php';

use config\Google;
?>
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta name="viewport" content="width=device-width"/>
        <meta charset="UTF-8" />
        <title>Cadilag</title>
        <meta name="googlebot-news" content="noindex" />
        <meta name="robots" content="all">
        <meta name="theme-color" content="#4267b2"/>
        <meta name="Description" content="O Cadilag é uma ferramenta gratuita de Simulação de Algoritmos de Estruturas de Dados desenvolvido com a ajuda de alunos e professores Unesp de Presidente Prudente desde 2015 para auxiliar os estudos durante a disciplina de Estruturas de Dados. Além disso, a ferramenta vem acompanhada de um Ambiente Virtual de Aprendizagem (AVA) para auxiliar no gerenciamento de turmas"/>
        <meta name="author" content="João G. G. Nogueira"/>
        <meta name="keywords" content="Simulação de Estruturas de Dados, AVA, Cadilag"/>

        <link rel="preload" href="css/loginstyle.css" as="style"/>

        <link async href="https://fonts.googleapis.com/css?family=Raleway:200,500,700" rel="stylesheet"/>
        <link rel="shortcut icon" href="images/cadilag.svg"/>
        <link async rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"/>
        <link rel="manifest" href="manifest.json"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="css/loginstyle.css" rel="stylesheet"/>
        <link async href="css/login_responsive.css" rel="stylesheet" media="(max-width: 510px)"/>
        <link async href="css/request.css" rel="stylesheet"/>
        <link async href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
        <script src="https://apis.google.com/js/api:client.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
        <script async src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script async src="js/progressBar.js"></script>
        <script async src="js/jquery.complexify.min.js"></script>
        <script async src="https://cdn.bootcss.com/jquery.complexify.js/0.5.1/jquery.complexify.banlist.js"></script>
        <script async src="js/request.js"></script>
        <script async src="js/slider.js"></script>
    </head>
    <body>
        <img class="background" alt=''/>
        <div class='topbar'>
            <div class='title'>
            </div> 
        </div>
        <button title='Mais informações' id="toogle-responsive-info" class="pure-button pure-button-primary">
            <i class="fa fa-info"></i>
        </button>
        <div class="slider">
            <div class="slider-content">
                <div class="slider-content-visible">
                    <div class="about">
                        <h1>Objetos de Aprendizagem</h1>
                        <h2 class="about-content">
                            As ferramentas do Cadilag provê 
                            simulação e representação das estruturas 
                            de dados mais conhecidas, através de animações de algoritmo de 
                            inserção, remoção, busca, entre outros.
                            <br/>
                            <br/>
                            A ferramenta também permite armazenar entradas de dados, visualizar pseudo-algoritmos,
                            representação de passo-a-passo e depuração.
                        </h2>
                    </div>
                    <div class="about" style="display:none;">
                        <h1>Ambiente Virtual de Aprendizagem</h1>
                        <h2 class="about-content">
                            O Ambiente Virtual de Aprendizagem do Cadilag possui um 
                            conjunto de ferramentas para veicular (distribuir) conteúdo, 
                            e permitir interação entre educadores e educandos
                            <br/>
                            <br/>
                            Com ele é possível que professores possam: criar atividades,
                            distribuir materiais didáticos, plano de ensino e eventos.
                        </h2>
                    </div>
                    <div class="about" style="display:none;">
                        <h1>Ambiente Colaborativo</h1>
                        <h2 class="about-content">
                            O Ambiente Colaborativo do Cadilag permite que os usuários
                            possam compartilhar conhecimento através de Tópicos de Perguntas e Respostas. 
                            <br/>
                            <br/>
                            A ferramenta de simulação permite que usuários possam compartilhar 
                            seus códigos com outros.
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="principal">
            <div class='area'>
                <div class="title" id="titleaction">Login</div>
                <form class="pure-form" id='login' method="post">
                    <div class="title">Insira os dados de acesso</div>
                    <label for='email'>Email</label>
                    <input autofocus autocomplete="email" required="required" id="email" name="email" type="email"/>
                    <label for='password'>Senha</label>
                    <input autocomplete="password" required="required" onkeypress="capsLockDetector(event)" status="scan" id="password" name="password" type="password"/>
                    <button title='mostrar a senha' type="button" id="viewpassword"></button>
                    <div id="alertCaps" style="display:none;clear: both;">Caps Lock est&aacute; ativo</div>
                    <div class="info" id="info" style="top:5px;display:none;" state="hide"></div>
                    <div class="logupdiv" style="display: none;top:5px;z-index:1;">
                        <div style="margin-top:10px;" class="progress"><div class="float"></div></div>
                        <div class='progress-label' style="text-align: center">
                            Força da Senha
                        </div>
                        <label for='passwordC'>Redigite a senha</label>
                        <input autocomplete="new-password" class='pure-input-1' onkeypress="capsLockDetector(event)" id="passwordC" type="password" name="passwordC"  />
                    </div>
                    <a href="./acesso_livre.php" style="display: inline-block; width: 100%">Acesso sem Cadastro</a>
                    <button class="pure-button pure-button-primary" id="action">Entrar</button>
                    <button type="button" class="pure-button" id="open_cadastro">Ou Cadastrar</button>   
                </form>
            </div>
        </div>
        <div id="socialLogin">
            <div class="btn-group social google" id="google-login" data-onsuccess="checkLoginStateGoogle">
                <a class='btn-text'><i class="fa fa-google-plus-square"></i> Entrar com Google</a>
            </div>	
        </div>
        <div class="confirmup" style="display:none">
            <div class='area'>
                <form class="pure-form" id='logup2'>
                    <div class='label labelcount'>2/2</div>
                    <div class="title">Preencha as seguintes informações:</div>
                    <div class='label'>N&iacute;vel de Acesso</div>
                    <select onchange="changeSelect(this)" id='level'>
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor</option>
                    </select>
                    <div class='alert' id='obs1'>* Ao selecionar o nível de Acesso de Professor ser&aacute; necess&aacute;rio aguardar a confirma&ccedil;&aacute;o do administrador</div>
                    <div class='alert' id='obs2'>**Voc&ecirc; n&atilde;o consiguir&aacute; alterar o N&iacute;vel de Acesso</div>   
                    <div class="title">Insira alguns detalhes do Perfil:</div>
                    <div class="pure-u-2-5">
                        <input placeholder="Apelido (Opcional)" maxlength="40" class="pure-input-1" id="nickname" name="nickname" type="text"/>
                    </div>
                    <div class="pure-u-2-5">
                        <input autocomplete="given-name"  placeholder="Primeiro Nome (Opcional)" maxlength="40" class="pure-input-1" id="firstname" name="fname" type="text"/>
                    </div>
                    <div class="pure-u-2-5">
                        <input autocomplete="family-name" placeholder="Último Nome (Opcional)" maxlength="40" class="pure-input-1" id="lastname" name="lname" type="text"/>
                    </div>
                    <button class="pure-button pure-button-primary" id="cadastro" type="button">Continuar</button> 
                    <button type="button" class="pure-button" id="cancelar">Cancelar</button>   
                </form>
            </div>    
        </div>
        <footer>Cadilag Web Alpha (2016 - 2018) - Universidade Estadual Paulista "Júlio de Mesquita Filho" - UNESP - Desenvolvido por <a href="https://www.linkedin.com/in/joão-gabriel-gomes-nogueira-96133040/" rel="opener">João Gabriel Gomes Nogueira</a>/Ronaldo Celso Messias Correia</footer>
        <script async>
            
            document.getElementById("toogle-responsive-info").addEventListener("click", function () {
                document.body.classList.toggle("show-responsive-info");
            });
            document.getElementById("viewpassword").addEventListener("click", function () {
                $("#viewpassword").toggleClass("selected");
                if ($("#password").attr('type') === 'password') {
                    $("#password").attr('type', 'text');
                } else {
                    $("#password").attr('type', 'password');
                }
            });
            document.getElementById("open_cadastro").addEventListener("click", function () {
                if ($(".logupdiv").css('display') === 'none') {

                    var email = $('#email').val();
                    var senha = $('#password').val();

                    if (email === '') {
                        $('#info').show().html('Campo email vazio');
                        return;
                    } else if (senha === '') {
                        $('#info').show().html('Campo senha vazio');
                        return;
                    } else {
                        $("#socialLogin").fadeOut(400, function () {
                            $("#continuelogin").fadeOut(400);
                            $("#labelforcontinuelogin").fadeOut(400);
                            $("#titleaction").fadeOut(400);
                            $(".logupdiv").fadeIn(400, function () {
                                $("#titleaction").html('Cadastro').fadeIn(400);
                                $("#open_cadastro").html("Cancelar");
                                $("#action").html("Cadastrar");
                                $("#passwordC").focus();
                            });
                        });
                    }
                } else {

                    $("#titleaction").fadeOut(400);
                    $("#continuelogin").fadeIn(400);
                    $("#labelforcontinuelogin").fadeIn(400);
                    $(".logupdiv").fadeOut(400, function () {
                        $(".logupdiv").hide();
                        $("#titleaction").fadeIn(400).html('Login')
                        $("#open_cadastro").html("Ou Cadastrar");
                        $("#action").html("Entrar");
                        $("#socialLogin").fadeIn(400);
                    });

                }
            });

            function fill_formup(data) {

                $("#email").val(data.email);
                $("#firstname").val(data.first_name);
                $("#lastname").val(data.last_name);
                $("#nickname").val(data.name);

                $("#open_cadastro").click();
                $("#socialLogin").fadeOut(400, function () {
                    $("#continuelogin").fadeOut(400);
                    $("#labelforcontinuelogin").fadeOut(400);
                    $("#titleaction").fadeOut(400);
                    $(".logupdiv").fadeIn(400, function () {
                        $("#titleaction").html('Cadastro').fadeIn(400);
                        $("#open_cadastro").html("Cancelar");
                        $("#action").html("Cadastrar");
                        $("#passwordC").focus();
                    });
                });
            }

            function capsLockDetector(e) {
                kc = e.keyCode ? e.keyCode : e.which;
                sk = e.shiftKey ? e.shiftKey : ((kc === 16) ? true : false);
                if (((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk))
                    document.getElementById('alertCaps').style.display = 'block';
                else
                    document.getElementById('alertCaps').style.display = 'none';
            }

            document.getElementById("cadastro").addEventListener("click", function () {
                var email = $('#email').val();
                var senha = $('#password').val();
                var ehAluno = $('#level').val() === 'aluno';
                var nickname = $("#nickname").val();
                var firstname = $("#firstname").val();
                var lastname = $("#lastname").val();
                var postData = {
                    "emailc": email,
                    "senhac": senha,
                    "ehAluno": ehAluno,
                    "nickname": nickname,
                    "lastname": lastname,
                    "firstname": firstname,
                    "facebookbind": null,
                    "googlebind": google_cache
                };

                post('./request/cadastro/cache.php', function () {
                    redirect('confirmarCadastro.php');
                }, postData);
            });

            var changeSelect = function (select) {
                if ($(select).val() === 'aluno') {
                    $('#obs1').css('font-weight', 'normal');
                } else {
                    $('#obs1').css('font-weight', 'bold');
                }
            };

            document.getElementById("info").addEventListener("click", function () {
                $(this).hide();
            });
            document.getElementById("cancelar").addEventListener("click", function () {
                $(".confirmup").hide();
                $(".principal").show();
            });
            document.getElementById("login").addEventListener("submit", function () {
                event.preventDefault();

                if ($(".logupdiv").css('display') === 'none') {

                    var email = $('#email').val();
                    var senha = $('#password').val();

                    var postData = {
                        "email": email,
                        "senha": senha
                    };

                    var functionError = function (data) {
                        $('#info').show().html(data.resposta);
                    };
                    post('./request/login/access.php', function (data) {
                        window.location.href = '<?= (isset($_SESSION['PAGE_REDIRECT']) ? "../" . $_SESSION['PAGE_REDIRECT'] : "./profile.php" ) ?>';
                    }, postData, {callbackError: functionError, callbackFalse: functionError});
                } else {
                    logup();
                }
            });

            var checkPassword = function () {
                if ($('#passwordC').val() !== $("#password").val()) {
                    $("#info").show().html('Senhas diferentes!');
                    return false;
                } else {
                    $("#info").hide();
                    return true;
                }
            };
            document.getElementById("passwordC").addEventListener("keyup", function () {
                checkPassword("#logup");
            });

            logup = function () {
                var email = $('#email').val();

                if (!checkPassword("#login")) {
                    swal("As senhas são diferentes", 'Isso evita que você insira uma senha incorreta ou aleatória!', 'error');
                    return;
                }

                post("./request/cadastro/emailCheck.php", function (data) {
                    if (!data.exists) {
                        $(".principal").hide();
                        $(".confirmup").show();
                    } else {
                        $('#info').show().html('Email j&aacute; utilizado');
                    }
                }, {"email": email});

            };
            function changebackground() {
                swal({
                    title: "Alterar Imagem de Fundo",
                    text: "Essa imagem só estará disponíveis neste navegador<br>\
                            <form class='pure-form'><input accept='file/*' style='display:block' type='file' onchange='changebackgroundimage(this)' /></form>",
                    html: "true",
                    confirmButtonText: "Restaurar",
                    cancelButtonText: "Fechar",
                    showCancelButton: true
                }, function () {
                    document.body.style.backgroundImage = "none";
                    localStorage.setItem("cadilagCover", null);
                });

            }
            function changebackgroundimage(obj) {

                var files = obj.files;
                var errors = "";

                if (!files) {
                    errors += "O envio de arquivo não é suportado pelo seu Navegador";
                }

                if (files && files[0]) {

                    for (var i = 0; i < files.length; i++) {

                        var file = files[i];

                        if ((/\.(png|jpeg|jpg|gif)$/i).test(file.name)) {
                            readImage(file);
                        } else {
                            errors += file.name + " Formato de Imagem não aceito\n";
                        }
                    }
                }

                if (errors) {
                    alert(errors);
                }
            }

            function readImage(file) {
                var reader = new FileReader();

                reader.onloadend = function () {
                    try {
                        localStorage.setItem("cadilagCover", reader.result);
                        document.body.style.backgroundImage = "url(" + reader.result + ")";
                        swal.close();
                    } catch (e) {
                        swal({title: "Limite Excedido, Imagem muito grande", type: "error"});
                        throw e;
                    }
                };

                reader.readAsDataURL(file);
            }
            (function () {
                var cover = localStorage.getItem("cadilagCover");
                if (cover && cover !== "null") {
                    document.body.style.backgroundImage = "url(" + localStorage.getItem("cadilagCover") + ")";
                }
            })();

        </script>
        <script title="google">

            google_cache = null;

            function checkLoginStateGoogle(googleUser) {
                var profile = googleUser.getBasicProfile();
                var cadastrar = function (data) {
                    post("./request/cadastro/emailCheck.php", function (data) {
                        if (!data.exists) {
                            swal({
                                title: "Opss... Conta não vinculada!",
                                text: "Utilizar sua conta do google para se cadastrar?",
                                showCancelButton: true,
                                confirmButtonColor: "#6BDD55",
                                confirmButtonText: "Sim",
                                cancelButtonText: "Não"
                            }, function () {
                                google_cache = {
                                    email: profile.getEmail(),
                                    idGg: profile.getId(),
                                    name: profile.getName(),
                                    first_name: profile.getFamilyName(),
                                    last_name: profile.getGivenName()
                                };
                                fill_formup(google_cache);
                            });
                        } else {
                            swal({
                                title: "Opss... Conta não vinculada!",
                                text: "Porém este email do google (<b>" + profile.getEmail() + "</b>) está cadastrado, deseja vincular e entrar agora?",
                                showCancelButton: true,
                                confirmButtonColor: "#6BDD55",
                                confirmButtonText: "Sim",
                                cancelButtonText: "Não",
                                html: true
                            }, function (confirm) {
                                if (confirm) {
                                    setTimeout(function () {
                                        swal({
                                            title: "Insira senha",
                                            text: "<form class='pure-form'>\
                                                <p>Email: <b>" + profile.getEmail() + "</b></p>\
                                                <p><input id='password-temp' placeholder='Senha' type='password'/></p>\
                                                </form>",
                                            showCancelButton: true,
                                            confirmButtonColor: "#6BDD55",
                                            confirmButtonText: "Vincular e Entrar",
                                            cancelButtonText: "Cancelar",
                                            closeOnConfirm: false,
                                            html: true
                                        }, function (confirm) {
                                            if (confirm) {
                                                var postData = {
                                                    "email": profile.getEmail(),
                                                    "senha": $("#password-temp").val()
                                                };

                                                var functionError = function () {
                                                    swal.showInputError("Senha errada!");
                                                };

                                                post('./request/login/access.php', function () {
                                                    post("./request/perfil/bindGoogle.php", function () {
                                                        swal({title: "Conta vinculada com sucesso", text: "Você poderá utilizar está conta do facebook para entrar da próxima vez", type: "success"}, function () {
                                                            window.location.href = '<?= (isset($_SESSION['PAGE_REDIRECT']) ? "../" . $_SESSION['PAGE_REDIRECT'] : "./profile.php" ) ?>';
                                                        });
                                                    }, {id: profile.getId(), email: profile.getEmail()});
                                                }, postData, {callbackFalse: functionError, hideFalseMessage: true});
                                            }
                                        });
                                    }, 400);
                                }

                            });
                        }
                    }, {email: profile.getEmail()});
                };

                post("./request/login/googleAccess.php", function (data) {
                    redirect("./profile.php");
                }, {id: profile.getId(), email: profile.getEmail()}, {callbackFalse: cadastrar});
            }

            var googleUser = {};

            var startAppGoogle = function () {
                if (typeof (gapi) !== 'undefined') {
                    gapi.load('auth2', function () {
                        auth2 = gapi.auth2.init({
                            client_id: '<?= Google::$client_id ?>',
                            cookiepolicy: 'single_host_origin'
                        });
                        attachSignin(document.getElementById('google-login'));
                    });
                } else {
                }
            };

            function attachSignin(element) {
                auth2.attachClickHandler(element, {}, checkLoginStateGoogle, function (error) {
                    console.log(JSON.stringify(error, undefined, 2));
                });
            }

        </script>

        <button title='Mudar plano de Fundo' onclick="changebackground()" class="pure-button pure-button-primary" style="z-index: 1000" id="changeBg"></button>
        <script async>startAppGoogle();</script>
        <?PHP include "./includes/google-analytics.php" ?>
    </body>
</html>

<?PHP
if (isset($_SESSION['PAGE_REDIRECT'])) {
    session_unset();
}
?>
