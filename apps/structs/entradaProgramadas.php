<?PHP
session_start();

if (!isset($_SESSION['email']) || !isset($_SESSION['senha'])) {
    include "../../includes/session_expired.php";
    exit();
}

include '../../config/Database.php';
include '../../controladores/ControladorUsuario.php';
include '../../entidades/EstruturaDeDados.php';
include './controladores/ControladorEp.php';
include './controladores/PDOCadilag.php';
include './entidades/EntradaProgramada.php';
include './controladores/EpPDO.php';

$email = $_SESSION['email'];
$password = $_SESSION['senha'];

$controladorEp = new controladores\ControladorEp();

if (!$controladorEp->checkAcess($email, $password)) {
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
        <title>Cadilag Estruturas</title>
        <link href='../../css/sweetalert.css' rel='stylesheet'/>
        <link href="./css/index.css" rel="stylesheet"/>
        <link href="./css/entradaProgramada.css" rel="stylesheet"/>
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
            <div class="subtitle"><h1>Entrada Programada</h1></div>
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
        <?PHP include '../../includes/navbar.php'; ?>
        <table id="content">
            <tbody>
                <?PHP include './includes/index/editorEp.php'; ?>
            </tbody>
        </table>
        <div id="editorEp">
            <div id="editTable">
                <table>
                    <tbody>
                        <tr>
                            <td><div class="title">Editar Entrada Programada</div></td>
                            <td><button class="optionEp cancel" onclick="hideEditor();"></button></td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <th>Rótulo : </th>
                            <td><input id="rotulo"/></td>
                            <td><button class='optionEp reset' onclick="revertEp()">Reverter</button></td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tr>
                        <td><button class="optionEp save" onclick="saveEp()">Salvar</button></td>
                        <td><button class="optionEp delete" onclick="deleteEpEditor()">Deletar</button></td>
                    </tr>
                </table>
                <table id="tableEp"></table>
            </div>
        </div>
        <script>
            $(".title-scn").each(function () {
                var parent = $(this).parents("tr");
                $(this).click(function () {
                    $(parent.find(".list")[0]).slideToggle(400);
                });
            });

            var onEdit = null;
            function deleteEpEditor() {
                deleteEp(onEdit.id, onEdit.d);
                hideEditor();
            }
            function openEp(id, d, idEstrutura) {
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
                page = "./" + page + ".php?action=openep&idEp=" + id;
                window.location.href = page;
            }
            function deleteEp(id, d) {
                swal({
                    title: "Você tem certeza?",
                    text: "Deseja remover a entrada!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true},
                        function (isConfirm) {
                            if (isConfirm) {
                                post('./ajax/deleteEp.php', function () {
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
                                    swal({title: "Sucesso", text: "Entrada Programada removida", type: "success"});
                                }, {id: id});
                            }

                        }
                );
            }

            function hideEditor() {
                onEdit = null;
                $("#editorEp").slideUp(500);
                $("#content").css('filter', 'none');
            }

            function pressEpAdd(d) {
                var selector = $(d);
                selector.find(".epRem").removeClass('EpSelectType');
                selector.find(".epRem p").animate({'margin-right': '-121px'}, 400, 'easeOutCubic');
                selector.find(".epSeparator").animate({'margin-left': '91px', "border-left-width": "4px", "border-right-width": "0px"}, 400, 'easeOutCubic');
                selector.find(".epAdd").animate({'width': '106px'}, 400, 'easeOutCubic').addClass('EpSelectType');
                selector.find(".epAdd p").animate({'margin-left': '25px'}, 400, 'easeOutCubic');
                selector.attr('value', 'add');
            }
            function pressEpRem(d) {
                var selector = $(d);
                selector.find(".epAdd").animate({'width': '0px'}, 400, 'easeOutCubic').removeClass('EpSelectType');
                selector.find(".epAdd p").animate({'margin-left': '-131px'}, 400, 'easeOutCubic');
                selector.find(".epSeparator").animate({'margin-left': '-5px', "border-left-width": "0px", "border-right-width": "4px"}, 400, 'easeOutCubic');
                selector.find(".epRem p").animate({'margin-right': '15px'}, 400, 'easeOutCubic');
                selector.find(".epRem").addClass('EpSelectType');
                selector.attr('value', 'rem');
            }

            function toggleEpType(d) {
                if ($(d).attr('value') === 'add') {
                    pressEpRem(d);
                } else {
                    pressEpAdd(d);
                }
            }

            function appendFunction(tr) {
                var td = $("<td/>").appendTo(tr);
                var epFunction = $("<div class='epFunction' onclick='toggleEpType(this);'/>").appendTo(td);
                $("<div class='epAdd'><p>Insere</p></div>").appendTo(epFunction);
                $("<div class='epSeparator'></div>").appendTo(epFunction);
                $("<div class='epRem'><p>Remove</p></div>").appendTo(epFunction);
                return epFunction;
            }

            function getInputObj(row, column) {
                var table = $("#tableEp");
                var tr = table.find('tr:not(:first-child)').eq(row);
                return tr.find("input").eq(column);
            }
            function hasAdd(row) {
                var table = $("#tableEp");
                var tr = table.find('tr:not(:first-child)').eq(row);
                return tr.find(".EpFunction").attr('value') === 'add';
            }
            function keyDownOnEp(e, d) {
                var thisObj = $(d);
                var parent = thisObj.parents('tr').eq(0);
                var table = $("#tableEp");
                var objList = table.find('tr:not(:first-child)');
                var cont = objList.index(parent);
                var qtd = objList.length;
                var totalcolumn = table.find('th:not(:last-child)').length;
                var column = parent.find("input").index(d);
                if (e.keyCode === 8) {
                    if (column !== 0) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        if (start === 0) {
                            var value = getInputObj(cont, column - 1).val();
                            getInputObj(cont, column - 1).focus().prop("selectionStart", value.length).prop("selectionEnd", value.length);
                            e.preventDefault();
                        }
                    } else if (cont !== 0) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        if (start === 0) {
                            var value = getInputObj(cont - 1, totalcolumn - 1).val();
                            getInputObj(cont - 1, column - 1).focus().prop("selectionStart", value.length).prop("selectionEnd", value.length);
                            e.preventDefault();
                        }
                    }
                } else if (e.keyCode === 38) {
                    if (cont !== 0) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        getInputObj(cont - 1, column).focus().prop("selectionStart", start).prop("selectionEnd", start);
                        e.preventDefault();
                    }
                } else if (e.keyCode === 40) {
                    if (cont < qtd) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        getInputObj(cont + 1, column).focus().prop("selectionStart", start).prop("selectionEnd", start);
                        e.preventDefault();
                    }
                } else if (e.keyCode === 39) {
                    if (column < totalcolumn - 1) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        var value = getInputObj(cont, column).val();
                        if (value.length === start) {
                            getInputObj(cont, column + 1).focus().prop("selectionStart", 0).prop("selectionEnd", 0);
                            e.preventDefault();
                        }
                    }

                } else if (e.keyCode === 37) {
                    if (column !== 0) {
                        var start = getInputObj(cont, column).prop("selectionStart");
                        if (start === 0) {
                            var value = getInputObj(cont, column - 1).val();
                            getInputObj(cont, column - 1).focus().prop("selectionStart", value.length).prop("selectionEnd", value.length);
                            e.preventDefault();
                        }
                    }
                }
            }
            function keyUpOnEp(e, d) {
                var thisObj = $(d);
                var parent = thisObj.parents('tr').eq(0);
                var table = $("#tableEp");
                var objList = table.find('tr:not(:first-child)');
                var cont = objList.index(parent);
                var qtd = objList.length;
                var totalcolumn = table.find('th:not(:first-child)').length;
                var fullEmpty = true;
                for (var j = 0; j < totalcolumn; j++) {
                    var value = getInputObj(cont, j).val();
                    fullEmpty = fullEmpty && (value === undefined || value === "");
                }
                if (!fullEmpty && cont === (qtd - 1)) {
                    addItem();
                    updateEpCount();
                } else if (fullEmpty && cont !== (qtd - 1)) {
                    if (cont !== (qtd - 2)) {
                        for (var i = cont; i + 1 < qtd; i++) {
                            for (var j = 0; j < totalcolumn; j++) {
                                getInputObj(i, j).val(getInputObj(i + 1, j).val());
                            }
                            if (hasAdd(i + 1)) {
                                pressEpAdd(objList.eq(i));
                            } else {
                                pressEpRem(objList.eq(i));
                            }
                        }
                        getInputObj(qtd - 2).val('');
                        pressEpAdd(objList.eq(qtd - 2));
                    }
                    updateEpCount();
                    objList.eq(qtd - 1).remove();
                    qtd--;
                }
                if (qtd === 1) {
                    pressEpAdd(objList.eq(0));
                }

            }

            function updateEpCount() {
                var list = $(".epCount");
                list.each(function (key) {
                    if (key !== list.length - 1) {
                        $(this).text(key);
                    } else {
                        $(this).text("");
                    }
                });
            }

            function addItem(item) {
                var table = $("#tableEp");
                var tr = $("<tr>" + key + "</tr>").appendTo(table);
                if (item !== undefined) {
                    $("<td><div class='epCount'></div></td>").appendTo(tr);
                    for (var key in item.info) {
                        $("<td><input onkeydown='keyDownOnEp(event,this)' onkeyup='keyUpOnEp(event,this)' value='" + item.info[key] + "'/></td>").appendTo(tr);
                    }
                    var epFunction = appendFunction(tr);
                    if (item.function === 'add') {
                        pressEpAdd(epFunction.get());
                    } else {
                        pressEpRem(epFunction.get());
                    }
                } else {
                    $("<td><div class='epCount'></div></td>").appendTo(tr);
                    table.find('th:not(:first-child):not(:last-child)').each(function () {
                        $("<td><input onkeydown='keyDownOnEp(event,this)' onkeyup='keyUpOnEp(event,this)'/></td>").appendTo(tr);
                    });
                    var epFunction = appendFunction(tr);
                    pressEpAdd(epFunction.get());
                }

            }
            function generateTable() {
                var table = $("#tableEp");
                var objList = table.find('th:not(:first-child):not(:last-child)');
                var resultado = [];
                var listTR = table.find("tr:not(:first-child):not(:last-child)");
                listTR.each(function (line) {
                    var input = {"info": {}, "function": hasAdd(line) ? "add" : "rem"};
                    var tr = $(this);
                    objList.each(function (column) {
                        input.info[$(this).html()] = tr.find("input").eq(column).val();
                    });
                    resultado[resultado.length] = input;
                });
                return resultado;
            }

            function saveEp() {

                var objList = $("#tableEp > tr:not(:first-child):not(:last-child)");
                if (objList.length > 1) {
                    var entradas = generateTable();
                    var postData = {
                        "id": onEdit.id,
                        "rotulo": $("#rotulo").val(),
                        "lista": entradas
                    };
                    post('./ajax/updateEp.php', function (result) {
                        var data = result.fetch;
                        var obj = $(onEdit.d);
                        onEdit.rotulo = data.rotulo;
                        $("#rotulo").val(data.rotulo);
                        var parent = obj.parents('.card');
                        parent.find('.total').text(entradas.length);
                        parent.find('.time').text(data.hora);
                        parent.find('.data').text(data.data);
                        parent.find('.head').text(data.rotulo);
                        swal({title: "Salvo", text: "A Entrada Programada foi alterada e salva", type: "success"});
                    }, postData);
                } else {
                    swal({title: 'Opss... ', text: 'É necessário pelo menos mais de uma entrada para salvar', type: 'error'});
                }
            }

            function revertEp() {
                applyData();
            }
            function applyData() {
                var rotulo = onEdit.rotulo;
                $("#editorEp").find("#rotulo").val(rotulo);
                var table = $("#tableEp").html("");
                var tr = $("<tr>" + key + "</tr>").appendTo(table);
                $("<th>#</th>").appendTo(tr).css('width', "30px");
                for (var key in onEdit.lista[0].info) {
                    $("<th>" + key + "</th>").appendTo(tr);
                }
                $("<th>Função</th>").appendTo(tr).css('width', "110px");
                $("#content").css('filter', 'blur(10px)');
                for (var i = 0; i < onEdit.lista.length; i++) {
                    addItem(onEdit.lista[i]);
                }
                addItem();
                updateEpCount();
            }
            function editEp(id, d) {
                var obj = $(d);
                var parent = obj.parents('.card');
                var rotulo = $.trim(parent.find('.head').text());
                onEdit = {id: id, d: d, rotulo: rotulo};
                post('./ajax/getEp.php', function (data) {
                    onEdit.lista = data.lista;
                    applyData(data.lista);
                    $("#editorEp").slideDown(400);
                }, {idEp: id});
            }
            var prefix_system = "../../";
        </script>
    </body>
</html>
