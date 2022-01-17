jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ListaEncadeada() {
    // cria um nó
    ListaEncadeada.criaNo = function () {
        return {valor: null, dados: null, prox: null
        };
    };

    this.ini = null;

    this.insere = function (valor, dado) {
        if (this.ini === null) {
            this.ini = ListaEncadeada.criaNo();
        } else {
            var novo = ListaEncadeada.criaNo();
            novo.prox = this.ini;
            this.ini = novo;
        }
        Element.bind(this.ini,dado.id);

        this.ini.dados = dado;

        this.ini.valor = valor;
    };
    
    this.remove = function (dado) {
        var no = this.ini;
        var ant = null;
        while (no != null && no.valor != dado) {
            ant = no;
            no = no.prox;
        }

        if (no) {
            if (no == this.ini)
                this.ini = this.ini.prox;
            else {
                ant.prox = no.prox;
            }
        }
    };

}

(function () {
    var collection = new ListaEncadeada();
    var nullpointer = null;
    var 
    setInitial = function(elId,key){
        $("span.initial").remove();
        if(key) {
            $("#"+elId).append("<span class='initial'>Lista</span>");
        }
    },
    setFinal = function(elId,key){
        $("#"+elId).find("span.final").remove();
        if(key) {
            $("#"+elId).append("<span class='final withPointer'>nulo</span>");
        }
    },
    deslocarApartir = function(raiz,offsetX,time) {
        while (raiz !== null) {
            deslocar(raiz.dados, offsetX, time);
            raiz = raiz.prox;
        }
    },
    deslocar = function (dados, offset, tempo) {
        Plumb.moveTo(dados.id, parseInt(dados.d.style.left) + offset, parseInt(dados.d.style.top), tempo);
    },
    animationAdd = function (elId) {
        UI.lock();
        setFinal(elId,true);
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var raiz = collection.ini.prox;
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        
        deslocarApartir(raiz, 125, 1000);
        
        highlighter.lines(0, 2, 10);
        timeout(function(){
            Plumb.moveTo(elId, 75, screen.height / 2.5, 1000);
            highlighter.line(3, 0);
        }, 1000);

        timeout(function(){
            highlighter.line(4, 0);
            timeout(function(){
                $(nullpointer.d).remove();
                connectDisc();
                StepRecord.add("Novo elemento aponta para o elemento no início da Lista");
                setInitial(elId,true);
                StepRecord.add("Inicio da Lista aponta para o novo elemento");
                StepRecord.end();
                highlighter.clear(0);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 1000);

        }, 1500);

    },
    animationSearch = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0, 1, 10);
        var temp = collection.ini;
        timeout(function(){
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(temp !== null) {
            highlighter.line(2, 2000 * (i + 1) + 500);
            var pos = {left: parseInt(temp.dados.d.style.left), top: parseInt(temp.dados.d.style.top) - 65};
            Plumb.moveTo(elem.id,pos.left,pos.top,2000);
            if (elem.valor === temp.valor) {
                highlighter.line(4, 2000 * (i + 1) + 1000);
                highlighter.line(5, 2000 * (i + 1) + 2000);
                break;
            }
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.lineRed(4, 2000 * (i + 1) + 1000);
            highlighter.line(6, 2000 * (i + 1) + 1500);
            i++;
            temp = temp.prox;
        }

        if (temp===null) {
            if(pos!==undefined)
                Plumb.moveTo(elem.id,pos.left + 125,pos.top,2000);
            highlighter.lineRed(2, 2000 * (i + 1) + 2000);
            highlighter.line(8, 2000 * (i + 1) + 3000);
        }
        timeout(function(){
            Plumb.fadeOut(elem.id, 1000);
            if (temp!==null) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                Plumb.blink(temp.dados.id,6000,function(){
                    StepRecord.end();
                    $("#" + elem.id).remove();
                    UI.unlock();
                    highlighter.clear(2000);
                });
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    StepRecord.end();
                    $("#" + elem.id).remove();
                    UI.unlock();
                    highlighter.clear(2000);
                }, 2000);
            }        
        }, (i + 1) * 2000);

    },
    animationRemove = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.lines(0, 1, 10);
        var temp = collection.ini;
        var ant = null;
        timeout(function(){
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(temp!==null) {
            var looptime = i*2000 + 1000;
            var pos = {left: parseInt(temp.dados.d.style.left), top: parseInt(temp.dados.d.style.top) - 65};
            Plumb.moveTo(elem.id,pos.left,pos.top,2000);
            if (elem.valor === temp.valor) {
                highlighter.clear(looptime);
                highlighter.lineRed(2,looptime);
                highlighter.line(7,looptime+1000);
                if(ant===null){
                    highlighter.line(9,looptime+2000);
                    highlighter.line(10,looptime+3000);
                } else {
                    highlighter.line(11,looptime+2000);
                    highlighter.lineRed(9,looptime+2000);
                    highlighter.line(12,looptime+3000);
                }
                highlighter.line(13,looptime+4000);
                highlighter.clear(looptime+5000);
                break;
            }
            highlighter.line(2,looptime);
            highlighter.line(4,looptime+500);
            highlighter.line(5,looptime+1000);
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            i++;
            ant = temp;
            temp = temp.prox;
        }
        
        if (temp !== null) {
            if (i === 0) {
                timeout(function(){
                    if(collection.ini!==null){
                        setInitial(collection.ini.dados.id,true);
                    }
                },10000);
            }
        } else {
            var looptime = i*2000 + 1000;
            highlighter.clear(looptime);
            highlighter.lineRed(2,looptime);
            highlighter.clear(looptime+500);
            highlighter.lineRed(7,looptime+500);
            highlighter.clear(looptime+1000);
            if(pos!==undefined)
                Plumb.moveTo(elem.id,pos.left + 125,pos.top,2000);
        }
        
        timeout(function(){
            
            Plumb.fadeOut(elem.id, 1000);
            
            if (temp!==null) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                var info = temp.dados;
                Plumb.blink(info.id,4000,function(){
                    disconnectDisc(temp,ant);
                });
                timeout(function(){
                    $("#"+elem.id).remove();
                    StepRecord.add("Lista aponta para o próximo elemento e o elemento é removido");
                    if(collection.ini.prox===null){
                        createDiscNull();
                    }
                    $("#" + temp.dados.id).remove();
                    Plumb.desconectarTodosCom({source: temp.dados.id});
                    StepRecord.add("Elemento é removido");
                    collection.remove(parseInt(elem.valor));
                    timeout(function(){
                        var leitor = temp.prox;
                        deslocarApartir(leitor,-125,2000);
                        UI.unlock();
                        timeout(function(){
                            window.Eprogramada.nextQueue();
                            StepRecord.end();
                        }, 2000);
                    },300);
                }, 5000);
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    $("#"+elem.id).remove();
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                },2000);
            }

        }, (i + 1.5) * 2000);

    },
    prepareAnt = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isPrimary:true,isSource:false,isTarget:true,anchor:"Right"});
    },
    prepareProx = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isPrimary:true,isSource:true,isTarget:false,anchor:"Left"});
    },
    connectDisc = function () {

        if (collection.ini.prox!==null) {
            var id1 = collection.ini.dados.id;
            var id2 = collection.ini.prox.dados.id;
            setFinal(id1,false);
            Plumb.conectar(prepareAnt(id1),prepareProx(id2),"proximo");
        }
    },
    disconnectDisc = function (elem,ant) {
        if (ant !== null) {
            Plumb.desconectarTodosCom({target: elem.dados.id});
            setFinal(ant.dados.id, true);
            StepRecord.add("Elemento anterior deixa de apontar para o elemento que vai ser removido");
        }
        if (ant !== null && elem.prox !== null) {
            Plumb.conectar(prepareAnt(ant.dados.id), prepareProx(elem.prox.dados.id));
            setFinal(ant.dados.id, false);
            StepRecord.add("Elemento anterior aponta para o próximo");
        }
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "75px",
                    top: ((screen.height / 2.5)) + "px",
                    title: "Lista",
                    idParent: "main"});
        setInitial(nullpointer.id,true);
    };
    createDisc = function (value,withPointer) {
        var elem = Element.createElement(
            {className:"dinamicDot altColor",
            innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
            left:"100px",
            top:"75px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        if(withPointer) {
            elem.d.className += " withPointer";
            var prox_div = document.createElement("div");
            prox_div.className = "pointer_box_right altColor";

            elem.d.appendChild(prox_div);
            UI.changeColorComponentPrimary();
        }
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
        
        search: function(){
            var value = UI.value("valor");
            if (value !== "") {
                return $(".dinamicDot[title='"+value+"']").length!==0;
            }
            return false;
        },
        
        elementToString: function(id){
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.valor};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.dados.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.proximo = {id:element.prox.dados.id};
                } else {
                    result.proximo = 'nulo';
                }
                return result;
            }
            return false;
        },
        
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value("valor");
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    var info = createDisc(value,true);
                    collection.insere(value, info);
                    Plumb.tornarArrastavel(info.id);
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
            var value = UI.value("valor");
            
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationRemove(info);
            }

        },
        searchValue: function () {

            var value = UI.value("valor");
            
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationSearch(info);
            }
        }

    };
})();

