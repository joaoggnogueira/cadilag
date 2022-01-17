jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ListaSimplesOrdenada() {
    this.cabeca = null;

    ListaSimplesOrdenada.criaNo = function () {
        return {
            dados: null,
            valor: null,
            prox: null,
            ant: null
        };
    };

    this.insere = function (valor, dado) {
        var novo = ListaSimplesOrdenada.criaNo();
        novo.dados = dado;
        novo.valor = valor;
        Element.bind(novo,dado.id);
        var leitor = this.cabeca;
        var anterior = null;
        while (leitor != null && leitor.valor * 1 < valor * 1) {
            anterior = leitor;
            leitor = leitor.prox;
        }
        if (leitor != null) {
            if (anterior == null) {
                novo.prox = this.cabeca;
                this.cabeca.ant = novo;
                this.cabeca = novo;
            } else {
                novo.ant = anterior;
                novo.prox = leitor;
                anterior.prox = novo;
                leitor.ant = novo;
            }
        } else {
            if (anterior == null) {
                this.cabeca = novo;
            } else {
                novo.ant = anterior;
                anterior.prox = novo;
            }
        }
    };
    
}

(function () {
    var collection = new ListaSimplesOrdenada();
    var nullpointer = null;
    var 
    setLabel = function(elId,key){
//        $("#"+elId).find("span.labelEl").remove();
//        
//        if(key) {
//            $("#"+elId).append("<span class='labelEl'>"+key.toUpperCase()+"</span>");
//            $("#"+elId).find("span.labelEl").css("height","30px");
//        }
    },
    clearLabel = function(){
      //  $("span.labelEl").remove();
    },
    setInitial = function(elId,key){
        $("span.initial").remove();
        if(key) {
            $("#"+elId).append("<span class='initial'>Lista</span>");
        }
    },
    setRightFinal = function(elId,key){
        $("#"+elId).find("span.final").remove();
        if(key) {
            $("#"+elId).append("<span class='final'>nulo</span>");
        }
    },
    setLeftFinal = function(elId,key){
        $("#"+elId).find("span.final2").remove();
        if(key) {
            $("#"+elId).append("<span class='final2'><p>nulo</p></span>");
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
    foundAnimation = function(id,time){
        Plumb.fadeOut(id,time);
        Plumb.fadeIn(id,time);
        Plumb.fadeOut(id,time);
        Plumb.fadeIn(id,time);
        Plumb.fadeOut(id,time);
        Plumb.fadeIn(id,time);
    },
    animationAdd = function (info) {
        UI.lock();
        
        setLeftFinal(info.id,true);
        setRightFinal(info.id,true);
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var posFim = {left: 100, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.lines(0,5,50);
        Tooltip.register(info.id,info.d,"tooltipStatic");
        if (collection.cabeca.prox !== null) {
            var i = 0;
            var leitor = collection.cabeca;
            timeout( function() {
                StepRecord.add("Busca começa no inicio da lista");
            },  2000);
            while(leitor !== null) {
                var looptime = 2000*i + 1000;
                if(info.valor*1===leitor.valor*1) {
                    if(leitor.ant!==null) {
                        Plumb.moveTo(info.id,posFim.left+150,posFim.top-80,1000);
                        Plumb.moveTo(info.id,posFim.left+150,posFim.top,1000);
                    } else {
                        Plumb.moveTo(info.id,posFim.left,posFim.top,2000);
                    }
                    timeout( function() {
                        
                        highlighter.clear(450);
                        highlighter.lineRed(6,500);
                        if(leitor.prox !== null) {
                            highlighter.line(11,1000);
                            if(leitor.ant === null){
                                highlighter.line(13,1500);
                                highlighter.lines(15,17,2000);
                                
                            } else {
                                highlighter.line(19,1500);
                                highlighter.lineRed(13,1500);
                                highlighter.lines(21,24,2000);
                            }
                        } else {
                            highlighter.line(27,900);
                            highlighter.lineRed(11,900);
                            if(leitor.ant === null){
                                highlighter.line(29,1500);
                                highlighter.line(30,2000);
                            } else {
                                highlighter.line(31,1500);
                                highlighter.lineRed(29,1500);
                                highlighter.lines(33,32,2000);
                            }

                        }
                        highlighter.clear(3000);
                        deslocarApartir(leitor.prox,150,2000);
                        timeout( function(){
                            Tooltip.show(leitor.dados.id, "novo", "#1A6", 3000);
                            if (leitor.prox !== null) {
                                Tooltip.show(leitor.prox.dados.id, "próximo", "#1A6", 3000);
                            } 
                            if(leitor.ant !== null) {
                                Tooltip.show(leitor.ant.dados.id, "anterior", "#1A6", 3000);
                            }
                            timeout(function(){
                                connectDisc(leitor);
                                if (leitor.ant === null) {
                                    setInitial(info.id, true);
                                    StepRecord.add("O inicio da fila aponta para o novo elemento");
                                }
                                timeout( function(){
                                    clearLabel();
                                    StepRecord.end();
                                    UI.unlock();
                                    window.Eprogramada.nextQueue();                            
                                }, 2000);
                            },1000);
                        }, 2000);
                    }, i * 2000);
                    break;
                } else if (leitor.prox!==null) {
                    posFim = {left: parseInt(leitor.dados.d.style.left), top: parseInt(leitor.dados.d.style.top)};
                    Plumb.moveTo(info.id,posFim.left,posFim.top - 80,2000);
                }
                timeout( function(){
                    StepRecord.add("Busca continua para o próximo elemento");   
                },((i+2)*2000));
                highlighter.line(6,looptime);
                highlighter.line(8,looptime+600);
                highlighter.line(9,looptime+1200);
                leitor = leitor.prox;
                i++;
            }
        } else {
            highlighter.clear(450);
            highlighter.lineRed(6,450);
            highlighter.line(27,900);
            highlighter.lineRed(11,900);
            highlighter.line(29,1350);
            highlighter.line(30,1600);
            highlighter.clear(2000);
            Plumb.moveTo(info.id,posFim.left,posFim.top,2000);
            timeout( function() {
                setInitial(info.id,true);
                $(nullpointer.d).remove();
                StepRecord.add("Não é necessário busca pois a lista está vazia");  
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        }
    },
    
    animationSearch = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var leitor = collection.cabeca;
        var pos = {left: -25, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0,1,50);
        timeout( function() {
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(leitor!==null) {
            var looptime = 2000*i + 1000;
            pos = {left:parseInt(leitor.dados.d.style.left),top:parseInt(leitor.dados.d.style.top) - 65};
            Plumb.moveTo(info.id,pos.left,pos.top,2000);
            if (info.valor*1 <= leitor.valor*1) {
                timeout( function() {
                    if (info.valor*1 === leitor.valor*1) {
                        timeout( function(){
                            StepRecord.add("Busca encerra pois o elemento foi encontrado");
                        },2000);
                        foundAnimation(leitor.dados.id,1000);
                    } else {
                        timeout( function(){
                            StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                        },2000);
                    }
                }, (i+1) * 2000);
                break;
            }
            timeout( function(){
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
            if(leitor===null) {
                Plumb.moveTo(info.id, pos.left + 150, pos.top, 2000);
                highlighter.clear(500);
                highlighter.lineRed(2,500);
                highlighter.line(8,1000);
                highlighter.clear(2000);
            } else {
                if(info.valor*1 === leitor.valor*1){
                    highlighter.line(2,1000);
                    highlighter.line(4,2000);
                    highlighter.line(5,3000);
                    highlighter.clear(4000);
                } else {
                    timeout( function(){
                        StepRecord.add("Busca encerra pois o elemento atual possui valor maior do que deseja ser encontrado");
                    },2000);
                    highlighter.clear(500);
                    highlighter.lineRed(2,500);
                    highlighter.line(8,1000);
                    highlighter.clear(2000);
                }
            }
            
            timeout( function() {
                Plumb.fadeOut(info.id,1000);
                timeout( function() {
                    StepRecord.end();
                    UI.unlock();
                    $("#" + info.id).remove();
                }, leitor===null || info.valor*1 !== leitor.valor*1?1000:6000);
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
        var higlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        higlighter.lines(0,1,50);
        timeout( function() {
            StepRecord.add("Busca começa no inicio da lista");
        },2000);
        while(leitor !== null) {
            var looptime = 2000*i + 1000;
            pos = {left:parseInt(leitor.dados.d.style.left),top:parseInt(leitor.dados.d.style.top) - 65};
            Plumb.moveTo(info.id,pos.left,pos.top,2000);
            if (info.valor*1 <= leitor.valor*1) {
                higlighter.clear(looptime);
                higlighter.lineRed(2,looptime);
                timeout( function() {
                    if (info.valor*1 === leitor.valor*1) {
                        timeout( function(){
                            Tooltip.show(leitor.dados.id, "removendo", "#1A6", 3000);
                            if (leitor.prox !== null) {
                                Tooltip.show(leitor.prox.dados.id, "próximo", "#1A6", 3000);
                            } 
                            if(leitor.ant !== null) {
                                Tooltip.show(leitor.ant.dados.id, "anterior", "#1A6", 3000);
                            }
                            StepRecord.add("Busca encerra pois o elemento foi encontrado");
                        },2000);
                        higlighter.line(7,10);
                        foundAnimation(leitor.dados.id,1000);
                        if(leitor.ant===null){
                            higlighter.line(9,1000);
                            if(leitor.prox!==null){
                                higlighter.line(11,2000);
                                higlighter.line(12,3000);
                                higlighter.line(13,4000);
                                higlighter.line(22,5000);
                                higlighter.clear(6000);
                            } else{
                                higlighter.clear(2000);
                                higlighter.lineRed(11,2000);
                                higlighter.line(13,3000);
                                higlighter.line(22,4000);
                                higlighter.clear(5000);
                            }
                        } else {
                            higlighter.line(15,1000);
                            higlighter.lineRed(9,1000);
                            higlighter.line(17,2000);
                            if (leitor.prox !== null) {
                                higlighter.line(18,3000);
                                higlighter.line(19,4000);
                                higlighter.line(22,5000);
                                higlighter.clear(6000);
                            } else {
                                higlighter.clear(3000);
                                higlighter.lineRed(18,3000);
                                higlighter.line(22,4000);
                                higlighter.clear(5000);
                            }
                        }
                        
                        timeout( function() {
                            
                            disconnectDisc(leitor);
                            if (leitor.ant !== null) {
                                leitor.ant.prox = leitor.prox;
                                if (leitor.prox === null)
                                    setRightFinal(leitor.ant.dados.id, true);
                                else
                                    leitor.prox.ant = leitor.ant;
                            } else {
                                collection.cabeca = collection.cabeca.prox;

                                if (collection.cabeca !== null) {
                                    setInitial(collection.cabeca.dados.id, true);
                                    setLeftFinal(collection.cabeca.dados.id, true);
                                    collection.cabeca.ant = null;
                                }
                            }
                            deslocarApartir(leitor.prox, -150, 2000);
                        },6000);
                    } else {
                        higlighter.clear(10);
                        higlighter.lineRed(7,10);
                    }
                }, (i+1) * 2000);
                break;
            }
            timeout( function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            higlighter.line(2,looptime);
            higlighter.line(4,looptime+500);
            higlighter.line(5,looptime+1000);
            i++;
            leitor = leitor.prox;
        }
        timeout( function() {
            if(leitor===null){
                Plumb.moveTo(info.id, pos.left + 150, pos.top, 2000);
                higlighter.clear(10);
                higlighter.lineRed(2,10);
                higlighter.clear(1000);
                higlighter.lineRed(7,1000);
                higlighter.clear(2000);
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                },2000);
            } else if(info.valor*1 !== leitor.valor*1){
                timeout( function(){
                    StepRecord.add("Busca encerra pois o elemento atual possui valor maior do que deseja ser encontrado");
                },2000);
            }
            timeout( function() {
                Plumb.fadeOut(info.id,1000);
                timeout( function() {
                    $("#" + info.id).remove();
                    if(collection.cabeca === null){
                        createDiscNull();
                    }
                    StepRecord.add("Elemento é removido");
                    StepRecord.end();
                    UI.unlock();
                }, leitor===null || info.valor*1 !== leitor.valor*1?1000:6000);
            }, 2000);
        }, i * 2000);
    },
    prepareAnt = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:[1, 0.25, 0, -1],isSource:false,isTarget:true,isPrimary:true});
    },
    prepareProx = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:[0, 0.25, 0, -1],isSource:true,isTarget:false,isPrimary:true});
    },
    prepareAnt2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:[0, 0.75, 0, -1],isSource:false,isTarget:true,isPrimary:false});
    },
    prepareProx2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{anchor:[1, 0.75, 0, -1],isSource:true,isTarget:false,isPrimary:false});
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
            elem.d.className += " withPointer2";
            
//            var append_prox_div = document.createElement("div");
//            append_prox_div.className = "append_box_bottom_right altColor";
//            elem.d.appendChild(append_prox_div);
//            
//            var append_ant_div = document.createElement("div");
//            append_ant_div.className = "append_box_top_left altColor";
//            elem.d.appendChild(append_ant_div);
            
            
            var prox_div = document.createElement("div");
            prox_div.className = "pointer_box_top_right altColor";
            elem.d.appendChild(prox_div);
            
            var ant_div = document.createElement("div");
            ant_div.className = "pointer_box_bottom_left altColor";
            elem.d.appendChild(ant_div);
            

            UI.changeColorComponentPrimary();
        }
        return elem;
    },
    connectDisc = function (elem) {
        setLabel(elem.dados.id,"novo");

        if(elem.ant !== null) {
            setLabel(elem.ant.dados.id,"anterior");
            if(elem.prox !== null){
                setLabel(elem.prox.dados.id,"próximo");
                Plumb.desconectar({source:elem.ant.dados.id,target:elem.prox.dados.id});
            }
            setRightFinal(elem.ant.dados.id,false);
            Plumb.conectar(prepareAnt(elem.ant.dados.id),prepareProx(elem.dados.id),"proximo");
            StepRecord.add("Anterior aponta para o novo");
            setLeftFinal(elem.dados.id,false);
            Plumb.conectar(prepareAnt2(elem.dados.id),prepareProx2(elem.ant.dados.id),"anterior");
            StepRecord.add("Novo aponta para o anterior");
        }
        if(elem.prox !== null) {
            setLabel(elem.prox.dados.id,"próximo");
            setRightFinal(elem.dados.id,false);
            Plumb.conectar(prepareAnt(elem.dados.id),prepareProx(elem.prox.dados.id),"proximo");
            StepRecord.add("Novo aponta para o próximo");
            if(elem.ant !== null){
                Plumb.desconectar({target:elem.ant.dados.id,source:elem.prox.dados.id});
            }
            setLeftFinal(elem.prox.dados.id,false);
            Plumb.conectar(prepareAnt2(elem.prox.dados.id),prepareProx2(elem.dados.id),"anterior");
            StepRecord.add("Próximo aponta para o novo");
        }
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "100px",
                    top: (screen.height / 2.5)+"px",
                    title: "Lista",
                    idParent: "main"});
        $("#"+nullpointer.id).append("<span class='initial'>Lista</span>");
    },
    disconnectDisc = function (raiz) {
        
        if(raiz.ant!==null && raiz.prox!==null) {
            Plumb.desconectar({source: raiz.ant.dados.id, target: raiz.dados.id});
            Plumb.conectar(prepareAnt(raiz.ant.dados.id), prepareProx(raiz.prox.dados.id),"proximo");
            StepRecord.add("Elemento anterior aponta para o próximo");
            Plumb.desconectar({source: raiz.prox.dados.id, target: raiz.dados.id});
            Plumb.conectar(prepareAnt2(raiz.prox.dados.id), prepareProx2(raiz.ant.dados.id),"anterior");
            StepRecord.add("Elemento proximo aponta para o anterior");
        }
        Plumb.desconectarCompletamente(raiz.dados.id);
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.setProperty("primaryColorProperty",true);
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
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
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
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.proximo = {id:element.prox.dados.id};
                } else {
                    result.proximo = 'nulo';
                }
                if (element.ant !== null) {
                    var nextId = (element.ant.dados.id * 1).toString(16).toUpperCase();
                    result.anterior = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.anterior = {id:element.ant.dados.id};
                } else {
                    result.anterior = 'nulo';
                }
                return result;
            }
            return false;
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor',"Entrada deve ser um número");
                if (value !== "") {
                    var info = createDisc(value,true);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    collection.insere(value, info);
                    Plumb.tornarArrastavel(info.id);
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

            var value = UI.value('valor',"Entrada deve ser um número");
            
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value('valor',"Entrada deve ser um número");
            
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value,false);
                animationSearch(info);
            }
        }

    };
})();