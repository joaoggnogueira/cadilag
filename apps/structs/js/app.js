/* global Opentip, DICIONARIO, jsPlumb */

jsPlumb.bind("ready", function () {
    Opentip.styles.configStyle = {
        extends: "glass",
        tipJoint: "top",
        showEffectDuration: 0.1,
        hideEffectDuration: 0.1,
        background: "white",
        target: true,
        fixed: true,
        stem: true,
        hideTriggers: ['tip', 'trigger'],
        hideDelay: 0.2,
        hideOn: 'mouseout',
        removeElementsOnHide: true,
        delay: 0.5,
        shadowColor: "rgba(0,0,0,0.5)"
    };
    $("#eprun").addClass("lockable");
    $("#EpRunDiv").addClass("lockable");
    $("#valor").addClass("inputFunction");
    $(".input-required").addClass("lockable");
    $(".random-btn").click(randomInput);
    $("#float").hide();
    $("#chanceNegativeInput").on("input",function(){
       $("#chanceNegativeLabel").text(this.value+"%"); 
    }).change(function(){
        localStorage.setItem(this.id + 'Cadilag', this.value);
    });
    
    if(localStorage.getItem('chanceNegativeInputCadilag')!==null){
        $("#chanceNegativeInput").val(parseInt(localStorage.getItem('chanceNegativeInputCadilag'))).trigger("input");
    }
    
    $("#UserDiv").click(function () {
        $("#huboptions").slideToggle({duration: 300, easing: "easeOutCirc"});
    });
    $('#time').change(function(){
        window.TimeApp.updateTimeLabel();
    }).on('input', function () {
        window.TimeApp.updateTimeLabel();
    });
    $("#timelabel").change(function(){
        window.TimeApp.updateTime();
    });
    $(".cool-checkbox").click(function () {
        var obj = $(this);
        obj.tipsy(true).hide();
        obj.toggleClass("selected");
        if (obj.hasClass('selected')) {
            obj.attr('title', 'OFF | <tipsym>ON</tipsym>');
        } else {
            obj.attr('title', '<tipsym>OFF</tipsym> | ON');
        }
        var id = obj.attr('id');
        localStorage.setItem(id + 'Cadilag', obj.hasClass('selected'));
        obj.tipsy(true).show();
        obj.trigger("change", [obj.hasClass('selected')]);
    });
    $("#hideNullPointer").change(function(event,selected){
        if (selected) {
            $("#main").addClass("hideNullPointers");
        } else {
            $("#main").removeClass("hideNullPointers");
        }
    });
    $("#sidebar > ul > li").each(function () {
        var thisObj = $(this);
        var title = thisObj.attr('title');
        thisObj.tipsy({title: function () {
                return "<tipsym>" + title + "</tipsym>";
            }, html: true, gravity: 'e'});
    });
    $(".p_integer").attr("pattern", "^-?[0-9][0-9]{0,2}$");
    $("#ClockDiv").tipsy({title: 'title', html: true, gravity: 's'});
    $(".navbar").tipsy({fallback: "<tipsym>Mostrar Estruturas</tipsym>", html: true, gravity: 'n'});
    $("#feedback").tipsy({fallback: "<tipsym>Feedback</tipsym>", html: true, gravity: 'sw', clsStyle: 'medium'});
    $("#config").tipsy({fallback: "<tipsym>Configurações</tipsym>", html: true, gravity: 'sw', clsStyle: 'medium'});
    $("#help").tipsy({fallback: "<tipsym>Tutoriais e Ajuda</tipsym>", html: true, gravity: 'sw', clsStyle: 'medium'});

    if (localStorage.getItem("enableDescritorCadilag") === null) {
        localStorage.setItem("enableDescritorCadilag", 'true');
    }

    if (localStorage.getItem("counterBlankCadilag") === null) {
        localStorage.setItem("counterBlankCadilag", 'true');
    }
    
    $(".cool-checkbox").each(function(){prepareCoolCheckboxConfig(this);});

    $(".appbuttons button").each(function () {
        $(this).tipsy({title: 'title', html: true, gravity: 'n', delayIn: 200});
    });
    $(window).resize(function () {
        if (!$("#mobile-interface").hasClass("selected")) {
            if (parseInt($(this).width()) < 600) {
                $(".mobile").each(function () {
                    if (!$(this).hasClass('toM')) {
                        $(this).addClass('toM');
                    }
                });
            } else {
                $('.toM').removeClass('toM');
            }
        }
    });
    $(".resetColor").click(function () {
        var target = $(this).attr('for');

        document.getElementById(target).jscolor.fromString($("#" + target).attr('original-value'));
        if (target === "colorChooserAlt") {
            UI.updateColorPrimary();
            UI.changeColorComponentPrimary();
        } else if (target === "colorChooserAlt1") {
            UI.updateColorSecondary();
            UI.changeColorComponentSecondary();
        }
    });

    UI.loadCache();
    
});

function prepareCoolCheckboxConfig(elem){
    var obj = $(elem);
    var id = elem.id;
    var result = localStorage.getItem(id + 'Cadilag');
    var a = new Opentip(obj, "<image src='"+obj.attr('data-image')+"' width='200' height='100'>", {style: "configStyle"});
    if (result !== null) {
        if (result === 'true') {
            obj.addClass('selected');
        } else {
            obj.removeClass('selected');
        }
    }
    if (obj.hasClass('selected')) {
        obj.attr('title', 'OFF | <tipsym>ON</tipsym>');
    } else {
        obj.attr('title', '<tipsym>OFF</tipsym> | ON');
    }
    obj.tipsy({title: 'title', html: true, gravity: 'n'});
}

function triggerCoolCheckbox() {
    $(".cool-checkbox").each(function () {
        var obj = $(this);
        obj.trigger('change', [obj.hasClass('selected')]);
    });
}

function randomInput() {
    toggleHideSidebar();
    var itemref = $(this).attr('itemref');
    var obj = $("#" + itemref);
    if (obj.hasClass('p_integer')) {
        if (obj.hasClass('p_interval')) {
            var valorinicial = obj.val();
            while (obj.val() === valorinicial) {
                var max = parseInt(obj.attr('max'));
                var min = parseInt(obj.attr('min'));
                obj.val(parseInt(min + Math.random() * (max - min)));
            }
        } else {
            var limit = $("#chanceNegativeInput").val();
            var randombool = parseFloat(Math.random() * 100);
            var maxlength = obj.attr('maxlength');
            var negative = 1;
            if (randombool <= limit) {
                negative = -1;
            }
            maxlength = parseInt(maxlength) - 1;
            var max = parseInt(Math.random() * maxlength) + 1;
            var random = parseInt(Math.random() * Math.pow(10, parseInt(max)))*negative;
            
            obj.val(random);
        }
    } else if (obj.hasClass('p_number')) {
        var limit = $("#chanceNegativeInput").val();
        var randombool = parseFloat(Math.random() * 100);
        var maxlength = parseInt(obj.attr('maxlength')) - 1;
        var negative = 1;
        if (randombool <= limit) {
            negative = -1;
            maxlength--;
        }
        var max = parseInt(Math.random() * maxlength) + 1;
        var random = ('' + (Math.random() * Math.pow(10, parseInt(maxlength)))).substring(0, max)*negative;
        
        random = random + '';
        if (random.charAt(random.length - 1) === '.') {
            random = random.replace('.', '');
        }
        obj.val(random);
    } else if (obj.hasClass('p_string')) {
        var max = DICIONARIO.length;
        var random = Math.random() * max;
        obj.val(DICIONARIO[parseInt(random)]);
    }
    obj.focus();

}

function config(){
    $("#ConfigDiv").fadeToggle(400);
    $("#config").toggleClass("selected");
}

(function () {
    window.UI = {
        primaryColorProperty: false,
        secondaryColorProperty: false,
        validatorFunction: false,
        elementToString: false,
        nextStep: false,
        locked: false,
        callstack: false,
        InitFunctions: function (addf, remf, searchf) {
            $("#add").click(function () {
                addf();
            });
            $("#remove").click(function () {
                remf();
            });
            $("#search").click(function () {
                searchf();
            });
            $("#subtopbar.subtopbar-others .button-hide").click(function(){
                $("#others").click();
            });
            $("#registroativacao-li").click(function(){
                UI.showPilhaDeChamadas();
            }).hide();
            $("#others").click(function(){
               $("#others").toggleClass("selected");
               if($("#others").hasClass("selected")) {
                    $("#subtopbar.subtopbar-others").css("display","block");
                    $("#subtopbar.subtopbar-others").animate({"top": "50px","opacity":"1"}, 500);
                    $("#main").animate({"top":"+50px"},500);
               } else {
                    $("#subtopbar.subtopbar-others").animate({"top": "0px","opacity":"0"}, 500,function(){
                        $("#subtopbar.subtopbar-others").css("display","none");
                    });
                    $("#main").animate({"top":"0px"},500);
               }
            });
        },
        InitInterface: function (validatorf, toStringElement) {
            this.validatorFunction = validatorf;
            if (this.elementToString !== undefined)
                this.elementToString = toStringElement;
        },
        checkInterface: function () {
            if ($("#repetirEntrada").hasClass('selected')) {
                if (this.validatorFunction()) {
                    this.lancarMensagem("Esta entrada já existe");
                    return false;
                }
            }
            return true;
        },
        lancarMensagem: function (mensagem) {
            var qtd = $(".message").length;
            var obj = $('<span/>', {
                class: 'message',
                text: mensagem,
                appendTo: $("body")
            }).css("bottom", ((qtd + 0.5) * 45) + "px");
            setTimeout(function () {
                obj.remove();
            }, 2000);
        },
        setProperty: function (type, value) {
            this[type] = value;
            if (this.primaryColorProperty) {
                $("#primaryColor").show();
                $("#colorChooserAlt").tipsy({title: 'title', html: true, gravity: 'n'});
            } else {
                $("#primaryColor").hide();
            }
            if (this.secondaryColorProperty) {
                $("#secondaryColor").show();
                $("#colorChooserAlt1").tipsy({title: 'title', html: true, gravity: 'n'});
            } else {
                $("#secondaryColor").hide();
            }
        },
        subtitle: function (text) {
            if (text !== undefined) {
                document.getElementById('subtitle').innerHTML = text;
            } else {
                return document.getElementById('subtitle').innerHTML;
            }
        },
        removeSubtitle: function () {
            document.getElementById('subtitle').innerHTML = "";
        },
        AddInput: function (id) {
            $("#" + id).addClass("inputFunction");
            var totalInputs = $("input.inputFunction").length;
            $("#title-history").html("");
            var title = document.getElementById("title-history");
            var d = document.createElement("li");
            d.style.width = "70px";
            
            d.innerHTML = "#";
            title.appendChild(d);
            $("input.inputFunction").each(function () {
                var d = document.createElement("li");
                d.style.width = (250/totalInputs)+"px";
                d.innerHTML = $(this).attr("name");
                title.appendChild(d);
            });
        },
        triggerNext: function(){
            if(!this.locked && this.nextStep){
                console.error("Chamada para pausar na próxima instrução encontrada porém interface está desbloqueada");
                this.nextStep = false;
            }
            if(this.nextStep) {
                UI.stop();
                this.nextStep = false;
            }
        },
        highlightInput: function(id,value){
            if(value) {
                $("#"+id).val(value);
            }
            $("#"+id).css("border","2px solid blue");
            setTimeout( function() { $("#"+id).removeAttr("style"); },100);
            setTimeout( function() { $("#"+id).css("border","2px solid blue"); },200);
            setTimeout( function() { $("#"+id).removeAttr("style"); },300);
            setTimeout( function() { $("#"+id).css("border","2px solid blue"); },400);
            setTimeout( function() { $("#"+id).removeAttr("style"); },500);
        },
        lock: function () {
            $(".lockable").attr("disabled", "disabled");
            $("#add").hide();
            $("#remove").hide();
            $("#search").hide();
            $("#others").hide();
            $("#time").attr("disabled", "disabled");
            $("#timelabel").attr("disabled", "disabled");
            if($("#subtopbar.subtopbar-others").length !== 0){
                $("#subtopbar.subtopbar-others").animate({"top": "0px","opacity":"0"}, 500,function() {
                    $("#subtopbar.subtopbar-others").css("display","none");
                });
                $("#main").animate({"top":"0px"},500);
            }
            $("#stop").show();
            $("#resume").hide();
            $("#step").hide();
            $("#registroativacao-li").show();
            this.nextStep = false;
            this.locked = true;
        },

        unlock: function () {
            if($("#clear-inputs").hasClass("selected")){
                $(".inputFunction").val("");
            };
            $("#add").show();
            $("#remove").show();
            $("#search").show();
            $("#others").show();
            $(".lockable").removeAttr("disabled");
            $("#others").removeClass("selected");
            $("#time").removeAttr("disabled");
            $("#timelabel").removeAttr("disabled");
            $("#stop").hide();
            $("#resume").hide();
            $("#step").hide();
            $("#registroativacao-li").hide();
            this.removeSubtitle();
            this.locked = false;
        },
        resume: function(){
            $("#stop").show();
            $("#resume").hide();
            $("#step").hide();
            $("#time").attr("disabled", "disabled");
            $("#timelabel").attr("disabled", "disabled");
//            if(this.callstack){
//                this.callstack.hide();
//                this.callstack.destroy();
//            }
            resumeAll();
        },
        next: function(){
            this.nextStep = true;
            UI.resume();
        },
        stop: function(){
            $("#resume").show();
            $("#stop").hide();
            $("#step").show();
            $("#time").removeAttr("disabled");
            $("#timelabel").removeAttr("disabled");

            stopAll();
            Plumb.repintarTudo();
        },
        loadCache: function () {
            setTimeout(function () {
                var color = localStorage.getItem("primaryColorCadilag");
                var color1 = localStorage.getItem("secondaryColorCadilag");
                if (color) {
                    document.getElementById('colorChooserAlt').jscolor.fromString(color);
                    UI.changeColorComponentPrimary();
                } else {
                    document.getElementById('colorChooserAlt').jscolor.fromString($('#colorChooserAlt').attr("original-value"));
                }
                if (color1) {
                    document.getElementById('colorChooserAlt1').jscolor.fromString(color1);
                    UI.changeColorComponentSecondary();
                } else {
                    document.getElementById('colorChooserAlt1').jscolor.fromString($('#colorChooserAlt1').attr("original-value"));
                }
            }, 1000);
        },
        updateColorPrimary: function () {
            var d = document.getElementById('colorChooserAlt');
            localStorage.setItem("primaryColorCadilag", d.value);
        },
        updateColorSecondary: function () {
            var d = document.getElementById('colorChooserAlt1');
            localStorage.setItem("secondaryColorCadilag", d.value);
        },
        changeColorComponentPrimary: function () {
            var d = document.getElementById('colorChooserAlt');
            var componentes = $(".altColor");
            componentes.css("background-color", "#" + d.value);
            componentes = $(".altColorTitle");
            componentes.css("color", d.style.color);
        },
        changeColorComponentSecondary: function () {
            var d = document.getElementById('colorChooserAlt1');
            var componentes = $(".altColor1");
            componentes.css("background-color", d.value);
            componentes = $(".altColorTitle1");
            componentes.css("color", d.style.color);
        },
        
        value: function (id, mensagemError) {

            if (mensagemError !== undefined) {
                if (!document.getElementById(id).checkValidity()) {
                    this.lancarMensagem("Entrada Inválida: " + mensagemError);
                    return "";
                }
            }
            var value = $("#" + id).val();
            value = $.trim(value);
            var html = value;
            var div = document.createElement("div");
            div.innerHTML = html;
            var text = div.textContent || div.innerText || "";
            return text;
        },
        setProgress: function (percent, time) { //não utilizado
            if ($("#enableTemporizador").hasClass('selected')) {
                if (percent === 0) {
                    $("#float").fadeOut(time);
                    setTimeout(function () {
                        $("#float").css("width", "0%");
                    }, time);
                } else {
                    $("#float").show();
                    $("#float").animate({"width": (percent * 100) + "%", "opacity": "1"}, time, "linear");
                }
            }
        }, setParameters: function (params) {
            var saida = "";
            for (var k in params) {
                saida += "<p>" + k + " <g>:=</g> " + params[k] + ";</p>";
            }
            document.getElementById("parameters").innerHTML += saida;

        },
        showPilhaDeChamadas : function(){
            if(this.callstack){
                this.callstack.show();
            }
        },
        registroDePilhaDeChamadas: function(){
            if(this.callstack){
                this.callstack.remove();
            } else {
                this.callstack = new CallStack();
                this.callstack.init();
            }
            return this.callstack;
        },
        updatePilhaDeChamadas: function(){
            this.callstack.destroy();
            this.callstack.flush();
            this.callstack.update();
        },
        destroyPilhaDeChamadas: function(){
            if(this.callstack){
                //this.callstack.destroy();
                //this.callstack = false;
            }
        }
        
    };
    window.Tooltip = {
        records: [],
        createStyle: function (name, parameter) {
            Opentip.styles[name] = parameter;
        },
        register: function (id, d, style) {
            this.records[id] = new Opentip(d, "", {style: style});
        },
        deactivate: function (id) {
            this.records[id].deactivate();
        },
        show: function (id, text, color, time) {
            var record = this.records[id];
            if(record === undefined){
                console.error("Elemento não registrado :"+id);
                console.log(id);
            }
            record.setContent(text);
            record.options.background = color;
            record.show();
            timeout(function () {
                record.hide();
            }, time);
        }
    };
    window.Element = {
        bind: function (element, id, vars) {
            $("#"+id).data("binddata",{element: element, vars: vars});
        },
        get: function (id) {
            var data = $("#"+id).data("binddata");
            if(data) {
                return data.element;
            }
        },
        getVars: function (id) {
            var data = $("#"+id).data("binddata");
            if(data) {
                return data.vars;
            }
        },
        mouseEnterEvent: function (id) {
            if ($("#enableDescritor").hasClass('selected')) {
                var array = UI.elementToString(id);

                if (array) {
                    var thisId = (id * 1).toString(16).toUpperCase();
                    var saida = "<p class='tipsy-head'>";
                    if (array._title === undefined) {
                        saida += "*" + thisId.substring(thisId.length - 5);
                    } else {
                        saida += array._title;
                    }
                    if (array._index !== undefined) {
                        saida += "[" + array._index + "]";
                    }
                    if(array._vizinhos !== undefined) {
                        for (var key in array._vizinhos) {
                            var idnext = (array._vizinhos[key].id* 1).toString(16).toUpperCase();
                            var objnext = $("#"+array._vizinhos[key].id);
                            var idnextdesc = idnext.substring(idnext.length - 5);
                            var t = "<tipsytitle>"+key+"</tipsytitle><br/><tipsylabel>*"+idnextdesc+"</tipsylabel>";
                            objnext.attr('tipsy-title', t);
                            objnext.addClass('visitado');
                            
                            if(array._vizinhos[key].tooltipdir !== undefined){
                                objnext.tipsy(true).options.gravity = array._vizinhos[key].tooltipdir;
                            }
                            
                            objnext.tipsy(true).show();
                        }
                    }
                    
                    saida += "</p>";
                    if (array._replaceAll === undefined) {
                        saida += "<table class='tipsy-table'><tr><th>Campo</th><th>Valor</th></tr>";

                        for (var key in array) {
                            if (!key.startsWith("_")) {
                                saida += "<tr><td>" + key + "</td><td>" + array[key] + "</td></tr>";
                            }
                        }
                        saida += "</table>";
                    } else {
                        saida += array._replaceAll;
                    }

                    var obj = $("#" + id);
                    if (array._gravity !== undefined) {
                        obj.tipsy(true).options.gravity = array._gravity;
                    } else {
                        obj.tipsy(true).options.gravity = 's';
                    }
                    obj.attr('tipsy-title', saida);
                    obj.tipsy(true).show();
                    obj.addClass('visitado');
                    jsPlumb.select({source:id}).each(function(con){
                        $(con.canvas).addClass("visitado");
                        var total = con.endpoints.length;
                        for (var i = 0; i < total; i++) {
                            $(con.endpoints[i].canvas).addClass("visitado");
                        }
                    });
                    $("#main").addClass("hover-visitados");
                }
            }
        },
        mouseExitEvent: function (id) {
            $("#main").removeClass("hover-visitados");
            $(".element.visitado").each(function(key,d){
                $(d).removeClass("visitado");
                $(d).tipsy(true).hide();
            });
            $(".jsplumb-connector.visitado").each(function(key,d){
                $(d).removeClass("visitado");
            });
            $(".jsplumb-endpoint.visitado").each(function(key,d){
                $(d).removeClass("visitado");
            });
        },
        createOutputStack: function(title) {
            
            $("#outputStack").remove();
    
            var stack = document.createElement("div");
            stack.className = "outputStack";
            stack.id = "outputStack";
            
            var titlediv = document.createElement("p");
            titlediv.className = "title";
            titlediv.innerHTML = title;
            
            var ul = document.createElement("ul");
            
            var closebtn = document.createElement("button");
            closebtn.style.position = 'absolute';
            closebtn.style.right = '5px';
            closebtn.style.background = 'none';
            closebtn.style.border = 'none';
            closebtn.innerHTML = "<i class='fa fa-times'></i>";
            closebtn.style.display = "none";
            closebtn.addEventListener('click',function() {
               $(stack).remove(); 
            });
            stack.showCloseBtn = function() {
                closebtn.style.display = "block";
            };
            stack.appendChild(closebtn);
            stack.appendChild(titlediv);
            stack.appendChild(ul);
            document.getElementById("main").appendChild(stack);
            var arrayLis = [];
            var count = 0;
            var filled = 0;
            
            stack.add = function() {
                var li = document.createElement("li");
                arrayLis[count] = li;
                count++;
                li.id = "stackOutput"+count;
                ul.appendChild(li);
            };
            
            stack.print = function(value,id) {
                stack.add();
                arrayLis[filled].innerHTML = "<div class='value'>"+value+"</div>";
                $(arrayLis[filled])
                    .mouseenter(function(){
                      $("#"+id).addClass("hover");  
                      Plumb.repintarElemento(id);
                    }).mouseleave(function(){
                      $("#"+id).removeClass("hover");  
                      Plumb.repintarElemento(id);
                    });
                filled++;
            };
            
            stack.add();
            stack.add();
            stack.add();
            stack.add();
            stack.add();
            
            return stack;
        },
        createElement: function (parameter) {
            var id = '' + ((new Date().getTime()));
            while ($("#" + id).length !== 0) {
                id--;
            }
            var filter = function (text) {
                return (text !== undefined ? text : "");
            };

            var obj = $('<div/>', {
                id: id,
                class: "element "+filter(parameter.className),
                html: filter(parameter.innerHTML),
                title: filter(parameter.title),
                appendTo: $("#" + parameter.idParent)
            }).css("left", parameter.left)
                    .css("top", parameter.top)
                    .attr("title", parameter.title);

            if (UI.elementToString) {
                obj.mouseover(function () {
                    Element.mouseEnterEvent(id);
                });
                obj.mouseout(function () {
                    Element.mouseExitEvent(id);
                });
                obj.attr('tipsy-title', '');
                obj.tipsy({title: 'tipsy-title', trigger: 'manual', html: true, gravity: 's'});
            }

            if (UI.primaryColorProperty) {
                UI.changeColorComponentPrimary();
            }
            if (UI.secondaryColorProperty) {
                UI.changeColorComponentSecondary();
            }
            return {d: obj.get(0), id: id};
        }
    };
    window.Validator = {
        isFloat: function (string) {
            return Number(string) === string && string % 1 !== 0;
        },
        isInteger: function (string) {
            return Number(string) === string && string % 1 === 0;
        }
    };
    window.StepRecord = {
        steps: [],
        title: false,
        start: function(){
            $("#empty-revisao-content").hide();
            $("#revisao-content").hide();
            $("#onrun-revisao-content").show();
            
            this.steps.length = 0;
            this.title = UI.subtitle();
            document.getElementById("lastsubtitle").innerHTML = this.title;
        },
        add: function(desc) {
            var html = (document.getElementById("main").innerHTML).replace(/\n/g, '');
            var opentips = [];
            $(".opentip-container").each(function(index){
                var canvas = $(this).find("canvas").get(0);
                opentips[index] = {html:this.outerHTML,canvas:canvas};
            });
            this.steps[this.steps.length] = {
                desc : desc,
                html : html,
                opentips: opentips
            };
        },
        end: function(){
            $("#revisao-content").show();
            $("#onrun-revisao-content").hide();
            var table = $("#revisao-content table tbody").get(0);
            table.innerHTML = "";
            $(this.steps).each(function(index,value){
                var row = table.insertRow(index);
                $(row)
                    .mouseenter(function(){StepRecord.prewie(value);})
                    .click(function(){StepRecord.prewie(value);})
                    .mouseout(function(){StepRecord.closeprewie();});
                var step = row.insertCell(0);
                var desc = row.insertCell(1);
                step.innerHTML = (index+1);
                desc.innerHTML = value.desc;
            });
        },
        prewie: function(obj){
            $("#main").hide();
            $("#mainrevisao").remove();
            $(".opentip-container").remove();
            var newmain = $("<div/>").
                addClass("main").
                attr("id","mainrevisao").
                html(obj.html);
            if($("#main").hasClass("cruzadastyle")){
                newmain.css("height","100vh");
            }
                
            $(document.body).append(
                newmain
            );
            $(obj.opentips).each(function(index,value){
                var opentip = $(value.html);
                $(document.body).append(opentip);
                var canvas = opentip.find("canvas").get(0);
                var destCtx = canvas.getContext('2d');
                destCtx.drawImage(value.canvas, 0, 0);
            });
        },
        closeprewie: function(){
            $("#mainrevisao").remove();
            $(".opentip-container").remove();
            $("#main").show();
            Plumb.repintarTudo();
        }
    };

})();
