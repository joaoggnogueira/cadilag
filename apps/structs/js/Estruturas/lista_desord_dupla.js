jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ListaDuplamenteEncadeada() {

    ListaDuplamenteEncadeada.criaNo = function () {
        return {valor: null, dados: null, prox: null, ant: null};
    };

    this.ini = null;

    this.insere = function (valor, dado) {
        if (this.ini === null) {
            this.ini = ListaDuplamenteEncadeada.criaNo();
        } else {
            var novo = ListaDuplamenteEncadeada.criaNo();
            novo.prox = this.ini;
            this.ini.ant = novo;
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

        if (no)
        {
            if (no == this.ini)
            {
                if (this.ini.prox != null)
                    this.ini.prox.ant = null;

                this.ini = this.ini.prox;
            } else
            {
                ant.prox = no.prox;

                if (no.prox != null)
                    no.prox.ant = ant;
            }
        }

    };

}

(function () {
    var collection = new ListaDuplamenteEncadeada();
    var nullpointer = null;
    var
    setInitial = function(elId,key){
        $("span.initial").remove();
        if(key){
            $("#"+elId).append("<span class='initial'>Lista</span>");
        }
        setLeftFinal(elId,key);
    },
    setRightFinal = function(elId,key){
        $("#"+elId).find("span.final").remove();
        if(key){
            $("#"+elId).append("<span class='final'>nulo</span>");
        }
    },
    setLeftFinal = function(elId,key){
        $("#"+elId).find("span.final2").remove();
        if(key) {
            $("#"+elId).append("<span class='final2'><p>nulo</p></span>");
        }
    },
    deslocarApartir = function(raiz,offsetX,time) {
        while (raiz !== null) {
            deslocar(raiz.dados, offsetX, time);
            raiz = raiz.prox;
        }
    },
    deslocar = function (raiz, offset, tempo) {
        Plumb.moveTo(raiz.id,parseInt(raiz.d.style.left) + offset,parseInt(raiz.d.style.top),tempo);
    },
    animationAdd = function (elId) {
        UI.lock();
        setRightFinal(elId,true);
        setLeftFinal(elId,true);
        StepRecord.start();
        if (collection.ini.prox === null) {
            StepRecord.add("Estado Inicial");
        }
        var raiz = collection.ini.prox;
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        deslocarApartir(raiz,150,2000);

        highlighter.lines(0,4,10);

        timeout( function() {
            Plumb.moveTo(elId,75,screen.height / 2.5,1000);
            if(collection.ini.prox===null) {
                highlighter.clear(499);
                highlighter.lineRed(5,500);
            } else {
                highlighter.line(5,500);
                highlighter.lines(7,8,1000);
            }
            timeout(function() {
                connectDisc();
            }, 1000);
            
            timeout( function() {
                highlighter.line(10,0);
                if (collection.ini.prox !== null) {
                    StepRecord.add("Estado Inicial");
                }
                $("#"+nullpointer.id).remove();
                setInitial(elId,true);
                StepRecord.add("Lista aponta para o novo elemento");

                timeout(function(){
                    StepRecord.end();
                    highlighter.clear(0);
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                },2000);

            }, 2000);

        }, 2000);
    },
    animationSearch = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0,1,10);
        var temp = collection.ini;
        timeout( function() {
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(temp!==null) {
            var pos = {left: parseInt(temp.dados.d.style.left), top: parseInt(temp.dados.d.style.top) - 65};
            Plumb.moveTo(elem.id,pos.left,pos.top,2000);

            if (elem.valor === temp.valor) {
                highlighter.line(2,2000*(i+1)-1000);
                highlighter.line(4,2000*(i+1));
                highlighter.line(5,2000*(i+1)+1000); 
                highlighter.clear(2000*(i+2));
                break;
            }
            highlighter.line(2,2000*i-500);
            highlighter.clear(2000*i-1);
            highlighter.lineRed(4,2000*i);
            highlighter.line(6,2000*i+500);
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            temp = temp.prox;
            i++;
        }
        if (temp===null && pos!==undefined) {
            Plumb.moveTo(elem.id,pos.left + 150,pos.top,2000);
        }

        timeout( function() {
            if (temp!==null) {
                timeout(function(){
                    StepRecord.add("Busca encerra pois o elemento foi encontrado");
                },2000);
                Plumb.blink(temp.dados.id,6000,function(){
                    StepRecord.end();
                    UI.unlock();
                    $("#"+elem.id).remove();
                });
            } else {
                highlighter.clear(0);
                highlighter.lineRed(2,500);
                highlighter.line(8,1000);
                highlighter.clear(2000);
                timeout( function() {
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    StepRecord.end();
                    UI.unlock();
                    $("#"+elem.id).remove();
                }, 2000);
            }
            Plumb.fadeOut(elem.id ,1000);
        }, (i + 1) * 2000);

    },
    animationRemove = function (elem) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var i = 0;
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.lines(0,1,10);
        var temp = collection.ini;
        timeout( function() {
            StepRecord.add("Busca começa no inicio da lista");
        },  2000);
        while(temp!==null) {
            var pos = {left: parseInt(temp.dados.d.style.left), top: parseInt(temp.dados.d.style.top) - 65};
            Plumb.moveTo(elem.id,pos.left,pos.top,2000);
            if (elem.valor === temp.valor) {
                highlighter.clear(2000*(i+1)+500);
                highlighter.lineRed(2,2000*(i+1) + 600);
                break;
            }
            highlighter.line(2,2000*(i+1) + 600);
            highlighter.line(4,2000*(i+1) + 1200);
            highlighter.line(5,2000*(i+1) + 1800);
            timeout(function(){
                StepRecord.add("Busca continua para o próximo elemento");   
            },((i+2)*2000));
            i++;
            temp = temp.prox;
        }
        if (temp===null && pos!==undefined) {
            Plumb.moveTo(elem.id,pos.left + 150,pos.top,2000);
        }

        timeout( function() {
            highlighter.clear(500);
            Plumb.fadeOut(elem.id,1000,function(){$("#"+elem.id).remove();});
            if (temp!==null) {
                StepRecord.add("Busca encerra pois o elemento foi encontrado");
                highlighter.line(7,1000);

                if(temp.ant === null) {
                    highlighter.line(9,1500);
                    if(collection.ini.prox!==null) {
                        highlighter.line(11,2000);
                        highlighter.line(12,2500);
                        highlighter.line(13,3000);
                        highlighter.line(21,3500);
                        highlighter.clear(4000);
                    } else {
                        highlighter.lineRed(11,2000);
                        highlighter.line(13,2500); 
                        highlighter.line(21,3000);
                        highlighter.clear(3500);
                    }
                } else {
                    highlighter.lineRed(9,1500);
                    highlighter.line(15,2000);
                    highlighter.line(17,2500);

                    if(temp.prox===null) {
                        highlighter.line(18,3000);
                        highlighter.line(19,3500);
                        highlighter.line(21,4000);
                        highlighter.clear(4500);
                    } else {
                        highlighter.lineRed(18,3000);
                        highlighter.line(21,3500);
                        highlighter.clear(4000);
                    }
                }
                Plumb.blink(temp.dados.id,4000,function(){
                    Plumb.fadeOut(temp.dados.id,1000,function(){
                        if(temp.ant === null && temp.prox !== null) {
                            setInitial(temp.prox.dados.id,true);
                            StepRecord.add("Inicio da lista avança para a próxima posição");
                        }
                        if(temp.prox === null && temp.ant !== null) {
                            setRightFinal(temp.ant.dados.id,true);
                        }
                        disconnectDisc(temp);
                        deslocarApartir(temp.prox,-150,2000);

                        timeout( function() {
                            collection.remove(parseInt(elem.valor));
                            StepRecord.end();
                            UI.unlock();
                        }, 2000);
                    });
                });
                
            } else {

                highlighter.lineRed(7,1000);
                highlighter.clear(2000);

                timeout( function() {
                    StepRecord.add("Busca encerra pois o elemento não foi encontrado");
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }, 2000);
            }

        }, (i + 1.5) * 2000);

    },

    prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:false,anchor: [1, 0.75, 0, -1]});
    },
    prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:true,anchor: [0, 0.25, 0, -1]});
    },
    prepare3 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:true,anchor: [1, 0.25, 0, -1]});
    },
    prepare4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:false,anchor: [0, 0.75, 0, -1]});
    },
    
    connectDisc = function () {
        if (collection.ini.prox !== null){
            var id1 = collection.ini.dados.id;
            var id2 = collection.ini.prox.dados.id;
            
            setRightFinal(id1,false);
            Plumb.conectar(prepare3(id1),prepare2(id2),"proximo");
            StepRecord.add("O ponteiro próximo do novo elemento para primeiro da lista");
            setLeftFinal(id2,false);
            Plumb.conectar(prepare4(id2),prepare(id1),"anterior");
            StepRecord.add("O ponteiro anterior do primeiro da Lista aponta para o novo");
        }
    },
    disconnectDisc = function (elem) {
        var id = elem.dados.id;
        Plumb.desconectarCompletamente(id);
        if (elem.ant !== null && elem.prox !== null){
            var idant = elem.ant.dados.id;
            var idprox = elem.prox.dados.id;
            Plumb.conectar(prepare4(idprox),prepare(idant));
            Plumb.conectar(prepare3(idant),prepare2(idprox));
            StepRecord.add("Anterior aponta para o próximo e Próximo aponta para o anterior");
        } else if(elem.ant === null && elem.prox === null){
            createDiscNull();
            StepRecord.add("Inicio da Lista aponta para nulo, pois foi removido o único elemento");
        }
        $("#" + elem.dados.id).remove();
        StepRecord.add("Elemento é removido");
    },
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "itemNullPointer",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "75px",
                    top: (screen.height / 2.5)+"px",
                    title: "Lista",
                    idParent: "main"});
        $("#"+nullpointer.id).append("<span class='initial'>Lista</span>");
    },
    createDisc = function (value,withPointer) {
        var elem = Element.createElement(
            {className:"dinamicDot altColor",
            innerHTML:"<span class='itemValue altColorTitle'>" + value + "</span>",
            left:"100px",
            top:"75px",
            title: value,
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
                if (element.prox !== null) {
                    var nextId = (element.prox.dados.id * 1).toString(16).toUpperCase();
                    result.proximo = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.proximo = {id:element.prox.dados.id};
                } else
                    result.proximo = 'nulo';
                if (element.ant !== null) {
                    var nextId = (element.ant.dados.id * 1).toString(16).toUpperCase();
                    result.anterior = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.anterior = {id:element.ant.dados.id};
                } else
                    result.anterior = 'nulo';
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
                var value = UI.value("valor");
                if (value !== "") {
                    var info = createDisc(value,true);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
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
                var info = createDisc(value,false);
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value("valor");
            if (value !== "") {
                var info = createDisc(value,false);
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                animationSearch(info);
            }
        }

    };
})();