jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function No() {
    var value;
    var proximoElemento;
    var ref;
    var id;
}

function ListaEncadeadaOrdenadaEstatica() {
    this.MAX = 13;
    this.NAO_APONTA = -1;
    this.indiceDisponivel = 0;
    this.indicePrimeiroElemento = this.NAO_APONTA;
    this.dados = new Array(this.MAX);

    this.inicia = function (MAX) {
        this.MAX = parseInt(MAX) || this.MAX;
        this.indicePrimeiroElemento = -1;
        this.indiceDisponivel = 0;
        for (var i = 0; i < this.MAX - 1; ++i) {
            this.dados[i] = new No();
            this.dados[i].proximoElemento = i + 1;
        }
        this.dados[i] = new No();
        this.dados[i].proximoElemento = this.NAO_APONTA;
    };

    this.isEmpty = function () {
        return this.indicePrimeiroElemento == this.NAO_APONTA;
    };

    this.size = function () {
        var qtd = 0, i = this.indicePrimeiroElemento;

        while (i != this.NAO_APONTA) {
            qtd++;
            i = this.dados[i].proximoElemento;
        }
        return qtd;
    };

    this.at = function (i) {
        var j = this.indicePrimeiroElemento;

        while (i && i != this.NAO_APONTA) {
            i--;
            j = this.dados[j].proximoElemento;
        }

        return this.dados[j];
    };

    this.remove = function (elem) {
        var anterior = -1, i = this.indicePrimeiroElemento;
        var flag = false;

        if (!this.isEmpty())
        {
            if (this.size() > 1)
            {
                while (i != this.NAO_APONTA && !flag)
                {
                    if (elem == this.dados[i].value)
                    {
                        flag = true;
                        var novoIndiceDisponivel;

                        if (anterior == -1)
                        {
                            novoIndiceDisponivel = i;
                            this.indicePrimeiroElemento = this.dados[i].proximoElemento;
                        } else
                        {
                            novoIndiceDisponivel = this.dados[anterior].proximoElemento;
                            this.dados[anterior].proximoElemento = this.dados[i].proximoElemento;
                        }

                        this.dados[i].proximoElemento = this.indiceDisponivel;
                        this.indiceDisponivel = novoIndiceDisponivel;
                    }
                    anterior = i;
                    i = this.dados[i].proximoElemento;
                }
            } else if (this.size() == 1)
            {
                if (elem == this.dados[i].value)
                {
                    this.indicePrimeiroElemento = this.NAO_APONTA;
                    this.dados[i].proximoElemento = this.indiceDisponivel;
                    this.indiceDisponivel = i;
                }
            }
        }
    };

    this.insere = function (elem) {
        if (this.size() != this.MAX){
            
            this.dados[this.indiceDisponivel].value = elem.valor;
            this.dados[this.indiceDisponivel].id = elem.id;
            this.dados[this.indiceDisponivel].ref = elem.d;
            Element.bind(this.dados[this.indiceDisponivel],elem.id,{index:this.indiceDisponivel});
            var auxDisp = this.dados[this.indiceDisponivel].proximoElemento;
            this.dados[this.indiceDisponivel].proximoElemento = this.NAO_APONTA;

            if (!this.isEmpty()) {

                var anterior = -1, i = this.indicePrimeiroElemento;

                while (i != this.NAO_APONTA && parseFloat(this.dados[i].value) < parseFloat(elem.valor)) {
                    anterior = i;
                    i = this.dados[i].proximoElemento;
                }

                if (anterior == -1) {
                    this.dados[this.indiceDisponivel].proximoElemento = this.indicePrimeiroElemento;
                    this.indicePrimeiroElemento = this.indiceDisponivel;
                } else {
                    if (i != this.NAO_APONTA)
                        this.dados[this.indiceDisponivel].proximoElemento = this.dados[anterior].proximoElemento;
                    this.dados[anterior].proximoElemento = this.indiceDisponivel;
                }
            } else
                this.indicePrimeiroElemento = this.indiceDisponivel;
            this.indiceDisponivel = auxDisp;
        }
    };

    this.search = function (value) {
        var i = this.indicePrimeiroElemento;
        while (i != this.NAO_APONTA && this.dados[i].value != value)
            i = this.dados[i].proximoElemento;
        return i;
    };
}



(function () {
    var collection = new ListaEncadeadaOrdenadaEstatica();

    var
    pointerprox = null,pointerini = null,
    createPointer = function(text){
        return Element.createElement(
            {className:"staticpointer",
            innerHTML:text,
            left:"3px",
            top:"350px",
            idParent:"main"});
    },
    
    highSwitch = function(arrayIndex) {
        var chunk = 2000 / arrayIndex.length;

        var f = function(obj,init,time){
            timeout( function(){
                var id = "arraynext" + obj.value;
                var color;
                switch(obj.color){
                    case "green": color = '#1A6';break;
                    case "blue": color = '#4183F4';break;
                    default: color = '#000';
                }
                if(obj.highEnd !== undefined){
                    $("#arraylabel" + obj.highEnd).css("background-color",color).css("color","white");
                    timeout( function(){
                        $("#arraylabel" + obj.highEnd).css("background-color","").css("color","");
                    },time);
                }
                timeout( function(){
                    StepRecord.add(obj.desc);
                },(chunk/2));
                Tooltip.show(id, obj.text, color, time);
            },init);
        };

        for (var i = 0; i < arrayIndex.length; i++) {
            var init = chunk * i;
            f(arrayIndex[i],init,(2000 - init));
        }
    },
    
    updatePointerProx = function(time){
        if(collection.indicePrimeiroElemento!==collection.NAO_APONTA) {
            if(pointerprox===null){
                pointerprox = createPointer("<p>PRIM</p>");
            }
            Plumb.moveTo(pointerprox.id,100 + 72 * collection.indicePrimeiroElemento+3,parseInt(pointerprox.d.style.top),time);
            
        } else {
            if(pointerprox!==null){
                Plumb.fadeOut(pointerprox.id,time);
                timeout( function(){
                    $("#"+pointerprox.id).remove();
                    pointerprox=null;
                },time);
            }
        }
    },
    updatePointerIni = function(time){
        if(collection.indiceDisponivel!==collection.NAO_APONTA) {
            if(pointerini===null){
                pointerini = createPointer("<p>DISP</p>");
            }
            Plumb.moveTo(pointerini.id,100 + 72 * collection.indiceDisponivel+3,parseInt(pointerini.d.style.top),time);
        
        } else {
            if(pointerini!==null){
                Plumb.fadeOut(pointerini.id,time);
                timeout( function(){
                    $("#"+pointerini.id).remove();
                    pointerini=null;
                },time);
            }
        }
    },
    
    updateColorsNext = function(){
        
        $(".staticArrayNext.active").removeClass("active");
        var i = collection.indicePrimeiroElemento;
        
        while (i != collection.NAO_APONTA) {
            $("#arraynext"+i).addClass("active");
            i = collection.dados[i].proximoElemento;
        }
    },
    
    hideArrowOnNext = function(origemindex){
        $("#arraynext"+origemindex).data("firing",false);
        $(".tempnull").remove();
        jsPlumb.detachEveryConnection();
    };
    
    showArrowOnNext = function(origemindex){
        var destinoindex = $("#arraynext"+origemindex+" p").html();
        if($("#arraynext"+origemindex).data("firing")){
            return;
        }
        
        var ondisp = $("#arraynext"+origemindex).hasClass("active");
        
        if(destinoindex !== "-1") {
            
            var endpointorigem = jsPlumb.addEndpoint("arraynext"+origemindex, {
                anchor: "Top",
                paintStyle: {fillStyle: (ondisp?"#3434ff":"#666666"),radius: 5},
                connectorStyle: {lineWidth: 3, strokeStyle: (ondisp?"#3434ff":"#666666")},
                connectorHoverStyle: {lineWidth: 4},
                endpointsOnTop: true,
                isSource: true,
                isTarget: false,
                enabled: false
            });

            var endpointdestino = jsPlumb.addEndpoint("arraynext"+destinoindex, {
                anchor: "Top",
                paintStyle: {fillStyle: (ondisp?"#3434ff":"#666666"),radius: 5},
                connectorStyle: {lineWidth: 3, strokeStyle: (ondisp?"#3434ff":"#666666")},
                connectorHoverStyle: {lineWidth: 4},
                endpointsOnTop: true,
                isSource: false,
                isTarget: true,
                enabled: false
            });
            var overlays = 
                [[
                    "PlainArrow", {
                        location: 0.5,
                        direction: 1,
                        width: 13,
                        length: 15,
                        paintStyle: {
                            fillStyle: (ondisp?"#3434ff":"#666666")
                        }
                    }
                ]];
            endpointorigem.connector = ["Flowchart", {stub: [50,30], alwaysRespectStubs: true, midpoint: 0.0001}];
            endpointdestino.connector = ["Flowchart", {stub: [50,30], alwaysRespectStubs: true, midpoint: 0.0001}];
            var connection = jsPlumb.connect({source: endpointorigem, target: endpointdestino, deleteEndpointsOnDetach: true},{overlays:overlays});
            $("#arraynext"+origemindex).data("firing",true);
        }  else {

            
            var endpointorigem = jsPlumb.addEndpoint("arraynext"+origemindex, {
                anchor: "Top",
                paintStyle: {fillStyle: (ondisp?"#3434ff":"#666666"),radius: 5},
                connectorStyle: {lineWidth: 3, strokeStyle: (ondisp?"#3434ff":"#666666")},
                connectorHoverStyle: {lineWidth: 4},
                endpointsOnTop: true,
                isSource: true,
                isTarget: false,
                enabled: false
            });
            
            var id = Date.now();
            
            $("<div>")
                .css("left",$("#arraynext"+origemindex).css("left"))
                .css("top",parseInt($("#arraynext"+origemindex).css("top"))-80)
                .css("position","absolute")
                .css("text-align","center")
                .attr("id",""+id)
                .css("line-height","30px")
                .width(70)
                .height(30)
                .attr("class","tempnull")
                .html("fim da lista")
                .appendTo(".main");
        
            
            var endpointdestino = jsPlumb.addEndpoint(""+id, {
                anchor: "Bottom",
                paintStyle: {fillStyle: (ondisp?"#3434ff":"#666666"),radius: 5},
                connectorStyle: {lineWidth: 3, strokeStyle: (ondisp?"#3434ff":"#666666")},
                connectorHoverStyle: {lineWidth: 4},
                endpointsOnTop: true,
                isSource: true,
                isTarget: false,
                enabled: false
            });
            
            var overlays = 
                [[
                    "PlainArrow", {
                        location: 0.5,
                        direction: 1,
                        width: 13,
                        length: 15,
                        paintStyle: {
                            fillStyle: (ondisp?"#3434ff":"#666666")
                        }
                    }
                ]];
            endpointorigem.connector = ["Straight"];
            endpointdestino.connector = ["Straight"];
            var connection = jsPlumb.connect({source: endpointorigem, target: endpointdestino, deleteEndpointsOnDetach: true},{overlays:overlays});
            $("#arraynext"+origemindex).data("firing",true);
            
        }
    },
    
    animationAdd = function (elId,value,info) {
        
        var not_first = collection.indicePrimeiroElemento !== collection.NAO_APONTA;
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        
        var animateIndex = function(index,time,ant){
            timeout( function(){
                if(not_first && index!==-1){
                    highlighter.line(12, 10);
                    highlighter.line(14, 600);
                    highlighter.line(15, 1200);
                }
               
                timeout(function(){showArrowOnNext(ant);},1000);
                timeout(function(){hideArrowOnNext(ant);},2000);
                highCursorTo(index,"Percorrendo a lista, seguindo para próximo elemento no indice "+index);
            },time);
        };
        
        UI.lock();
        var desl = 72;
        if(collection.MAX!==collection.size()) {
            highlighter.line(0, 10);
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            Plumb.moveTo(elId,desl * collection.indiceDisponivel + 103,280,2000);
            timeout( function(){
                highlighter.line(2, 10);
                highlighter.lines(3, 6, 500);
                StepRecord.add("Adiciona o novo elemento a índice disponível");
                highPointerInitial();
                if(not_first) {
                    timeout(function(){
                        StepRecord.add("Percorrendo a lista a patir do primeiro índice");
                    },1000);
                }
                timeout( function(){
                    if(not_first) {
                        highlighter.line(7, 0);
                        highlighter.line(9,500);
                        highlighter.line(10,1000);
                        highlighter.line(11,1500);
                    } else {
                        highlighter.lineRed(7, 0);
                        highlighter.line(29, 1000);
                        highlighter.line(30, 2000);
                        highlighter.line(31, 4000);
                    }
                    var i = collection.indicePrimeiroElemento;
                    var qtd = 1;
                    var ant = false;
                    while (i != collection.NAO_APONTA && parseFloat(collection.dados[i].value) < parseFloat(value)) {
                        animateIndex(collection.dados[i].proximoElemento,2000*qtd,i);
                        ant = i;
                        i = collection.dados[i].proximoElemento;
                        qtd++;
                    }

                    timeout( function(){
                        clearCursor();
                        var caso = false;
                        if(not_first) {
                            highlighter.lineRed(12,0);
                            if(ant !== false){
                                highlighter.line(17,500);
                                highlighter.line(19,1000);
                                highlighter.line(20,2000);
                            } else {
                                highlighter.lineRed(17,500);
                                highlighter.line(22,500);
                                if (i !== collection.NAO_APONTA) {
                                    highlighter.line(24,1000);
                                    highlighter.line(25,1500);
                                    highlighter.line(26,2000);
                                } else {
                                    highlighter.lineRed(24,1000);
                                    highlighter.line(26,2000);     
                                }
                            }
                            highlighter.line(31,3000);
                        }
                        if(ant !== false) {
                            if (i == collection.NAO_APONTA) {
                                StepRecord.add("Busca encerra pois o próximo elemento é -1 (nulo)");
                                //ÚLTIMA POSIÇÃO
                                caso = "ultimo";
                                highSwitch([
                                    {
                                        text: "anterior", 
                                        value: ant, 
                                        color : "green", 
                                        highEnd: collection.indiceDisponivel,
                                        desc: "O próximo do elemento anterior sera o indice do novo elemento"
                                    }, 
                                    {
                                        text: "nulo", 
                                        value: collection.indiceDisponivel, 
                                        color : "blue",
                                        desc: "O próximo do novo elemento sera -1 (nulo)"
                                    }
                                ]);
                            } else {
                                StepRecord.add("Busca encerra pois o elemento possui valor maior ou igual ao que vai ser adicionado");
                                //POSIÇÃO INTERMEDIÁRIA
                                caso = "medio";
                                highSwitch([
                                    {
                                        text: "próximo", 
                                        value: collection.indiceDisponivel, 
                                        color : "blue", 
                                        highEnd: i,
                                        desc: "O próximo do novo elemento será o indice do próximo do elemento anterior"
                                    },
                                    {
                                        text: "anterior", 
                                        value: ant, 
                                        color : "green", 
                                        highEnd: collection.indiceDisponivel,
                                        desc: "O próximo do elemento anterior será o indice do novo elemento"
                                    } 
                                ]);
                            }
                        } else {
                            if (i == collection.NAO_APONTA) {
                                caso = "primeiro";
                                //PRIMEIRO ELEMENTO
                                highSwitch([
                                    {
                                        text: "nulo", 
                                        value: collection.indiceDisponivel, 
                                        color : "blue",
                                        desc: "Como a lista está vazia, e este é o primeiro elemento, o próximo depois do novo será -1 (nulo)"
                                    }
                                ]);
                            } else {
                                StepRecord.add("Busca encerra pois o elemento possui valor maior ou igual ao que vai ser adicionado");
                                caso = "inicio";
                                //PRIMEIRA POSIÇÃO
                                highSwitch([
                                    {
                                        text: "primeiro", 
                                        value: collection.indiceDisponivel, 
                                        color : "green", 
                                        highEnd: collection.indicePrimeiroElemento,
                                        desc: "O próximo do novo elemento será o primeiro atual da lista"
                                    }
                                ]);   
                            }
                        }
                        timeout( function(){
                            collection.insere(info);
                            update();
                            updatePointerProx(1500);
                            updatePointerIni(1500);
                            timeout( function(){
                                updateColorsNext();
                                switch (caso){
                                    case "ultimo":
                                    case "medio":
                                        StepRecord.add("O indice disponivel agora será o próximo");
                                        break;
                                    case "primeiro":
                                    case "inicio":
                                        StepRecord.add("O novo elemento se torna o inicio da lista, e o indice disponivel agora será o próximo");
                                        break;
                                }
                                highlighter.clear(0);
                                StepRecord.end();
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            },1500);
                        }, 2000);
                    },2000 * qtd);

                },2000);
            },2000);
        } else {
            highlighter.lineRed(0, 10);
            Plumb.moveTo(elId,desl * collection.MAX + 2,279,2000);
            timeout( function(){
                Plumb.fadeOut(elId,2000);
                highlighter.clear(0);
                timeout( function(){
                    $("#"+elId).remove();
                },2000);
                UI.unlock();
                update();
                window.Eprogramada.nextQueue();
            },2000);
        }

    },
    animationSearch = function (value) {
        UI.lock();
        var i = collection.indicePrimeiroElemento;
        var qtd = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.line(0,10);
        highlighter.line(1,1000);
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var animateIndex = function(index,time,ant){
            timeout( function(){
                if(index !== -1){
                    highlighter.line(2, 10);
                    highlighter.lineRed(4, 600);
                    highlighter.line(6, 1200);
                }
               
                timeout(function(){showArrowOnNext(ant);},1000);
                timeout(function(){hideArrowOnNext(ant);},2000);
                highCursorTo(index,"Percorrendo a lista, seguindo para próximo elemento no indice "+index);
            },time);
        };
        highPointerInitial();
        if(collection.indicePrimeiroElemento !== collection.NAO_APONTA) {
            timeout(function(){
                StepRecord.add("Percorrendo a lista a patir do primeiro índice");
            },1000);
        }
        timeout( function(){
            while (i != collection.NAO_APONTA && parseFloat(collection.dados[i].value) <= parseFloat(value)) {
                if (collection.dados[i].value == value){
                    break;
                }
                var next = collection.dados[i].proximoElemento;
                animateIndex(next,2000*qtd,i);
                i = next;
                qtd++;
            }

            timeout( function() {
                clearCursor();
                
                if (i != collection.NAO_APONTA && collection.dados[i].value == value) {
                    highlighter.line(2, 10);
                    highlighter.line(4, 2000);
                    highlighter.line(5, 4000);
                    timeout( function(){
                        StepRecord.add("Busca encerra pois o elemento encontrado");
                    },2000);
                    var id = collection.dados[i].id;
                    Plumb.fadeOut(id,1000,function(){changeColor(i);});
                    Plumb.fadeIn(id,1000);
                    Plumb.fadeOut(id,1000);
                    Plumb.fadeIn(id,1000);
                    Plumb.fadeOut(id,1000);
                    Plumb.fadeIn(id,1000);
                } else {
                    highlighter.clear(0);
                    highlighter.lineRed(2, 10);
                    highlighter.line(8, 1000);
                    if(i === collection.NAO_APONTA) {
                        StepRecord.add("Busca encerra pois o próximo elemento é -1 (nulo)");
                    } else {
                        StepRecord.add("Busca encerra pois o valor do elemento é maior que o pesquisado");
                    }
                }
            }, qtd * 2000);

            timeout( function() {
                highlighter.clear(0);
                UI.unlock();
                StepRecord.end();
                resetColor(i);
            }, (qtd + 1) * 2000 + (i != collection.NAO_APONTA && collection.dados[i].value == value ? 6000 : 2000));
        },2000);
    },
    animationRemove = function (valor) {
        UI.lock();
        var i = collection.indicePrimeiroElemento;
        var qtd = 1;
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        var empty = collection.indicePrimeiroElemento === collection.NAO_APONTA;
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var animateIndex = function(index,time,ant){
            timeout( function(){
                if(index !== -1){
                    highlighter.line(7, 10);
                    highlighter.line(9, 600);
                    highlighter.line(10, 1200);
                }
                               
                timeout(function(){showArrowOnNext(ant);},1000);
                timeout(function(){hideArrowOnNext(ant);},2000);
                highCursorTo(index,"Percorrendo a lista, seguindo para próximo elemento no indice "+index);
            },time);
        };
        highPointerInitial();
        if(collection.indicePrimeiroElemento !== collection.NAO_APONTA) {
            timeout( function(){
                StepRecord.add("Percorrendo a lista a patir do primeiro índice");
            },1000);
        }
        highlighter.line(0,10);
        highlighter.line(1,600);
        highlighter.line(2,1200);
        timeout( function(){
            highlighter.clear(0);
            var not_first = collection.dados[i].proximoElemento !== collection.NAO_APONTA;
            if(empty) {
                highlighter.lineRed(3,10);
            } else {
                highlighter.line(3,10);
                if(!not_first){
                    highlighter.clear(1000);
                    highlighter.lineRed(5,1000);
                    if(parseFloat(collection.dados[i].value) === parseFloat(valor)){
                        highlighter.line(28, 2000);
                        highlighter.line(30, 3000);
                        highlighter.line(31, 4000);
                        highlighter.line(32, 5000);
                        highlighter.line(33, 6000);
                    } else {
                        highlighter.clear(2000);
                        highlighter.lineRed(28, 2000);
                    }
                } else {
                    highlighter.line(5,1000);
                }
            }
            var ant = false;
            while (i != collection.NAO_APONTA && parseFloat(collection.dados[i].value) <= parseFloat(valor)) {
                if (collection.dados[i].value == valor)
                    break;
                animateIndex(collection.dados[i].proximoElemento, 2000*qtd,i);
                ant = i;
                i = collection.dados[i].proximoElemento;
                qtd++;
            }

            timeout( function() {
                clearCursor();
                if(!empty && not_first){
                    highlighter.clear(0);
                    highlighter.lineRed(7, 10);
                    if (collection.dados[i].value == valor){
                        highlighter.line(12, 1000);
                        if(ant === false){
                            highlighter.line(14, 2000);
                            highlighter.line(16, 3000);
                            highlighter.line(17, 4000);
                        } else {
                            highlighter.line(14, 2000);
                            highlighter.lineRed(19, 2000);
                            highlighter.line(21, 3000);
                            highlighter.line(22, 4000);                     
                        }
                        highlighter.line(24, 5000);
                        highlighter.line(25, 6000);
                    } else {
                        highlighter.clear(1000);
                        highlighter.lineRed(12, 1000);
                        
                    }
                }
                if (i != collection.NAO_APONTA && parseFloat(collection.dados[i].value) <= parseFloat(valor)) {
                    timeout( function(){
                        StepRecord.add("Busca encerra pois o elemento encontrado");
                    },2000);
                    var pos = collection.search(parseInt(valor));
                    var id = collection.dados[collection.search(parseInt(valor))].id;
                    Plumb.fadeOut(id,1000,function(){changeColor(i);});
                    Plumb.fadeIn(id,1000);
                    Plumb.fadeOut(id,1000);
                    Plumb.fadeIn(id,1000);
                    Plumb.fadeOut(id,1000);

                    timeout( function() {
                        var caso = false;
                        if(ant !== false){
                            var next = collection.dados[i].proximoElemento;
                            if(next !== collection.NAO_APONTA){
                                caso = "medio";
                                //POSIÇÃO INTERMEDIÁRIA
                                highSwitch([
                                    {
                                        text: "proximo", 
                                        value: ant, 
                                        color : "green", 
                                        highEnd: next,
                                        desc: "O próximo do elemento anterior, será o próximo do que será removido"
                                    } ,
                                    {
                                        text: "disponivel", 
                                        value: i, 
                                        color : "blue", 
                                        highEnd: collection.indiceDisponivel,
                                        desc: "O próximo do elemento anterior, será o próximo do que será removido"
                                    } 
                                ]);
                            } else {
                                caso = "ultimo";
                                //ÚLTIMA POSIÇÃO
                                highSwitch([
                                    {
                                        text: "nulo", 
                                        value: ant, 
                                        color : "green",
                                        desc: "O próximo do elemento anterior, será -1 (nulo), pois o elemento a ser removido é o último da lista"
                                    },
                                    {
                                        text: "disponivel", 
                                        value: i, 
                                        color : "blue", 
                                        highEnd: collection.indiceDisponivel,
                                        desc: "O próximo do elemento anterior, será o próximo do que será removido"
                                    } 
                                ]);
                            }
                        } else {
                            caso = "primeiro";
                            //PRIMEIRO ELEMENTO
                            highSwitch([
                                {
                                    text: "disponivel", 
                                    value: i, 
                                    color : "green", 
                                    highEnd: collection.indiceDisponivel,
                                    desc: "O próximo do indice do elemento a ser removido será o primeiro inidice disponivel"
                                }
                            ]);   
                        }
                        
                        resetColor(pos);
                        $("#" + collection.dados[collection.search(parseInt(valor))].id).remove();
                        collection.remove(parseInt(valor));
                        timeout( function(){
                            update();
                            updatePointerProx(2000);
                            updatePointerIni(2000);
                            timeout( function(){
                                updateColorsNext();
                                switch (caso){
                                    case "ultimo":
                                    case "medio":
                                        StepRecord.add("O indice disponivel agora será o indice que o elemento foi removido");
                                        break;
                                    case "primeiro":
                                        if(collection.indicePrimeiroElemento !== collection.NAO_APONTA){
                                            StepRecord.add("O primeiro indice da fila agora será o próximo da lista, e o indice disponivel agora será o indice que o elemento foi removido");
                                        } else {
                                            StepRecord.add("O primeiro indice da fila agora será -1 (nulo), e o indice disponivel agora será o indice que o elemento foi removido");
                                        }
                                        break;
                                }
                                highlighter.clear(0);
                                StepRecord.end();
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            },2000);
                        },2000);
                    }, 5250);
                } else {
                    if(i === collection.NAO_APONTA) {
                        StepRecord.add("Busca encerra pois o próximo elemento é -1 (nulo)");
                    } else {
                        StepRecord.add("Busca encerra pois o valor do elemento é maior que o pesquisado");
                    }
                    highlighter.clear(0);
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }
            }, (qtd + 1) * 2000);
        },2000);
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
    /**
     * @param {Integer} index
     * @returns {undefined}
     */
    highCursorTo = function(index,title){
        clearCursor();
        if(index!==-1){
            $(".staticArrayNext[value='"+index+"']").addClass("highlighted");
            timeout( function(){
                $("#arraylabel"+index).addClass("highlighted");
                if(title){
                    StepRecord.add(title);
                }
            },1000);
        }
    };
    
    highPointerInitial = function(){
        if(pointerprox){
            $("#arraylabel"+collection.indicePrimeiroElemento).addClass("highlighted");
        }
    };
    
    clearCursor = function(){
        $(".staticArrayIndex.highlighted").removeClass("highlighted");
        $(".staticArrayNext.highlighted").removeClass("highlighted"); 
    };
    changeColor = function (ind) {
        Canvas.highlight({canvasId:'canv',indice:ind});
    },
    resetColor = function(ind){
        Canvas.reset({indice:ind});
    },

    update = function () {
        var labels = [];
        for(var i=0;i<collection.MAX;i++){
            labels[i] = collection.dados[i].proximoElemento;
        }
        Canvas.updateLabels({labels:labels,total:collection.MAX});
    };
    draw = function () {
        var labels = [];
        for(var i=0;i<collection.MAX;i++)
            labels[i] = collection.dados[i].proximoElemento;
        Canvas.drawArray({canvasId:'canv',total:collection.MAX,labels:labels,labelTitle:"Indices do próximo elemento",alternate:"html"});
        for(var i=0;i<collection.MAX;i++){
            Tooltip.register("arraynext"+i,$("#arraynext"+i).get(0),"tooltipStatic");
            $("#arraynext"+i).data("index",i).mouseover(function(){
                var index = $(this).data("index");
                showArrowOnNext(index);
            }).mouseout(function(){
                var index = $(this).data("index");
                hideArrowOnNext(index); 
            });
        }
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            $("#stop").hide();
            UI.setProperty("primaryColorProperty",true);
            $("#newStruct").click(this.newStruct);
            UI.InitInterface(this.search,this.elementToString);
            Canvas.initInterface(Cadilag.elementIndexToString);
            Tooltip.createStyle("tooltipStatic",{
                extends: "dark",
                showOn:null,
                tipJoint: "bottom",
                showEffectDuration: 0.01,
                hideEffectDuration: 0.01,
                target: true,
                background: "#333333",
                removeElementsOnHide: true,
                delay: 0.01
            });
        },
        newStruct: function(){
            var size = UI.value("sizeArray","Tamanho do Vetor é invalido");
            if(size!=="") {
                UI.InitFunctions(Cadilag.addDisc,Cadilag.removeValue,Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size);
                UI.setParameters({MAXIMO:collection.MAX});
                draw();
                update();
                updatePointerIni(0);
                
                UI.unlock();
                $("#subtopbar").animate({"top":"0px"},500,function(){
                    $(this).remove();
                });
            }
        },
        elementIndexToString: function (index) {
            var arraypos = collection.dados[index];
            if (arraypos.value === null || arraypos.value === undefined) {
                return {'info':'nulo','prox':arraypos.proximoElemento,'_index':index,'_title':'Lista'};
            } else {
                return {'info':arraypos.value,'prox':arraypos.proximoElemento,'_index':index,'_title':'lista'};
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element !== undefined){
                var vars  = Element.getVars(id);
                var result = {'info':element.value,'prox':element.proximoElemento,'_index':vars.index,'_title':'lista','_gravity':(vars.index===0?'sw':(vars.index===collection.MAX-1?'se':'s'))};
                return result;
            }
            return false; 
        },
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return $(".dinamicDot[title='"+value+"']").length!==0;
            }
            return false;
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor',"O valor deve ser um número");
                if (value !== "") {
                    var info = createDisc(value);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    animationAdd(info.id, value,info);
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                    });
                }
            } else {
                History.rollbackAppendInput();
            }

        },
        removeValue: function () {
            var value = UI.value('valor',"O valor deve ser um número");
           
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                animationRemove(value);
            }
        },
        searchValue: function () {
            var value = UI.value('valor',"O valor deve ser um número");
            
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                animationSearch(value);
            }
        }
    };

})();