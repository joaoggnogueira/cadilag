jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function FilaEstatica() {
    this.MAX = 13;
    this.ini = 0;
    this.fim = 0;
    this.total = 0;
    this.fila = new Array(this.MAX);

    FilaEstatica.criaNo = function () {
        return {ref: null, id: null, value: null};
    };

    this.inicia = function (MAX) {
        this.ini = 0;
        this.fim = 0;
        this.total = 0;
        this.MAX = parseInt(MAX) || this.MAX;
        for (var i = 0; i < this.MAX; ++i)
            this.fila[i] = null;

    },
    this.insere = function (elem) {
        if (this.total !== this.MAX) {
            this.fila[this.fim] = FilaEstatica.criaNo();
            this.fila[this.fim].ref = elem.d;
            this.fila[this.fim].id = elem.id;
            this.fila[this.fim].value = elem.valor;
            Element.bind(this.fila[this.fim],elem.id,{index:this.fim});
            this.fim = (this.fim + 1) % this.MAX;
            this.total++;
        }
    },
    this.remove = function () {
        if (this.total !== 0) {
            var aux = this.fila[this.ini];
            delete this.fila[this.ini];
            this.ini = (this.ini+1)%this.MAX;
            this.total--;
            return aux;
        }
        return null;
    },

    this.at = function (i) {
        return this.fila[i];
    };

}

(function () {
    var collection = new FilaEstatica();

    var 
    pointerini=null,pointerfim=null,
    initPointers = function(){
        if(pointerini!==null){
            $("#"+pointerini.id).remove();
        }
        if(pointerfim!==null){
            $("#"+pointerfim.id).remove();
        }
        pointerini = createPointer("<p>Inicio<br>Fim</p>");
        pointerfim = null;
    },
    reinitPointers = function(){
        $("#"+pointerfim.id).remove();
        pointerfim = null;
        pointerini.d.innerHTML = "<p>Inicio<br>Fim</p>";
    },
    createPointer = function(text){
        return Element.createElement(
            {className:"staticpointer",
            innerHTML:text,
            left:"105px",
            top:"350px",
            idParent:"main"});
    },
    showMessage = function(text,time){
        Plumb.showMessage(text,time);
    },
    animationAdd = function (info) {
        UI.lock();
        
        var qtd = collection.fim;
        var pos = {left: 100, top: 280};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        if (pointerfim !== null) {
            pos = $(pointerfim.d).position();
        } else {
            pos = $(pointerini.d).position();
        }
        pos.left = pos.left - 2;
        pos.top = pos.top - 70;
        Plumb.moveTo(info.id,pos.left,pos.top,2000);
        if(collection.total !== collection.MAX) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0,10);
            highlighter.line(2,500);
            highlighter.line(3,1000);
            highlighter.line(4,1500);
            highlighter.clear(3000);
            var next = (qtd+1)%collection.MAX;
            var pos = $("#array"+next).position().left + 4;
            if(pointerfim === null) {
                pointerini.d.innerHTML = "<p>Inicio</p>";
                pointerfim = createPointer("<p>Fim</p>");
            }
            Plumb.moveTo(pointerfim.id,pos,parseInt(pointerfim.d.style.top),500);
            timeout( function() {
                StepRecord.add("Novo elemento é adicionado no fim da fila, cujo o mesmo irá avançar para próxima posição");
                StepRecord.end();
                collection.insere(info);
                if(collection.ini === collection.fim) {
                    reinitPointers();
                }
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        } else {
            showMessage("Fila Cheia",4000);
            highlighter.lineRed(0,10);
            highlighter.clear(1000);
            timeout( function(){
                timeout( function(){
                    $("#"+info.id).remove();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                },2000);
                Plumb.fadeOut(info.id,2000);
            },2000);
        }

    },
    animationSearch = function (elId, value) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        
        var pos = $("#array"+collection.ini).position();
        pos.top -= 70;
        pos.left -= 2;
        Plumb.moveTo(elId,pos.left,pos.top, 2000);
        if(collection.total === 0){
            highlighter.lineRed(0,10);
            highlighter.line(17,1000);

            showMessage("Fila vazia",1000);
            timeout( function(){
                StepRecord.add("Busca encerra pois a fila está vazia");
            },2000);
            $("#"+elId).fadeOut(2000);
            timeout( function() {
                highlighter.clear(0);
                UI.unlock();
                $("#" + elId).remove();
                StepRecord.end();
            }, 2000);
            return;
        } else if(collection.fila[collection.ini].value == value){
            highlighter.line(0,10);
            highlighter.lines(2,3,1000);
            highlighter.line(4,2000);
            highlighter.line(5,3000);

            var id = collection.at(collection.ini).id;
            timeout(function(){changeColor(collection.ini);}, 1000);
            timeout( function(){
                StepRecord.add("Busca encerra pois o elemento foi encontrado na primeira posição");
            },2000);
            Plumb.blink(id,6000,function() {
                highlighter.clear(0);
                UI.unlock();
                $("#" + elId).remove();
                resetColor(collection.ini);
                StepRecord.end();
            });
            return;
        }
        highlighter.line(0,10);
        highlighter.lines(2,3,1000);
        highlighter.line(6,2000);
        highlighter.lineRed(4,2000);
        highlighter.line(8,3000);
        
        var animate = function(i,time){
            timeout( function() {
                StepRecord.add("Busca avança para o indice "+(i+1));
            }, (time + 1) * 2000);
        };
        
        timeout( function() {
            StepRecord.add("Busca começa no indice de início da pilha(índice: "+collection.ini+")");
        },  2000);
        var index = 1;
        var pos;
        for (var i = (collection.ini+1)%collection.MAX; i !== collection.fim; i=(i+1)%collection.MAX) {
            pos = $("#array"+i).position();
            pos.top -= 70;
            pos.left -= 2;
            Plumb.moveTo(elId,pos.left,pos.top, 2000);
            index++;
            highlighter.line(9,2000*(index+1));
            if (collection.fila[i].value == value) {
                highlighter.line(11,2000*(index)+500);
                highlighter.line(12,2000*(index)+1000);
                highlighter.clear(2000*(index+1));
                break;
            }
            highlighter.lineRed(11,2000*(index)+500);
            highlighter.line(13,2000*(index)+1000);
            animate(i,index);
        }

        timeout( function() {
            if (i !== collection.fim) {
                var id = collection.at(i).id;
                timeout( function(){changeColor(i);}, 1000);
                timeout( function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                Plumb.blink(id,6000,function() {
                    UI.unlock();
                    $("#" + elId).remove();
                    resetColor(i);
                    StepRecord.end();
                });
            } else {
                timeout( function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                },2000);
                Plumb.moveTo(elId,pos.left+72,pos.top, 2000);
                highlighter.lineRed(9,1000);
                highlighter.line(17,2000);
                highlighter.clear(3000);
                timeout( function() {
                    UI.unlock();
                    $("#" + elId).remove();
                    resetColor(i);
                    StepRecord.end();
                }, 3000);
            }
            Plumb.fadeOut(elId,2000);
        }, (index + 1) * 2000);


    },
    animationRemove = function () {
        UI.lock();

        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);

        if (collection.total !== 0) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            var id = collection.at(collection.ini).id;

            timeout(function(){changeColor(collection.ini);},1000);
            Plumb.blink(id,4000,function(){
               Plumb.fadeOut(id,1000); 
            });
            if(pointerfim === null) {
                pointerini.d.innerHTML = "<p>Inicio</p>";
                pointerfim = createPointer("<p>Fim</p>");
                pointerfim.d.style.left = pointerini.d.style.left;
                pointerfim.d.style.top = pointerini.d.style.top;
            }
            highlighter.line(0,10);
            highlighter.line(2,900);
            highlighter.line(3,1800);
            highlighter.line(4,2700);
            highlighter.line(5,3600);
            highlighter.line(6,4500);

            var next = (collection.ini+1)%collection.MAX;
            var pos = $("#array"+next).position().left + 4;
            Plumb.moveTo(pointerini.id,pos,parseInt(pointerini.d.style.top),500);
            
            timeout( function() {
                resetColor(collection.ini);
                collection.remove();
                if(collection.ini === collection.fim){
                    reinitPointers();
                }
                $("#"+id).remove();
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 5000);
        } else {
            showMessage("Fila vazia",1000);
            highlighter.lineRed(0,10);
            highlighter.line(8,500);
            highlighter.clear(1000);
            timeout( function(){
                UI.unlock();
                window.Eprogramada.nextQueue();
            },1000);
        }
    },
    createDisc = function (value) {
       var elem = Element.createElement(
                {className:"dinamicDot altColor",
                innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
                left:"0px",
                top:"75px",
                title:value,
                idParent:"main"});
        elem.valor = value;
        return elem;
    },
    changeColor = function (ind) {
        Canvas.highlight({canvasId:'canv',indice:ind});
    },
    resetColor = function(ind){
        Canvas.reset({indice:ind});
    },
    draw = function () {
        Canvas.drawArray({canvasId:'canv',total:collection.MAX,alternate:"html"});
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            $("#stop").hide();
            UI.setProperty("primaryColorProperty",true);
            $("#newStruct").click(this.newStruct);
            UI.InitInterface(this.search,this.elementToString);
            Canvas.initInterface(Cadilag.elementIndexToString);
        },
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return $(".dinamicDot[title='"+value+"']").length!==0;
            }
            return false;
        },
        elementIndexToString: function (index) {
            var arraypos = collection.fila[index];
            if (arraypos === null) {
                return {'info':'nulo','_index':index,'_title':'Fila'};
            } else if(arraypos !== undefined) {
                return {'info':arraypos.value,'_index':index,'_title':'Fila'};
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var vars  = Element.getVars(id);
                var result = {'info':element.value,'_index':vars.index,'_title':'Fila'};
                return result;
            }
            return false; 
        },
        newStruct: function(){
            var size = UI.value("sizeArray","Tamanho do Vetor é invalido");
            if(size!=="") {
                UI.setParameters({"MAX":size});
                UI.InitFunctions(Cadilag.addDisc,Cadilag.removeValue,Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size);
                draw();
                initPointers();    
                UI.unlock();
                $("#subtopbar").animate({"top":"0px"},500,function(){
                    $(this).remove();
                });
            }
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    var info = createDisc(value);
                    animationAdd(info);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                    });
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            UI.subtitle("Removendo o primeiro da fila");
            animationRemove();
        },
        searchValue: function () {
            var value = UI.value('valor');
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationSearch(info.id, value);
            }
        }

    };

})();
