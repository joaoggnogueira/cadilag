jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function PilhaEstatica() {
    this.MAX = 15;
    this.topo = -1;
    this.pilha = new Array(this.MAX);

    PilhaEstatica.criaNo = function () {
        return {ref: null, id: null, value: null};
    };

    this.inicia = function (MAX) {
        this.topo = -1;
        this.MAX = MAX || this.MAX;
        for (var i = 0; i < this.MAX; ++i)
            this.pilha[i] = null;
    };

    this.push = function (elem) {
        if (this.topo < this.MAX - 1) {
            this.pilha[++this.topo] = PilhaEstatica.criaNo();
            this.pilha[this.topo].ref = elem.d;
            this.pilha[this.topo].id = elem.id;
            this.pilha[this.topo].value = elem.valor;
            Element.bind(this.pilha[this.topo], elem.id, {index: this.topo});
        }
    };

    this.pop = function () {
        if (this.topo != -1) {
            this.topo--;
            return this.pilha[this.topo + 1];
        }
        return null;
    };

    this.show = function () {
        for (var i = 0; i <= this.topo; ++i)
            alert(this.pilha[i]);
    };

    this.size = function () {
        return this.topo;
    };

    this.at = function (i) {
        return this.pilha[i];
    };
}

(function () {
    var collection = new PilhaEstatica();

    var
    pointerini,
    initPointers = function () {
        pointerini = createPointer("<p>TOPO</p>");
    },
    createPointer = function (text) {
        return Element.createElement(
                {className: "staticpointer",
                    innerHTML: text,
                    left: "105px",
                    top: "350px",
                    idParent: "main"});
    },
    deslocarPointer = function (offsetX, time) {
        Plumb.moveTo(pointerini.id,parseInt(pointerini.d.style.left) + offsetX,parseInt(pointerini.d.style.top),time);
    },
    animationAdd = function (elId) {
        UI.lock();

        var desl = 3;
        var qtd = collection.size();
        var pos = {left: 100, top: 280};
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        if (qtd >= 1) {
            var elem = collection.at(qtd - 1);
            pos = {left: parseInt(elem.ref.style.left), top: parseInt(elem.ref.style.top)};
            desl = 72;
        }
        deslocarPointer(72, 500);
        highlighter.line(0, 10);
        highlighter.line(2, 500);
        highlighter.line(3, 1000);
        highlighter.clear(2000);
        pos.left = pos.left + desl;
        Plumb.moveTo(elId, pos.left, pos.top, 2000);
        timeout(function() {
            StepRecord.add("Adiciona o elemento ao topo da pilha, e o topo avança uma posição");
            StepRecord.end();
            UI.unlock();
            window.Eprogramada.nextQueue();
        }, 2000);
    },
    
    animationSearch = function (elId, value) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        var i;
        var animate = function(i){
            timeout(function() {
                StepRecord.add("Busca avança para o indice "+(i+1));
            }, (i + 2) * 2000);
        };
        timeout(function() {
            StepRecord.add("Busca inicia no indice 0");
        },  2000);
        for (i = 0; i <= collection.size(); ++i) {
            var elem = collection.at(i);
            Plumb.moveTo(elId, parseInt(elem.ref.style.left), parseInt(elem.ref.style.top) - 65, 2000);
            if (elem.value === value) {
                highlighter.line(0, 2000 * (i + 1));
                highlighter.line(2, 2000 * (i + 1) + 600);
                highlighter.line(3, 2000 * (i + 1) + 1200);
                highlighter.clear(2000 * (i + 2));
                break;
            }
            highlighter.line(0, 2000 * (i + 1));
            highlighter.clear(2000 * (i + 1) + 900);
            highlighter.lineRed(2, 2000 * (i + 1) + 1000);

            animate(i);
        }

        timeout(function() {
            if (i <= collection.size()) {
                var id = collection.at(i).id;
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                Plumb.fadeOut(id, 1000,function(){changeColor(i);});
                Plumb.fadeIn(id, 1000);
                Plumb.fadeOut(id, 1000);
                Plumb.fadeIn(id, 1000);
                Plumb.fadeOut(id, 1000);
                Plumb.fadeIn(id, 1000);
            } else {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                },2000);
                highlighter.clear(0);
                highlighter.lineRed(0, 10);
                highlighter.line(5, 1000);
                highlighter.clear(2000);
            }
            Plumb.fadeOut(elId, 2000);
            timeout(function() {
                UI.unlock();
                $("#" + elId).remove();
                resetColor(i);
                window.Eprogramada.nextQueue();
                StepRecord.end();
            }, i <= collection.size() ? 6000 : 2000);
        }, (i + 1) * 2000);
    },
    
    animationRemove = function () {
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        UI.lock();

        if (collection.topo >= 0) {
            StepRecord.start();
            StepRecord.add("Estado Inicial");
            var id = collection.at(collection.size()).id;
            Plumb.fadeOut(id, 1000,function(){changeColor(collection.size());});
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);
            Plumb.fadeIn(id, 1000);
            Plumb.fadeOut(id, 1000);

            highlighter.line(0, 10);
            highlighter.line(2, 500);
            highlighter.line(3, 1000);
            highlighter.clear(2000);
            deslocarPointer(-72, 500);
            timeout(function() {
                StepRecord.add("O topo retrocede uma posição, e elemento do topo é removido");
                StepRecord.end();
                UI.unlock();
                resetColor(collection.size());
                $("#"+id).remove();
                collection.pop();
                window.Eprogramada.nextQueue();
            }, 6000);
        } else {
            highlighter.lineRed(0, 10);
            highlighter.line(5, 1000);
            highlighter.clear(2000);
            timeout(function() {
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        }
    },
    createDisc = function (value) {
        var elem = Element.createElement(
                {className: "dinamicDot altColor",
                    innerHTML: "<span class='itemValue altColorTitle'>" + value + "</span>",
                    left: "0px",
                    top: "75px",
                    title: value,
                    idParent: "main"});
        elem.valor = value;
        return elem;
    },
    resetColor = function (ind) {
        Canvas.reset({indice: ind});
    },
    changeColor = function (ind) {
        Canvas.highlight({canvasId: 'canv', indice: ind});
    },
    draw = function () {
        Canvas.drawArray({canvasId: 'canv', total: collection.MAX, alternate: "html"});
    };

    window.Cadilag = {
        init: function () {
            UI.AddInput("pilha");
            UI.lock();
            $("#stop").hide();
            $("#newStruct").click(this.newStruct);
            UI.setProperty("primaryColorProperty", true);
            UI.InitInterface(this.search, this.elementToString);
        },
        elementIndexToString: function (index) {
            var arraypos = collection.pilha[index];
            if (arraypos === null) {
                return {'value': 'nulo', '_index': index, '_title': 'Pilha'};
            } else if (arraypos !== undefined) {
                return {'value': arraypos.value, '_index': index, '_title': 'Pilha'};
            }
            return false;
        },
        elementToString: function (id) {
            var element = Element.get(id);
            if (element !== undefined) {
                var vars = Element.getVars(id);
                var result = {'value': element.value, '_index': vars.index, '_title': 'Pilha'};
                return result;
            }
            return false;
        },
        search: function () {
            var value = UI.value("valor");
            if (value !== "") {
                return $(".dinamicDot[title='" + value + "']").length !== 0;
            }
            return false;
        },
        newStruct: function () {
            var size = UI.value("sizeArray", "Tamanho do Vetor é invalido");
            if (size !== "") {
                UI.setParameters({"MAX": size});
                UI.InitFunctions(Cadilag.addDisc, Cadilag.removeValue, Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size);
                Canvas.initInterface(Cadilag.elementIndexToString);
                draw();
                initPointers();
                UI.unlock();
                $("#subtopbar").animate({"top": "0px"}, 500, function () {
                    $(this).remove();
                });
            }
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var value = UI.value('valor');
                if (value !== '') {
                    UI.subtitle("Inserindo o valor <b>" + value + "</b>");
                    if (collection.topo < collection.MAX - 1) {
                        var info = createDisc(value);
                        collection.push(info);
                        animationAdd(info.id);
                        $(info.d).click(function(){
                            UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                        });
                    } else {
                        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                        highlighter.lineRed(0, 10);
                        highlighter.clear(1000);
                        timeout(function() {
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        }, 1000);
                    }
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            UI.subtitle("Removendo o último elemento");
            animationRemove();
        },
        searchValue: function () {
            var value = UI.value('valor');
            if (value !== '') {
                UI.subtitle("Buscando o valor <b>" + value + "</b>");
                var info = createDisc(value);
                animationSearch(info.id, value);
            }
        }
    };
})();
