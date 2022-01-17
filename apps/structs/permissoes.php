<!DOCTYPE html>
<?PHP
session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "../../includes/session_expired.php";
    exit();
}

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../entidades/EstruturaDeDados.php';
include '../../controladores/Professor.php';
include '../../controladores/Turma.php';
include '../../entidades/Permissao.php';
include './controladores/ControladorCodigos.php';
include './controladores/PDOCadilag.php';
include './entidades/Codigo.php';
include './controladores/CodePDO.php';

$email = $_SESSION['email'];
$password = $_SESSION['senha'];

$index = 0;

if (isset($_GET['index'])) {
    $index = $_GET['index'];
}

$controladorCode = new controladores\ControladorCodigos();

if (!$controladorCode->checkAcess($email, $password)) {
    echo 'Falha na Sessão';
}

$controlador = new ControladorUsuario();
$controlador->setUser($email);
$imageurl = "../../" . $controlador->getFilteredImage();
$isAluno = $controlador->ehAluno();
$isProfessor = !$isAluno;
$prefix_navbar = "../../";
if ($isAluno) {
    header("Location: profile.php");
}
$controlador = $controlador->getProfessor();
$estruturas = $controlador->listarEstruturas();
$turma = $controlador->getTurmaByIndex($index);
if ($turma) {
    $permissoes = $turma->listarPermissoes();
    $details = $turma->getDescricaoTurma();
    $title = $details['disciplina_nome'] . ' (' . $details['curso_sigla'] . ') - ' . $turma->getAno();
}
$turmas = $controlador->getTurmas();
define('STRUCTVIEW', true);
?>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <link href="../../images/cadilag.svg" rel="shortcut icon"/>
        <title>Cadilag Permissões - <?= $title ?></title>
        <link href='../../css/sweetalert.css' rel='stylesheet'/>
        <link href="./css/index.css" rel="stylesheet"/>
        <link href="./css/permissoes.css" rel="stylesheet"/>
        <link href="../../css/yui.yahooapis.com_pure_0.6.0_pure-min.css" rel="stylesheet"/>
        <link href="../../css/bootstrap-switch.css" rel="stylesheet"/>
        <link href="../../css/genericstyle.css" rel="stylesheet"/>
        <link href="../../css/request.css" rel="stylesheet"/>
        <script src='../../js/sweetalert.min.js' type='text/javascript'></script>
        <script src="../../js/jquery.min.js" type='text/javascript'></script>
        <script src="../../js/jquery-ui.min.js" type='text/javascript'></script>
        <script src='./js/jquery.ui.touch-punch.min.js' type='text/javascript'></script>
        <script src="../../js/bootstrap-switch.js"></script>
        <script src="../../js/request.js"></script>
    </head>
    <body>
        <div class='topbar'>
            <a href="../../profile.php"><div id="icon"></div></a>
            <div class="subtitle"><h1>Permissões</h1></div>
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
                            $acesso = $controlador->possuiAcesso();
                            if ($acesso) {
                                include './includes/index/sidebarprofessor.php';
                            } else {
                                include './includes/index/sidebarprofessorbloqueado.php';
                            }
                            ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="content">
            <form class="pure-form">
                <label for="class">Turma : </label>
                <select name="index" id="class">
                    <?PHP
                    if ($turma):
                        foreach ($turmas as $i => $turmafor):
                            $details = $turmafor->getDescricaoTurma();
                            ?>
                            <option value="<?= $i ?>"><?= $details['disciplina_nome'] ?> (<?= $details['curso_sigla'] ?>) - <?= $turmafor->getAno() . ($details['total_solicitacoes'] !== 0 ? ': +' . $details['total_solicitacoes'] : '') ?></option>
                        <?PHP
                        endforeach;
                    else:
                        ?>
                        <option value="0" selected>Você não posssui turmas cadastradas</option>
                    <?PHP endif;
                    ?>

                </select>
            </form>
<?PHP if ($turma): ?>
                <table>
                    <tr>
                        <th>Estrutura de Dados</th>
                        <th>Código de Inserção</th>
                        <th>Código de Remoção</th>
                        <th>Código de Busca</th>
                    </tr>
    <?PHP foreach ($estruturas as $i => $ed): ?>
                        <tr>
                            <td><?= $ed->getNome() ?></td>
                            <?PHP
                            $Add = false;
                            $Rem = false;
                            $Search = false;

                            if (isset($permissoes[$ed->getId()])) {
                                $permissao = $permissoes[$ed->getId()];
                                $Add = $permissao->getPseudoadd();
                                $Rem = $permissao->getPseudorem();
                                $Search = $permissao->getPseudosearch();
                            }
                            ?>
                            <td><input type="checkbox" name="add" <?= ($Add ? 'checked' : "") ?> onchange="setPermission(this,<?= $ed->getId() ?>)"/></td>
                            <td><input type="checkbox" name="rem" <?= ($Rem ? 'checked' : "") ?> onchange="setPermission(this,<?= $ed->getId() ?>)"/></td>
                            <td><input type="checkbox" name="search" <?= ($Search ? 'checked' : "") ?> onchange="setPermission(this,<?= $ed->getId() ?>)"/></td>
                        </tr>
                <?PHP endforeach; ?>
                </table>
<?PHP endif; ?>
        </div>
        <script>

            var total = <?= count($estruturas); ?>;

            $.fn.bootstrapSwitch.defaults.size = 'medium';
            $.fn.bootstrapSwitch.defaults.onText = 'Desbloqueado';
            $.fn.bootstrapSwitch.defaults.offText = 'Bloqueado';
            $.fn.bootstrapSwitch.defaults.handleWidth = 100;
            $.fn.bootstrapSwitch.defaults.labelWidth = 10;
            $.fn.bootstrapSwitch.defaults.offColor = 'danger';

            document.getElementById("class").addEventListener("change", function (e) {
                var target = e.target.parentElement;
                target.submit();
            });

            var setPermission = function (element, id) {
                var pseudo = $(element).attr("name");
                var value = $(element).bootstrapSwitch('state');

                var postData = {'pseudo': pseudo, 'value': value, 'edid': id, 'index':<?= $index; ?>};
                post('./ajax/setPermissao.php', function (data) {}, postData);

            };
            var prefix_system = "../../";
            $("#loadingbar").hide();
            $("input[type='checkbox']").bootstrapSwitch();
            $("#class").val(<?= $index; ?>);

        </script>
<?PHP include '../../includes/navbar.php'; ?>
    </body>
</html>
