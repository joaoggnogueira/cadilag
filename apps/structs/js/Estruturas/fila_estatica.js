jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function FilaEstatica() {
    this.MAX = 13;
    this.ini = 0;
    this.fim = 0;
    this.fila = new Array(this.MAX);

    FilaEstatica.criaNo = function () {
        return {ref: null, id: null, value: null};
    };

    this.inicia = function (MAX) {
        this.ini = 0;
        this.fim = 0;
        this.MAX = parseInt(MAX) || this.MAX;
        for (var i = 0; i < this.MAX; ++i)
            this.fila[i] = null;

    },
    this.insere = function (elem) {
        if (this.fim!==this.MAX) {
            this.fila[this.fim] = FilaEstatica.criaNo();
            this.fila[this.fim].ref = elem.d;
            this.fila[this.fim].id = elem.id;
            this.fila[this.fim].value = elem.valor;
            Element.bind(this.fila[this.fim],elem.id,{index:this.fim});
            this.fim++;
        }
    },
    this.remove = function () {
        if (this.ini !== this.fim) {
            this.ini++;
            var aux = this.fila[this.ini - 1];
            if (this.ini === this.fim) {
                this.ini = 0;
                this.fim = 0;
            }
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
    reinitPointers = function(time){
        $("#"+pointerfim.id).remove();
        pointerfim = null;
        pointerini.d.innerHTML = "<p>Inicio<br>Fim</p>";
        Plumb.moveTo(pointerini.id,"105px","350px",time);
    },
    createPointer = function(text){
        return Element.createElement(
            {className:"staticpointer",
            innerHTML:text,
            left:"105px",
            top:"350px",
            idParent:"main"});
    },
    deslocarPointerIni = function(offsetX,time){
        Plumb.moveTo(pointerini.id,parseInt(pointerini.d.style.left)+offsetX,parseInt(pointerini.d.style.top),time);
    },
    deslocarPointerFim = function(offsetX,time){
        if(pointerfim===null) {
            pointerini.d.innerHTML = "<p>Inicio</p>";
            pointerfim = createPointer("<p>Fim</p>");
        }
        Plumb.moveTo(pointerfim.id,parseInt(pointerfim.d.style.left)+offsetX,parseInt(pointerfim.d.style.top),time);
    },
    animationAdd = function (info) {
        UI.lock();
        
        var desl = 3;
        var qtd = collection.fim;
        var pos = {left: 100, top: 280};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        if (collection.fim >= 1) {
            var elem = collection.at(qtd-1);
            pos = {left: parseInt(elem.ref.style.left), top: parseInt(elem.ref.style.top)};
            desl = 72;
        }
        pos.left = pos.left + desl;
        Plumb.moveTo(info.id,pos.left,pos.top,2000);
        if(qtd !== collection.MAX) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0,10);
            highlighter.line(2,1000);
            highlighter.line(3,2000);
            highlighter.clear(3000);
            deslocarPointerFim(72,500);
            timeout( function() {
                StepRecord.add("Novo elemento é adicionado no fim da fila, cujo o mesmo irá avançar para próxima posição");
                StepRecord.end();
                collection.insere(info);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        } else {
            Plumb.showMessage("Fila Cheia",4000);
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

        highlighter.lines(0,1,10);
        
        var animate = function(i,time){
            timeout( function() {
                StepRecord.add("Busca avança para o indice "+(i+1));
            }, (time + 2) * 2000);
        };
        
        timeout( function() {
            StepRecord.add("Busca começa no indice de início da pilha(índice: "+collection.ini+")");
        },  2000);
        
        for (var i = collection.ini; i < collection.fim; ++i) {
            var elem = collection.at(i);
            var pos = {left:parseInt(elem.ref.style.left),top:parseInt(elem.ref.style.top) - 65};
            Plumb.moveTo(elId,pos.left,pos.top, 2000);

            highlighter.line(2,2000*(i-collection.ini+1));

            if (collection.at(i).value == value) {
                highlighter.line(4,2000*(i-collection.ini+1)+500);
                highlighter.line(5,2000*(i-collection.ini+1)+1000);
                highlighter.clear(2000*(i-collection.ini+2));
                break;
            }
            highlighter.lineRed(4,2000*(i-collection.ini+1)+500);
            highlighter.line(6,2000*(i-collection.ini+1)+1000);
            animate(i,(i-collection.ini));
        }

        timeout( function() {
            if (i < collection.fim) {
                
                var id = collection.at(i).id;
                timeout(function(){changeColor(i);}, 1000);
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
                highlighter.lineRed(2,1000);
                highlighter.line(8,2000);
                highlighter.clear(3000);
                timeout( function() {
                    UI.unlock();
                    $("#" + elId).remove();
                    resetColor(i);
                    StepRecord.end();
                }, 3000);
            }
            Plumb.fadeOut(elId,2000);
        }, (i + 1) * 2000);


    },
    animationRemove = function () {
        UI.lock();

        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);

        if (collection.ini !== collection.fim) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            var id = collection.at(collection.ini).id;

            timeout(function(){changeColor(collection.ini);},1000);
            Plumb.blink(id,4000,function(){
               Plumb.fadeOut(id,1000); 
            });

            highlighter.line(0,10);
            highlighter.lines(2,3,500);
            if(collection.ini+1===collection.fim){
                deslocarPointerIni(72,500);
                timeout( function(){
                    reinitPointers(2500);
                },500);
                highlighter.line(4,1000);
                highlighter.line(6,1500);
                highlighter.line(7,2000);
                highlighter.line(9,2500);
                highlighter.clear(3000);
            } else {
                deslocarPointerIni(72,500);
                highlighter.lineRed(4,1000);
                highlighter.line(9,1500);
                highlighter.clear(2000);
            }
            timeout( function() {
                resetColor(collection.ini);
                if(collection.ini+1===collection.fim){
                    StepRecord.add("Elemento removido do início da fila, cujo o mesmo, e o fim da fila, iram retornar a posição inicial");
                } else {
                    StepRecord.add("Elemento removido do início da fila, cujo o mesmo irá avançar para próxima posição");
                }
                collection.remove();
                $("#"+id).remove();
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 5000);
        } else {
            Plumb.showMessage("Fila vazia",4000);
            highlighter.lineRed(0,10);
            highlighter.line(11,500);
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
