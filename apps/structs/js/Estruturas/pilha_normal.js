jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function Pilha() {
    // cria um nó
    Pilha.criaNo = function () {
        return {valor: null, dados: null, prox: null };
    };

    this.topo = null;

    this.insere = function (valor, dado) {
        var novo = Pilha.criaNo();

        novo.prox = this.topo;
        Element.bind(novo, dado.id);
        this.topo = novo;
        this.topo.dados = dado;

        this.topo.valor = valor;
    };

    this.remove = function () {
        this.topo = this.topo.prox;
    };

}

(function () {
    var pilha = new Pilha();
    var nullpointer = null;
    var
            deslocarApartir = function (raiz, offsetX, tempo) {
                while (raiz !== null) {
                    deslocar(raiz.dados, offsetX, tempo);
                    raiz = raiz.prox;
                }
            },
            deslocar = function (dados, offsetX, tempo) {
                Plumb.moveTo(dados.id, parseInt(dados.d.style.left) + offsetX, parseInt(dados.d.style.top), tempo);
            },
            setInitial = function (elId, key) {
                $("span.initial").remove();
                if (key) {
                    $("#" + elId).append("<span class='initial'>Topo</span>");
                }
            },
            setFinal = function (elId, key) {
                $("#" + elId).find("span.final").remove();
                if (key) {
                    $("#" + elId).append("<span class='final withPointer'>nulo</span>");
                }
            },
            animationAdd = function (elId) {
                UI.lock();
                setFinal(elId,true);
                StepRecord.start();
                StepRecord.add("Estado Inicial");
                var raiz = pilha.topo.prox;
                var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                highlighter.lines(0, 2, 10);
                highlighter.lines(3, 4, 1000);
                highlighter.clear(2000);
                deslocarApartir(raiz, 125, 1000);
                timeout(function(){
                    Plumb.moveTo(elId, 75, screen.height / 2.5, 1500);
                    highlighter.clear(2000);
                    timeout(function(){
                        connectDisc();
                        if(!nullpointer){
                            StepRecord.add("Novo elemento aponta para o elemento no topo da pilha");    
                        }
                        setInitial(pilha.topo.dados.id, true);
                        StepRecord.add("Topo da pilha agora aponta para o novo elemento");   
                        Plumb.repintarElemento(elId);
                        if(nullpointer){
                            $(nullpointer.d).remove();
                            nullpointer = null;
                        }
                        StepRecord.end();
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    }, 2000);

                }, 1000);

            },
            animationSearch = function (elem) {
                UI.lock();
                StepRecord.start();
                StepRecord.add("Estado Inicial");
                var i = 0;
                var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
                highlighter.lines(0, 1, 10);
                var temp = pilha.topo;
                timeout(function(){
                    StepRecord.add("Busca inicia no topo da pilha");
                },  2000);
                while (temp !== null) {
                    var pos = {left: parseInt(temp.dados.d.style.left), top: parseInt(temp.dados.d.style.top) - 65};
                    Plumb.moveTo(elem.id, pos.left, pos.top, 2000);

                    if (elem.valor === temp.valor) {
                        highlighter.line(2, 2000 * (i + 1) - 1000);
                        highlighter.line(4, 2000 * (i + 1));
                        highlighter.line(5, 2000 * (i + 1) + 1000);
                        highlighter.clear(2000 * (i + 2));
                        break;
                    }
                    timeout(function(){
                        StepRecord.add("Busca continua para o próximo elemento");   
                    },((i+2)*2000));
                    highlighter.line(2, 2000 * (i + 1) - 500);
                    highlighter.lineRed(4, 2000 * (i + 1));
                    highlighter.line(6, 2000 * (i + 1) + 500);
                    
                    i++;
                    temp = temp.prox;
                }

                if (temp === null) {
                    Plumb.moveTo(elem.id, pos.left + 125, pos.top, 2000);
                }

                timeout(function(){
                    if (temp !== null) {
                        timeout(function(){
                            StepRecord.add("Busca encerra pois o elemento foi encontrado");
                        },2000);
                        var id = temp.dados.id;
                        Plumb.fadeOut(id, 1000);
                        Plumb.fadeIn(id, 1000);
                        Plumb.fadeOut(id, 1000);
                        Plumb.fadeIn(id, 1000);
                        Plumb.fadeOut(id, 1000);
                        Plumb.fadeIn(id, 1000);
                        timeout(function(){
                            StepRecord.end();
                            UI.unlock();
                        }, 7000);
                    } else {
                        timeout(function(){
                            StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                        },2000);
                        highlighter.clear(0);
                        highlighter.lineRed(2, 10);
                        highlighter.line(8, 1000);
                        highlighter.clear(2000);
                        timeout(function(){
                            StepRecord.end();
                            UI.unlock();
                        }, 2000);
                    }
                    Plumb.fadeOut(elem.id, 1000);
                }, (i + 1.5) * 2000);

                timeout(function(){
                    $("#" + elem.id).remove();
                }, (i + 2) * 2000);

            },
            animationRemove = function () {
                var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);

                if (pilha.topo !== null) {
                    UI.lock();
                    StepRecord.start();
                    StepRecord.add("Estado Inicial");
                    highlighter.line(2, 10);
                    highlighter.line(3, 500);
                    highlighter.line(4, 1000);
                    highlighter.line(5, 1500);
                    highlighter.clear(2000);

                    var id = pilha.topo.dados.id;
                    Plumb.fadeOut(id ,1000);
                    Plumb.fadeIn(id ,1000);
                    Plumb.fadeOut(id ,1000);
                    Plumb.fadeIn(id ,1000);
                    Plumb.fadeOut(id ,1000);
                    timeout(function(){
                        if (pilha.topo.prox !== null) {
                            setInitial(pilha.topo.prox.dados.id, true);
                            StepRecord.add("Topo aponta para o próximo elemento");
                        } else {
                            createDiscNull();
                            StepRecord.add("Topo aponta para nulo");
                        }
                        disconnectDisc();
                        StepRecord.add("Elemento é removido, e o valor '"+pilha.topo.valor+"' retornado");
                        deslocarApartir(pilha.topo, -125, 2000);
                        pilha.remove();
                        $("#"+id).remove();
                        StepRecord.end();
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    }, 5000);
                } else {
                    Plumb.showMessage("Pilha vazia",2000);
                    highlighter.lineRed(0, 10);
                    highlighter.clear(2000);
                    timeout(function(){
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    }, 2000);
                }
            },
            prepareAnt = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: true, anchor: "Right"});
            },
            prepareProx = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: true, anchor: "Left"});
            },
            connectDisc = function () {
                if (pilha.topo.prox !== null) {
                    setFinal(pilha.topo.dados.id,false);
                    Plumb.conectar(prepareAnt(pilha.topo.dados.id), prepareProx(pilha.topo.prox.dados.id),"proximo");
                }
            },
            disconnectDisc = function () {
                Plumb.desconectarCompletamente(pilha.topo.dados.id);
            },
            createDiscNull = function() {
                nullpointer = Element.createElement(
                        {className: "itemNullPointer",
                            innerHTML: "<span class='itemValue'>nulo</span>",
                            left: "75px",
                            top: (screen.height / 2.5)+"px",
                            title: "Topo",
                            idParent: "main"});
                setInitial(nullpointer.id,true);
            };
            createDisc = function (value,withPointer) {
                var elem = Element.createElement(
                        {className: "dinamicDot altColor",
                            innerHTML: "<span class='itemValue altColorTitle'>" + value + "</span>",
                            left: "75px",
                            top: "75px",
                            title: value,
                            idParent: "main"});
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
            UI.setProperty("primaryColorProperty", true);
            UI.InitFunctions(this.addDisc, this.removeValue, this.searchValue);
            UI.InitInterface(this.search, this.elementToString);
            createDiscNull();
        },
        search: function () {
            var value = UI.value("valor");
            if (value !== "") {
                return $(".dinamicDot[title='" + value + "']").length !== 0;
            }
            return false;
        },
        elementToString: function (id) {
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.valor};
                result._vizinhos = [];
                if (element.prox !== null) {
                    var nextId = (element.prox.dados.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.proximo = {id:element.prox.dados.id};
                } else
                    result.proximo = 'nulo';
                return result;
            }
            return false;
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var value = UI.value('valor');
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>" + value + "</b>");
                    var info = createDisc(value,true);
                    pilha.insere(value, info);
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
            UI.subtitle("Removendo o último elemento inserido da pilha");
            animationRemove();
        },
        searchValue: function () {

            var value = UI.value('valor');
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>" + value + "</b>");
                var info = createDisc(value,false);
                animationSearch(info);
            }
        }

    };
})();