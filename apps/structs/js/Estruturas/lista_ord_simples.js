jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ListaSimplesOrdenada() {
    this.cabeca = null;

    ListaSimplesOrdenada.criaNo = function () {
        return {
            dados: null,
            valor: null,
            prox: null
        };
    };

    this.insere = function (valor, dado) {
        var novo = ListaSimplesOrdenada.criaNo();
        novo.dados = dado;
        novo.valor = valor;
        Element.bind(novo,dado.id);
        var ant = null;
        var aux = this.cabeca;

        while (aux != null && aux.valor * 1 < valor * 1) {
            ant = aux;
            aux = aux.prox;
        }
        if (aux != null) {
            if (ant == null) {
                novo.prox = this.cabeca;
                this.cabeca = novo;
            } else {
                ant.prox = novo;
                novo.prox = aux;
            }
        } else {
            if (ant == null) {
                this.cabeca = novo;
            } else {
                ant.prox = novo;
            }
        }
    };
}

(function () {
    var collection = new ListaSimplesOrdenada();
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
    deslocar = function (dados, offsetX, tempo) {
        Plumb.moveTo(dados.id, parseInt(dados.d.style.left) + offsetX,parseInt(dados.d.style.top), tempo);
    },
    deslocarApartir = function (raiz, offsetX, tempo) {
        while(raiz!==null) {
            deslocar(raiz.dados,offsetX,tempo);
            raiz = raiz.prox;
        }
    },
    animationAdd = function (info) {
        setFinal(info.id, true);
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var posFim = {left: 75, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.lines(0,4,10);
        Tooltip.register(info.id,info.d,"tooltipStatic");
        if (collection.cabeca.prox !== null) { //caso não vazio
            var ant = null;
            var i = 0;
            var leitor = collection.cabeca;
            timeout( function() {
                StepRecord.add("Busca começa no inicio da lista");
            },  2000);
            while(leitor !== null) {
                var looptime = 2000*i + 1000;
                if(info.valor*1 === leitor.valor*1) {
                    if(leitor.prox!==null){
                        posFim = {left: parseInt(leitor.prox.dados.d.style.left), top: parseInt(leitor.prox.dados.d.style.top)};
                    } else {
                        posFim = {left: posFim.left+125, top: posFim.top};
                    }
                    
                    Plumb.moveTo(info.id,posFim.left,posFim.top - 60,2000);
                    timeout(function(){
                        Plumb.moveTo(info.id,posFim.left,posFim.top,2000);
                        timeout( function() {
                            deslocarApartir(leitor.prox,125,2000);
                            highlighter.lineRed(5,1000);

                            timeout(function() {
                                Tooltip.show(leitor.dados.id, "novo", "#1A6", 3000);
                                if (leitor.prox !== null) {
                                    Tooltip.show(leitor.prox.dados.id, "próximo", "#1A6", 3000);
                                } 
                                if(ant !== null) {
                                    Tooltip.show(ant.dados.id, "anterior", "#1A6", 3000);
                                }
                            },2000);

                            if (leitor.prox === null) {
                                highlighter.lineRed(10,1500);
                                highlighter.line(23,1500);
                                if(ant === null) {
                                    highlighter.line(25,2000);
                                    highlighter.line(26,2500);
                                } else {
                                    highlighter.lineRed(25,2000);
                                    highlighter.line(27,2000);
                                    highlighter.line(28,2500);

                                }
                                highlighter.clear(3000);
                            } else {
                                highlighter.line(10,1500);
                                if(ant === null) {
                                    highlighter.line(12,2000);
                                    highlighter.line(14,2500);
                                    highlighter.line(15,3000);
                                } else {

                                    highlighter.line(17,2000);
                                    highlighter.lineRed(12,2000);
                                    highlighter.line(19,2500);
                                    highlighter.line(20,3000);
                                }
                                highlighter.clear(3500);
                            }
                            timeout( function() {
                                Plumb.tornarArrastavel(info.id);
                                connectDisc(ant, leitor);
                                if (ant === null) {
                                    setInitial(info.id, true);
                                    StepRecord.add("O inicio da fila aponta para o novo elemento");
                                }
                                StepRecord.end();
                                UI.unlock();
                                window.Eprogramada.nextQueue(); 
                            }, 4000);
                        }, i * 2000);
                    },2000);
                    break;
                } else if (leitor.prox !== null) {
                    posFim = {left: parseInt(leitor.dados.d.style.left), top: parseInt(leitor.dados.d.style.top)};
                    Plumb.moveTo(info.id,posFim.left,posFim.top - 60,2000);
                }
                timeout(function(){
                    StepRecord.add("Busca continua para o próximo elemento");   
                },((i+2)*2000));
                highlighter.line(5,looptime);
                highlighter.line(7,looptime+600);
                highlighter.line(8,looptime+1200);
                ant = leitor;
                leitor = leitor.prox;
                i++;
            }
        } else {
            highlighter.lineRed(5,1500);
            highlighter.clear(2000);
            highlighter.line(23,2000);
            highlighter.lineRed(10,2000);
            highlighter.line(25,2500);
            highlighter.line(26,3000);
            highlighter.clear(4000);
            StepRecord.add("Busca não inicia pois a lista está vazia");   
            Plumb.moveTo(info.id,posFim.left,posFim.top,2000);
            timeout(function(){
                $(nullpointer.d).remove();
                setInitial(info.id,true);
                StepRecord.add("O novo elemento se torna o inicio da lista");   
                StepRecord.end();
                Plumb.tornarArrastavel(info.id);
                UI.unlock();
                window.Eprogramada.nextQueue();
            },4000);
        }
    },
    
    animationSearch = function (info) {
        UI.lock();
        var i = 0;
        var leitor = collection.cabeca;
        var pos = {left: -25, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0,1,10);
        StepRecord.start();
        StepRecord.add("Estado inicial");
        timeout(function() {
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(leitor !== null) {
            var looptime = 2000*i+1000;
            pos = {left:parseInt(leitor.dados.d.style.left),top:parseInt(leitor.dados.d.style.top) - 65};
            Plumb.moveTo(info.id,pos.left,pos.top,2000);
            if (info.valor*1 <= leitor.valor*1) {
                timeout( function() {
                    if (info.valor*1 === leitor.valor*1) {
                        timeout(function(){
                            StepRecord.add("Busca encerra pois o elemento foi encontrado");
                        },2000);
                        highlighter.line(2,10);
                        highlighter.line(4,1000);
                        highlighter.line(5,2000);
                        highlighter.clear(3000);
                        Plumb.blink(leitor.dados.id,6000);
                    } else {
                        timeout(function(){
                            StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                        },2000);
                        highlighter.clear(10);
                        highlighter.lineRed(2,10);
                        highlighter.line(8,1000);
                        highlighter.clear(2000);
                    }
                }, (i+1) * 2000);
                break;
            }
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.line(2,looptime);
            highlighter.clear(looptime+500);
            highlighter.lineRed(4,looptime+500);
            highlighter.line(6,looptime+1000);
            i++;
            leitor = leitor.prox;
        }
        timeout( function() {
            if(leitor === null){
                Plumb.moveTo(info.id, pos.left + 125, pos.top, 2000);
                highlighter.clear(1000);
                highlighter.lineRed(2,1000);
                highlighter.line(8,1500);
                highlighter.clear(2000);
            } else if(info.valor*1 !== leitor.valor*1) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento atual possui valor maior do que deseja ser encontrado");
                },2000);
            }
            timeout( function() {
                Plumb.fadeOut(info.id,1000);
                timeout( function() {
                    StepRecord.end();
                    UI.unlock();
                    $("#" + info.id).remove();
                }, leitor === null || info.valor*1 !== leitor.valor*1?1000:6000);
            }, 2000);
        }, i * 2000);

    },
    
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var leitor = collection.cabeca;
        var pos = {left: -25, top: screen.height / 2.5};
        var ant = null;
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.lines(0,1,50);
        timeout( function() {
            StepRecord.add("Busca começa no inicio da lista");
        },2000);
        while(leitor !== null) {
            var looptime = 2000*(i+1);
            pos = {left:parseInt(leitor.dados.d.style.left),top:parseInt(leitor.dados.d.style.top) - 65};
            Plumb.moveTo(info.id,pos.left,pos.top,2000);
            if (info.valor*1 <= leitor.valor*1) {
                timeout( function() {
                    if(info.valor*1 === leitor.valor*1){
                        timeout(function(){
                            Tooltip.show(leitor.dados.id, "removendo", "#1A6", 3000);
                            if (leitor.prox !== null) {
                                Tooltip.show(leitor.prox.dados.id, "próximo", "#1A6", 3000);
                            } 
                            if(ant !== null) {
                                Tooltip.show(ant.dados.id, "anterior", "#1A6", 3000);
                            }
                            timeout(function(){
                                StepRecord.add("Busca encerra pois o elemento foi encontrado");
                            },100);
                        },2000);
                        highlighter.line(7,1000);
                        highlighter.lineRed(2,100);
                        if(ant===null){
                            highlighter.line(9,2000);
                            highlighter.line(10,3000);
                        } else {
                            highlighter.line(11,2000);
                            highlighter.lineRed(9,2000);
                            highlighter.line(12,3000);                            
                        }
                        highlighter.line(13,4000);
                        highlighter.clear(5000);
                        Plumb.blink(leitor.dados.id,6000);
                        timeout(function(){
                            disconnectDisc(ant,leitor);
                            //algoritmo de remoção na estrutura abaixo
                            if(ant !== null) {
                                ant.prox = leitor.prox;
                                if(leitor.prox === null) {
                                    setFinal(ant.dados.id,true);
                                }
                            } else {
                                collection.cabeca = collection.cabeca.prox;
                                if(collection.cabeca !== null){
                                    setInitial(collection.cabeca.dados.id,true);
                                    StepRecord.add("Início da lista aponta para o próximo elemento");
                                }
                            }
                            deslocarApartir(leitor.prox,-125,2000);

                        },6000);
                    } else {
                        highlighter.lineRed(2,100);
                        highlighter.clear(1000);
                        highlighter.lineRed(7,1000);
                        highlighter.clear(2000);
                    }
                }, (i+1) * 2000);
                break;
            }
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.line(2,looptime);
            highlighter.line(4,looptime+600);
            highlighter.line(5,looptime+1200);
            i++;
            ant = leitor;
            leitor = leitor.prox;
        }
        timeout( function() {
            if(leitor===null){
                Plumb.moveTo(info.id, pos.left + 125, pos.top, 2000);
                highlighter.clear(2000);
                highlighter.lineRed(2,2000);
                highlighter.clear(3000);
                highlighter.lineRed(7,3000);
                highlighter.clear(4000);
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                },2000);
            } else if(info.valor*1 !== leitor.valor*1){
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento atual possui valor maior do que deseja ser encontrado");
                },2000);
            }
            timeout( function() {
                highlighter.clear(0);
                Plumb.fadeOut(info.id,1000);
                timeout( function() {
                    $("#" + info.id).remove();
                    if(collection.cabeca===null){
                        createDiscNull();
                    }
                    StepRecord.add("Elemento é removido");
                    StepRecord.end();
                    UI.unlock();
                }, leitor === null || info.valor*1 !== leitor.valor*1?1000:6000);
            }, 2000);
        }, i * 2000);
    },
    prepareAnt = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:"Right",isSource:false,isTarget:true,isPrimary:true});
    },
    prepareProx = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:"Left",isSource:true,isTarget:false,isPrimary:true});
    },
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
    },
    connectDisc = function (ant,elem) {
        if(ant!==null && elem.prox!==null) {
            Plumb.desconectar({source:ant.dados.id,target:elem.prox.dados.id});
        }
        if(ant!==null) {
            setFinal(ant.dados.id,false);
            Plumb.conectar(prepareAnt(ant.dados.id),prepareProx(elem.dados.id),"proximo");
            StepRecord.add("Elemento anterior aponta para o novo");   
        }
        if(elem.prox!==null) {
            setFinal(elem.dados.id,false);
            Plumb.conectar(prepareAnt(elem.dados.id),prepareProx(elem.prox.dados.id),"proximo");
            StepRecord.add("Novo elemento para o atual");
        }
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "75px",
                    top: (screen.height / 2.5)+"px",
                    title: "Lista",
                    idParent: "main"});
        setInitial(nullpointer.id,true);
    },
    disconnectDisc = function (ant,raiz) {
        
        Plumb.desconectarCompletamente(raiz.dados.id);
        
        if(ant!==null && raiz.prox!==null) {
            Plumb.conectar(prepareAnt(ant.dados.id),prepareProx(raiz.prox.dados.id),"proximo");
            StepRecord.add("O próximo do elemento anterior aponta para o próximo do elemento a ser removido");
        }
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.setProperty("primaryColorProperty",true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.InitInterface(this.search,this.elementToString);
            createDiscNull();
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
        elementToString: function(id){
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.valor};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.dados.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.proximo = {id:element.prox.dados.id};
                } else {
                    result.proximo = 'nulo';
                }
                
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
                var value = UI.value('valor',"O Valor deve ser um número");
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    var info = createDisc(value,true);
                    collection.insere(value, info);
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

            var value = UI.value('valor',"O Valor deve ser um número");
    
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationRemove(info);
            }

        },
        searchValue: function () {

            var value = UI.value('valor',"O Valor deve ser um número");
            
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationSearch(info);
            }
        }

    };

})();