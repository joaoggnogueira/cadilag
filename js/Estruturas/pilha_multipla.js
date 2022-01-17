jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function PilhasMultiplas() {
    this.MAX = 12;
    this.topos = [];
    this.inicios = [];
    this.totalPilhas = 2;
    this.pilha = new Array(this.MAX);

    PilhasMultiplas.criaNo = function () {
        return {ref: null, id: null, value: null};
    };

    this.inicia = function (MAX,totalP) {
        this.MAX = MAX;
        this.totalPilhas = totalP;

        for (var i = 0; i < this.MAX; ++i)
            this.pilha[i] = null;
        
        var naco = this.MAX/this.totalPilhas;
        var i;
        for(i = 0; i < this.totalPilhas; i++) {
            this.topos[i] = parseInt(naco*i);
            this.inicios[i] = parseInt(naco*i);
        }
        this.inicios[i] = this.MAX;
    };

    this.insere = function (elem, p, valor) { 
        if(this.topos[p]<this.topoInicial(p+1)) {
            this.pilha[this.topos[p]] = PilhasMultiplas.criaNo();
            this.pilha[this.topos[p]].ref = elem.d;
            this.pilha[this.topos[p]].id = elem.id;
            this.pilha[this.topos[p]].value = valor;
            Element.bind(this.pilha[this.topos[p]],elem.id,{index:this.topos[p]});
            this.topos[p]++;
            return true;
        }
        return false;
    };

    this.remove = function (p) {
        if(this.topos[p]!==this.topoInicial(p)){
            var aux = this.pilha[this.topos[p]-1];
            this.pilha[this.topos[p]-1] = null;
            this.topos[p]--;
            return aux;
        }
        return null;
    };
    
    this.topoInicial = function(p){
        return this.inicios[p];
    };
}

(function () {
    var collection = new PilhasMultiplas();

    var 
    pointers,
    initPointer = function(){
        pointers = [];
        for(var i=0;i<collection.totalPilhas;i++) {
            pointers[i] = createPointer("<p>Topo "+i+"</p>",collection.topos[i]*72 + 100);
            var label = createLabel("<p>Pilha "+i+"</p>",collection.topos[i]*72 + 100);
            var obj = $("#"+pointers[i].id);
            pointers[i].label = label;
            var color = Math.floor(Math.random()*16777215).toString(16);
            obj.click({pointer: pointers[i]},changeColorLabel);
            obj.css("border-bottom-color",color);
            obj = $('#'+label.id);
            obj.css("border-bottom-color",color);
            obj.css("width",(collection.topoInicial(i+1)*72-collection.topoInicial(i)*72)-5);
        }
    },
    changeColorLabel = function(event){
        var color = Math.floor(Math.random()*16777215).toString(16);
        $("#"+event.data.pointer.id).css("border-bottom-color",color);
        $("#"+event.data.pointer.label.id).css("border-bottom-color",color);  
    },
    createPointer = function(text,left){
        return Element.createElement(
            {className:"staticpointer",
            innerHTML:text,
            left:left+"px",
            top:"350px",
            idParent:"main"});
    },
    createLabel = function(text,left){
        return Element.createElement(
            {className:"staticlabel",
            innerHTML:text,
            left:left+"px",
            top:"220px",
            idParent:"main"});     
    },
    highlightPointer = function(p,time){
        var id = pointers[p].id;
        Plumb.fadeOut(id, time);
        Plumb.fadeIn(id, time);
        Plumb.fadeOut(id, time);
        Plumb.fadeIn(id, time);
        Plumb.fadeOut(id, time);
        Plumb.fadeIn(id, time);
    },
    updatePointers = function(time){
        for(var i=0;i<collection.totalPilhas;i++) {
            if(i!==collection.totalPilhas && collection.topos[i+1]===collection.topos[i]){
                Plumb.moveTo(pointers[i].id,collection.topos[i]*72 + 100,parseInt(pointers[i+1].d.style.top)+72,time);
            } else {
                Plumb.moveTo(pointers[i].id,collection.topos[i]*72 + 100,350,time);
            }
        }
    },
    animationAdd = function (elId, p, deuCerto) {
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        UI.lock();
        if(deuCerto){
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0,10);
            highlighter.line(2,600);
            highlighter.line(3,1200);
            highlighter.clear(2000);
            Plumb.moveTo(elId,72*(collection.topos[p]-1) + 103,280,2000);
            updatePointers(2000);
            timeout(function() {
                StepRecord.add("Adiciona o elemento ao topo da pilha, e o topo avança uma posição");
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        } else {
            highlighter.lineRed(0,10);
            highlighter.clear(2000);
            Plumb.moveTo(elId,72*(collection.topos[p]-1)+103,193,2000);
            highlightPointer(p,1000);
            timeout(function(){
                Plumb.fadeOut(elId, 2000);
                updatePointers(2000);
                timeout(function() {
                    $("#"+elId).remove();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }, 4000);
            },2000);
        }

    },
    animationSearch = function (elId, value, p) {
        UI.lock();
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        var j = collection.topoInicial(p);
        var i = 0;
        var elem;
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        highlighter.line(0,200);
        highlighter.line(1,1000);
        var animate = function(i,j){
            timeout(function() {
                StepRecord.add("Busca avança para o indice "+(j+1));
            }, (i + 2) * 2000);
        };
        timeout(function() {
            StepRecord.add("Busca inicia no inicio da pilha "+p+" (índice:"+collection.topoInicial(p)+")");
        },  2000);
        while (j < collection.topos[p]) {
            elem = collection.pilha[j];
            Plumb.moveTo(elId, parseInt(elem.ref.style.left), parseInt(elem.ref.style.top) - 60, 2000);
            if (elem.value === value) {
                highlighter.line(2,(i+1)*2000);
                highlighter.line(4,(i+1)*2000+600);
                highlighter.line(5,(i+1)*2000+1200);
                break;
            }
            animate(i,j);
            highlighter.line(2,(i+1)*2000);
            highlighter.lineRed(4,(i+1)*2000+600);
            highlighter.line(6,(i+1)*2000+1200);
            j++;
            i++;
        }
        if(j===collection.topos[p]){
            highlighter.lineRed(2,(i+1)*2000);
            highlighter.line(8,(i+1)*2000+600);
        }
        timeout(function() {
            if (j!==collection.topos[p]) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                var id = elem.id;
                Plumb.fadeOut(id, 1000);
                Plumb.fadeIn(id, 1000);
                Plumb.fadeOut(id, 1000);
                Plumb.fadeIn(id, 1000);
                Plumb.fadeOut(id, 1000);
                Plumb.fadeIn(id, 1000);
                changeColor(j);
                timeout(function() {
                    highlighter.clear();
                    UI.unlock();
                    $("#" + elId).remove();
                    resetColor(j);
                    StepRecord.end();
                }, 6000);
            } else {
                timeout(function() {
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    UI.unlock();
                    $("#" + elId).remove();
                    highlighter.clear();
                    StepRecord.end();
                }, 2000);              
            }
            Plumb.fadeOut(elId,2000);

        }, (i + 1) * 2000);

    },
    animationRemove = function (p) {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        UI.lock();
        if(collection.topos[p]!==collection.topoInicial(p)){
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0,200);
            highlighter.line(2,1000);
            highlighter.line(3,2000);
            highlighter.line(4,3000);
            highlighter.line(5,4000);
            highlighter.clear(5000);
            var elem = collection.pilha[collection.topos[p]-1];
            var id = elem.ref.id;
            Plumb.fadeOut(id, 1000);
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);
            updatePointers(2000);
            var index = collection.topos[p]-1;
            changeColor(index);
            timeout(function(){
                collection.remove(p);
                updatePointers(2000);
                timeout(function() {
                    StepRecord.add("O topo retrocede uma posição, e elemento do topo é removido");
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                    resetColor(index);
                    $("#"+id).remove();
                }, 5000);
            },1000);
            
        } else {
            highlighter.lineRed(0,10);
            highlighter.line(7,1000);
            highlighter.clear(2000);
            highlightPointer(p,1000);
            timeout(function(){
                UI.unlock();
                window.Eprogramada.nextQueue();
            },6000);
        }

    },
    createDisc = function (value,pilha) {
        return Element.createElement(
            {className:"dinamicDot altColor",
            innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
            left:"0px",
            top:"75px",
            title:value+"/"+pilha,
            idParent:"main"});
    },
    
    changeColor = function (ind) {
        Canvas.highlight({canvasId:'canv',indice:ind});
    },
    draw = function () {
        Canvas.drawArray({canvasId:'canv',total:collection.MAX,alternate:"html"});
    };
    resetColor = function(ind){
        Canvas.reset({indice:ind});
    },

    window.Cadilag = {
        lock:false,
        init: function () {
            UI.AddInput("pilha");
            UI.lock();
            $("#stop").hide();
            UI.setProperty("primaryColorProperty",true);
            $("#newStruct").click(this.newStruct);
            UI.InitInterface(this.search,this.elementToString);
        },
        search: function(){
            var value = UI.value("valor");
            var pilha = UI.value("pilha");
            if(value!==""){
                return $(".dinamicDot[title='"+value+"/"+pilha+"']").length!==0;
            }
            return false;
        },
        elementIndexToString: function (index) {
            var arraypos = collection.pilha[index];
            if (arraypos === null) {
                return {'info':'nulo','_index':index,'_title':'Pilha'};
            } else if(arraypos !== undefined) {
                return {'info':arraypos.value,'_index':index,'_title':'Pilha'};
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var vars  = Element.getVars(id);
                var result = {'info':element.value,'_index':vars.index,'_title':'Pilha'};
                return result;
            }
            return false; 
        },
        newStruct: function(){
            var size = UI.value("sizeArray","Tamanho do Vetor é invalido");
            var total = UI.value("totalStacks","Numero de Pilhas é invalido");
            if(size!=="" && total!=="") {
                if(parseInt(total)>parseInt(size)){
                    swal({title:"Opss..",text:"O numero de pilhas não deve ser maior que o tamanho do vetor"});
                    return;
                }
                UI.InitFunctions(Cadilag.addDisc,Cadilag.removeValue,Cadilag.searchValue);
                Canvas.initInterface(Cadilag.elementIndexToString);
                $("#newStruct").unbind('click');
                collection.inicia(size,total);
                var params = "";
                for (var i = 0; i < total; i++) {
                    if(i!==0){
                        params+=",";
                    }
                    params += collection.topos[i];
                }

                UI.setParameters({topos:"{"+params+"}"});
                draw();
                initPointer();    
                UI.unlock();
                $("#pilha").attr("max",total-1);
                $("#subtopbar").animate({"top":"0px"},500,function(){
                    $(this).remove();
                });
            }
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var value = UI.value("valor");
                var pilha = UI.value("pilha","Pilha informada não existe");
                if (value!=="" && pilha!==""){
                    UI.subtitle("Inserindo o valor <b>"+value+"</b> na pilha <b>"+pilha+"</b>");
                    var info = createDisc(value,pilha);
                    var deuCerto = collection.insere(info, parseInt(pilha),value);
                    animationAdd(info.id, parseInt(pilha),deuCerto);
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                        UI.highlightInput("pilha",pilha);
                    });
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            var pilha = UI.value("pilha");
            if (pilha!==""){
                UI.subtitle("Removendo o último elemento da pilha <b>"+pilha+"</b>");
                animationRemove(pilha);
            }
        },
        searchValue: function () {
            var value = UI.value("valor");
            var pilha = UI.value("pilha","Pilha informada não existe");
            if (value!=="" && pilha!==""){
                var info = createDisc(value);
                UI.subtitle("Buscando o valor <b>"+value+"</b> na pilha <b>"+pilha+"</b>");
                animationSearch(info.id, value, pilha);
            }
        }
    };

})();