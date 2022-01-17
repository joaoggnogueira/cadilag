jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function FilaPrioridade() {
    this.ini = null;
    this.fim = null;

    FilaPrioridade.criaNo = function () {
        return {
            valor: null,
            dado: null,
            prioridade: null,
            prox: null
        };
    };

    this.insere = function (valor, dado, prioridade) {
        var novo = FilaPrioridade.criaNo();

        novo.valor = valor;
        novo.dado = dado;
        novo.prioridade = prioridade;
        Element.bind(novo, dado.id);
        var leitor = this.ini;
        var ant = null;
        var pos = 0;

        while (leitor !== null && leitor.prioridade * 1 >= prioridade * 1) {
            pos++;
            ant = leitor;
            leitor = leitor.prox;
        }

        if (leitor !== null) {
            if (ant === null) {
                novo.prox = this.ini;
                this.ini = novo;
            } else {
                novo.prox = leitor;
                ant.prox = novo;
            }
        } else {
            if (ant === null) {
                this.ini = novo;
            } else {
                this.fim.prox = novo;
            }
            this.fim = novo;
        }
        return(pos);
    };

    this.remove = function () {
        if (this.ini) {
            this.ini = this.ini.prox;
            if (this.ini === null) {
                this.fim = null;
            }
        }
    };

    this.busca = function (dado) {
        var aux = this.ini;
        var i = 0;

        while (aux && aux.valor * 1 != dado * 1) {
            aux = aux.prox;
            i--;
        }

        if (aux && aux.valor * 1 == dado * 1)
            return i;
        return -1;
    };

    this.at = function (i) {
        var no = this.ini;

        while (no && i) {
            no = no.prox;
            i--;
        }

        return no.dado;
    };

}

(function () {
    var collection = new FilaPrioridade();
    var nullpointer = null;
    var
    setInitial = function (elId, key, text) {
        $("#" + elId).find("span.initial").remove();
        if (key) {
            $("#" + elId).append("<span class='initial' style='margin-top:20px;'>" + text + "</span>");
        }
    },
    setFinal = function (elId, key) {
        $("#" + elId).find("span.final").remove();
        if (key) {
            $("#" + elId).append("<span class='final'>nulo</span>");
        }
    },
    deslocar = function (dados, offsetX, time) {
        Plumb.moveTo(dados.id, parseInt(dados.d.style.left) + offsetX, parseInt(dados.d.style.top), time);
    },
    deslocarApartir = function (raiz, offsetX, time) {
        while (raiz !== null) {
            deslocar(raiz.dado, offsetX, time);
            raiz = raiz.prox;
        }
    },
    animationAdd = function (elId, lastPosIns) {
        UI.lock();
        var posFim = {left: 100, top: screen.height / 2.5};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.lines(0, 4, 50);
        setFinal(elId,true);
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        
        if (collection.ini.prox !== null) { //Caso a fila não estiver vazia
            var i = 0, pos;
            var ant = null;
            var elem = collection.ini;
            timeout(function() {
                StepRecord.add("Percorrendo pela posição correta começando no inicio da fila");
            },  2000);
            while (i !== lastPosIns) {
                var looptime = (i) * 2000 + 1000;
                pos = {left: parseInt(elem.dado.d.style.left), top: parseInt(elem.dado.d.style.top)};
                posFim = {left: pos.left + 125, top: pos.top};
                Plumb.moveTo(elId, pos.left, pos.top - 60, 2000);
                timeout(function(){
                    StepRecord.add("Busca continua para o próximo elemento");   
                },((i+1)*2000));
                highlighter.line(5, looptime);
                highlighter.line(7, looptime + 500);
                highlighter.line(8, looptime + 1000);
                i++;
                ant = elem;
                elem = elem.prox;
            }
            timeout(function() {
                highlighter.clear(500);
                highlighter.lineRed(5, 500);
                if (elem.prox !== null) {
                    highlighter.line(10, 900);
                    if (ant === null) {
                        timeout(function(){
                            StepRecord.add("Elemento adicionado no início da fila, pois tem maior prioridade");
                        },2000);
                        highlighter.line(12, 1200);
                        highlighter.lines(14, 15, 1600);
                    } else {
                        timeout(function(){
                            StepRecord.add("Elemento adicionado em uma posição intermediária pois tem mais prioridade que alguns outros elementos");
                        },2000);
                        highlighter.line(17, 1200);
                        highlighter.lineRed(12, 1200);
                        highlighter.lines(19, 20, 1600);
                    }
                    deslocarApartir(elem.prox, 125, 2000);
                } else {
                    highlighter.line(23, 900);
                    highlighter.lineRed(10, 900);
                    if (ant === null) {
                        timeout(function(){
                            StepRecord.add("Início e Fim da fila aponta para o novo elemento, pois é o primeiro a ser adicionado");
                        },2000);
                        highlighter.line(25, 1200);
                        highlighter.line(26, 1500);
                    } else {
                        timeout(function(){
                            StepRecord.add("Elemento adicionado no final da fila pois tem menor prioridade que outros");
                        },2000);
                        highlighter.line(27, 1200);
                        highlighter.lineRed(25, 1200);
                        highlighter.line(28, 1500);
                    }
                    highlighter.line(29, 1750);
                }
                highlighter.clear(2000);
                timeout(function() {
                    connectDisc(elem, ant);
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                    StepRecord.end();
                }, 2000);
            }, i * 2000);
        } else {//Quando a fila está vazia 
            highlighter.clear(500);
            highlighter.lineRed(5, 500);
            highlighter.line(26, 1000);
            highlighter.lineRed(10, 1000);
            highlighter.line(28, 1300);
            highlighter.line(29, 1600);
            highlighter.clear(2000);
            timeout(function() {
                $(nullpointer.d).remove();
                setInitial(elId, true, "<p>Fila.inicio</p><p>Fila.fim</p>");
                setFinal(elId, true);
                StepRecord.add("Início e Fim da fila aponta para o novo elemento, pois é o primeiro a ser adicionado");
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        }
        Plumb.moveTo(elId, posFim.left, posFim.top, 2000);

    },
    animationSearch = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var i = 0;
        var temp = collection.ini;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0, 3, 50);
        timeout(function() {
            StepRecord.add("Busca começa no inicio da fila");
        },  2000);
        while (temp !== null) {
            var looptime = 2000 * i + 1000;
            var pos = {left: parseInt(temp.dado.d.style.left), top: parseInt(temp.dado.d.style.top) - 65};
            Plumb.moveTo(elem.id, pos.left, pos.top, 2000);
            if (elem.valor === temp.valor)
                break;
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            highlighter.line(4, looptime);
            highlighter.clear(looptime + 500);
            highlighter.lineRed(6, looptime + 500);
            highlighter.line(8, looptime + 1000);
            highlighter.line(9, looptime + 1500);
            i++;
            temp = temp.prox;
        }

        timeout(function() {
            Plumb.fadeOut(elem.id,1000);
            if (temp !== null) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                highlighter.line(4, 50);
                highlighter.line(6, 500);
                highlighter.line(7, 1000);
                Plumb.blink(temp.dado.id, 6000,function(){
                    UI.unlock();
                    StepRecord.end();
                    $("#" + elem.id).remove();
                });
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    UI.unlock();
                    StepRecord.end();
                    $("#" + elem.id).remove();
                },2000);
                highlighter.clear(50);
                highlighter.lineRed(4, 50);
                highlighter.line(11, 1000);
                Plumb.moveTo(elem.id, pos.left + 125, pos.top, 2000);
            }
            highlighter.clear(2000);
            
        }, (i + 1) * 2000);
    },
    animationRemove = function () {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        if (collection.ini !== null) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            highlighter.line(0, 50);
            highlighter.lines(2, 5, 500);
            UI.lock();

            if (collection.ini.prox === null) {
                highlighter.line(6, 1000);
                highlighter.line(7, 1500);
            } else {
                highlighter.lineRed(6, 1000);
            }
            highlighter.line(8, 2000);
            highlighter.line(9, 2500);
            highlighter.clear(3000);
            var id = collection.ini.dado.id;
            Plumb.fadeOut(id, 1000);
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);

            timeout(function() {
                disconnectDisc(collection.ini);
                deslocarApartir(collection.ini.prox, -125, 2000);
                if (collection.ini.prox !== null) {
                    StepRecord.add("Início avança para próxima posição, elemento é removido, e o valor '"+collection.ini.valor+"' retornado");
                } else {
                    createDiscNull();
                    StepRecord.add("Início e Fim apontam para nulo, elemento é removido, e o valor '"+collection.ini.valor+"' retornado");
                }
                timeout(function() {
                    StepRecord.end();
                    $("#"+id).remove();
                    collection.remove();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }, 1000);
            }, 5500);

        } else {
            highlighter.lineRed(0, 50);
            highlighter.clear(1000);
            highlighter.line(11, 1000);
            highlighter.clear(2000);
            timeout(function() {
                window.Eprogramada.nextQueue();
            }, 2000);
        }

    },
    prepareAnt2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {anchor: [0, 0.5, 0, -1], isSource: true, isTarget: false, isPrimary: true});
    },
    prepareProx2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {anchor: [1, 0.5, 0, -1], isSource: false, isTarget: true, isPrimary: true});
    },
    connectDisc = function (elem, ant) {
        
        if (ant !== null && elem.prox !== null) {
            Plumb.desconectar({source: ant.dado.id, target: elem.prox.dado.id});
            Plumb.desconectar({target: ant.dado.id, source: elem.prox.dado.id});
        }
        if (ant !== null) {
            setFinal(ant.dado.id,false);
            Plumb.conectar(prepareProx2(ant.dado.id), prepareAnt2(elem.dado.id), "proximo");
            StepRecord.add("Elemento anterior aponta para o novo");
        }
        if (elem.prox !== null) {
            setFinal(elem.dado.id,false);
            Plumb.conectar(prepareProx2(elem.dado.id), prepareAnt2(elem.prox.dado.id), "proximo");
            StepRecord.add("Novo elemento aponta para o leitor");
        }
        
        if (collection.ini.prox.prox === null) {
            setInitial(collection.ini.dado.id, true, "Fila.inicio");
            setInitial(collection.ini.prox.dado.id, true, "Fila.fim");
            setFinal(collection.ini.prox.dado.id, true);
        } else if (elem === collection.ini) {
            setInitial(collection.ini.prox.dado.id, false);
            setInitial(collection.ini.dado.id, true, "Fila.inicio");
        } else if (elem.prox === null) {
            setInitial(ant.dado.id, false);
            setInitial(elem.dado.id, true, "<p>Fila.fim</p>");
            setFinal(elem.dado.id, true);
        }
        if (elem === collection.ini) {
            StepRecord.add("Início da fila aponta para o novo elemento");
        } else if (elem.prox === null) {
            StepRecord.add("Fim da fila aponta para o novo elemento");
        }
    },
    disconnectDisc = function (elem) {
        Plumb.desconectarCompletamente(elem.dado.id);
        setInitial(elem.dado.id, false);
        if (collection.ini.prox === collection.fim) {
            setInitial(collection.fim.dado.id, true, "<p>Fila.inicio</p><p>Fila.fim</p>");
        } else {
            if (collection.ini.prox !== null)
                setInitial(collection.ini.prox.dado.id, true, "<p>Fila.inicio</p>");
        }
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
    createDisc = function (value, prior) {
        var elem = Element.createElement(
                {className: "dinamicDot altColor",
                    innerHTML: "<span class='itemValuePriori altColorTitle'>" + value + "</span><span class='itemPriori altColor1 altColorTitle1'>" + prior + "</span>",
                    left: "100px",
                    top: "75px",
                    title: value + "/" + prior,
                    idParent: "main"});
        elem.valor = value;
        return elem;
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.setProperty("primaryColorProperty", true);
            UI.setProperty("secondaryColorProperty", true);
            UI.InitFunctions(this.addDisc, this.removeValue, this.searchValue);
            UI.AddInput("prioridade");
            UI.InitInterface(this.search, this.elementToString);
            createDiscNull();
        },
        elementToString: function (id) {
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.valor, 'prioridade': element.prioridade};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.dado.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.proximo = {id:element.prox.dado.id};
                } else
                    result.proximo = 'nulo';
                return result;
            }
            return false;
        },
        search: function () {
            var value = UI.value("valor");
            var prior = UI.value('prioridade');
            if (value !== "") {
                return $(".dinamicDot[original-title='" + value + "/" + prior + "']").length !== 0;
            }
            return false;
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var value = UI.value('valor');
                var prior = UI.value('prioridade', "Prioridade deve ser um numero!");
                if ((value !== "") && (prior !== "")) {
                    var info = createDisc(value, prior);
                    var lastPosIns = collection.insere(value, info, prior);
                    Plumb.tornarArrastavel(info.id);
                    UI.subtitle("Inserindo o valor <b>" + value + "</b> com prioridade <b>" + prior + "</b>");
                    animationAdd(info.id, lastPosIns);
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValuePriori").text());
                        UI.highlightInput("prioridade",$(info.d).find(".itemPriori").text());
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
                UI.subtitle("Buscando o valor <b>" + value + "</b>");
                var info = createDisc(value);
                $("#" + info.id).html("<span class='itemValue'>" + value + "</span>");
                animationSearch(info);
            }
        }

    };
})();