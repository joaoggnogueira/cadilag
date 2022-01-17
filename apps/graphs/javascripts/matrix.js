/* 
 Author     : joaog
 */

/* global jsPlumb */

(function () {

    var hoverConnections = [];

    function highlightConnection(con){
        con.setPaintStyle({
            strokeWidth: 6,
            stroke: "#0078e7"
        });
        hoverConnections = [con];
    }

    function hoverCellTable(j, i) {
        $("#matrix-graph tr:nth-child(" + j + ") td").addClass("hover");
        $("#matrix-graph tr td:nth-child(" + i + ")").addClass("hover");
        $(lastretrieval.estados[j - 2].d).addClass("selected");
        $(lastretrieval.estados[i - 2].d).addClass("selected");
        var source = lastretrieval.estados[j - 2].d;
        var target = lastretrieval.estados[i - 2].d;
        var con = jsPlumb.select({source: source, target: target, scope: "workspace"});
        var conreverse = jsPlumb.select({source: target, target: source, scope: "workspace"});

        if (con.length !== 0) {
            highlightConnection(con.get(0));
        } else if (!lastretrieval.digrafo && conreverse.length !== 0) {
            highlightConnection(conreverse.get(0));
        } else {
            var endpoints;
            if (source === target) {
                endpoints = Endpoints.get("curvado");
            } else {
                if (lastretrieval.digrafo) {
                    endpoints = Endpoints.get("retodigrafo");
                } else {
                    endpoints = Endpoints.get("retografo");
                }
            }
            var backupscope = endpoints.scope;
            endpoints.scope = "prewie";
            var a = jsPlumb.addEndpoint(source, endpoints);
            var b = jsPlumb.addEndpoint(target, endpoints);
            var con = jsPlumb.connect({
                source: a,
                target: b,
                deleteEndpointsOnEmpty: true
            });
            endpoints.scope = backupscope;
        }
    }

    function hoverLineTable(j) {
        $("#matrix-graph tr:nth-child(" + j + ") td").addClass("hover");
        $(lastretrieval.estados[j - 2].d).addClass("selected");
    }

    function hoverColumnTable(i) {
        $("#matrix-graph tr td:nth-child(" + i + ")").addClass("hover");
        $(lastretrieval.estados[i - 2].d).addClass("selected");
    }

    function clearHoverCellTable() {
        $("#matrix-graph td").removeClass("hover");
        $(".element.selected").removeClass("selected");
        for (var i = 0; i < hoverConnections.length; i++) {
            hoverConnections[i].setPaintStyle({
                strokeWidth: 4,
                stroke: "#456"
            });
        }

        jsPlumb.select({scope: "prewie"}).delete();
        hoverConnections.length = 0;
    }

    var lastretrieval;

    function updateMatriz(data) {
        var table = document.getElementById("matrix-graph");
        table.innerHTML = "";
        var header = table.insertRow(0);
        header.insertCell(0).style.background = "rgba(0,0,0,0.1)";
        var matrix = [];
        for (var i = 0; i < data.estados.length; i++) {
            matrix[i] = [];
            var headercell = header.insertCell(i + 1);
            headercell.className = "headtop";
            headercell.innerHTML = data.estados[i].name;
            headercell.style.background = "rgba(0,0,0,0.1)";
            const ki = i + 2;
            $(headercell)
                    .mouseenter(function() {
                        hoverColumnTable(ki);
                    })
                    .mouseout(function() {
                        clearHoverCellTable();
                    });
            var row = table.insertRow(i + 1);
            var cell = row.insertCell(0);
            cell.innerHTML = data.estados[i].name;
            cell.className = "headleft";
            cell.style.background = "rgba(0,0,0,0.1)";
            const kj = i + 2;
            $(cell)
                    .mouseenter(function() {
                        hoverLineTable(kj);
                    })
                    .mouseout(function() {
                        clearHoverCellTable();
                    });
            for (var j = 0; j < data.estados.length; j++) {
                var cellmatrix = row.insertCell(j + 1);
                const kx = i + 2;
                const ky = j + 2;
                $(cellmatrix)
                        .mouseenter(function() {
                            hoverCellTable(kx, ky);
                        })
                        .mouseout(function() {
                            clearHoverCellTable();
                        });
                if (data.ponderado) {
                    cellmatrix.innerHTML = "-1";
                } else {
                    cellmatrix.innerHTML = "false";
                }
                matrix[i][j] = cellmatrix;
            }
        }
        for (var i = 0; i < data.transicoes.length; i++) {
            var transicao = data.transicoes[i];
            var cell = matrix[transicao.from][transicao.to];
            cell.className = "notNull";
            if (data.digrafo) {
                if (data.ponderado) {
                    cell.innerHTML = transicao.value;
                } else {
                    cell.innerHTML = "true";
                }
            } else {
                var cell2 = matrix[transicao.to][transicao.from];
                cell2.className = "notNull";
                if (data.ponderado) {
                    cell.innerHTML = transicao.value;
                    cell2.innerHTML = transicao.value;
                } else {
                    cell.innerHTML = "true";
                    cell2.innerHTML = "true";
                }
            }

        }
    }

    function clearHoverCellList() {
        $(".element.selected").removeClass("selected");
        for (var i = 0; i < hoverConnections.length; i++) {
            hoverConnections[i].setPaintStyle({
                strokeWidth: 4,
                stroke: "#456"
            });
        }

        jsPlumb.select({scope: "prewie"}).delete();
        hoverConnections.length = 0;
    }

    function hoverList(j) {
        $(lastretrieval.estados[j].d).addClass("selected");
    }

    function hoverConnection(source, target) {
        var con = jsPlumb.select({source: source, target: target, scope: "workspace"});
        var conreverse = jsPlumb.select({source: target, target: source, scope: "workspace"});
        $(source).addClass("selected");
        $(target).addClass("selected");
        if (con.length !== 0) {
            highlightConnection(con.get(0));
        } else if (!lastretrieval.digrafo && conreverse.length !== 0) {
            highlightConnection(conreverse.get(0));
        }
    }

    function updateList(data) {
        var list = document.getElementById("list-graph");
        list.innerHTML = "";
        var rows = [];
        for (var i = 0; i < data.estados.length; i++) {
            var ul = document.createElement("li");
            var listinner = document.createElement("ul");
            listinner.className = "inner";
            var cellinner = document.createElement("li");
            cellinner.className = "headerinnercell";
            cellinner.innerHTML = data.estados[i].name;
            const kj = i;
            $(cellinner)
                    .mouseenter(function() {
                        hoverList(kj);
                    })
                    .mouseout(function() {
                        clearHoverCellList();
                    });
            listinner.appendChild(cellinner);
            var arrow = document.createElement("li");
            arrow.className = "arrowinnercell";
            listinner.appendChild(arrow);
            ul.appendChild(listinner);
            rows[i] = listinner;
            list.appendChild(ul);
        }

        for (var i = 0; i < data.transicoes.length; i++) {
            var transicao = data.transicoes[i];
            var ul = rows[transicao.from];
            var cellinner = document.createElement("li");
            cellinner.className = "innercell";
            cellinner.innerHTML = data.estados[transicao.to].name;
            const from = data.estados[transicao.from].d;
            const to = data.estados[transicao.to].d;
            if (data.ponderado) {
                cellinner.innerHTML += " | " + transicao.value;
            }
            ul.appendChild(cellinner);
            $(cellinner)
                .mouseenter(function() {
                    hoverConnection(from, to);
                })
                .mouseout(function() {
                    clearHoverCellTable();
                });
        }
        if (!data.digrafo) {
            for (var i = 0; i < data.transicoes.length; i++) {

                var transicao = data.transicoes[i];
                var ul = rows[transicao.to];
                const from = data.estados[transicao.from].d;
                const to = data.estados[transicao.to].d;
                var cellinner = document.createElement("li");
                cellinner.className = "innercell";
                cellinner.innerHTML = data.estados[transicao.from].name;
                if (data.ponderado) {
                    cellinner.innerHTML += " | " + transicao.value;
                }
                ul.appendChild(cellinner);
                $(cellinner)
                        .mouseenter(function() {
                            hoverConnection(from, to);
                        })
                        .mouseout(function() {
                            clearHoverCellTable();
                        });
            }
        }
    }

    window.Matrix = {
        update: function() {
            const data = DataGraph.retrieval(true);
            lastretrieval = data;
            updateMatriz(data);
            updateList(data);
        }

    };


})();