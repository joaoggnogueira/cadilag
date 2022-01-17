jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function FilaCircular() {
    this.ini = null;
    this.fim = null;
    this.qtd = 0;
    FilaCircular.criaNo = function () {
        return {valor: null, dado: null, ant: null, prox: null};
    };

    this.insere = function (valor, dado) {
        var novo = FilaCircular.criaNo();
        novo.ant = null;
        novo.prox = null;
        novo.dado = dado;
        novo.valor = valor;

        if (!this.ini)
            this.ini = novo;
        else {
            novo.ant = this.fim;
            this.fim.prox = novo;
        }

        this.fim = novo;
        this.ini.ant = this.fim;
        this.fim.prox = this.ini;
        this.qtd++;
        Element.bind(this.fim,dado.id);
    };

    this.remove = function () {
        if (this.ini!==null) {
            if(this.ini.prox===this.ini) {
                this.ini = null;
                this.fim = null;
            } else {
                this.ini = this.ini.prox;
                this.ini.ant = this.fim;
                this.fim.prox = this.ini;
            }
            this.qtd--;
        }
    };

    this.size = function () {
        return this.qtd;
    };

}

(function () {
    var collection = new FilaCircular();
    var nullpointer = null;
    var 
    deslocar = function(dados,offsetX,time){
       Plumb.moveTo(dados.id,parseInt(dados.d.style.left)+offsetX,parseInt(dados.d.style.top),time);  
    },
    setInitial = function(elId,key,text,removeAll){
        var atual = $("#"+elId).find("span.initial");
        atual.remove();
        if(removeAll){
            $("span.initial").each(function(){
                if(this.innerHTML==="Fila.inicio"){
                    $(this).remove();
                }
            });
        }
        if(key){
            $("#"+elId).append("<span class='initial'>"+text+"</span>");
        }
    },
    setFinal = function(elId,key){
        $("span.final").remove();
        if(key) {
            $("#"+elId).append("<span class='final'>nulo</span>");
        }
    },
    animationAdd = function (elId) {
        UI.lock();
        StepRecord.start();
        setFinal(elId,true);
        StepRecord.add("Estado Inicial");
        var posFim = {left: 75, top: screen.height / 2.5};
        var qtd = collection.size();
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.lines(0,2,50);
        if (qtd > 1) {
            highlighter.line(5,1000);
            highlighter.lineRed(3,1000);
            highlighter.line(6,2000);
            var elem = collection.fim.ant;
            posFim = {left: parseInt(elem.dado.d.style.left)+125, top: parseInt(elem.dado.d.style.top)};
        } else {
            highlighter.line(3,1000);
            highlighter.line(4,2000);
        }
        highlighter.lines(7,8,2500);
        highlighter.clear(3000);
        Plumb.moveTo(elId, posFim.left, posFim.top, 2000);
        timeout(connectDisc,2000);
        timeout(function(){
            UI.unlock();
            StepRecord.end();
            window.Eprogramada.nextQueue();
        },3000);
    },
    
    animationSearch = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0,3,50);
        var i = 0;
        var qtd = collection.size();
        var temp = collection.ini;
        var pos = {left: 40, top: screen.height / 2.5};
        timeout(function() {
            StepRecord.add("Busca começa no inicio da fila");
        },  2000);
        while(i < qtd) {
            var looptime = 2000*i + 1000;
            pos = {left:parseInt(temp.dado.d.style.left),top:parseInt(temp.dado.d.style.top) - 65};
            Plumb.moveTo(elem.id, pos.left,pos.top,2000);
            highlighter.line(4,looptime);
            if (elem.valor === temp.valor){
                highlighter.line(6,looptime+500);
                highlighter.line(7,looptime+1000);
                highlighter.clear(looptime+2000);
                break;
            }
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            i++;
            temp = temp.prox;
            highlighter.clear(looptime+450);
            highlighter.lineRed(6,looptime+450);
            highlighter.line(8,looptime+900);
            highlighter.line(9,looptime+1350);
            highlighter.clear(looptime+1650);
            if(i!==qtd){
                highlighter.lineRed(10,looptime+1650);
            } else {
                highlighter.line(10,looptime+1650);
                highlighter.line(11,looptime+2000);
                highlighter.line(13,looptime+2400);
                highlighter.clear(looptime+3000);
            }
        }
        if(i===qtd){
            var looptime = 2000*i + 1000;
        }
        timeout(function() {
            Plumb.fadeOut(elem.id,2000);
            if (i !== qtd) {
                Plumb.blink(temp.dado.id,6000,function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                    StepRecord.end();
                    $("#" + elem.id).remove();
                    UI.unlock();
                });
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    StepRecord.end();
                    $("#" + elem.id).remove();
                    UI.unlock();
                },2000);
            }
        }, (i + 1) * 2000);

    },
    animationRemove = function () {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        UI.lock();
        
        if (collection.ini!==null) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0,50);
            highlighter.lines(2,5,500);
            if(collection.ini.prox===collection.ini){
                highlighter.line(6,1000);
                highlighter.lines(8,9,2000);
            } else{
                highlighter.lineRed(6,1000);
                highlighter.line(11,1000);
                highlighter.lines(13,14,2000);
            }
            highlighter.lines(16,17,3000);
            highlighter.clear(4000);
            Plumb.blink(collection.ini.dado.id,4000,function() {
                var qtd = collection.size();
                var elem = collection.ini.prox;
                for (var i = qtd - 2; i >= 0; i--) {
                    deslocar(elem.dado,-125,2000);
                    elem = elem.prox;
                }
                connectDiscRem();
                collection.remove();
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            });
        } else {
            highlighter.lineRed(0,50);
            highlighter.line(19,1000);
            highlighter.clear(2000);
            window.Eprogramada.nextQueue();
            timeout(function(){
                UI.unlock();
                window.Eprogramada.nextQueue();
            },2000);
        }
    },
    prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: true, anchor: [0, 0.5, 0, -1]});
    },
    prepare4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: true, anchor: [1, 0.5, 0, -1]});
    },
    prepareC1 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: true, anchor: [0, 0.5, -1, 0], type: "Flowchart"});
    },
    prepareC4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: true, anchor: [1, 0.5, 0, 1], type: "Flowchart"});
    },
    connectDisc = function () {
        var qtd = collection.size();
        
        var idfim = collection.fim.dado.id;
        var idini = collection.ini.dado.id;
        if(qtd > 1){
            var idant = collection.fim.ant.dado.id;
            Plumb.desconectarTodosCom({source: ""+idant});
            Plumb.conectar(prepare4(idant),prepare(idfim),"proximo");
            StepRecord.add("Elemento do Fim da fila aponta para o novo elemento");
        }
        if(qtd > 1) {
            if(qtd === 2) {
                setInitial(idfim,true,"Fila.fim");
                setInitial(idini,true,"Fila.inicio");
            } else {
                setInitial(idant,false);
                setInitial(idfim,true,"Fila.fim");
            }
            StepRecord.add("Fim da fila aponta para o novo elemento");
        } else {
            $(nullpointer.d).remove();
            setInitial(idfim,true,"<p>Fila.inicio</p><p>Fila.fim</p>");
            StepRecord.add("Fim e Início da fila aponta para o novo elemento");
        }
        setFinal(idfim,false);
        Plumb.conectar(prepareC4(idfim),prepareC1(idini),"proximo");
        StepRecord.add("Novo elemento aponta para o ínicio da fila");
    },
    connectDiscRem = function () {
        var qtd = collection.size();
        
        var idfim = collection.fim.dado.id;
        var idini = collection.ini.dado.id;
        var idprox = collection.ini.prox.dado.id;
        if (collection.ini.prox!==null){
            setInitial(idini,false);
            if(collection.ini.prox.prox!==collection.ini) {
                setInitial(collection.ini.prox.dado.id,true,"Fila.inicio",true);
            } else {
                setInitial(collection.ini.prox.dado.id,true,"<p>Fila.inicio</p><p>Fila.fim</p>");
            }
            StepRecord.add("Início da fila aponta para o próximo");
            disconnectDisc();
        }
        
        if(qtd > 2){
            var idant = collection.fim.ant.dado.id;
            Plumb.desconectarTodosCom({source: ""+idant});
            Plumb.conectar(prepare4(idant),prepare(idfim),"proximo");
        } else if(qtd===1){
            createDiscNull();
        }
        $("#" + collection.ini.dado.id).remove();
        setFinal(idfim,true);
        StepRecord.add("Remove o elemento");
        if(qtd>1){
            Plumb.conectar(prepareC4(idfim),prepareC1(idprox),"proximo");
            setFinal(idfim,false);
            StepRecord.add("O elemento do Fim da fila aponta para o novo Início da Lista");
        }
    },
    disconnectDisc = function () {
        Plumb.desconectarCompletamente(collection.ini.dado.id);
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "75px",
                    top: (screen.height / 2.5)+"px",
                    title: "Topo",
                    idParent: "main"});
        setInitial(nullpointer.id,true,"<p>Fila.inicio<br/>Fila.fim</p>");
    },
    createDisc = function (value) {
        var elem = Element.createElement(
            {className:"dinamicDot altColor",
            innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
            left:"75px",
            top:"75px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.setProperty("primaryColorProperty",true);
            UI.InitInterface(this.search,this.elementToString);
            createDiscNull();
        },
        elementToString: function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var result = {'info':element.valor};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.dado.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.proximo = {id:element.prox.dado.id};
                } else
                    result.proximo = 'nulo';
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
                var value = UI.value('valor');
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    var info = createDisc(value);
                    collection.insere(value, info);
                    Plumb.tornarArrastavel(info.id);
                    animationAdd(info.id, value);
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
                animationSearch(info);
            }
        }
    };
})();