jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function HashColisao() {
    this.MAX = 10;
    this.tabelaHash = new Array(this.MAX);

    HashColisao.criaNo = function () {
        return {ref: null, id: null, value: null};
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
        this.tabelaHash[ind] = HashColisao.criaNo();
        this.tabelaHash[ind].id = elem.id;
        this.tabelaHash[ind].ref = elem.d;
        this.tabelaHash[ind].value = elem.valor;
        Element.bind(this.tabelaHash[ind],elem.id,{index:ind});
    };

    this.remove = function (chave) {
        var ind = this.hashFunction(chave);

        if (this.tabelaHash[ind]!=null && this.tabelaHash[ind].value == chave)
            this.tabelaHash[ind] = null;

    };
}

(function () {
    var collection = new HashColisao();

    var 
    setHashFuctionText = function (value,hash) {
        if(value !== undefined){
            $(".hashFunctionDot p b").html(hash).addClass("grande");;
        } else {
            $(".hashFunctionDot p b").html("y").removeClass("grande");
        }
    },
    animationAdd = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[ind];
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.line(0,10);
        highlighter.lineGreen(1,600);
        highlighter.line(2,1200);
        highlighter.clear(2000);
        Plumb.moveTo(info.id,295,250,2000);
        timeout(function(){
            setHashFuctionText(info.valor,ind);
            StepRecord.add("Calcula a função Hash para "+info.valor+" retornando a posição "+ind);
        }, 2000);
        var pos;
        if (elementoNaPosicao != null) {
            pos = {left: 535, top: 75 + (ind * 52)};
            Plumb.moveTo(info.id,pos.left,pos.top,2000);
            
            timeout(function(){
                Plumb.moveTo(elementoNaPosicao.id,parseInt(elementoNaPosicao.ref.style.left) + 50,parseInt(elementoNaPosicao.ref.style.top),2000);
            }, 4000);

            timeout(function(){
                Plumb.fadeOut(elementoNaPosicao.id,2000);
                Plumb.moveTo(info.id,pos.left + 70,pos.top,2000);
            }, 6000);
        } else {
            Plumb.moveTo(info.id,605, 75 + (ind * 52),2000);
        }

        timeout(function(){
            if (elementoNaPosicao != null){
                $("#" + elementoNaPosicao.id).remove();
                StepRecord.add("Elemento já existente na posição é removido, e a tabela Hash recebe o novo elemento, no índice "+ind);
            } else {
                StepRecord.add("Tabela Hash recebe o elemento no índice "+ind);
            }
            UI.unlock();
            setHashFuctionText();
            StepRecord.end();
            window.Eprogramada.nextQueue();
        }, elementoNaPosicao != null ? 9000 : 4000);
    },
    
    animationSearch = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[collection.hashFunction(info.valor)];
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        Plumb.moveTo(info.id, 295, 250, 2000);
        Plumb.moveTo(info.id, 540, 75 + (ind * 52), 2000);
        
        highlighter.line(0,10);
        highlighter.lineGreen(1,10);
        timeout(function(){
            setHashFuctionText(info.valor,collection.hashFunction(info.valor));
            StepRecord.add("Calcula a função Hash para "+info.valor+" retornando a posição "+ind);
        }, 2000);
        if (elementoNaPosicao != null && elementoNaPosicao.value == info.valor) {
            timeout(function(){
                StepRecord.add("Elemento foi encontrado");
                Plumb.blink(elementoNaPosicao.id,6000);
                timeout(function(){changeColor(ind);},1000);
            }, 4000);
            highlighter.line(2,500);
            highlighter.line(3,1000);
        } else {
            timeout(function(){
                StepRecord.add("Elemento não foi encontrado");
            },4000);
            highlighter.line(4,1000);
        }
        
        highlighter.clear(2000);
        
        timeout(function(){
            Plumb.fadeOut(info.id, 1000);
        }, 4000);

        timeout(function(){
            reset(ind);
            UI.unlock();
            StepRecord.end();
            setHashFuctionText();
            $("#" + info.id).remove();
        }, elementoNaPosicao != null ? 11000 : 5000);

    },
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[collection.hashFunction(info.valor)];
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        Plumb.moveTo(info.id, 295, 250, 2000);
        Plumb.moveTo(info.id, 540, 75 + (ind * 52), 2000);
        timeout(function(){
            setHashFuctionText(info.valor,collection.hashFunction(info.valor));
            StepRecord.add("Calcula a função Hash para "+info.valor+" retornando a posição "+ind);
        }, 2000);
        highlighter.line(0,10);
        highlighter.lineGreen(1,10);
        
        if (elementoNaPosicao != null && elementoNaPosicao.value == info.valor) {
            highlighter.line(2,500);
            highlighter.line(4,1000);
            highlighter.line(5,1500);
            highlighter.clear(2000);
            timeout(function(){
                StepRecord.add("Elemento foi encontrado e removido");
                var id = elementoNaPosicao.id;
                Plumb.blink(elementoNaPosicao.id, 4000, function(){
                    Plumb.fadeOut(id ,1000);
                });
                timeout(function(){
                    changeColor(ind);
                },1000);
                
            }, 4000);

        } else {
            timeout(function(){
                StepRecord.add("Elemento não foi encontrado");
            },4000);
            highlighter.lineRed(2,1000);
            highlighter.clear(2000);
        }
        timeout(function(){
            Plumb.fadeOut(info.id, 1000);
        }, 4000);

        timeout(function(){
            reset(ind);
            collection.remove(info.valor);
            $("#" + info.id).remove();
            StepRecord.end();
            UI.unlock();
            StepRecord.end();
            setHashFuctionText();
            window.Eprogramada.nextQueue();
        }, elementoNaPosicao != null ? 11000 : 5000);

    },
    createDisc = function (value) {
        var elem = Element.createElement(
            {className:"dinamicSmallDotStatic altColor",
            innerHTML:"<span class='itemValue altColorTitle' style='top: 8px'>" + value + "</span>",
            left:"0px",
            top:"75px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    },
    reset = function(ind){
        Canvas.resetHash({indice:ind});
    },
    changeColor = function (ind) {
        Canvas.highlightHash({canvasId:"canv",indice:ind});
    },
    draw = function () {
        Canvas.drawHashTable({canvasId:"canv",total:collection.MAX,alternate:"html"});
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            $("#stop").hide();
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
            if(size !== "") {
                UI.setParameters({TAMANHO_DA_TABELA: collection.MAX});
                UI.InitFunctions(Cadilag.addDisc, Cadilag.removeValue, Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size);
                draw();
                UI.unlock();
                $("#subtopbar").animate({"top": "0px"}, 500, function () {
                    $(this).remove();
                });
            }
        },
        elementIndexToString: function (index) {
            var arraypos = collection.tabelaHash[index];
            if (arraypos === null) {
                return {'_replaceAll':'nulo','_index':index,'_title':'TabelaHash'};
            } else if(arraypos !== undefined) {
                return {'info':arraypos.value,'_index':index,'_title':'TabelaHash'};
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var vars  = Element.getVars(id);
                var result = {'info':element.value,'_gravity':'e','_index':vars.index,'_title':'TabelaHash'};
                return result;
            }
            return false; 
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    var info = createDisc(value);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    animationAdd(info);
                    collection.insere(info);
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