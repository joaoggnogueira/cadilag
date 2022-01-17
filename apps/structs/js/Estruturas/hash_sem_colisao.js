/* global jsPlumb */

jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function HashSemColisao() {
    this.MAX = 10;
    this.tabelaHash = new Array(this.MAX);

    HashSemColisao.criaNo = function () {
        return {ref: null, id: null, value: null, prox: null, ant: null};
    };

    this.inicia = function (MAX) {
        this.MAX = MAX || this.MAX;
        for (var i = 0; i < this.MAX; ++i)
            this.tabelaHash[i] = null;
    };

    this.hashFunction = function (chave) {
        var qtd = chave.length;
        var soma = 0;

        for (var i = 0; i < qtd; ++i)
            soma += (i + 1) * chave.charCodeAt(i);
        return soma % this.MAX;
    };

    this.insere = function (elem) {
        var ind = this.hashFunction(elem.valor);
        var novo = HashSemColisao.criaNo();

        novo.prox = null;
        novo.ant = null;
        novo.ref = elem.d;
        novo.id = elem.id;
        novo.value = elem.valor;
        Element.bind(novo,novo.id);
        if (!this.tabelaHash[ind])
            this.tabelaHash[ind] = novo;
        else {
            var aux = this.tabelaHash[ind], ant = null;

            while (aux && aux.value*1 <= elem.valor*1) {
                ant = aux;
                aux = aux.prox;
            }

            if (aux) {
                if (ant) {
                    novo.prox = aux;
                    novo.ant = ant;
                    ant.prox = novo;
                    aux.ant = novo;
                } else {
                    novo.prox = this.tabelaHash[ind];
                    this.tabelaHash[ind].ant = novo;
                    this.tabelaHash[ind] = novo;
                }
            } else {
                ant.prox = novo;
                novo.ant = ant;
            }
        }
    };

    this.remove = function (value) {
        var ind = this.hashFunction(value);
        var aux = this.tabelaHash[ind];
        var ant = null;

        while (aux && aux.value*1 < value*1) {
            ant = aux;
            aux = aux.prox;
        }

        if (aux && aux.value*1 == value*1) {
            if (!ant) {
                this.tabelaHash[ind] = this.tabelaHash[ind].prox;
                if (this.tabelaHash[ind])
                    this.tabelaHash[ind].ant = null;
            } else {
                ant.prox = aux.prox;
                if (aux.prox)
                    aux.prox.ant = aux.ant;
            }
        }
    };

}

(function () {
    var collection = new HashSemColisao();
    var pointerDots = new Array(collection.MAX);

    var 
    setRightFinal = function(elId,key){
        $("#"+elId).find("span.finalright").remove();
        if(key) {
            $("#"+elId).append("<span class='finalright'></span>");
        }
    },
    setHashFuctionText = function (value,hash) {
        if(value !== undefined){
            $(".hashFunctionDot p b").html(hash).addClass("grande");
        } else {
            $(".hashFunctionDot p b").html("y").removeClass("grande");
        }
    },
    deslocarApartir = function(raiz,offsetX,time){
        while(raiz!==null){
            deslocar(raiz,offsetX,time);
            raiz = raiz.prox;
        }
    },
    deslocar = function(raiz,offsetX,time){
        Plumb.moveTo(raiz.id,parseInt(raiz.ref.style.left)+offsetX,parseInt(raiz.ref.style.top),time);
    },
    animationAddList = function (info, ind) {
        setRightFinal(info.id,true);
        var disc;
        var pos = {left: 550, top: 105 + (ind * 52)};
        var cabeca = collection.tabelaHash[collection.hashFunction(info.valor)];
        var anterior = null;
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        
        Plumb.moveTo(info.id,pos.left,pos.top,2000);
        if(cabeca == null) {
            timeout(function(){
                StepRecord.add("Como a lista está vazia, basta o elemento ser armazenado no vetor");
            },6000);
            highlighter.line(6,3000);
            highlighter.line(7,4000);
            highlighter.clear(6000);
            disc = false;
        } else {
            highlighter.lineRed(6,3000);
            highlighter.line(8,3000);
            highlighter.line(10,3500);
            highlighter.line(11,4000);
            disc = createDiscLinha(614,99 + (ind * 52));
            $("#"+disc.id).hide();
            timeout(function(){
                $("#"+disc.id).show();
                StepRecord.add("Leitor aponta para o ínicio da fila");
            },2000);
            var moveTo = function(left) {
                timeout(function(){
                    Plumb.moveTo(disc.id,left + 68,99 + (ind * 52),2000);
                },4000);
            };
            while (cabeca != null) {
                i++;
                pos = {left: parseInt(cabeca.ref.style.left), top:  105 + (ind * 52)};

                if (cabeca.value*1 > info.valor*1) {
                    break;
                }
                highlighter.line(12,i*2000+2500);
                highlighter.line(14,i*2000+3000);
                highlighter.line(15,i*2000+3500);
                moveTo(pos.left,pos.top);
                timeout(function(){
                    StepRecord.add("Busca continua para o próximo elemento");   
                },((i+2)*2000));
                anterior = cabeca;
                cabeca = cabeca.prox;
            }

            highlighter.lineRed(12,i*2000+4000);
            if(cabeca === null) {
                highlighter.lineRed(17,i*2000+4500);
                highlighter.line(30,i*2000+5000);
                highlighter.line(31,i*2000+5500);
            } else {
                highlighter.line(17,i*2000+4500);
                if(anterior!==null) {
                    highlighter.line(19,i*2000+5000);
                    highlighter.lines(21,22,i*2000+6000);
                } else {
                    highlighter.lineRed(19,i*2000+5000);
                    highlighter.line(24,i*2000+5000);
                    highlighter.lines(26,27,i*2000+6000);
                    
                }
            }
            highlighter.clear(i*2000+8000);
        }

        timeout(function() {
            
            if (cabeca != null) {
                deslocarApartir(cabeca, 75, 2000);
            }
            
            timeout(function() {
                StepRecord.add("Busca encerrada");   
                if (cabeca != null) {
                    Plumb.moveTo(info.id, pos.left, pos.top, 2000);
                } else {
                    if(anterior!=null){
                        Plumb.moveTo(info.id, pos.left + 75, pos.top, 2000);
                    } else {
                        Plumb.moveTo(info.id, 620, pos.top, 2000);
                    }
                }
            }, 2000);

            timeout(function() {

                connectDisc(info, anterior, cabeca);
                if(disc){
                    $("#"+disc.id).remove();
                }
                StepRecord.end();
                setHashFuctionText();
                collection.insere(info);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 4000);

        }, i * 2000 + 2000);

    },

    animationAdd = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var pos = {left: 295, top: 250};
        var ind = collection.hashFunction(info.valor);
        timeout(function(){
            setHashFuctionText(info.valor,ind);
            StepRecord.add("Calcula-se a função HASH para o valor "+info.valor+" resultando no índice "+ind);
        },2000);
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        
        highlighter.lines(0,4,10);
        highlighter.lineGreen(5,1000);

        Plumb.moveTo(info.id, pos.left, pos.top,2000);

        animationAddList(info, ind);
    },

    animationSearchList = function (info, ind) {
        var pos = {left: 550 ,top: 105 + (ind * 52)};
        var cabeca = collection.tabelaHash[collection.hashFunction(info.valor)];
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        Plumb.moveTo(info.id,pos.left, pos.top, 2000);
        var disc = createDiscLinha(614,99 + (ind * 52));
        $("#"+disc.id).hide();
        timeout(function(){
            $("#"+disc.id).show();
            StepRecord.add("Leitor aponta para o ínicio da fila");
        },4000);
        var moveTo = function(left) {
            timeout(function(){
                Plumb.moveTo(disc.id,left + 69,99 + (ind * 52),2000);
            },4000);
        };
        while (cabeca != null) {
            i++;
            highlighter.line(4,(i+1)*2000+2000);

            pos = {left: parseInt(cabeca.ref.style.left),top: 105 + (ind * 52)};
            if (cabeca.value*1 >= info.valor*1) {
                break;
            }
            moveTo(pos.left,pos.top);
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
//            Plumb.moveTo(info.id,pos.left + 80,pos.top,2000);
            highlighter.clear((i+1)*2000+2700);
            highlighter.lineRed(6,(i+1)*2000+2800);
            highlighter.line(8,(i+1)*2000+3600);
            cabeca = cabeca.prox;
        }

        if(cabeca===null){
            highlighter.clear(i*2000+2500);
            highlighter.lineRed(4,i*2000+2600);
            highlighter.clear(i*2000+3100);
            highlighter.lineRed(10,i*2000+3200);
            highlighter.clear(i*2000+4000);
        } else if(cabeca.value === info.valor) {
            highlighter.line(6,i*2000+2600);
            highlighter.line(7,i*2000+3200);
            highlighter.clear(i*2000+4000);
        } else {
            highlighter.clear(i*2000+2500);
            highlighter.lineRed(4,i*2000+2600);
            highlighter.clear(i*2000+3100);
            highlighter.lineRed(10,i*2000+3200);
            highlighter.clear(i*2000+4000);
        }

        timeout(function() {
            Plumb.fadeOut(info.id, 1000);
            StepRecord.add("Busca encerrada");
            if (cabeca != null && cabeca.value == info.valor) {
                $("#" + disc.id).css("background-image", "url(../../images/correct-symbol.svg)");
                Plumb.blink(cabeca.id,6000);
                timeout(function(){
                    StepRecord.add("Elemento foi encontrado");
                },1000);
            } else {
                $("#" + disc.id).css("background-image", "url(../../images/xmark.svg)");
                $("#" + disc.id).css("z-index", "10000");
                StepRecord.add("Elemento não foi encontrado");
            }

            timeout(function() {
                $("#"+disc.id).remove();
                StepRecord.end();
                setHashFuctionText();
                UI.unlock();
                $("#"+info.id).remove();
            }, 1200 + (cabeca != null && cabeca.value == info.valor) ? 6000 : 0);

        }, (i + 2) * 2000);
    },
    animationSearch = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var pos = {left: 295, top: 250};
        var ind = collection.hashFunction(info.valor);
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        timeout(function(){
            setHashFuctionText(info.valor,ind);
            StepRecord.add("Calcula-se a função HASH para o valor "+info.valor+" resultando no índice "+ind);
        },2000);
        highlighter.line(0,100);
        highlighter.line(1,1000);
        highlighter.line(2,2000);
        highlighter.lineGreen(3,3000);

        Plumb.moveTo(info.id, pos.left, pos.top, 2000);

        animationSearchList(info, ind);
    },
    animationRemoveList = function (info, ind) {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        var pos = {left: 550 ,top: 105 + (ind * 52)};
        var cabeca = collection.tabelaHash[collection.hashFunction(info.valor)];
        var i = 0;
        Plumb.moveTo(info.id, pos.left, pos.top, 2000);
        var disc = createDiscLinha(614,99 + (ind * 52));
        $("#"+disc.id).hide();
        timeout(function(){
            $("#"+disc.id).show();
            StepRecord.add("Leitor aponta para o ínicio da fila");
        },2000);
        var moveTo = function(left) {
            timeout(function(){
                Plumb.moveTo(disc.id,left + 69,99 + (ind * 52),2000);
            },4000);
        };
        while (cabeca != null) {
            i++;
            pos = {left: parseInt(cabeca.ref.style.left),top: 105 + (ind * 52)};
            if (cabeca.value*1 >= info.valor*1){
                break;
            }
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.line(4,(i+1)*2000+2000);
            highlighter.line(6,(i+1)*2000+2500);
            highlighter.line(7,(i+1)*2000+3000);
            moveTo(pos.left,pos.top);
            cabeca = cabeca.prox;
        }
        highlighter.lineRed(4,(i+1)*2000+2000);
        timeout(function() {
            Plumb.fadeOut(info.id, 1000);
            
            if (cabeca != null && cabeca.value == info.valor) {
                StepRecord.add("Busca encerrada e elemento foi encontrado");
                highlighter.line(9,1000);
                if(cabeca.ant){
                    highlighter.line(13,2000);
                    highlighter.lineRed(11,2000);
                    highlighter.line(14,4000);
                } else {
                    highlighter.line(11,2000);
                    highlighter.line(12,4000);
                }
                $("#" + disc.id).css("background-image", "url(../../images/correct-symbol.svg)");
                Plumb.blink(cabeca.id,4000,function(){
                    disconnectDisc(cabeca);
                    $("#"+disc.id).remove();
                    if(cabeca !== null) {
                        $("#" + cabeca.id).remove();
                    }
                    deslocarApartir(cabeca.prox,-105,2000);
                });
            } else {
                StepRecord.add("Elemento não foi encontrado");
                highlighter.lineRed(9,1000);
                $("#" + disc.id).css("background-image", "url(../../images/xmark.svg)");
                $("#" + disc.id).css("z-index", "10000");
            }

            timeout(function() {
                highlighter.clear(0);
                $("#"+info.id).remove();
                StepRecord.end();
                collection.remove(info.valor);
                setHashFuctionText();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000 + (cabeca != null && cabeca.value == info.valor ? 6000 : 0));

        }, (i + 2) * 2000);
    },
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        ind = 0;
        var pos = {left: 295, top: 250};
        var ind = collection.hashFunction(info.valor);
        timeout(function(){
            setHashFuctionText(info.valor,ind);
            StepRecord.add("Calcula-se a função HASH para o valor "+info.valor+" resultando no índice "+ind);
        },2000);
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.line(0,100);
        highlighter.line(1,1000);
        highlighter.lineGreen(2,2000);
        highlighter.line(3,3000);

        Plumb.moveTo(info.id, pos.left, pos.top, 2000);

        animationRemoveList(info, ind);

    },
    populateDotArray = function () {
        for (var i = 0; i < collection.MAX; ++i) {
            pointerDots[i] = createPointerDot((i * 52 + 105) + "px", 622 + "px", "10px 0px 0px 10px");
        }
    },
    prepare1 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:true,anchor:[1, 0.5, 0, -1]});
    },
    prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:true,anchor:[0, 0.5, 0, -1]});
    },
    connectDisc = function (novo, ant, elem) {

        if (elem != null) {

            var connections = jsPlumb.getConnections({target: elem.id});
            if (connections[0] !== undefined){
                jsPlumb.detach(connections[0]);
            }
            
            setRightFinal(novo.id,false);
            Plumb.conectar(prepare1(novo.id), prepare2(elem.id),"proximo");
            StepRecord.add("Novo elemento aponta para o próximo");
            if (ant!=null) {
                setRightFinal(ant.id,false);
                Plumb.conectar(prepare1(ant.id),prepare2(novo.id),"proximo");
                StepRecord.add("Elemento anterior aponta para o novo");
            } else {
                StepRecord.add("Novo elemento se torna o ínicio da lista");
            }

        } else {
            if (ant!=null) {
                setRightFinal(ant.id,false);
                Plumb.conectar(prepare1(ant.id),prepare2(novo.id),"proximo");
                StepRecord.add("Elemento anterior aponta para o novo");
            }
        }
    },

    disconnectDisc = function (elem) {

        if (elem.ant == null) {
            if (elem.prox != null) { // N -> 0 
                connections = jsPlumb.getConnections({target: elem.prox.id});
                jsPlumb.detach(connections[0]);
                Plumb.desconectarCompletamente(elem.id);
                StepRecord.add("Elemento é substituido pelo próximo");
            }
        } else { //ant != nulo
            if (elem.prox == null) { //0 -> N
                var connections = jsPlumb.getConnections({target: elem.id});
                jsPlumb.detach(connections[0]);
                setRightFinal(elem.ant.id,true);
                StepRecord.add("Elemento anterior agora aponta para nulo");
            } else {//0 -> N -> 0
                var connections = jsPlumb.getConnections({target: elem.id});
                jsPlumb.detach(connections[0]);

                connections = jsPlumb.getConnections({source: elem.id});
                jsPlumb.detach(connections[0]);

                Plumb.conectar(prepare1(elem.ant.id),prepare2(elem.prox.id),"proximo");
                StepRecord.add("Anterior aponta para o próximo");
            }
        }

    },
    createDiscLinha = function (left,top) {
        var elem = Element.createElement(
                {className: "dinamicSmallDotLinha",
                    left: left+"px",
                    innerHTML: "",
                    top: top+"px",
                    idParent: "main"});
        return elem;
    },
    createDisc = function (value) {
        var elem = Element.createElement(
            {className:"dinamicSmallDotStatic altColor",
            innerHTML:"<span class='itemValue altColorTitle' style='top: 8px'>" + value + "</span>",
            left:"0px",
            top:"105px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    },
    createPointerDot = function (top, left, radius) {
        var elem = Element.createElement(
            {className:"dotPointer",
            innerHTML:"",
            left:left,
            top:top,
            idParent:"main"});
        $(elem.d).css("border-radius", radius);
        elem.conecDir = null;
        elem.conecBaixo = null;
        return elem;
    },
    draw = function () {
        Canvas.drawHashTable({canvasId:"canv",total:collection.MAX,alternate:"html"});
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            $("#stop").hide();
            Plumb.init(true);
            $("#newStruct").click(this.newStruct);
            UI.setProperty("primaryColorProperty",true);
            UI.InitInterface(this.search,this.elementToString);
            Canvas.initInterface(this.elementIndexToString);
        },
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return $(".dinamicSmallDotStatic[title='"+value+"']").length!==0;
            }
            return false;
        },
        newStruct: function(){
            var size = UI.value("sizeArray","Tamanho do Vetor é invalido");
            if(size!=="") {
                UI.setParameters({TAMANHO_DA_TABELA:collection.MAX});
                UI.InitFunctions(Cadilag.addDisc,Cadilag.removeValue,Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size);
                draw();
                populateDotArray();
                UI.unlock();
                $("#subtopbar").animate({"top":"0px"},500,function(){
                    $(this).remove();
                });
            }
        },
        elementIndexToString: function (index) {
            var element = collection.tabelaHash[index];
            if (element === null) {
                return {'_replaceAll':'nulo','_index':index,'_title':'TabelaHash'};
            } else if(element !== undefined) {
                var result = {'info':element.value,'_index':index,'_title':'TabelaHash'};
                if (element.prox !== null) {
                    var nextId = (element.prox.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                } else {
                    result.proximo = 'nulo';
                }
                return result;
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var result = {'info':element.value};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.proximo = {id:element.prox.id,tooltipdir:"w"};
                } else {
                    result.proximo = 'nulo';
                }
                return result;
            }
            return false; 
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    var info = createDisc(value);
                    animationAdd(info);
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                    });
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            var value = UI.value('valor');
            
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value('valor');
            
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationSearch(info);
            }
        }
    };

})();

