/* global jsPlumb, Function */

jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function Fila() {
    this.ini = null;
    this.fim = null;
    
    //o "ant" é o "prox" na interface final
    Fila.criaNo = function () {
        return {
            valor: null,
            dados: null,
            prox: null,
            ant: null
        };
    };

    this.insere = function (valor, dado) {
        var novo = Fila.criaNo();

        novo.valor = valor;
        novo.dados = dado;

        if (!this.ini)
            this.fim = novo;
        else {
            novo.prox = this.ini;
            novo.ant = null;
            this.ini.ant = novo;
        }
        this.ini = novo;
        Element.bind(this.ini,dado.id);

    },
    this.remove = function () {
        if (this.fim) {
            this.fim = this.fim.ant;

            if (!this.fim)
                this.ini = null;
            else
                this.fim.prox = null;
        }
    };
};

(function () {
    var collection = new Fila();
    var nullpointer = null;
    var 
    deslocarApartir = function (raiz, offsetX, tempo) {
        while (raiz !== null){
            deslocar(raiz.dados,offsetX,tempo);
            raiz = raiz.ant;
        }
    },
    deslocar = function (dados, offsetX, tempo) {
        Plumb.moveTo(dados.id,parseInt(dados.d.style.left)+offsetX,parseInt(dados.d.style.top),tempo);
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
        $("#"+elId).find("span.final").remove();
        if(key) {
            $("#"+elId).append("<span class='final'>nulo</span>");
        }
    },
    animationAdd = function (elId) { //inserção já ocorreu
        UI.lock();
        setFinal(elId,true);
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var posFim = {left: 100, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.lines(0,2,10);
        
        if (collection.ini.prox !== null) { //Caso a fila não estiver vázia
            highlighter.lineRed(3,500);
            highlighter.line(5,1000);
            highlighter.line(6,2500);
            highlighter.line(7,3000);
            highlighter.clear(4000);
            posFim = {left: parseInt(collection.ini.prox.dados.d.style.left)+125, top: parseInt(collection.ini.prox.dados.d.style.top)};
            timeout(function(){
                connectDisc();
                StepRecord.add("Novo elemento aponta para o elemento do fim da fila");
                if(collection.ini.prox.prox === null) {
                    setInitial(collection.ini.dados.id,true,"Fila.fim");
                    setInitial(collection.ini.prox.dados.id,true,"Fila.inicio");
                } else {
                    setInitial(collection.ini.prox.dados.id,false);
                    setInitial(elId,true,"Fila.fim");
                }
                StepRecord.add("O fim da fila aponta para o novo elemento");
            },3000);
            
        } else {
            timeout(function(){
                $(nullpointer.d).remove();
                nullpointer = null;
                setInitial(elId,true,"<p>Fila.inicio</p><p>Fila.fim</p>");
                setFinal(elId,true);
                StepRecord.add("O início e o fim da fila aponta para o novo elemento");
            },3000);
            highlighter.line(3,500);
            highlighter.line(4,1000);
            highlighter.line(7,2000);  
            highlighter.clear(2500);
        }
        
        timeout(function(){
            Plumb.moveTo(elId,posFim.left,posFim.top,2000);
            timeout(function(){
                UI.unlock();
                window.Eprogramada.nextQueue();
                StepRecord.end();
            },2000);
        },1000);
        
    },
    animationSearch = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0,2,10);
        var temp = collection.fim;
        timeout( function() {
            StepRecord.add("Busca começa no inicio da pilha");
        },  2000);
        while (temp!==null) {
            
            var pos = {left:parseInt(temp.dados.d.style.left),top:parseInt(temp.dados.d.style.top) - 65};
            Plumb.moveTo(elem.id,pos.left,pos.top , 2000);
            
            highlighter.line(3,2000*(i+1));
            
            if (elem.valor === temp.valor) {
                highlighter.line(5,2000*(i+1)+500);
                highlighter.line(6,2000*(i+1)+1000);
                highlighter.clear(2000*(i+2));
                break;
            }
            timeout( function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.lineRed(5,2000*(i+1)+500);
            highlighter.line(7,2000*(i+1)+1000);
            highlighter.line(8,2000*(i+1)+1500);
            i++;
            temp = temp.ant;
        }
        
        if(temp===null && pos!==undefined){
            Plumb.moveTo(elem.id,pos.left+125,pos.top , 2000);
        }
        
        timeout(function() {
            if (temp!==null) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                Plumb.blink(temp.dados.id,6000,function(){
                    StepRecord.end();
                    highlighter.clear(0);
                    UI.unlock();
                });
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                },2000);
                highlighter.lineRed(3,500);
                highlighter.line(10,1000);
                highlighter.clear(2000);
                timeout(function(){
                    StepRecord.end();
                    UI.unlock();
                },2000);
            }
            Plumb.fadeOut(elem.id, 1000);

        }, (i + 1.5) * 2000);

        timeout(function() {
            $("#" + elem.id).remove();
        }, (i + 2) * 2000);
    },
    animationRemove = function () {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        if (collection.ini!==null) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            UI.lock();
            var id = collection.fim.dados.id;
            Plumb.blink(collection.fim.dados.id,4000,function(){
                Plumb.fadeOut(id, 1000);
            });
            timeout( function(){
                if (collection.ini.prox!==null) {
                    if(collection.ini.prox.prox!==null) {
                        setInitial(collection.fim.ant.dados.id,true,"Fila.inicio",true);
                        timeout( function(){
                            StepRecord.add("Início da Fila aponta para o próximo elemento");
                        },2000);
                    } else {
                        setInitial(collection.fim.ant.dados.id,true,"<p>Fila.inicio</p><p>Fila.fim</p>",true);
                        timeout( function(){
                            StepRecord.add("Início da Fila aponta para o próximo elemento");
                        },2000);
                    }
                    disconnectLast();
                } else {
                    timeout( function(){
                        disconnectDisc();
                        createDiscNull();
                        StepRecord.add("Início da Fila e Fim aponta para nulo, pois este era o único elemento da lista");
                    },2000);
                }
            },2000);

            highlighter.line(0,10);
            highlighter.line(1,1000);
            if (collection.ini.prox===null) {
                highlighter.line(3,2000);
                highlighter.line(4,3000);
            } else{
                highlighter.lineRed(3,2000);
            }
            highlighter.line(5,3500);
            highlighter.line(6,4000);
            highlighter.line(7,4500);
            highlighter.line(8,5000);
            highlighter.line(9,5500);
            highlighter.line(11,6000);
            timeout( function(){
                if (collection.ini.prox!==null) {
                    disconnectDisc();
                }
                StepRecord.add("Elemento é removido, e o valor '"+collection.ini.valor+"' retornado");
                deslocarApartir(collection.fim.ant,-125,1000);
                timeout( function() {
                    highlighter.clear(0);
                    collection.remove();
                    UI.unlock();
                    StepRecord.end();
                    window.Eprogramada.nextQueue();
                }, 1500);
            },5000);
        } else {
            highlighter.line(0,10);
            highlighter.lineRed(1,600);
            highlighter.line(11,1200);
            highlighter.clear(2000);
            window.Eprogramada.nextQueue();  
        }
    },
    prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:true,anchor: [0, 0.5, 0, -1]});
    },
    prepare4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:true,anchor: [1, 0.5, 0, -1]});
    },
    connectDisc = function () {
        if (collection.ini.prox!==null) {
            var id1 = collection.ini.dados.id;
            var id2 = collection.ini.prox.dados.id;
            setFinal(id2,false);
            Plumb.conectar(prepare4(id2),prepare(id1),"proximo");
        }
    },
    disconnectLast = function(){
        Plumb.desconectar({target:collection.fim.dados.id+""},1);
    },
    disconnectDisc = function () {
        Plumb.desconectarCompletamente(collection.fim.dados.id);
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "100px",
                    top: (screen.height / 2.5)+"px",
                    title: "Topo",
                    idParent: "main"});
        setInitial(nullpointer.id,true,"<p>Fila.inicio<br/>Fila.fim</p>");
    },
    createDisc = function (value) {
        var elem = Element.createElement(
            {className:"dinamicDot altColor",
            innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
            left:"100px",
            top:"75px",
            title: value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.setProperty("primaryColorProperty",true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.InitInterface(this.search,this.elementToString);
            createDiscNull();
        },
        elementToString: function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var result = {'info':element.valor};
                result._vizinhos = [];
                if (element.ant !== null) {
                    var nextId = (element.ant.dados.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.proximo = {id:element.ant.dados.id};
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
                    var info = createDisc(value);
                    collection.insere(value, info);
                    Plumb.tornarArrastavel(info.id);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    animationAdd(info.id);
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
