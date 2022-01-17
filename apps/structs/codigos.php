<?PHP
session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "../../includes/session_expired.php";
    exit();
}

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../entidades/EstruturaDeDados.php';
include './controladores/ControladorCodigos.php';
include './controladores/PDOCadilag.php';
include './entidades/Codigo.php';
include './controladores/CodePDO.php';

$email = $_SESSION['email'];
$password = $_SESSION['senha'];

$controladorCode = new controladores\ControladorCodigos();

if (!$controladorCode->checkAcess($email, $password)) {
    echo 'Falha na Sessão';
}
$prefix_navbar = "../../";
$controlador = new ControladorUsuario();
$controlador->setUser($email);
$imageurl = "../../" . $controlador->getFilteredImage();
$isAluno = $controlador->ehAluno();
$isProfessor = !$isAluno;

$estruturas = $controlador->listarEstruturas();


define('STRUCTVIEW', true);
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <link href="../../images/cadilag.svg" rel="shortcut icon"/>
        <title>Cadilag Códigos</title>
        <link href='../../css/sweetalert.css' rel='stylesheet'/>
        <link href="./css/index.css" rel="stylesheet"/>
        <link href="./css/codigos.css" rel="stylesheet"/>
        <link href="../../css/request.css" rel="stylesheet"/>
        <link href="../../css/genericstyle.css" rel="stylesheet"/>
        <script src='../../js/sweetalert.min.js' type='text/javascript'></script>
        <script src="../../js/jquery.min.js" type='text/javascript'></script>
        <script src="../../js/jquery-ui.min.js" type='text/javascript'></script>
        <script src='./js/jquery.ui.touch-punch.min.js' type='text/javascript'></script>
        <script src='../../js/request.js' type='text/javascript'></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="../../profile.php"><div id="icon"></div></a>
            <div class="subtitle"><h1>Código</h1></div>
            <div id='gotohub'>
                <p>HUB</p>
                <img id='imgUser' alt='Imagem do Perfil' src='<?= $imageurl ?>'/>
            </div>
        </div>
        <div id="sidebar">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td>
                            <?PHP
                            if ($isAluno) {
                                include '../../controladores/Aluno.php';
                                include '../../controladores/Turma.php';
                                $controlador = $controlador->getAluno();
                                $turma = $controlador->getTurma();
                                include './includes/index/sidebaraluno.php';
                            } elseif ($isProfessor) {
                                include '../../controladores/Professor.php';

                                $controlador = $controlador->getProfessor();
                                $acesso = $controlador->possuiAcesso();
                                if ($acesso) {
                                    include './includes/index/sidebarprofessor.php';
                                } else {
                                    include './includes/index/sidebarprofessorbloqueado.php';
                                }
                            }
                            ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table id="content">
            <tbody>
                <?PHP include './includes/index/editorCodes.php'; ?>
            </tbody>
        </table>
        <?PHP include '../../includes/navbar.php'; ?>
        <script>
            $(".title-scn").each(function () {
                var parent = $(this).parents("tr");
                $(this).click(function () {
                    $(parent.find(".list")[0]).slideToggle(400);
                });
            });
            function deleteCode(id, d) {
                swal({
                    title: "Você tem certeza?",
                    text: "Deseja remover o código?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post('./ajax/deleteCode.php', function (data) {
                                    var card = $(d).parents('.card').eq(0);
                                    var list = card.parents('.list').eq(0);
                                    var td = list.parents('td').eq(0);
                                    card.remove();
                                    if (list.find('.card').length === 0) {
                                        var tr = list.parents('tr').eq(0);
                                        tr.remove();
                                    } else {
                                        td.find('.title b').html(list.find('.card').length);
                                    }
                                    var content = $("#content tbody");
                                    if (content.find("tr:not(:first-child)").length === 0) {
                                        $("<tr><th id='empty'>vazio</th></tr>").appendTo(content);
                                    }
                                    swal({title: "Sucesso", type: "success"});
                                }, {id: id});
                            }

                        }
                );
            }
            function editCode(id, d, idEstrutura) {
                var page = "";
                switch (idEstrutura) {
                    case 1:
                        page = "lista_ord_simples";
                        break;
                    case 2:
                        page = "lista_ord_estatica";
                        break;
                    case 3:
                        page = "lista_ord_dupla";
                        break;
                    case 4:
                        page = "lista_desord_simples";
                        break;
                    case 5:
                        page = "lista_desord_dupla";
                        break;
                    case 6:
                        page = "lista_cruzada";
                        break;
                    case 7:
                        page = "fila_estatica";
                        break;
                    case 8:
                        page = "fila_priori";
                        break;
                    case 9:
                        page = "fila_normal";
                        break;
                    case 10:
                        page = "fila_circ";
                        break;
                    case 11:
                        page = "pilha_estatica";
                        break;
                    case 12:
                        page = "pilha_multipla";
                        break;
                    case 13:
                        page = "pilha_normal";
                        break;
                    case 14:
                        page = "hash_colisao";
                        break;
                    case 15:
                        page = "hash_sem_colisao";
                        break;
                    case 16:
                        page = "arv_avl";
                        break;
                    case 17:
                        page = "arv_b";
                        break;
                    case 18:
                        page = "arv_b_plus";
                        break;
                    case 19:
                        page = "arv_rn";
                        break;
                    case 20:
                        page = "arv_binaria";
                        break;
                    case 21:
                        page = "arv_trie";
                        break;
                    case 22:
                        page = "arv_patricia";
                        break;
                }
                page = "./" + page + ".php?action=editcode&idCode=" + id;
                window.location.href = page;
            }
            var prefix_system = "../../";
        </script>
    </body>
</html>
