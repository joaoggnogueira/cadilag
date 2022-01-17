/* 
 Author     : joaog
 */

/* global jsPlumb */

$(document).ready(function () {

    jsPlumb.importDefaults({
        DragOptions: {zIndex: 2000},
        Connector: ["Straight", {gap: 0}],
        ConnectionsDetachable: true,
        allowLoopback: true
    });


    jsPlumb.bind('connectionMoved', function (info) {
        movedEvent(info);
        Matrix.update();
    });

    jsPlumb.bind("connection", function (info) {

        connectEvent(info);
        if (info.connection.scope === "workspace") {
            Matrix.update();
        }
    });

    jsPlumb.bind("connectionDetached", function (info) {
        detachEvent(info);
        if (info.connection.scope === "workspace") {
            setTimeout(function () {
                Matrix.update();
            }, 200);
        }
    });

    $("input[name='ponderado']").change(function (event) {
        if ($("input[name='ponderado']:checked").val() === "true") {
            jsPlumb.select({scope: "workspace"}).each(function(connection){
                addCellRead(connection, "0");
            });
            Matrix.update();
        } else {
            swal({
                type: "warning",
                title: "Continuar?",
                text: "Ao altenar o modo não ponderado, os pesos serão perdidos",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar"
            }, function (isConfirm) {
                if (isConfirm) {
                    jsPlumb.select({scope: "workspace"}).each(function(connection) {
                        removeCellRead(connection);
                    });
                    Matrix.update();
                }
            });
        }
    });
    $("input[name='digrafo']").change(function (event) {

        var exe = function (isConfirm) {
            if (isConfirm) {
                jsPlumb.select({scope: "workspace"}).each(function(connection) {
                    jsPlumb.deleteConnection(connection);
                });
                jsPlumb.unmakeEveryTarget();
                jsPlumb.unmakeEverySource();
                var endpoints;
                if ($("input[name='digrafo']:checked").val() === "true") {
                    endpoints = Endpoints.get("retodigrafo");
                } else {
                    endpoints = Endpoints.get("retografo");
                }
                if ($(".radio-connect").hasClass("selected")) {
                    $('.nodeelement').each(function(key, obj) {
                        jsPlumb.makeSource(obj, endpoints);
                        jsPlumb.makeTarget(obj, endpoints);
                    });
                }
                updateCountTransicoes();
                Matrix.update();
            } else {
                $("input[name='digrafo']:not(:checked)").get(0).checked = true;
            }
        };

        if (jsPlumb.select({scope: "workspace"}).length !== 0) {
            swal({
                type: "warning",
                title: "Continuar?",
                text: "Ao altenar o modo digrafo e grafo, as conexões atuais serão removidas",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar"
            }, exe);
        } else {
            exe(true);
        }

    });

    $(".radio-connect").on("selected", function() {
        $('.nodeelement').each(function(key, obj){
            jsPlumb.setDraggable(obj.id, false);
            var endpoints;
            if ($("input[name='digrafo']:checked").val() === "true") {
                endpoints = Endpoints.get("retodigrafo");
            } else {
                endpoints = Endpoints.get("retografo");
            }
            jsPlumb.makeSource(obj, endpoints);
            jsPlumb.makeTarget(obj, endpoints);
            jsPlumb.repaintEverything();
        });
        jsPlumb.select({scope: "workspace"}).each(function(connection) {
            connection.setDetachable(true);
        });
    });

    $(".radio-move").on("selected", function() {

        $('.nodeelement').each(function(key, obj) {
            jsPlumb.setDraggable(obj.id, true);
        });
        jsPlumb.select({scope: "workspace"}).each(function(connection) {
            connection.setDetachable(false);
        });
        jsPlumb.unmakeEveryTarget();
        jsPlumb.unmakeEverySource();
    });
});

function removeAllConnections() {
    jsPlumb.select({scope: "workspace"}).each(function(connection) {
        jsPlumb.deleteConnection(connection);
    });
    updateCountTransicoes();
    Matrix.update();
}

function removeAllLabels() {
    $(".labelcomponent").each(function(key, obj) {
        jsPlumb.remove(obj.id);
    });
}

function clearAll() {
    $(".labelcomponent").each(function(key, obj) {
        jsPlumb.remove(obj.id);
    });
    $(".element").each(function(key, obj) {
        jsPlumb.remove(obj.id);
    });
    updateCountTransicoes();
    updateCountEstados();
    Matrix.update();
}

function toggleFerramenta(i) {
    if ($(".subsidebar").eq(i).css('display') === 'none') {
        $(".subsidebar").fadeOut(400);
        setTimeout(function () {
            $(".subsidebar").eq(i).fadeIn(400);
        }, 500);
    }

    if ($("#sidebar").hasClass('hide'))
        toggleSidebar();
}

function movedEvent(info) {
    var movido = false;
    var invert = false;
    if (info.originalSourceId !== info.newSourceId) {
        movido = true;
        invert = true;
    } else if (info.originalTargetId !== info.newTargetId) {
        movido = true;
        invert = false;
    }
    if (movido) {
        var scope = info.connection.scope;
        jsPlumb.deleteConnection(info.connection);
        var a, b;
        if (info.newTargetId === info.newSourceId) {
            var endpoints = Endpoints.get("curvado");
            endpoints.scope = scope;
            a = jsPlumb.addEndpoint(document.getElementById(info.newSourceId), endpoints);
            b = jsPlumb.addEndpoint(document.getElementById(info.newTargetId), endpoints);
        } else {
            var endpoints;
            if ($("input[name='digrafo']:checked").val() === "true") {
                endpoints = Endpoints.get("retodigrafo");
            } else {
                endpoints = Endpoints.get("retografo");
            }
            endpoints.scope = scope;
            a = jsPlumb.addEndpoint(document.getElementById(info.newSourceId), endpoints);
            b = jsPlumb.addEndpoint(document.getElementById(info.newTargetId), endpoints);
        }

        if (invert) {
            jsPlumb.connect({
                source: b,
                target: a,
                deleteEndpointsOnEmpty: true
            });
        } else {
            jsPlumb.connect({
                source: a,
                target: b,
                deleteEndpointsOnEmpty: true
            });
        }
    }
}

function detachEvent(info) {
    var con = info.connection;
    if (con.target !== con.source) {
        var reverse = jsPlumb.select({scope: "workspace", source: con.target, target: con.source});

        if (reverse.length !== 0) {
            reverse.get(0).endpoints[0].setAnchor(["Perimeter", {shape: "Circle"}]);
            reverse.get(0).endpoints[1].setAnchor(["Perimeter", {shape: "Circle"}]);
        }
    }
}

function removerComponent(disc) {
    jsPlumb.remove(disc.d);

    updateCountTransicoes();
    updateCountEstados();
}

function editComponent(disc) {
    $(disc.d).contextMenu(false);
    var itemValued = $(disc.d).find(".itemValue").get(0);
    $(itemValued).hide();
    var input = document.createElement("input");
    input.className = "editValue";
    input.value = itemValued.innerHTML;
    $(disc.d).append(input);
    $(input).attr("maxlength", "4");

    var finish = function() {

        var search = false;

        $(".element").each(function(key, ele) {
            var obj = $(ele).data("disc");
            if (obj.label === input.value) {
                search = true;
            }
        });

        if (search) {
            if(itemValued.innerHTML !== input.value){
                swal({title: "Opss", text: "Já existe um estado com o título '" + input.value + "'", type: "warning"});
            }
            $(itemValued).show();
            $(input).remove();
            $(disc.d).contextMenu(true);
        } else {
            itemValued.innerHTML = input.value;
            disc.label = input.value;
            $(itemValued).show();
            $(input).remove();
            $(disc.d).contextMenu(true);
            Matrix.update();
        }
    };

    $(input).focus().keyup(function(evt) {
        (evt.originalEvent.code === "Enter" && finish());
    }).blur(finish);
}

function updateCountEstados() {
    $("#counterestados").html($('.element').length);
}

function updateCountTransicoes() {
    $("#countertransicoes").html(jsPlumb.select({scope: "workspace"}).length);
}

function removeCellRead(c) {
    c.removeOverlay("label");
}

function addCellRead(c, values) {
    var id = c.sourceId + 'to' + c.targetId;
    c.addOverlay(["Label", {label: '<div class="listread" id="' + id + '"><div class="cell">' + values + '</div></div>', location: 0.75, cssClass: "lplumb", id: "label"}]);
    $(".listread#" + id + " .cell").click(function (event) {
        editCellRead($(this).parents(".listread").get(0));
        event.stopPropagation();
    });
    $(".listread").dblclick(function (event) {
        event.stopPropagation();
    });
}

function editCellRead(obj) {
    var value = $(obj).find(".cell").get(0).innerHTML;
    var d = document.createElement("input");
    d.type = "number";
    d.value = value * 1;
    d.className = "editCellRead";
    $(d).attr("min", "0");
    $(obj).find(".cell").hide();
    obj.appendChild(d);
    $(d).focus();
    $(d).keyup(function (evt) {
        if (evt.originalEvent.code === "Enter") {
            $(this).trigger("blur");
        }
    });
    $(d).blur(function () {
        var value = parseFloat($(d).val());
        value = Math.max(0, value);
        $(obj).find(".cell").get(0).innerHTML = value;
        $(d).remove();
        $(obj).find(".cell").show();
        Matrix.update();
    });
}

function addLabel(disc) {
    Create.label(disc);
}

function disconnectComponent(disc) {
    jsPlumb.deleteConnectionsForElement(disc.d);
}

(function () {

    window.connectEvent = function(info) {
        if (info) {
            if (info.connection.scope === "workspace" || info.connection.scope === "prewie") {
                jsPlumb.repaintEverything();
                var con = info.connection;

                var arr = jsPlumb.select({source: con.sourceId, target: con.targetId});

                if (arr.length > 1) {
                    jsPlumb.deleteConnection(con);
                    return;
                }

                if ($("input[name='digrafo']:checked").val() === "false" && info.sourceId !== info.targetId) {
                    var reverse = jsPlumb.select({scope: "workspace", source: con.target, target: con.source});

                    if (reverse.length !== 0) {
                        jsPlumb.deleteConnection(con);
                        return;
                    }
                }
                if (con.scope === "prewie") {
                    con.setPaintStyle({
                        strokeWidth: 6,
                        stroke: "#0078e7",
                        dashstyle: "2 2"
                    });
                }
                if (info.sourceId === info.targetId && con.connector.type === "Straight") {
                    var endpoints;
                    endpoints = Endpoints.get("curvado");
                    endpoints.scope = con.scope;

                    var a = jsPlumb.addEndpoint(info.source, endpoints);
                    var b = jsPlumb.addEndpoint(info.target, endpoints);

                    jsPlumb.deleteConnection(con);
                    var c = jsPlumb.connect({
                        source: b,
                        target: a,
                        deleteEndpointsOnEmpty: true
                    });
                    if (con.scope === "prewie") {
                        c.setPaintStyle({
                            strokeWidth: 6,
                            stroke: "#0078e7",
                            dashstyle: "2 2"
                        });
                    }
                } else if (info.sourceId !== info.targetId) {
                    var reverse = jsPlumb.select({scope: "workspace", source: con.target, target: con.source});

                    if (reverse.length !== 0) {
                        setTimeout(function () {
                            var anchor1 = [[1, 0.4, 0, -1], [0, 0.6, 0, -1], [0.4, 1, 0, -1], [0.6, 0, 0, -1]];
                            var anchor2 = [[0, 0.4, 0, -1], [1, 0.6, 0, -1], [0.4, 0, 0, -1], [0.6, 1, 0, -1]];
                            reverse = reverse.get(0);
                            if (con.endpoints) {
                                con.endpoints[0].setAnchor(anchor1);
                                con.endpoints[1].setAnchor(anchor2);
                                reverse.endpoints[0].setAnchor(anchor1);
                                reverse.endpoints[1].setAnchor(anchor2);
                                //Matrix.update();
                            }
                        }, 200);

                    }
                }
                if ($("input[name='ponderado']:checked").val() === "true" && con.scope === "workspace") {
                    addCellRead(con, '0');
                }

                updateCountTransicoes();
            }
        } else {
            console.error("INFO é undefinido");
        }

    };

    var newLabel = function () {
        var saida = 0;
        do {
            saida++;
            var search = false;
            $(".element").each(function(key, ele) {
                var obj = $(ele).data("disc");
                if (obj.label === "s" + saida) {
                    search = true;
                }
            });
        } while (search);
        return "s" + saida;
    };

    var createComponent = function (event) {

        const params = Component.node;
        var label = newLabel();
        var x = event.pageX;
        var y = event.pageY;
        var disc = Create.component(x, y, label);
        $(disc.d).animate({'left': (x - params.width / 2) + 'px', 'top': (y - params.height / 2) + "px", 'width': (params.width - 3) + 'px', 'height': (params.height - 3) + 'px'}, 600, 'easeOutElastic');

        clearSelection();
        updateCountEstados();
        Matrix.update();
    };

    window.Machine = {
        addNode: function (event) {
            createComponent(event);
        }
    };

}
());