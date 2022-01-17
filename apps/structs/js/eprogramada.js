/* global swal, idestrutura */

jsPlumb.bind("ready", function () {
    window.Eprogramada.init();
    $('#EntradaProgramadaDiv').hide();

});

(function () {

    var i = 0;
    var lock = false;
    var EpOpened = null;

    function getNameUser(nickname, firstname, lastname, email) {
        var title = "#ERRO";
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

    setEpDetails = function (id, rotulo) {
        if (id != -1) {
            EpOpened = {id: id, rotulo: rotulo};
            document.getElementById("openedEpTitle").innerHTML = rotulo;
        } else {
            EpOpened = null;
            document.getElementById("openedEpTitle").innerHTML = "";
        }
    },
            setUniqueCounterEp = function () {
                $("#counterEp").html('<p>1/1</p>');
            },
            pressEpAdd = function (d) {
                var tr = $(d).parents("tr");
                if (tr.attr("disabled") !== "disabled") {
                    tr.find(".eprem").removeClass('EpSelectType');
                    tr.find(".eprem p").animate({'margin-right': '-121px'}, 400, 'easeOutCubic');
                    tr.find(".separatorep").animate({'margin-left': '91px', "border-left-width": "4px", "border-right-width": "0px"}, 400, 'easeOutCubic');
                    tr.find(".epadd").animate({'width': '106px'}, 400, 'easeOutCubic').addClass('EpSelectType');
                    tr.find(".epadd p").animate({'margin-left': '25px'}, 400, 'easeOutCubic');
                }
            },
            pressEpRem = function (d) {
                var tr = $(d).parents("tr");
                if (tr.attr("disabled") !== "disabled") {
                    tr.find(".epadd").animate({'width': '0px'}, 400, 'easeOutCubic').removeClass('EpSelectType');
                    tr.find(".epadd p").animate({'margin-left': '-131px'}, 400, 'easeOutCubic');
                    tr.find(".separatorep").animate({'margin-left': '-5px', "border-left-width": "0px", "border-right-width": "4px"}, 400, 'easeOutCubic');
                    tr.find(".eprem p").animate({'margin-right': '15px'}, 400, 'easeOutCubic');
                    tr.find(".eprem").addClass('EpSelectType');
                }
            },
            getInputObj = function (row, column) {
                column = column || 0;
                return $("#TableEp > tr:not(:first-child)").eq(row).find(".epvalue").eq(column);
            },
            hasAdd = function (row) {
                return $("#TableEp > tr:not(:first-child)").eq(row).find(".epadd").hasClass('EpSelectType');
            },
            generateTable = function () {
                var objList = $("input.inputFunction");
                var resultado = [];
                var listTR = $("#TableEp > tr:not(:first-child):not(:last-child)");
                listTR.each(function (line) {
                    var input = {"info": {}, "function": hasAdd(line) ? "add" : "rem"};
                    var tr = $(this);
                    objList.each(function (column) {
                        input.info[$(this).attr('id')] = tr.find(".epvalue").eq(column).val();
                    });
                    resultado[resultado.length] = input;
                });
                return resultado;
            },
            updateEpCount = function () {
                var cont = 1;

                $("#TableEp > tr:not(:first-child):not(:last-child)").each(function () {
                    $(this).find(".epcount").html(cont);
                    cont++;
                });
                $("#TableEp > tr:last-child").find(".epcount").html("");
            },
            keyDownOnEp = function (e, d) {
                var objList = $("#TableEp > tr:not(:first-child)");
                var cont = objList.index($(d).parents('tr')[0]);
                var qtd = objList.length;
                var totalcolumn = $("input.inputFunction").length;
                var column = objList.eq(cont).find(".epvalue").index(d);
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
                    if (cont < qtd - 1) {
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
            },
            keyUpOnEp = function (e, d) {
                var objList = $("#TableEp > tr:not(:first-child)");
                var cont = objList.index($(d).parents('tr')[0]);
                var qtd = objList.length;
                var totalcolumn = $("input.inputFunction").length;
                var fullEmpty = true;
                for (var j = 0; j < totalcolumn; j++) {
                    var value = getInputObj(cont, j).val();
                    fullEmpty = fullEmpty && (value === undefined || value === "");
                }
                if (!fullEmpty && cont === (qtd - 1)) {
                    addNovoItem();
                } else if (fullEmpty && cont !== (qtd - 1)) {
                    if (cont !== (qtd - 2)) {
                        for (i = cont; i + 1 < qtd; i++) {
                            for (var j = 0; j < totalcolumn; j++) {
                                getInputObj(i, j).val(getInputObj(i + 1, j).val());
                            }
                            if (hasAdd(i + 1)) {
                                pressEpAdd(objList.eq(i).find('.epfunction'));
                            } else {
                                pressEpRem(objList.eq(i).find('.epfunction'));
                            }
                        }
                        getInputObj(qtd - 2).val('');
                        pressEpAdd(objList.eq(qtd - 2).find('.epfunction'));
                    }
                    objList.eq(qtd - 1).remove();
                    qtd--;
                    updateEpCount();
                }
                if (qtd !== 1) {
                    $("#EpRunDiv").fadeIn(200);
                } else {
                    $("#EpRunDiv").fadeOut(200);
                    pressEpAdd(objList.eq(0).find('.epfunction'));
                }

            },
            initTableEp = function () {
                var objList = $("input.inputFunction");
                var obj = $($("<tr/>").appendTo($("#TableEp"))[0]);
                obj.addClass('static');
                $("<th class='epcount'></th>").appendTo(obj);
                objList.each(function () {
                    $("<th>" + this.name + "</th>").appendTo(obj);
                });
                $("<th class='epfunction'></th>").appendTo(obj);
            },
            addNovoItem = function () {
                var obj = $($("<tr/>").appendTo($("#TableEp"))[0]);
                $('<td/>', {appendTo: obj, class: "epcount"});
                var objList = $("input.inputFunction");
                var filter = function (text) {
                    return (text ? text : ".*");
                };
                objList.each(function () {
                    $('<td/>', {html: "<input class='epvalue' pattern='" + filter(this.pattern) + "' onkeyup='keyUpOnEp(event,this)' onkeydown='keyDownOnEp(event,this)'/>", appendTo: obj});
                });
                $('<td/>', {class: "epfunction", html: "<div class='EpType'><div class='EpSelectType epadd' onclick='pressEpRem(this)'><p>Insere</p></div><div class='separatorep' style='margin-left:91px'></div><div class='eprem' onclick='pressEpAdd(this)'><p>Remove</p></div></div></div>", appendTo: obj});
                updateEpCount();
            },
            nextEp = function () {
                var objList = $("input.inputFunction");
                var column = 0;
                objList.each(function () {
                    var html = getInputObj(i, column).val();
                    var div = document.createElement("div");
                    div.innerHTML = html;
                    var text = div.textContent || div.innerText || "";
                    $(this).val(text);
                    column++;
                });

                $("#TableEp > tr.inAction").removeClass("inAction");
                $("#TableEp > tr:not(:first-child)").eq(i).addClass("inAction");

                if (hasAdd(i)) {
                    setalgoritmo(1);
                    window.Cadilag.addDisc();
                    window.ButtonApp.lightupAdd();
                    History.appendInput(VK.INSERCAO);
                } else {
                    setalgoritmo(2);
                    window.Cadilag.removeValue();
                    History.appendInput(VK.REMOCAO);
                }
            },
            saveEp = function () {
                var validate = checkValidate();
                if (!validate) {
                    swal({title: 'Opss ... ', text: 'Existem entradas inválidas', type: 'error'});
                    return;
                }
                var saveOverwriteEp = function (rotulo) {
                    var entradas = generateTable();
                    post('./ajax/updateEp.php', function () {
                        swal({title: "Salvo", text: "A Entrada Programada foi alterada e salva", type: "success"});
                    }, {
                        "rotulo": rotulo,
                        "id": EpOpened.id,
                        "lista": entradas
                    });
                };
                var saveNewEp = function () {
                    swal({
                        title: "Nova entrada programada!",
                        text: "Insira um rótulo para você identificar essa entrada mais tarde quando for recupera-la!",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top"
                    },
                            function (rotulo) {
                                if (rotulo === false)
                                    return false;

                                if (rotulo === "") {
                                    swal.showInputError("Nome vazio!");
                                    return false;
                                }
                                var entradas = generateTable();
                                var postData = {
                                    "rotulo": rotulo,
                                    "idestrutura": idestrutura,
                                    "lista": entradas
                                };
                                post('./ajax/insertEp.php', function (data) {
                                    setEpDetails(data.lastId, rotulo);
                                    swal({title: "Salvo", text: "Você agora pode visualizá-la em Entradas Programadas no Menu Principal"});
                                }, postData);
                            }
                    );
                };
                var objList = $("#TableEp > tr:not(:first-child)");
                if (objList.length > 1) {
                    if (EpOpened !== null) {
                        swal({
                            title: "Sobrescrever ?",
                            text: "Deseja alterar a Entrada Programada('" + EpOpened.rotulo + "')?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#6B55DD",
                            confirmButtonText: "Sobrescrever!",
                            cancelButtonText: "Salvar novo!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }, function (isConfirm) {
                            if (isConfirm) {
                                saveOverwriteEp(EpOpened.rotulo);
                            } else {
                                saveNewEp();
                            }
                        });
                    } else {
                        saveNewEp();
                    }
                } else {
                    swal({title: 'Opss... ', text: 'É necessário pelo menos mais de uma entrada para salvar', type: 'error'});
                }
            },
            selectEdOnChangeEp = function(){
                var selectEprogramada = $("#selectep_temp");
                var selectEd = $("#selected_temp");
                selectEprogramada.find("option").remove();
                $(".sweet-alert button").attr("disabled",true);
                var url = './ajax/listEp.php';
                var isListOthers = $("#themep_temp").hasClass("selected");
                if(isListOthers){
                    url = './ajax/listOthersEp.php';
                }
                post(url, function(data){
                    $(".sweet-alert button").removeAttr("disabled");
                    if(data.lista.length===0){
                        $(".sweet-alert .confirm").hide();
                        $("#emptymessage_temp").show();
                        selectEprogramada.hide();
                    } else {
                        selectEprogramada.show();
                        $("#emptymessage_temp").hide();
                        $(".sweet-alert .confirm").show();
                    }
                    for (var i = 0; i < data.lista.length; i++) {
                        var ep = data.lista[i];
                        var optionD = $("<option>").val(ep.id);
                        if(isListOthers){
                            optionD.html(ep.rotulo + " -  (" + ep.total + " entradas) por " + getNameUser(ep.nickname, ep.fname, ep.lname, ep.email));
                        } else {
                            optionD.html(ep.rotulo + " - " + ep.data + " " + ep.hora + " - (" + ep.total + " entradas)");
                        }
                        selectEprogramada.append(optionD);
                    }
                    $("#countep_temp").html(data.lista.length);
                }, {"idEstrutura": selectEd.val()});
            },
            loadEp = function () {
                var callbackFunction = function (data) {
                    var eps = "";
                    eps += $("<div>").append(
                        $("<div>").addClass("button-ep-wrapper").append(
                            $("<div>").addClass("button temp_button").html("Suas Entradas").attr("id","yourep_temp").addClass("selected")
                        ).append(
                            $("<div>").addClass("button temp_button").html("Outras Entradas").attr("id","themep_temp")
                        )
                    ).html();
                    eps += "<div class='tab' id='temp'>";
                    eps += "<p>Estrutura de Dados</p>";
                    var selectEd = $(data._appendedData.selectEd);
                    selectEd.css("width","400px");
                    selectEd.find("option").addClass("toRemove");
                    for(var i=0;i <eProgramadasCompativeis.length;i++) {
                        selectEd
                            .find("option[value='"+eProgramadasCompativeis[i]+"']")
                            .removeClass("toRemove");
                    }
                    selectEd.find("option.toRemove").remove();
                    selectEd.find("option[value='"+idestrutura+"']").attr("selected",true);
                    eps += "<select id='selected_temp' style='width:400px' onchange='selectEdOnChangeEp()'>";
                    eps += selectEd.html();
                    eps += "</select>";
                    eps += "<br/><br/>";
                    
                    eps += "<p><b id='countep_temp'>" + data.lista.length + "</b> entradas salvas</p>";
                    eps += "<p id='emptymessage_temp'><b>Nenhuma entrada salva para esta estrutura!</b></br>Tente selecionar outra estrutura acima, se disponível!</p>";

                    eps += "<select id='selectep_temp' style='width:400px'>";

                    for (var i = 0; i < data.lista.length; i++) {
                        var ep = data.lista[i];
                        eps += "<option value='" + ep.id + "'>" + ep.rotulo + " - " + ep.data + " " + ep.hora + " - (" + ep.total + " entradas) </option>";
                    }
                    eps += "</select>";
                    eps += "</div>";
                    swal({title: "Selecione uma entrada", text: eps, html: true, confirmButtonColor: "#499BEA", confirmButtonText: "Carregar", cancelButtonText:"Cancelar", closeOnConfirm: true, showCancelButton: true}, function () {
                        var id = $("#selectep_temp").val();
                        post('./ajax/getEp.php', function (data) {
                            clearAllEp();
                            writeEps(data);
                        }, {idEp: id});
                    });
                    
                    //after swal
                    if(data.lista.length === 0) {
                        $(".sweet-alert .confirm").hide();
                        $("#selectep_temp").hide();
                    } else {
                        $("#emptymessage_temp").hide();
                    }    
                    
                    $("#yourep_temp").click(function(){
                        $(".temp_button").removeClass("selected");
                        $("#yourep_temp").addClass("selected");
                        selectEdOnChangeEp();
                    });
                    
                    $("#themep_temp").click(function(){
                        $(".temp_button").removeClass("selected");
                        $("#themep_temp").addClass("selected");
                        selectEdOnChangeEp();
                    });
                    
                };
                postHTML('./ajax/selectEstruturasDeDados.php', function(selectHTML){
                    post('./ajax/listEp.php', callbackFunction, {"idEstrutura": idestrutura},{appendData:{selectEd:selectHTML}});
                });
                
            },
            writeEps = function(data){
                for (var i = 0; i < data.lista.length; i++) {
                    var ep = data.lista[i];
                    var row = $("#TableEp > tr:not(:first-child)").eq(i);
                    var j = 0;
                    for (var key in ep.info) {
                        getInputObj(i, j).val(ep.info[key]);
                        j++;
                    }
                    switch (ep.function) {
                        case "add":
                            pressEpAdd(row.find('.epfunction'));
                            break;
                        case "rem":
                            pressEpRem(row.find('.epfunction'));
                            break;
                    }
                    addNovoItem();
                }
                if(iduser == data.iduser){
                    setEpDetails(data.id, data.rotulo);
                }
            },
            clearEp = function () {
                if($("#TableEp > tr:not(:first-child)").length>1){
                    clearAllEp();
                } else {
                    swal({title:"lista já esta vazia!",type:"info"});
                }
            },
            clearAllEp = function(){
                $("#TableEp").html("");
                initTableEp();
                addNovoItem();
                setEpDetails(-1);
            },
            copyHistory = function () {
                if (History.stackHistory.array.length === 0) {
                    swal({title: "Histórico vazio!", text: "Nenhuma entrada foi realizada", type: "info"});
                } else {
                    $("#TableEp").html("");
                    initTableEp();
                    addNovoItem();
                    setEpDetails(-1);
                    for (var i = 0; i < History.stackHistory.contador; i++) {
                        addNovoItem();
                        var row = $("#TableEp > tr:not(:first-child)").eq(i);
                        var li = History.stackHistory.array[i];
                        if (li.type === VK.INSERCAO) {
                            pressEpAdd(row.find('.epfunction'));
                        } else {
                            pressEpRem(row.find('.epfunction'));
                        }
                        var j = 0;
                        for (var key in li.info) {
                            getInputObj(i, j).val(li.info[key]);
                            j++;
                        }
                    }
                }
            },
            checkValidate = function () {
                var key = true;
                $("#TableEp input").each(function () {
                    if (!$(this)[0].checkValidity()) {
                        key = false;
                    }
                });
                return key;
            },
            eprun = function (d) {
                var validate = checkValidate();
                if (!validate) {
                    swal({title: 'Opss ... ', text: 'Existem entradas inválidas', type: 'error'});
                    return;
                }
                if ($(d).attr("disabled") !== "disabled") {
                    setTimeout(function(){
                        $(".tipsy").hide();
                    },500);
                    var objList = $("#TableEp > tr:not(:first-child)");
                    var qtd = objList.length;
                    if (qtd > 1) {
                        i = 0;
                        $("#counterEp").html("<p>1/" + qtd + "</p>");
                        lock = true;
                        nextEp();
                        $("#eprun").attr("disabled", true);
                        $("#EpRunDiv").attr("disabled", true);
                        $(".epvalue").attr("disabled", true);
                        $(".EpType").attr("disabled", true);
                        $(".epadd.EpSelectType p").animate({"margin-left": "30px"}, 400);
                        $(".eprem.EpSelectType p").animate({"margin-right": "20px"}, 400);
                    } else {
                        swal({title: 'Opss ... ', text: 'É necessário pelo menos mais de uma entrada', type: 'error'});
                    }
                }
            },
            window.Eprogramada = {
                init: function () {
                    setTimeout(function () {
                        initTableEp();
                        addNovoItem();
                    }, 100);
                    $("#ephistory").bind('click', function () {
                        copyHistory();
                    });
                    $("#epsave").click(function () {
                        saveEp();
                    });
                    $("#epload").bind('click', function () {
                        loadEp();
                    });
                    $("#eprun,#EpRunDiv").bind('click', function () {
                        eprun(this);
                    });
                    $("#epclear").bind('click', function () {
                        clearEp();
                    });
                },
                nextQueue: function () {
                    if (lock) {
                        var objList = $("#TableEp > tr:not(:first-child)");
                        var qtd = objList.length;
                        if (i < qtd - 2) {
                            i++;
                            $("#counterEp").html("<p>" + (i) + "/" + (qtd - 1) + "</p>");
                            nextEp();
                        } else {
                            lock = false;
                            $("#TableEp > tr.inAction").removeClass("inAction");
                            $("#eprun").removeAttr("disabled");
                            $("#EpRunDiv").removeAttr("disabled");
                            $(".epvalue").removeAttr("disabled");
                            $(".EpType").removeAttr("disabled");
                            $(".epadd.EpSelectType p").animate({"margin-left": "25px"}, 400);
                            $(".eprem.EpSelectType p").animate({"margin-right": "15px"}, 400);
                        }
                    }
                }

            };

})();