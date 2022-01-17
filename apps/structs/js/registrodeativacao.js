/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var lastPosCallStack = {
    left: "100px",
    top: "100px"
};

function hoverEnterRegistroDeAtivacao(id){
    $("#"+id).addClass("hover");
    Plumb.repintarElemento(""+id);
}

function hoverOutRegistroDeAtivacao(id){
    $("#"+id).removeClass("hover");
    Plumb.repintarElemento(""+id);
}

function CallStack() {

    this.d = null;
    this.root = null;
    this.tabled = null;
    this.data = [];
    this.count = [0, 0, 0];

    this.init = function () {
        var x,y;
        if (x === undefined) {
            x = lastPosCallStack.left;
        }
        if (y === undefined) {
            y = lastPosCallStack.top;
        }
        var parent = document.body;

        var ddrag = document.createElement("div");
        ddrag.className = "registrodeativacao-parent";
        ddrag.style.left = x;
        ddrag.style.top = y;

        var d = document.createElement("div");
        d.className = "registrodeativacao";

        var title = document.createElement("div");
        title.innerHTML = "Pilha de Chamadas";
        title.className = "title";
        
        var button_close = document.createElement("button");
        button_close.innerHTML = '<i class="fa fa-times"></i>';
        button_close.className = "btn_close";
        
        button_close.onclick = function(){
            UI.callstack.hide();
        };
        
        title.appendChild(button_close);
        d.appendChild(title);
        ddrag.appendChild(d);
        parent.appendChild(ddrag);

        this.initTable(d);
        $(ddrag).draggable({handle: ".title"});
        this.root = ddrag;
        this.d = d;
    };

    this.initTable = function (parent) {

        this.tabled = document.createElement("table");
        this.tabled.className = "controller";
        this.createRowHeaderTable(["Chamadas", ""]);
        parent.appendChild(this.tabled);

    };

    this.update = function () {

        $(this.tabled).tabelize({
            fullRowClickable: true,
            onBeforeRowClick: null,
            onAfterRowClick: null,
            onReady: function(){
                var root = $(".registrodeativacao");
                root.find(".l1").removeClass("contracted").addClass("expanded").addClass("l1-first");
                root.find(".l2").removeClass("hidden").addClass("l2-last").addClass("l1-last");
            }
        });

    };

    this.tr = function (lvl, count) {
        var pos = String.fromCharCode(97 + count);
        var tr = document.createElement("tr");
        tr.setAttribute("data-level", "" + lvl);
        tr.className = "data-level";
        tr.id = "level_" + lvl + "_" + pos;
        return tr;
    };

    this.fillTR = function (tr, row) {
        var total = row.length;
        for (var i = 0; i < total; i++) {
            var td = document.createElement("td");
            td.innerHTML = row[i];
            td.className = "data";
            tr.appendChild(td);
        }
    };

    this.newTr = function (lvl, row) {
        var count;
        if (lvl < 4) {
            count = this.count[lvl - 1];
            this.count[lvl - 1]++;
        } else {
            count = 1;
        }
        var tr = this.tr(lvl, count);
        this.fillTR(tr, row);
        this.tabled.appendChild(tr);
    };

    this.addChamada = function (nomeFuncao, variaveis, linha) {
        this.data.push({nome: nomeFuncao, variaveis: variaveis, linha: linha});
    };

    this.flush = function () {
        for (var i = 0; i < this.data.length; i++) {
            this.appendChamada(this.data[i].nome,this.data[i].variaveis,this.data[i].linha);
        }
        this.count = [0,0,0];
    };

    this.destroy = function(){
        $(this.tabled).remove();
        this.initTable(this.d);
        lastPosCallStack.left = this.root.style.left;
        lastPosCallStack.top = this.root.style.top;
    };
    
    this.remove = function(){
        $(this.tabled).remove();
        this.initTable(this.d);
        this.data.length = 0;
    };
    
    this.show = function(){
        $(this.root).show();
    };
    
    this.hide = function(){
        $(this.root).hide();
    };

    this.appendChamada = function (nomeFuncao, variaveis, linhas) {
        var stringParams = "";
        var stringValues = "";
        var first = true;
        for (var key in variaveis) {
            
            if (!first) {
                stringParams += ",";
                stringValues += ",";
            }
            if(variaveis[key].hover){
                stringValues += 
                "<a onmouseenter=\"hoverEnterRegistroDeAtivacao("+variaveis[key].hover+")\" onmouseout=\"hoverOutRegistroDeAtivacao("+variaveis[key].hover+")\"'>";
            }
            stringParams += key;
            stringValues += variaveis[key].resumo;
            first = false;
            if(variaveis[key].hover){
                stringValues += "</a>";
            }
        }

        if(linhas===undefined){
            linhas = nomeFuncao + "(" + stringParams + ")";
        }

        //CHAMADAS
        this.newTr(1, ["<b>" + nomeFuncao + "(" + stringParams + ")</b>", "<i>"+linhas+"</i>"]);

        //PARAMETERS
        this.newTr(2, ["Parâmetros", "(" + stringValues + ")"]);

        for (var key in variaveis) {
            this.newTr(3, [key, variaveis[key].resumo]);
            for (var keyin in variaveis[key]) {
                if (keyin !== "resumo" && keyin !== "hover") {
                    this.newTr(4, [keyin, variaveis[key][keyin]]);
                }
            }
        }
    };

    this.createRowHeaderTable = function (row) {

        var tr = document.createElement("tr");
        tr.setAttribute("data-level", "header");
        tr.className = "header";

        var total = row.length;
        for (var i = 0; i < total; i++) {
            var td = document.createElement("td");
            td.innerHTML = row[i];
            tr.appendChild(td);
        }

        this.tabled.appendChild(tr);

    };

}
