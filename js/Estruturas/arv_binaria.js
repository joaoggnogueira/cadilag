jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function BST() {
    this.raiz = null; //Variaveis Globais
    this.MENOR = null;
    this.MAIOR = null;
    this.size = null;

    BST.criaNo = function () { //Cria um novo No -- Objeto Definido
        return {ref: null, id: null, value: null, esq: null, dir: null};
    };

    BST.criaRef = function () { //Cria Referencia Nula
        return {ref: null};
    };

    this.inicia = function () {  //Iniciando a arvore
        this.raiz = BST.criaRef();
        this.raiz.ref = BST.criaNo(); //Raiz.ref guarda O Objeto, Raiz.ref.ref guarda sua referencia
        this.size = 0;
    };

    this.insere2 = function (raiz, elem) { //Insercao

        if (raiz.ref.ref == null) {	//Insercao 
            if (this.MENOR == null && this.MAIOR == null) {
                this.MENOR = elem.valor;
                this.MAIOR = elem.valor; //Caso Referencia for Nula, MAIOR E MENOR RECEBEM o elemento
            } else {
                if (parseInt(this.MENOR) > parseInt(elem.valor))
                    this.MENOR = elem.valor;	//Caso Esquerda
                if (parseInt(this.MAIOR) < parseInt(elem.valor))
                    this.MAIOR = elem.valor;	//Caso Direita
            }
            var noEsq = BST.criaRef();
            var noDir = BST.criaRef();
            noEsq.ref = BST.criaNo();
            noDir.ref = BST.criaNo();
            raiz.ref.d = elem.d;
            raiz.ref.ref = elem.id; //Raiz recebe o endereco de elem
            raiz.ref.id = elem.id;	//Id do Objeto recebe o elem
            raiz.ref.value = elem.valor;
            raiz.ref.esq = noEsq;
            raiz.ref.dir = noDir;
            Element.bind(raiz.ref, raiz.ref.id);
            this.size++;
        } else if (parseInt(raiz.ref.value) < parseInt(elem.valor)) {
            this.insere2(raiz.ref.dir, elem); //Insercao a direita

        } else if (parseInt(raiz.ref.value) > parseInt(elem.valor)) {
            this.insere2(raiz.ref.esq, elem); //Insercao a esquerda
        }
    };

    this.length = function () {
        return this.size;
    };

    this.insere = function (elem) {
        this.insere2(this.raiz, elem);
    };

    this.search2 = function (raiz, value) {
        if (raiz.ref.ref == null)
            return null;
        if (parseInt(raiz.ref.value) == parseInt(value))
            return raiz;
        else if (parseInt(raiz.ref.value) < parseInt(value))
            return this.search2(raiz.ref.dir, value);
        else if (parseInt(raiz.ref.value) > parseInt(value))
            return this.search2(raiz.ref.esq, value);
    };

    this.search = function (value) {
        return this.search2(this.raiz, value);
    };

    this.remocao2 = function (raiz, value) {
        if (raiz.ref.ref !== null && parseInt(raiz.ref.value) !== parseInt(value)) {
            if(parseInt(raiz.ref.value) < parseInt(value)){
                this.remocao2(raiz.ref.dir, value);
            } else {
                this.remocao2(raiz.ref.esq, value);
            }
        } else if (raiz.ref.ref !== null) {
            if(raiz.ref.dir.ref.ref === null){
                raiz.ref = raiz.ref.esq.ref;
            } else if(raiz.ref.esq.ref.ref === null){
                raiz.ref = raiz.ref.dir.ref;
            } else {
                var sucessor = raiz.ref.dir;
                
                while(sucessor.ref.esq.ref.ref !== null){
                    sucessor = sucessor.ref.esq;
                }
                
                raiz.ref.value = sucessor.ref.value;
                sucessor.ref = sucessor.ref.dir.ref;
            }
        }
        
    };

    this.maisEsquerdo = function (raiz) {
        if (raiz.ref.esq.ref.ref == null) {
            return raiz;
        } else
            return this.maisEsquerdo(raiz.ref.esq);
    };

    this.getSucessor = function (raiz) {
        return this.maisEsquerdo(raiz.ref.dir);
    };

    this.remove = function (value) {
        this.remocao2(this.raiz, value);
        this.size--;
    };
}

(function () {
    var collection = new BST();
    var nullpointer = null;
        
    organizar = function() {
        var selected = document.getElementById("organizar_select").value;
        if(selected === "simetrico") {
            organizarSimetrico(2000);
        } else if(selected === "reduzido") {
            organizarEspacoReservado(2000);
        }
    };

    var
    setInitial = function(elId,key){
        $("span.initial").remove();
        if(key) {
            $("#"+elId).append("<span class='initial'>Raiz</span>");
        }
    },
    setFinalRight = function(elId,key){
        $("#"+elId).find("span.finalright").remove();
        if(key) {
            $("#"+elId).append("<span class='finalright'></span>");
        }
    },
    setFinalLeft = function(elId,key){
        $("#"+elId).find("span.finalleft").remove();
        if(key) {
            $("#"+elId).append("<span class='finalleft'></span>");
        }
    },
    organizarEspacoReservado = function(time){

        var list_ordem = [];

        var preordem = function(no, altura){
            if (no.ref.esq.ref.ref) {
                preordem(no.ref.esq, altura + 1);
            }
            list_ordem.push({no: no, altura: altura});
            if (no.ref.dir.ref.ref) {
                preordem(no.ref.dir, altura + 1);
            }
        };

        preordem(collection.raiz, 0);
        var sizeNode = 40;
        var width = parseInt($("#main").width()) - 500;
        var total = list_ordem.length;
        var iniLeft = (width / 2) - (total * sizeNode) / 2;
        var offsetTop = 125;
        var offsetY = 75;
        if (iniLeft < 0) {
            iniLeft = 0;
        }
        var i = 0;
        while (list_ordem.length) {
            var data = list_ordem.shift();
            Plumb.moveTo(data.no.ref.id, iniLeft + i * sizeNode, offsetTop + offsetY * data.altura, 2000);
            i++;
        }

    },
    organizarSimetrico = function (time) {

        var width = parseInt($("#main").width()) - 500;
        var offsetTop = 125;
        var offsetY = 75;
        var no = collection.raiz;
        var passos = [];
        var maxlvl = 0;
        var inundarlvl = function (raiz, lvl) {
            if (raiz.ref.ref !== null) {
                if (raiz.ref.esq.ref.ref !== null) {
                    inundarlvl(raiz.ref.esq, lvl + 1);
                }
                if (maxlvl < lvl)
                    maxlvl = lvl;
                if (raiz.ref.dir.ref.ref !== null) {
                    inundarlvl(raiz.ref.dir, lvl + 1);
                }
            }
        };
        inundarlvl(no, 0);
        width = Math.max(Math.pow(2, maxlvl) * 40, width);

        var inundar = function (raiz, lvl) {
            if (raiz.ref.ref !== null) {
                if (raiz.ref.esq.ref.ref !== null) {
                    passos[lvl] = 0;
                    inundar(raiz.ref.esq, lvl + 1);
                }
                var maxchunks = Math.pow(2, lvl);
                var sizechunk = width / maxchunks;

                var top = offsetTop + offsetY * lvl;
                var pos = 0;
                for (var i = 0; i < lvl; i++) {
                    pos += passos[i] * Math.pow(2, lvl - i - 1);
                }

                var left = sizechunk * pos + (sizechunk / 2 - 20);

                Plumb.moveTo(raiz.ref.id, left, top, time);

                if (raiz.ref.dir.ref.ref !== null) {
                    passos[lvl] = 1;
                    inundar(raiz.ref.dir, lvl + 1);
                }
            }
        };
        inundar(no, 0);
    },

    animationAdd = function (info) {
        UI.lock();
        StepRecord.start();
        setFinalLeft(info.id,true);
        setFinalRight(info.id,true);
        StepRecord.add("Estado Inicial");
        var pai = null;
        var raiz = collection.raiz;
        var pos = {left: 3 * window.innerWidth / 8, top: 75};
        var i = 0;
        var j = 0;
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        timeout( function(){
            StepRecord.add("Busca inicia na raiz da árvore");
        },2000);
        while (raiz.ref.ref != null) {
            highlighter.clear(2000 * i);
            highlighter.line(0, 10 + 2000 * i);
            pos = {left: parseInt(raiz.ref.d.style.left), top: parseInt(raiz.ref.d.style.top)};
            Plumb.moveTo(info.id, pos.left, pos.top + 40, 2000);
            
            pai = raiz;

            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                timeout( function(){
                    StepRecord.add("Busca continua para subárvore da esquerda");
                },(i+2)*2000);
                raiz = raiz.ref.esq;
                highlighter.line(2, 600 + 2000 * i);
                highlighter.clear(1100 + 2000 * i);
                highlighter.lineGreen(3, 1200 + 2000 * i);
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                timeout( function(){
                    StepRecord.add("Busca continua para subárvore da direita");
                },(i+2)*2000);
                raiz = raiz.ref.dir;
                highlighter.lineRed(2, 500 + 2000 * i);
                highlighter.line(4, 1000 + 2000 * i);
                highlighter.clear(1400 + 2000 * i);
                highlighter.lineGreen(5, 1500 + 2000 * i);
            } else {
                highlighter.line(6, 599 + 2000 * i);
                highlighter.lineRed(2, 600 + 2000 * i);
                highlighter.lineRed(4, 600 + 2000 * i);
                highlighter.line(7, 1200 + 2000 * i);
                highlighter.clear(2000 + 2000 * i);
                timeout( function() {
                    StepRecord.add("Busca encerra e elemento já estava inserido");
                    Plumb.fadeOut(info.id, 2000, function(){
                        UI.unlock();
                        timeout(function() {
                            StepRecord.end();
                            $("#" + info.id).remove();
                            window.Eprogramada.nextQueue();
                        }, 2000);
                    });
                }, (2000 * i + 2000));
                return;
            }
            i++;
            j++;
        }

        highlighter.clear(2000 * i);
        highlighter.lineRed(0, 500 + 2000 * i);
        highlighter.line(9, 1000 + 2000 * i);
        highlighter.line(11, 1500 + 2000 * i);
        highlighter.line(12, 2000 * (i + 1));
        highlighter.clear(2000 * (i + 1) + 1000);
        timeout(function() {
            collection.insere(info);
            organizar();
            timeout( function() {
                StepRecord.add("Busca se encerra pois elemento é nulo");
                if (pai != null) {
                    connectDisc(pai, info);
                }
                if(pai == null) {
                    setInitial(info.id, true);
                    StepRecord.add("Novo elemento se torna o nó raiz da árvore");
                }
                $(nullpointer.d).remove();
                StepRecord.end();
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 2000);
        }, i * 2000);

    },
    animationSearch = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var raiz = collection.raiz;
        var pos = {left: window.innerWidth / 2, top: 75};
        var j = 0;
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        timeout( function(){
            StepRecord.add("Busca inicia na raiz da árvore");
        },2000);
        while (raiz.ref.ref != null) {
            var atual = 2000 * j;
            highlighter.clear(atual);
            highlighter.line(0, 10 + atual);
            pos = {left: parseInt(raiz.ref.d.style.left), top: parseInt(raiz.ref.d.style.top)};
            Plumb.moveTo(info.id, pos.left, pos.top + 40, 2000);

            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                timeout( function(){
                    StepRecord.add("Busca continua para subárvore da esquerda");
                },(j+2)*2000);
                highlighter.line(2, 600 + atual);
                highlighter.clear(1200 + atual);
                highlighter.lineGreen(3, 1200 + atual);
                raiz = raiz.ref.esq;
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                timeout( function(){
                    StepRecord.add("Busca continua para subárvore da direita");
                },(j+2)*2000);
                raiz = raiz.ref.dir;
                highlighter.line(4, 500 + atual);
                highlighter.lineRed(2, 500 + atual);
                highlighter.clear(1000 + atual);
                highlighter.lineGreen(5, 1000 + atual);
            } else {
                timeout( function(){
                    StepRecord.add("Busca encerrada e elemento foi encontrado");
                },(j+1)*2000);
                
                highlighter.line(6, 500 + atual);
                highlighter.lineRed(2, 500 + atual);
                highlighter.lineRed(4, 500 + atual);
                highlighter.line(7, 1000 + atual);
                highlighter.clear(2000 + atual);
                break;
            }
            j++;

        }
        if (raiz.ref.ref == null) {
            timeout(function(){
                StepRecord.add("Busca encerrada e elemento não foi encontrado");
            },(j+1)*2000);
            var atual = 2000 * j;
            highlighter.clear(atual);
            highlighter.line(9, 500 + atual);
            highlighter.lineRed(0, 500 + atual);
            highlighter.line(10, 1000 + atual);
            highlighter.clear(2000 + atual);
        }
        timeout( function() {
            Plumb.fadeOut(info.id, 1000);
            if (raiz.ref.ref != null) {
                Plumb.blink(raiz.ref.id,6000,function(){
                    StepRecord.end();
                    $("#" + info.id).remove();
                    UI.unlock();
                });
            } else {
                timeout( function() {
                    StepRecord.end();
                    $("#" + info.id).remove();
                    UI.unlock();
                }, 1200);
            }
        }, (j+1) * 2000 + 1000);

    },
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var value = info.valor;
        var raiz = collection.raiz;
        var pai = null;
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        var pos = {left: window.innerWidth / 2, top: 75};
        var j = 0;
        timeout( function(){
           StepRecord.add("Busca inicia na Raiz da Árvore");
        },2000);
        while (raiz.ref.ref != null) {
        
            pos = {left: parseInt(raiz.ref.d.style.left), top: parseInt(raiz.ref.d.style.top)};
            Plumb.moveTo(info.id, pos.left, pos.top + 40, 2000);
            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                pai = raiz;
                raiz = raiz.ref.esq;
                highlighter.line(0,(j+1)*2000 - 1000);
                highlighter.line(4,(j+1)*2000 - 500);
                highlighter.lineRed(2,(j+1)*2000 - 500);
                highlighter.clear((j+1)*2000);
                highlighter.lineGreen(5,(j+1)*2000);  
                timeout( function(){
                   StepRecord.add("Busca continua para subárvore da esquerda");
                },(j+2)*2000);
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                pai = raiz;
                raiz = raiz.ref.dir;
                highlighter.line(0,(j+1)*2000 - 1000);
                highlighter.line(2,(j+1)*2000 - 500);
                highlighter.clear((j+1)*2000);
                highlighter.lineGreen(3,(j+1)*2000);
                timeout( function(){
                   StepRecord.add("Busca continua para subárvore da direita");
                },(j+2)*2000);
            } else {
                highlighter.line(7,(j+1)*2000 - 1000);
                highlighter.lineRed(0,(j+1)*2000 - 1000);
                highlighter.line(9,(j+1)*2000);
                highlighter.line(10,(j+1)*2000 + 1000);
                break;
            }
            j++;
        }

        if (raiz.ref.ref == null) { //elemento não encontrado
            timeout( function() {
                highlighter.clear(0);
                highlighter.lineRed(0,0);
                highlighter.lineRed(7,0);
                Plumb.fadeOut(info.id,2000,function(){
                    StepRecord.add("Busca se encerra pois elemento é nulo e elemento não foi encontrado");
                    highlighter.clear(0);
                    UI.unlock();
                    StepRecord.end();
                    $("#" + info.id).remove();
                    window.Eprogramada.nextQueue();
                });
            }, (j+1) * 2000);
            return;
        }
        timeout( function() { //elemento encontrado
            Plumb.moveTo(info.id, pos.left, pos.top, 500);
            StepRecord.add("Busca se encerra pois elemento foi encontrado");
            Plumb.fadeOut(info.id,1000);
            var obj = $("#" + raiz.ref.id);
            var i = 0;
            if (raiz.ref.dir.ref.ref !== null && raiz.ref.esq.ref.ref !== null) { //procura por sucessor
                highlighter.line(15,10);
                highlighter.lineRed(13,10);
                highlighter.lineRed(11,10);
                highlighter.line(17,1000);
                highlighter.line(18,2000);
                timeout( function(){
                    var discsuc = createDiscO(parseInt(raiz.ref.d.style.left), parseInt(raiz.ref.d.style.top));
                    var sucessor = raiz.ref.dir;
                    var paisucessor = raiz;
                    timeout( function(){
                        StepRecord.add("Busca pelo sucessor começa na subárvore a direita");
                    },2000);
                    while(sucessor.ref.ref != null) {
                        console.log(sucessor);
                        pos = {left: parseFloat(sucessor.ref.d.style.left), top: parseFloat(sucessor.ref.d.style.top)};
                        Plumb.moveTo(discsuc.id, pos.left, pos.top, 2000);
                        i++;
                        if(sucessor.ref.esq.ref.ref != null) {
                            highlighter.line(19,i*2000 - 1000);
                            highlighter.line(20,i*2000);
                            paisucessor = sucessor;
                            sucessor = sucessor.ref.esq;
                            timeout( function(){
                                StepRecord.add("Busca pelo sucessor começa na subárvore a esquerda");
                            },(i+1)*2000);
                        } else {
                            highlighter.line(21,i*2000 - 1000);
                            highlighter.line(22,i*2000);
                            highlighter.line(23,i*2000 + 1000);
                            highlighter.line(25,i*2000 + 2000);
                            break;
                        }
                    }
                    timeout( function(){
                        StepRecord.add("Busca pelo sucessor encerra pois não possui mais elementos á esquerda");
                        Plumb.fadeOut(discsuc.id,1000);
                        var idsucessor = sucessor.ref.id;
                        var id = raiz.ref.id;
                        Plumb.blink(idsucessor,4000);
                        Plumb.blink(id,4000,function() {
                            obj.find(".itemValue").html(sucessor.ref.value);
                            pai = paisucessor;
                            raiz = sucessor;
                            if (raiz.ref.dir.ref.ref === null && raiz.ref.esq.ref.ref === null){
                                disconnectDisc(pai, raiz, null);
                            } else {
                                if(raiz.ref.dir.ref.ref !== null){
                                    var dir = raiz.ref.dir;
                                    disconnectDisc(pai, raiz, dir);
                                } else if(raiz.ref.esq.ref.ref !== null) {
                                    var esq = raiz.ref.esq;
                                    disconnectDisc(pai, raiz, esq);
                                }
                            }
                            StepRecord.add("Elemento a ser removido recebe o valor do sucessor, e o sucessor é removido");
                            timeout( function() {
                                $("#"+raiz.ref.id).remove();
                                collection.remove(value);
                                organizar();
                                highlighter.clear(0);
                                StepRecord.end();
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            }, 1000);
                        });
                    },2000*(i+1));
                },2000);
            } else {
                if (raiz.ref.dir.ref.ref === null){
                    highlighter.line(11, 10);
                    highlighter.line(12,1000);
                } else if (raiz.ref.esq.ref.ref === null) {
                    highlighter.line(13,10);
                    highlighter.lineRed(11, 10);
                    highlighter.line(14,1000);
                }

                highlighter.line(25, 2000);
                timeout( function(){
                    if (raiz.ref.dir.ref.ref === null && raiz.ref.esq.ref.ref === null){
                        
                        if (pai != null) {
                            disconnectDisc(pai, raiz, null);
                        } else {
                            createDiscNull();
                        }
                        StepRecord.add("Como o elemento a ser removido não possui filhos, basta desalocá-lo");
                    } else {
                        if(raiz.ref.dir.ref.ref !== null){
                            var dir = raiz.ref.dir;
                            disconnectDisc(pai, raiz, dir);
                        } else if(raiz.ref.esq.ref.ref !== null) {
                            var esq = raiz.ref.esq;
                            disconnectDisc(pai, raiz, esq);
                        }
                        if(collection.raiz === raiz){
                            setInitial(dir.ref.id,true);
                        }
                        StepRecord.add("Como o elemento possui somente um filho, basta o pai aponta para o filho");

                    }
                },1000);
                Plumb.blink(raiz.ref.id,6000,function() {
                    $("#"+raiz.ref.id).remove();
                    collection.remove(value);
                    organizar();
                    highlighter.clear(0);
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                });
            }

            timeout(function() {
                $("#" + info.id).remove();
            }, 1500);
        }, (j+2) * 2000);

    },
    runAnimation = function(list,output) {
        UI.lock();

        var index = 0;

        rec = function() {
            timeout( function() {
                if(index !== list.length){
                    list[index](output, 2000);
                    index++;
                    rec();
                } else {
                    $(".dinamicSmallDotSucessor").remove();
                    output.showCloseBtn();
                    UI.unlock();
                }
            },2000);
        };

        rec();
    },
    
    compileAnimationEmOrdem = function(raiz,list) {
        var disc = createDiscO(parseFloat($(raiz.ref.d).position().left),parseFloat($(raiz.ref.d).position().top));
        disc.d.style.display = "none";
        list.push(function() {
            disc.d.style.display = "block";
        });
        
        if(raiz.ref.esq.ref.ref!==null) {
            compileAnimationEmOrdem(raiz.ref.esq,list);
        }
        
        list.push(function(output,time) {
            disc.d.style.borderColor = "#FC0";
            timeout( function() {
                output.print(raiz.ref.value,raiz.ref.id);
            }, time / 2.0);
            timeout( function() {
                disc.d.style.borderColor = "#000";
            }, time);
        });

        if(raiz.ref.dir.ref.ref!==null) {
            compileAnimationEmOrdem(raiz.ref.dir,list);
        }
        
        list.push(function() {
            disc.d.style.display = "none";
        });
    },
    
    compileAnimationPreOrdem = function(raiz,list) {
        var disc = createDiscO(parseFloat($(raiz.ref.d).position().left),parseFloat($(raiz.ref.d).position().top));

        disc.d.style.display = "none";
        list.push(function() {
            disc.d.style.display = "block";
        });
        
        list.push(function(output,time) {
            disc.d.style.borderColor = "#FC0";
            timeout( function() {
                output.print(raiz.ref.value,raiz.ref.id);
            }, time / 2.0);
            timeout( function() {
                disc.d.style.borderColor = "#000";
            }, time);
        });
        
        if(raiz.ref.esq.ref.ref!==null) {
            compileAnimationPreOrdem(raiz.ref.esq,list);
        }

        if(raiz.ref.dir.ref.ref!==null) {
            compileAnimationPreOrdem(raiz.ref.dir,list);
        }
        
        list.push(function() {
            disc.d.style.display = "none";
        });

    },
    compileAnimationPosOrdem = function(raiz,list) {
        var disc = createDiscO(parseFloat($(raiz.ref.d).position().left),parseFloat($(raiz.ref.d).position().top));
        disc.d.style.display = "none";
        list.push(function() {
            disc.d.style.display = "block";
        });
        
        if(raiz.ref.esq.ref.ref!==null) {
            compileAnimationPosOrdem(raiz.ref.esq,list);
        }

        if(raiz.ref.dir.ref.ref!==null) {
            compileAnimationPosOrdem(raiz.ref.dir,list);
        }
        
        list.push(function(output,time) {
            disc.d.style.borderColor = "#FC0";
            timeout( function(){
                output.print(raiz.ref.value,raiz.ref.id);
            }, time / 2.0);
            timeout( function(){
                disc.d.style.borderColor = "#000";
            }, time);
        });
        
        list.push(function() {
            disc.d.style.display = "none";
        });
        
    },
    compileAnimationNivel = function(topo, list) {

        var pilha = [];
        pilha.push(topo);

        do{
            var novapilha = [];
            for (var i = 0; i < pilha.length; i++) {
                const raiz = pilha[i];
                const disc = createDiscO(parseFloat($(raiz.ref.d).position().left),parseFloat($(raiz.ref.d).position().top));
                disc.d.style.display = "none";
                list.push(function() {
                    disc.d.style.display = "block";
                });
                list.push(function(output,time) {
                    disc.d.style.borderColor = "#FC0";
                    timeout( function(){
                        output.print(raiz.ref.value,raiz.ref.id);
                    }, time / 2.0);
                    timeout( function(){
                        disc.d.style.borderColor = "#000";
                    }, time);
                });
                var esq = raiz.ref.esq;
                var dir = raiz.ref.dir;
                if (esq.ref.ref !== null) {
                    novapilha.push(esq);
                }
                if (dir.ref.ref !== null) {
                    novapilha.push(dir);
                }
            }
            pilha = novapilha;
        } while(novapilha.length !== 0);
    },
    prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: true, anchor: "Top"});
    },
    prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: false, anchor: "Top"});
    },
    prepare3 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: true, anchor: [1, 0.8, 0, -1]});
    },
    prepare4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: false, anchor: [0, 0.8, 0, -1]});
    },
    connectDisc = function (pai, elem) {
        if (pai != null) {
            if (parseInt(pai.ref.value) < parseInt(elem.valor)) {
                Plumb.conectar(prepare3(pai.ref.id), prepare(elem.id),"direita");
                setFinalRight(pai.ref.id,false);
                StepRecord.add("Instância-se o nó para que o pai á esquerda aponte para o novo elemento");

            } else {
                Plumb.conectar(prepare4(pai.ref.id), prepare2(elem.id),"esquerda");
                setFinalLeft(pai.ref.id,false);
                StepRecord.add("Instância-se o nó para que o pai á direita aponte para o novo elemento");
            }
        }
    },
    disconnectDisc = function (pai, filho, neto) {
        if (neto != null) {
            Plumb.desconectar({target: filho.ref.id});
            Plumb.desconectar({target: neto.ref.id});
            if(pai != null) {
                if (parseInt(pai.ref.value) < parseInt(neto.ref.value)) {
                    Plumb.conectar(prepare3(pai.ref.id), prepare(neto.ref.id),"direita");
                } else {
                    Plumb.conectar(prepare4(pai.ref.id), prepare2(neto.ref.id),"esquerda");
                }
            }
        } else {
            if(pai.ref.esq == filho) {
                setFinalLeft(pai.ref.id,true);
            } else if(pai.ref.dir == filho) {
                setFinalRight(pai.ref.id,true);
            }
            Plumb.desconectar({target: filho.ref.id});
            
        }
    },
    createDiscNull = function() {
        var width = parseInt($("#main").width()) - 500;
        nullpointer = Element.createElement(
                {className: "dinamicSmallDotNull",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: (width/2 - 20)+"px",
                    top: "110px",
                    title: "Lista",
                    idParent: "main"});
        setInitial(nullpointer.id,true);
    },
    createDiscO = function (left,top) {
        var elem = Element.createElement(
                {className: "dinamicSmallDotSucessor",
                    left: left+"px",
                    innerHTML: "",
                    top: top+"px",
                    idParent: "main"});
        return elem;
    },
    createDisc = function (value) {
        var elem = Element.createElement(
                {className: "dinamicSmallDot altColor",
                    innerHTML: "<span class='itemValue altColorTitle' style='top: 7px'>" + value + "</span>",
                    left: "100px",
                    top: "75px",
                    title: value,
                    idParent: "main"});
        elem.valor = value;
        return elem;
    },
    createSelectTypeOrganizar = function(){
                
        var form = document.createElement("form");
        form.className = "pure-form formmain";

        var label = document.createElement("p");
        label.innerHTML = "Tipo de Organização";

        var select = document.createElement("select");
        select.id = "organizar_select";

        var option_simetrico = document.createElement("option"); 
        option_simetrico.value = "simetrico";
        option_simetrico.innerHTML = "Simétrico";
        select.appendChild(option_simetrico);

        var option_curto = document.createElement("option"); 
        option_curto.value = "reduzido";
        option_curto.innerHTML = "Reduzido";
        select.appendChild(option_curto);

        form.appendChild(label);
        form.appendChild(select);

        document.getElementById("main").appendChild(form);

        select.onchange = organizar;

    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc, this.removeValue, this.searchValue);
            UI.setProperty("primaryColorProperty", true);
            collection.inicia();
            $("#main").css("padding-right","400px");
            $("#pre-ordem").click(this.preordem);
            $("#pos-ordem").click(this.posordem);
            $("#em-ordem").click(this.emordem);
            $("#altura").click(this.nivel);
            UI.InitInterface(this.search, this.elementToString);
            createDiscNull();
            createSelectTypeOrganizar();
        },
        elementToString: function (id) {
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.value};
                result._vizinhos = [];
                if (element.esq.ref.ref !== null) {
                    var nextId = (element.esq.ref.id * 1).toString(16).toUpperCase();
                    result.esquerda = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.esquerda = {id:element.esq.ref.id,tooltipdir:"e"};
                } else {
                    result.esquerda = 'nulo';
                }
                if (element.dir.ref.ref !== null) {
                    var nextId = (element.dir.ref.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.direita = {id:element.dir.ref.id,tooltipdir:"w"};
                } else {
                    result.direita = 'nulo';
                }
                return result;
            }
            return false;
        },
        emordem:function(){
            if(collection.length()!==0){
                UI.subtitle("Executando varredura Em-ordem");
                var output = Element.createOutputStack("Varredura Em-ordem");
                var list = [];
                compileAnimationEmOrdem(collection.raiz,list);
                runAnimation(list,output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        preordem: function(){
            if (collection.length() !== 0) {
                UI.subtitle("Executando varredura Pré-ordem");
                var output = Element.createOutputStack("Varredura Pré-ordem");
                var list = [];
                compileAnimationPreOrdem(collection.raiz,list);
                runAnimation(list,output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        posordem: function() {
            if (collection.length() !== 0) {
                UI.subtitle("Executando varredura Pós-ordem");
                var output = Element.createOutputStack("Varredura Pós-ordem");
                var list = [];
                compileAnimationPosOrdem(collection.raiz,list);
                runAnimation(list,output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        nivel: function(){
            
            if (collection.length() !== 0) {
                var output = Element.createOutputStack("Varredura Pós-ordem");
                UI.subtitle("Executando varredura em Nível");
                UI.lock();
                var list = [];
                compileAnimationNivel(collection.raiz,list);
                runAnimation(list,output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        search: function () {
            var value = UI.value("valor");
            if (value !== "") {
                return $(".dinamicSmallDot[title='" + value + "']").length !== 0;
            }
            return false;
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var value = UI.value('valor', "Insira apenas números inteiros");
                if (value !== '') {
                    UI.subtitle("Inserindo o valor <b>" + value + "</b>");
                    var info = createDisc(value);
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
            var value = UI.value('valor', "Insira apenas números inteiros");

            if (value !== "") {
                UI.subtitle("Removendo o valor <b>" + value + "</b>");
                var info = createDisc(value);
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value('valor', "Insira apenas números inteiros");
            value = $.trim(value);

            if (value !== "") {
                UI.subtitle("Buscando o valor <b>" + value + "</b>");
                var info = createDisc(value);
                animationSearch(info);
            }
        }

    };
})();

