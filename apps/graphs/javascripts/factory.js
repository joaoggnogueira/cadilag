/* global jsPlumb */

$(document).ready(function () {
    window.addEventListener("beforeunload", function (e) {
        Persistencia.salvarRascunho();

    });

});

(function () {

    var autoIncrementIdState = 0;
    var autoIncrementIdLabel = 0;
    var id = -1;

    window.DataGraph = {
        open: function(data) {
            if (data.ponderado) {
                $("input[name='ponderado'][value='true']").get(0).checked = true;
            } else {
                $("input[name='ponderado'][value='false']").get(0).checked = true;
            }

            if (data.digrafo) {
                $("input[name='digrafo'][value='true']").get(0).checked = true;
            } else {
                $("input[name='digrafo'][value='false']").get(0).checked = true;
            }

            $("#nameofproject").val(data.nome);

            const params = Component.node;
            var hash = [];

            for (var key in data.estados) {
                var estado = data.estados[key];
                var disc = Create.component(estado.x, estado.y, estado.name);
                $(disc.d).css({'width': (params.width - 3) + 'px', 'height': (params.height - 3) + 'px'});
                hash[key] = disc;
                for (var keyinfo in estado.infos) {
                    var info = estado.infos[keyinfo];
                    Create.label(disc, info.text, info.x + 50, info.y + 33, info.w, info.h);
                }
            }

            for (var key in data.transicoes) {
                var transicao = data.transicoes[key];
                var endpoints;
                if (data.digrafo) {
                    endpoints = Endpoints.get("retodigrafo");
                } else {
                    endpoints = Endpoints.get("retografo");
                }
                var a = jsPlumb.addEndpoint(hash[transicao.to].d, endpoints);
                var b = jsPlumb.addEndpoint(hash[transicao.from].d, endpoints);
                jsPlumb.connect({
                    source: b,
                    target: a,
                    deleteEndpointsOnEmpty: true
                });
                if (data.ponderado) {
                    var idcell = "#" + hash[transicao.from].id + "to" + hash[transicao.to].id;
                    $(idcell + " .cell").text(transicao.value);
                }
            }
            id = data.id;
            updateCountEstados();
            updateCountTransicoes();
            Matrix.update();
        },
        retrieval: function(withId){
            if(withId  === undefined){
                withId = false;
            }
            var estados = [];
            var hash = [];
            var auto = 0;
            $(".element.nodeelement").each(function (key, obj) {
                var disc = $(obj).data("disc");

                var infos = [];

                for (var key in disc.infos) {
                    var rotulo = disc.infos[key];
                    var info = {
                        text: rotulo.text(),
                        x: parseFloat(rotulo.d.style.left),
                        y: parseFloat(rotulo.d.style.top),
                        w: $(rotulo.d).width(),
                        h: $(rotulo.d).height()
                    };
                    infos.push(info);
                }

                var estado = {
                    name: disc.label.substring(0, 4),
                    x: parseFloat(obj.style.left),
                    y: parseFloat(obj.style.top),
                    infos: infos,
                    index: auto
                };
                if(withId){
                    estado.d = disc.d;
                    estado.id = disc.id;
                }
                auto++;
                hash[disc.id] = estado;
                estados.push(estado);
            });

            var transicoes = [];
            var ponderado = $("input[name='ponderado']:checked").val() === "true";
            var digrafo = $("input[name='digrafo']:checked").val() === "true";

            jsPlumb.select({scope: "workspace"}).each(function(con) {
                var source = hash[con.sourceId];
                var target = hash[con.targetId];
                var connection = {
                    from: source.index,
                    to: target.index
                };
                if (ponderado) {
                    connection.value = parseFloat($("#" + con.sourceId + "to" + con.targetId + " .cell").text());
                }
                transicoes.push(connection);
            });


            var grafo = {
                nome: $("#nameofproject").val(),
                estados: estados,
                transicoes: transicoes,
                digrafo: digrafo,
                ponderado: ponderado,
                id: -1
            };

            return grafo;
        }

    };

    window.Create = {
        component: function (x, y, label) {

            const params = Component.node;
            var d = document.createElement("div");
            d.className = "element " + params.className;
            document.getElementById("workspace").appendChild(d);
            var id = "s" + autoIncrementIdState;
            autoIncrementIdState++;
            d.id = id;

            d.style.left = x + "px";
            d.style.top = y + "px";

            var innerHTML = params.innerHTML;

            innerHTML = innerHTML.replace("${id}", id);
            innerHTML = innerHTML.replace("${label}", label);

            d.innerHTML = innerHTML;

            var disc = {d: d, id: id, label: label, infos: []};

            $(d).data("disc", disc);
            jsPlumb.draggable(id);
            d.draggable = "true";

            if (!$(".radio-move").hasClass('selected')) {
                jsPlumb.setDraggable(id, false);
            }

            if ($(".radio-connect").hasClass('selected')) {
                var endpoints;
                if ($("input[name='digrafo']:checked").val() === "true") {
                    endpoints = Endpoints.get("retodigrafo");
                } else {
                    endpoints = Endpoints.get("retografo");
                }
                jsPlumb.makeSource(d, endpoints);
                jsPlumb.makeTarget(d, endpoints);
                jsPlumb.repaintEverything();
            }

            $(disc.d).click(function (event) {
                event.stopPropagation();
            }).dblclick(function (event) {
                event.stopPropagation();
            });
            $.contextMenu({
                selector: '#' + id,
                callback: function (key, options) {
                    switch (key) {
                        case "delete":
                            removerComponent(disc);
                            break;
                        case "tag":
                            addLabel(disc);
                            break;
                        case "edit":
                            editComponent(disc);
                            break;
                        case "detach":
                            disconnectComponent(disc);
                            break;
                    }
                    Matrix.update();
                },
                items: {
                    "edit": {name: "Alterar nome", icon: "edit"},
                    "tag": {name: "Adicionar rótulo", icon: "fa-tag"},
                    "detach": {name: "Desconectar completamente", icon: "fa-times"},
                    "delete": {name: "Remover", icon: "delete"}
                }
            });
            return disc;
        },
        label: function (disc, text, x, y, w, h) {

            var d = document.createElement("div");
            d.className = "labelcomponent";
            document.getElementById("workspace").appendChild(d);
            var id = "l" + autoIncrementIdLabel;
            autoIncrementIdLabel++;
            d.id = id;
            var left, top;
            if (x) {
                left = x;
            } else {
                left = Math.max(parseFloat(disc.d.style.left) - 100, 0);
            }
            if (y) {
                top = y;
            } else {
                top = Math.max(parseFloat(disc.d.style.top) - 100, 100);
            }

            d.style.left = left + "px";
            d.style.top = top + "px";
            var width, height;
            if (w) {
                width = w;
            } else {
                width = 100;
            }

            if (h) {
                height = h;
            } else {
                height = 66;
            }

            var header = document.createElement('div');
            header.className = 'header';
            var textarea = document.createElement('textarea');
            textarea.value = text;
            var closebtn = document.createElement('button');
            closebtn.innerHTML = "<i class='fa fa-times'></i>";
            header.appendChild(closebtn);
            d.appendChild(header);

            $(d).dblclick(function (event) {
                event.stopPropagation();
            });
            var a = jsPlumb.addEndpoint(disc.d, window.Endpoints.label[0]);
            var b = jsPlumb.addEndpoint(d, window.Endpoints.label[0]);
            var discd = {
                id: id,
                text: function(){ return textarea.value;},
                d: d
            };
            disc.infos.push(discd);
            $(d).animate({'left': (left - width / 2) + 'px', 'top': (top - height / 2) + "px", 'width': width + "px", 'height': height + "px"}, 600, 'easeOutElastic', function() {
                $(d).css('width', 'auto').css('height', 'auto');
                $(textarea)
                        .width($(d).width())
                        .css('min-width', width + "px")
                        .css('min-height', (height - 36) - 'px')
                        .mouseup(function(){
                            jsPlumb.repaintEverything();
                        });
                d.appendChild(textarea);

                var c = jsPlumb.connect({
                    source: b,
                    target: a,
                    deleteEndpointsOnEmpty: true,
                    connectionsDetachable: false,
                    scope: "rotuloScope"
                });
                $(closebtn).click(function(){
                    disc.infos = disc.infos.filter(function (el) {
                        return el.id !== id;
                    });

                    jsPlumb.remove(d);
                });
                c.setDetachable(false);
                jsPlumb.repaintEverything();
            });

            jsPlumb.draggable(id);

            return id;
        }

    };

}());