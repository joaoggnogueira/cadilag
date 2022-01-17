/* global iduser, idestrutura, swal, Opentip */

$(document).ready(function () {
    $("#AlgoritmoDiv").show();
    $(".algoritmo[id='remocao']").hide();
    $(".algoritmo[id='busca']").hide();
    $("#AlgoritmoDiv").hide();
    $("#loadCode").click(showOpenDialogCode);
    $("#newCode").click(newCode);
    $("#saveCode").click(saveCode);
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    var algoritmoS = new AlgoritmoServer('Padrão', "Pseudo-Código");
    $("#toggleOptions").click(function () {
        $(".appoptions").slideToggle(400);
        $("#AlgoritmoDiv").toggleClass('full');
    });
    $(".appoptions > button").tipsy({title: 'title', html: true, gravity: 'n'});
    $("#dialogOpenCode,#dialogOpenCode #cancel").click(hideOpenDialogCode);
    $("#selectorCode").click(function (evt) {
        evt.stopPropagation();
    });
    $("#dialogOpenCode .sidecontent button").click(function () {
        $("#dialogOpenCode .sidecontent button.selected").removeClass("selected");
        $(this).addClass("selected");
        loadListDialogCode();
    });
    $("#delimiter").change(function (event, selected) {
        if (selected) {
            AlgServer.changeDelimiter("<c>{</c>", "<c>}</c>");
        } else {
            AlgServer.resetDelimiter();
        }
    });
    $("#counterBlank").change(function (event, selected) {
        if (selected) {
            AlgServer.changeCounter(true);
        } else {
            AlgServer.changeCounter(false);
        }
    });
    Opentip.styles.codeStyle = {
        extends: "dark",
        tipJoint: "right",
        showEffectDuration: 0.1,
        hideEffectDuration: 0.1,
        background: "rgba(57,63,125,0.5)",
        target: true,
        fixed: true,
        stem: true,
        hideTriggers: ['tip', 'trigger'],
        hideDelay: 0.2,
        hideOn: 'mouseout',
        removeElementsOnHide: true,
        delay: 0.5
    };
    $(".code p").each(function () {
        var thisObj = $(this);
        var objId = thisObj.attr('id');
        if (objId !== undefined) {
            var parents = thisObj.parents('.algoritmo');
            var id = objId.substring(1);
            var value = thisObj.html();

            switch (value) {
                case "INICIO":
                    thisObj.addClass("delimiterUp");
                    break;
                case "FIM":
                    thisObj.addClass("delimiterDown");
                    break;
            }

            var title = thisObj.attr('title');
            value = value.replace("&nbsp;", " ");
            if (value.startsWith("  ")) {
                value = value.substring(2);
                thisObj.html(value);
            }
            var newObj = {valueAtual: value, value: value, titleAtual: title, title: title};
            var lineObj = {d: thisObj.get(), title: title};
            switch (parents.attr("id")) {
                case "insercao":
                    algoritmoS.addlines[id] = newObj;
                    AlgServer.addLines[id] = lineObj;
                    break;
                case "remocao":
                    algoritmoS.remlines[id] = newObj;
                    AlgServer.remLines[id] = lineObj;
                    break;
                case "busca":
                    algoritmoS.searchlines[id] = newObj;
                    AlgServer.searchLines[id] = lineObj;
                    break;
            }
            if (thisObj.attr('title') !== undefined) {
                lineObj.tip = new Opentip(thisObj, thisObj.attr('title'), {style: "codeStyle"});
                thisObj.removeAttr('title');
            }
        } else {
            thisObj.addClass('empty');
        }
        thisObj.html(Color2Pseudo(thisObj.html()));
    });
    AlgServer.add(algoritmoS);
    $("#codeSelect").select2();
    triggerCoolCheckbox();

//    debugAlgoritmoLineOffset();

});

function debugAlgoritmoLineOffset() {
    var div = $("<div/>").
            css("top", "100px").
            css("left", "0px").
            css("position", "absolute");

    var pini = $("<p/>").css("margin", "0px");
    var pfim = $("<p/>").css("margin", "0px");
    var ptop = $("<p/>").css("margin", "0px");
    var input = $("<input type='number'/>").css("width", "50px").val("1");
    var button = $("<button/>").text("Focar");

    div.append(input);
    div.append(pini);
    div.append(ptop);
    div.append(pfim);
    div.append(button);
    var parent = $(".algoritmo#insercao");
    button.click(function () {
        var child = parent.find("#l" + input.val());
        var ini = 0;
        var fim = 0 + parent.height() - 20;
        var top = child.offset().top - 190;
        if (top < ini || top > fim) {
            parent.scrollTop(0);
            parent.animate({
                scrollTop: top + 'px'
            }, 200 * CONFIG.SPEED);
        }

    });

    $("#main").append(div);

    parent.scroll(function () {
        var child = parent.find("#l" + input.val());
        var ini = 0;
        var fim = 0 + parent.height() - 20;
        var top = child.offset().top - 190;

        pini.text(ini);
        ptop.text(top);
        pfim.text(fim);

        if (top < ini || top > fim) {
            ptop.css("color", "red");
        } else {
            ptop.css("color", "blue");
        }
    });
}

function AlgoritmoServer(title, language) {
    this.addlines = [];
    this.remlines = [];
    this.searchlines = [];
    this.title = title;
    this.language = language;
    this.id = -1;
    this.editable = false;
    this.toString = function () {
        return this.title + " (" + this.language + ")";
    };
}

window.AlgServer = {
    algoritmos: [],
    addLines: [],
    remLines: [],
    searchLines: [],
    selected: 0,
    listaDeCodigos: null,
    add: function (algserver) {
        this.algoritmos[this.algoritmos.length] = algserver;
        return this.algoritmos.length - 1;
    }, linePrepare: function (algoritmoLine, serverLine, queryObj) {
        var thisObj = $(queryObj);
        if (algoritmoLine !== undefined && thisObj.length === 1) {
            var value = algoritmoLine.valueAtual;
            if (value.startsWith("  ")) {
                value = value.substring(2);
                value = "&nbsp; " + value;
            }
            thisObj.html(Color2Pseudo(value));
            var title = algoritmoLine.titleAtual;
            if (!this.selectedIsEditable()) {
                if (title !== undefined) {
                    serverLine.tip.setContent(title);
                } else {
                    if (serverLine.tip === undefined) {
                        serverLine.tip = new Opentip(thisObj, content, {style: "codeStyle"});
                    }
                    serverLine.tip.deactivate();
                }
            } else {
                var content = "";
                if (title !== undefined) {
                    content = "<b>Descrição</b><p onclick='openEditLineTitle($(\"" + queryObj + "\"));' class='editTitleLine'>" + title + "</p><br></div>";
                } else {
                    content = "<b>Descrição</b><p onclick='openEditLineTitle($(\"" + queryObj + "\"));' class='editTitleLine empty'>< Sem Descrição ></p><br></div>";
                }
                content += "<span class='separatorTooltip'></span>\
                            <b>Antigamente era:</b><br>" + algoritmoLine.value + "\
                            <span class='separatorTooltip'></span>\
                            <br><br>\
                            <button onclick='openEditLineAlgoritmo($(\"" + queryObj + "\"));'>Editar linha</button>\
                            <button onclick='openEditLineTitle($(\"" + queryObj + "\"));'>Editar descrição</button>";
                if (serverLine.tip === undefined) {
                    serverLine.tip = new Opentip(thisObj, content, {style: "codeStyle"});
                } else {
                    serverLine.tip.setContent(content);
                    serverLine.tip.activate();
                }
            }
        }
    }, select: function (index) {
        if (this.algoritmos[index]) {
            clearLines();
            this.selected = index;
            for (var i = 0; i < this.algoritmos[index].addlines.length; i++) {
                this.linePrepare(
                        this.algoritmos[index].addlines[i],
                        this.addLines[i],
                        ".algoritmo#insercao #l" + i);
            }
            for (var i = 0; i < this.algoritmos[index].remlines.length; i++) {
                this.linePrepare(
                        this.algoritmos[index].remlines[i],
                        this.remLines[i],
                        ".algoritmo#remocao #l" + i);
            }
            for (var i = 0; i < this.algoritmos[index].searchlines.length; i++) {
                this.linePrepare(
                        this.algoritmos[index].searchlines[i],
                        this.searchLines[i],
                        ".algoritmo#busca #l" + i);
            }
            $("#codeSelect").val(index);
            $("#codeSelect").select2();
            if (this.algoritmos[index].editable) {
                $("#saveCode").removeAttr("disabled");
            } else {
                $("#saveCode").attr("disabled", "disabled");
            }
            AlgServer.fixSize();
        }
    }, selectedIsEditable: function () {
        return this.algoritmos[this.selected].editable;
    }, duplicate: function (fromIndex, toIndex) {
        var i;
        var toAlg = this.algoritmos[toIndex];
        var fromAlg = this.algoritmos[fromIndex];
        for (i in this.algoritmos[fromIndex].addlines) {
            toAlg.addlines[i] = clone(fromAlg.addlines[i]);
        }
        for (i in this.algoritmos[fromIndex].remlines) {
            toAlg.remlines[i] = clone(fromAlg.remlines[i]);
        }
        for (i in this.algoritmos[fromIndex].searchlines) {
            toAlg.searchlines[i] = clone(fromAlg.searchlines[i]);
        }

    },
    fixSize: function () {
        $(".code p").each(function () {
            $(this).removeClass("big_one").removeClass("big_two").removeClass("big_three");
            var height = $(this).height();
            if (height >= 80) {
                $(this).addClass("big_three");
            } else if(height >= 60) {
                $(this).addClass("big_two");
            } else if(height >= 40){
                $(this).addClass("big_one");
            }
        });

    },
    searchCode: function (id) {
        for (var key in this.algoritmos) {
            if (this.algoritmos[key] !== null && this.algoritmos[key].id === id)
                return key;
        }
        return -1;
    },
    closeCodeById: function (id) {
        this.closeCode(this.searchCode(id));
    },
    closeCode: function (index) {
        $("#codeSelect").find("option[value='" + index + "']").remove();
        $("#codeSelect").select2();
        this.algoritmos[index] = null;
    },
    putNewAlgoritmoLines: function (id, title, language, addlines, remlines, searchlines) {
        var index = this.algoritmos.length;
        var alg = new AlgoritmoServer(title, language);

        alg.id = id;
        for (var i = 0; i < addlines.length; i++) {
            var line = clone(addlines[i]);
            line.valueAtual = line.value;
            line.titleAtual = line.title;
            alg.addlines[i] = line;
        }
        for (var i = 0; i < remlines.length; i++) {
            var line = clone(remlines[i]);
            line.valueAtual = line.value;
            line.titleAtual = line.title;
            alg.remlines[i] = line;
        }
        for (var i = 0; i < searchlines.length; i++) {
            var line = clone(searchlines[i]);
            line.valueAtual = line.value;
            line.titleAtual = line.title;
            alg.searchlines[i] = line;
        }
        this.algoritmos[index] = alg;
        return index;
    },
    changeDelimiter: function (valueUp, valueDown) {
        $(".delimiterUp").html(valueUp);
        $(".delimiterDown").html(valueDown);
    },
    changeCounter: function (blank) {
        if (blank) {
            $("#AlgoritmoDiv").addClass("counterInvisible");
        } else {
            $("#AlgoritmoDiv").removeClass("counterInvisible");
        }
    },
    resetDelimiter: function () {
        var resetFunction = function (obj) {
            var id = parseInt(obj.attr("id").substring(1));
            var value;
            switch (obj.parents(".algoritmo")[0].id) {
                case "insercao":
                    value = AlgServer.algoritmos[AlgServer.selected].addlines[id].value;
                    break;
                case "remocao":
                    value = AlgServer.algoritmos[AlgServer.selected].remlines[id].value;
                    break;
                case "busca":
                    value = AlgServer.algoritmos[AlgServer.selected].searchlines[id].value;
                    break;
            }
            value = Color2Pseudo(value);
            obj.html(value);
        };
        $(".delimiterUp").each(function () {
            resetFunction($(this));
        });
        $(".delimiterDown").each(function () {
            resetFunction($(this));
        });
    }
};

function clone(obj) {
    if (null === obj || "object" !== typeof obj)
        return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}


function hideOpenDialogCode() {
    $("#dialogOpenCode").slideUp(400);
    $("#codeSelect").val(AlgServer.selected).trigger("change");
    AlgServer.listaDeCodigos = null;
}

function getDetailsCode(idCode, callback) {
    post("./ajax/getDetailCode.php", function (data) {
        callback(data.code.title, data.code.language, data.code.idEstrutura);
    }, {idCode: idCode});
}

function getCode(idCode, linguagem, titulo, idUser) {
    var data = {"idCode": idCode};
    $(".algoritmo").addClass('hide');
    post("./ajax/getCode.php", function (data) {
        var funct = function () {
            AlgServer.closeCodeById(idCode);
            var index = AlgServer.putNewAlgoritmoLines(idCode, titulo, linguagem, data.addLines, data.remLines, data.searchLines);
            if (idUser == "" + iduser) {
                appendNewOptSelect({value: index, text: AlgServer.algoritmos[index].toString()}, "oneditcodegp");
                AlgServer.algoritmos[index].editable = true;
            } else {
                appendNewOptSelect({value: index, text: AlgServer.algoritmos[index].toString()}, "onprotectedcodegp");
            }
            AlgServer.select(index);
            $(".algoritmo").removeClass('hide');

            hideOpenDialogCode();
        };

        var indexsearch = AlgServer.searchCode(idCode);
        if (indexsearch !== -1) {
            swal({title: "O mesmo código já esta aberto",
                text: "Deseja fechar o atual e carregar do sistema?", type: "warning", showCancelButton: true}, function (inputValue) {
                if (!inputValue) {
                    $(".algoritmo").removeClass('hide');
                } else {
                    funct();
                }
            });
        } else {
            funct();
        }

    }, data);
}

function saveCode() {
    var dataAdd = [];
    var dataRem = [];
    var dataSearch = [];
    var addLines = AlgServer.algoritmos[AlgServer.selected].addlines;
    var remLines = AlgServer.algoritmos[AlgServer.selected].remlines;
    var searchLines = AlgServer.algoritmos[AlgServer.selected].searchlines;
    var key;
    for (key in addLines) {
        dataAdd[key] = {value: addLines[key].valueAtual, title: addLines[key].titleAtual};
    }
    for (key in remLines) {
        dataRem[key] = {value: remLines[key].valueAtual, title: remLines[key].titleAtual};
    }
    for (key in searchLines) {
        dataSearch[key] = {value: searchLines[key].valueAtual, title: searchLines[key].titleAtual};
    }
    var fUpdate = function () {
        for (key in addLines) {
            addLines[key].value = addLines[key].valueAtual;
        }
        for (key in remLines) {
            remLines[key].value = remLines[key].valueAtual;
        }
        for (key in searchLines) {
            searchLines[key].value = searchLines[key].valueAtual;
        }
    };
    if (AlgServer.algoritmos[AlgServer.selected].id === -1) {
        var data = {dataAdd: dataAdd, dataRem: dataRem, dataSearch: dataSearch, idEstrutura: idestrutura, title: AlgServer.algoritmos[AlgServer.selected].title, language: AlgServer.algoritmos[AlgServer.selected].language};
        post("./ajax/insertCode.php", function (data) {
            AlgServer.algoritmos[AlgServer.selected].id = data.lastId;
            fUpdate();
            swal({title: "Código Salvo com sucesso", type: "success"});
        }, data);
    } else {
        var data = {dataAdd: dataAdd, dataRem: dataRem, dataSearch: dataSearch, idCode: AlgServer.algoritmos[AlgServer.selected].id};
        post("./ajax/updateCode.php", function () {
            fUpdate();
            swal({title: "Código Alterado com sucesso", type: "success"});
        }, data);
    }
}

function newCode() {
    $(".algoritmo").addClass('hide');
    swal({
        title: "Insira um rótulo para o código",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "Rótulo aqui"
    },
            function (inputValue) {
                if (inputValue === false) {
                    $("#codeSelect").val(AlgServer.selected).trigger("change");
                    $(".algoritmo").removeClass('hide');
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("Rótulo não pode ser vazio");
                    return false;
                }
                swal({
                    title: "Selecione a linguagem",
                    text: "<form class='pure-form'><select id='languageCode' style='height:45px;width:300px;'>\
                    <option value='Pseudo-Código'>Pseudo-Código</option>\
                    <option value='C' selected>C</option>\
                    <option value='C++'>C++</option>\
                    <option value='Java'>Java</option>\
                    </select></form>",
                    html: true
                }, function () {
                    var algS = new AlgoritmoServer(inputValue, $("#languageCode").val());
                    var pos = AlgServer.add(algS);
                    appendNewOptSelect({value: pos, text: algS.toString()}, "oneditcodegp");
                    algS.editable = true;
                    AlgServer.duplicate(AlgServer.selected, pos);
                    AlgServer.select(pos);
                    $(".algoritmo").removeClass('hide');

                });
            });
}

function getNameUser(nickname, firstname, lastname, email) {
    var title;
    if (nickname !== null && nickname !== '') {
        title = nickname;
    } else if (firstname !== null && firstname !== '') {
        title = firstname;
    } else if (lastname !== null && lastname !== '') {
        title = "Sr(a). ".lastname;
    } else {
        title = email;
    }
    return title;
}

function appendCodeList(list, data) {
    var li = document.createElement("li");
    li.onclick = function () {
        getCode(data.idCode, data.linguagem, data.titulo, data.iduser);
    };
    var value = document.createElement("div");
    value.className = "value";
    value.innerHTML = data.titulo + " em " + data.linguagem;
    var footer = document.createElement("div");
    footer.className = "foot";
    footer.innerHTML = "por " + getNameUser(data.nickname, data.fname, data.lname, data.email) + " em " + data.datetime;
    li.appendChild(value);
    li.appendChild(footer);
    list.appendChild(li);
}

function loadListDialogCode() {
    $("#dialogOpenCode").slideDown(400);
    var key;
    var list = $("#dialogOpenCode .content").get()[0];
    var empty = true;
    var onlyThisUser = $("#dialogOpenCode button[name='onlyUserCode']").hasClass('selected');
    list.innerHTML = "";
    for (key in AlgServer.listaDeCodigos) {
        if (onlyThisUser) {
            if (AlgServer.listaDeCodigos[key].iduser === "" + iduser) {
                appendCodeList(list, AlgServer.listaDeCodigos[key]);
                empty = false;
            }
        } else {
            if (AlgServer.listaDeCodigos[key].iduser !== "" + iduser) {
                appendCodeList(list, AlgServer.listaDeCodigos[key]);
                empty = false;
            }
        }
    }
    if (empty) {
        var li = document.createElement("li");
        li.innerHTML = "Vazio";
        li.className = "empty";
        list.appendChild(li);
    }
}

function showOpenDialogCode() {
    if (AlgServer.listaDeCodigos === null) {
        post("./ajax/listCode.php", function (data) {
            AlgServer.listaDeCodigos = data.lista;
            loadListDialogCode();
        }, {idEstrutura: idestrutura});
    } else {
        loadListDialogCode();
    }

}

function appendNewOptSelect(opt, parentId) {
    if ($('#' + parentId).length === 0) {
        var optgroup = document.createElement('optgroup');
        optgroup.id = parentId;
        optgroup.setAttribute("label", "Seus Códigos");
        document.getElementById('codeSelect').appendChild(optgroup);
    }
    var option = document.createElement('option');
    option.value = opt.value;
    option.text = opt.text;
    document.getElementById(parentId).appendChild(option);
}

function changeCodeSelector(elemento) {
    if (parseInt(elemento.value) !== AlgServer.selected) {
        $(".algoritmo").addClass('hide');
        setTimeout(function () {
            AlgServer.select(parseInt(elemento.value));
            $(".algoritmo").removeClass('hide');
        }, 500);
    }
}

function HighlighterAlgoritmo(algoritmo) {
    this.algoritmoSelecionado;
    switch (algoritmo) {
        case VK.INSERCAO:
            algoritmoSelecionado = $('#insercao');
            break;
        case VK.REMOCAO:
            algoritmoSelecionado = $('#remocao');
            break;
        case VK.BUSCA:
            algoritmoSelecionado = $('#busca');
            break;
        default:
            console.log("Grifador: Algoritmo não encontrado");
    }
    this.line = function (line, time) {
        checkScrollToAction(algoritmoSelecionado, algoritmoSelecionado.find("#l" + line));
        timeout(function () {
            resetLines(algoritmoSelecionado);
            var obj = algoritmoSelecionado.find("#l" + line);
            obj.addClass('current_line');
            scrollTo(algoritmoSelecionado, obj);
            UI.triggerNext();
        }, time);
    };
    this.lines = function (ini, fim, time) {
        if (ini > fim) {
            var aux = fim;
            fim = ini;
            ini = aux;
        }
        if(algoritmoSelecionado.find === undefined){
            console.log(algoritmoSelecionado);
            console.log("Objeto não inicializado");
        }
        var fimObj = algoritmoSelecionado.find("#l" + fim);
        checkScrollToAction(algoritmoSelecionado, fimObj);
        timeout(function () {
            resetLines(algoritmoSelecionado);
            while (ini <= fim) {
                var obj = algoritmoSelecionado.find("#l" + ini);
                obj.addClass('current_line');
                ini++;
            }
            scrollTo(algoritmoSelecionado, fimObj);
            UI.triggerNext();
        }, time);
    };
    this.lineRed = function (line, time) {
        timeout(function () {
            var obj = algoritmoSelecionado.find("#l" + line);
            obj.addClass('second_line');
            if(obj.hasClass("while_l")) {
                UI.triggerNext();
            }
        }, time);
    };
    this.lineGreen = function (line, time) {
        timeout(function () {
            var obj = algoritmoSelecionado.find("#l" + line);
            obj.addClass('call_line');
            UI.triggerNext();
        }, time);
    };
    this.clear = function (time) {
        timeout(function () {
            resetLines(algoritmoSelecionado);
        }, time);
    };
}

$(function () {
    window.VK = {
        INSERCAO: 1,
        REMOCAO: 2,
        BUSCA: 3
    };
    window.CONFIG = {
        SPEED: 1
    };

    var selected = VK.INSERCAO;
    var atualScrollAdvent = false;
    function ScrollAdvent() {
        this.count = 0;
        this.array = [];
        this.add = function (child) {
            this.array[this.count] = child;
            this.count++;
        };
        this.getTop = function (parent) {
            var height = parent.height();
            var top = this.array[0].offset().top - 190 - height / 2;
            //Se ocorrer erro aqui significa que a linha chamada não existe
            for (var i = 1; i < this.count; i++) {
                var thistop = this.array[1].offset().top - 190 - height / 2;
                var dif = thistop - top;
                top += dif / (i + 1);
            }
            return top;
        };
    }

    resetLines = function (parent) {
        parent.find('.second_line').removeClass('second_line');
        parent.find('.current_line').removeClass('current_line');
        parent.find('.call_line').removeClass('call_line');
    };
    clearLines = function () {
        resetLines($(".code"));
    };
    toggleOptionLineCode = function (button) {
        $(button).toggleClass('open');
    };
    checkLineIsVisible = function (parent, child) {
        var ini = 0;
        var fim = ini + parent.height() - 20;
        var offset = child.offset();
        if(offset === undefined){
            return true;
        }
        var top = offset.top - 190;
        return !(top < ini || top > fim);
    };
    checkScrollToAction = function (parent, child) {
        if ($("#followCode").hasClass("selected")) {
            if (atualScrollAdvent) {
                atualScrollAdvent.add(child);
            } else {
                if (!checkLineIsVisible(parent, child)) {
                    atualScrollAdvent = new ScrollAdvent();
                    atualScrollAdvent.add(child);
                }
            }
        }
    };
    scrollTo = function (parent, child) {
        if ($("#followCode").hasClass("selected")) {
            if (!checkLineIsVisible(parent, child)) {
                parent.scrollTop(0);
                var top = 0;
                if (atualScrollAdvent) {
                    top = atualScrollAdvent.getTop(parent);
                } else {
                    top = child.offset().top - 190 - parent.height() / 2;
                }
                parent.animate({
                    scrollTop: top + 'px'
                }, 200 * CONFIG.SPEED);
                atualScrollAdvent = false;
            }
        }
    };
    toggleTabCode = function (tabcode) {
        tabcode.slideToggle(200);
    },
    setSpeed = function (speedfloat) {
        CONFIG.SPEED = speedfloat;
    },
    getSpeed = function () {
        return CONFIG.SPEED;
    },
    $("#showinsercao").click(function () {
        setalgoritmo(VK.INSERCAO);
    });
    $('#add').bind('click', function () {
        setUniqueCounterEp();
        setalgoritmo(VK.INSERCAO);
        History.appendInput(VK.INSERCAO);
    }),
            $("#showremocao").click(function () {
        setalgoritmo(VK.REMOCAO);
    });
    $('#remove').bind('click', function () {
        setUniqueCounterEp();
        setalgoritmo(VK.REMOCAO);
        History.appendInput(VK.REMOCAO);
    });
    $("#showbusca").click(function () {
        setalgoritmo(VK.BUSCA);
    });
    $('#search').bind('click', function () {
        setUniqueCounterEp();
        setalgoritmo(VK.BUSCA);
    });
    setalgoritmo = function (t) {
        toggleHideSidebar();
        switch (t) {
            case VK.INSERCAO:
                window.ButtonApp.lightupAdd();
                break;
            case VK.REMOCAO:
                window.ButtonApp.lightupRem();
                break;
            case VK.BUSCA:
                window.ButtonApp.lightupSearch();
                break;
        }
        if (selected !== t) {
            switch (selected) {
                case VK.INSERCAO:
                    $('.algoritmo#insercao').hide();
                    $('button#showinsercao').removeClass("selected");
                    break;
                case VK.REMOCAO:
                    $('.algoritmo#remocao').hide();
                    $('button#showremocao').removeClass("selected");
                    break;
                case VK.BUSCA:
                    $('.algoritmo#busca').hide();
                    $('button#showbusca').removeClass("selected");
                    break;
            }
            switch (t) {
                case VK.INSERCAO:
                    $('.algoritmo#insercao').show();
                    $('button#showinsercao').addClass("selected");
                    window.ButtonApp.lightupAdd();
                    break;
                case VK.REMOCAO:
                    $('.algoritmo#remocao').show();
                    $('button#showremocao').addClass("selected");
                    window.ButtonApp.lightupRem();
                    break;
                case VK.BUSCA:
                    $('.algoritmo#busca').show();
                    $('button#showbusca').addClass("selected");
                    window.ButtonApp.lightupSearch();
                    break;
            }
            AlgServer.fixSize();
        }
        selected = t;
    };
    $('.code p').click(function (evento) {
        var obj = $(this);
        if (obj.length !== 0 && !obj.hasClass('empty'))
            toggleLineAlgoritmo(obj, evento);
    });

    clearSelection = function () {
        if (window.getSelection) {
            if (window.getSelection().empty)
                window.getSelection().empty();
            else if (window.getSelection().removeAllRanges)
                window.getSelection().removeAllRanges();
        } else if (document.selection)
            document.selection.empty();
    };

    openEditLineTitle = function (line) {
        var titlep = $(".editTitleLine");
        var input = document.createElement("textarea");
        input.className = "editTitleAlg";
        if (!titlep.hasClass("empty")) {
            input.innerHTML = titlep[0].innerHTML;
        } else {
            input.innerHTML = "";
        }
        var revertEdit = function () {
            var innerHtml = input.value;
            var id = parseInt(line.attr('id').substring(1));
            var algoritmo = line.parents('.algoritmo').attr('id');
            var lineD, lineS, query;
            switch (algoritmo) {
                case 'insercao':
                    lineD = AlgServer.algoritmos[AlgServer.selected].addlines[id];
                    lineS = AlgServer.addLines[id];
                    query = ".algoritmo#insercao #l" + id;
                    break;
                case 'remocao':
                    lineD = AlgServer.algoritmos[AlgServer.selected].remlines[id];
                    lineS = AlgServer.remLines[id];
                    query = ".algoritmo#remocao #l" + id;
                    break;
                case 'busca':
                    lineD = AlgServer.algoritmos[AlgServer.selected].searchlines[id];
                    lineS = AlgServer.searchLines[id];
                    query = ".algoritmo#busca #l" + id;
                    break;
            }

            lineD.titleAtual = (innerHtml != "" ? innerHtml : undefined);
            AlgServer.linePrepare(lineD, lineS, query);
            $(input).remove();
            titlep.html((innerHtml != "" ? innerHtml : "<Sem Descrição>"));
            titlep.show();
            
        };
        var keyEvent = function (event) {
            if (event.key === "Enter") {
                revertEdit();
            }
        };
        input.onkeydown = keyEvent;
        input.onblur = revertEdit;
        $(input).insertAfter(titlep);
        $(input).focus();
        titlep.hide();
    };
    openEditLineAlgoritmo = function (line) {
        var innerHtml = strip(line.html());
        var span = document.createElement("span");
        var input = document.createElement("input");
        span.className = "spanInputCode";
        span.setAttribute("counter", line.attr("counter"));
        input.className = "inputcode" + (line.hasClass('handlerTab') ? ' handlerTab' : "");
        input.value = innerHtml;
        span.appendChild(input);
        var d = line.get();
        var revertEdit = function () {
            var innerHtml = input.value;
            var id = parseInt(line.attr('id').substring(1));
            var algoritmo = line.parents('.algoritmo').attr('id');
            var lineD;
            switch (algoritmo) {
                case 'insercao':
                    lineD = AlgServer.algoritmos[AlgServer.selected].addlines[id];
                    break;
                case 'remocao':
                    lineD = AlgServer.algoritmos[AlgServer.selected].remlines[id];
                    break;
                case 'busca':
                    lineD = AlgServer.algoritmos[AlgServer.selected].searchlines[id];
                    break;
            }
            if (innerHtml === '') {
                innerHtml = '<br>';
            }

            lineD.valueAtual = innerHtml;
            $(d).html(Color2Pseudo(innerHtml));
            $(span).remove();
            $(d).show();
            AlgServer.fixSize();
        };
        var keyEvent = function (event) {
            if (event.key === "Enter") {
                revertEdit();
            } else if (event.key === "Tab") {
                var id = parseInt(line.attr('id').substring(1));

                openEditLineAlgoritmo(line.parents('.algoritmo').find("#l" + (id + 1)));
                revertEdit();
            }
        };
        input.onkeydown = keyEvent;
        input.onblur = revertEdit;


        $(span).insertAfter(d);
        $(input).focus();
        line.hide();
    };

    toggleLineAlgoritmo = function (line, evento) {
        var pass = true;
        if (line.hasClass('handlerTab')) {
            var relativeX = evento.pageX - line.offset().left;
            pass = relativeX > 20;
            if (!pass) {
                line.toggleClass('hide');
                toggleTabCode(line.next('.TabCode').eq(0));
            }
        }
        if (pass) {
            if (AlgServer.selectedIsEditable()) {
                openEditLineAlgoritmo(line);
            } else {
                clearSelection();
                if (line.hasClass('current_line')) {
                    if (evento.shiftKey === false && evento.ctrlKey === false) {
                        clearLines();
                    } else
                        line.removeClass('current_line');
                } else {
                    if (evento.shiftKey === false && evento.ctrlKey === false) {
                        clearLines();
                    }
                    line.addClass('current_line');
                }
            }
        }
    };
});