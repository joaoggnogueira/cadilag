jsPlumb.bind("ready", function () {
    Cadilag.init();
});

const cor = {
    preto: 0,
    vermelho: 1
};

function RB() {

    this.raiz = null;
    this.queue = null;

    RB.criaNo = function () {
        return {ref: null, id: null, value: null, esq: null, dir: null, cor: cor.preto};
    };

    RB.criaRef = function () {
        return new nodeRB(); //nó sentinela
    };

    function nodeRB(refAddress) {

        if (refAddress === undefined) {
            refAddress = null;
        }

        this.ref = refAddress;
        //**
        this.ehPreto = function () {
            return (this.ref.ref === null || this.ref.cor === cor.preto);
        };
        this.ehVermelho = function () {
            return this.ref.cor === cor.vermelho;
        };
        this.ehNull = function () {
            return this.ref.ref === null;
        };
        /**
         * @returns {nodeRB}
         */
        this.dir = function () {
            return this.ref.dir;
        };
        /**
         * @returns {nodeRB}
         */
        this.esq = function () {
            return this.ref.esq;
        };
        this.hasDir = function () {
            return !this.ref.dir.ehNull();
        };
        this.hasEsq = function () {
            return !this.ref.esq.ehNull();
        };
        this.value = function () {
            return this.ref.value;
        };
        this.dom = function () {
            return this.ref.ref;
        };
        this.id = function () {
            return this.ref.id;
        };
        this.positionTop = function () {
            return parseFloat(this.ref.ref.style.top);
        };
        this.positionLeft = function () {
            return parseFloat(this.ref.ref.style.left);
        };
        this.position = function () {
            return {
                left: this.positionLeft(),
                top: this.positionTop()
            };
        };

        this.alloc = function (info) {
            if (info) {
                this.ref = RB.criaNo();
                var noEsq = RB.criaRef();
                var noDir = RB.criaRef();
                noEsq.ref = RB.criaNo();
                noDir.ref = RB.criaNo();
                this.ref.ref = info.d;
                this.ref.d = info.d;
                this.ref.id = info.id;
                this.ref.value = info.valor;
                this.ref.esq = noEsq;
                this.ref.dir = noDir;
                this.ref.cor = cor.vermelho;
                Element.bind(this.ref, this.ref.id);
            } else {
                console.err("Elemento DOM não encontrado");
                alert("Elemento DOM não encontrado");
            }
        };
    }
    ;

    function StackRB() {
        this.stack = [];
        this.updatedno = null;
        this.no = function () {
            return this.stack[this.stack.length - 1];
        };
        this.pai = function () {
            return this.stack[this.stack.length - 2];
        };
        this.avo = function () {
            return this.stack[this.stack.length - 3];
        };
        this.bisavo = function () {
            return this.stack[this.stack.length - 4];
        };
        this.empty = function () {
            return this.stack.length === 0;
        };
        this.noremoved = function (no) {
            if (no) {
                this.updatedno = no;
            } else {
                return this.updatedno;
            }
        };
        this.tio = function () {
            var avo = this.avo();
            if (avo.dir() === this.pai()) {
                return avo.esq();
            } else {
                return avo.dir();
            }
        };
        this.irmao = function () {
            var pai = this.pai();
            if (pai.dir() === this.noremoved()) {
                return pai.esq();
            } else {
                return pai.dir();
            }
        };
        this.joelhoDireito = function () {
            return this.avo().dir() === this.pai() && this.pai().esq() === this.no();
        };
        this.joelhoEsquerdo = function () {
            return this.avo().esq() === this.pai() && this.pai().dir() === this.no();
        };
        this.rotate = function () {
            var no = this.pop();
            var pai = this.pop();
            this.push(no);
            this.push(pai);
        };
        this.rotatePai = function () {
            var no = this.pop();
            var pai = this.pop();
            this.push(no);
            this.push(pai);
        };
        /**
         * @param {nodeRB} elem
         */
        this.push = function (elem) {
            return this.stack.push(elem);
        };
        /*
         * @returns {nodeRB}
         */
        this.pop = function () {
            return this.stack.pop();
        };
    }


    this.inicia = function () {
        this.raiz = RB.criaRef();
        this.raiz.ref = RB.criaNo();
        this.id_rotacao = 0;
        this.queue = [];
    };

    /**
     * Retorna se a árvore (a partir do no) está balanceada no número de nós pretos
     * @param {nodeRB} no
     * @returns {Number} Retorna Zero caso a árvore está balanceada,
     *  um número positivo caso esteja desbalanceada a direita, 
     *  e um número negativo caso esteja desbalanceado a esquerda.
     */
    this.verificarBlackHeight = function (no) {
        if (no.ehNull()) {
            return 0;
        } else {
            return this.blackHeight(no.dir()) - this.blackHeight(no.esq());
        }
    };

    this.blackHeight = function (no) { //calcula total de nós pretos a partir de no
        if (!no.ehNull()) {
            return (no.ehPreto() ? 1 : 0) + this.contarPretos(no.dir()) + this.contarPretos(no.ref.esq);
        } else {
            return 0;
        }
    };

    this.insere = function (info) {
        var stack = new StackRB();
        var leitor = this.raiz;

        while (!leitor.ehNull()) {
            stack.push(leitor);
            if (parseInt(leitor.value()) < parseInt(info.valor)) {
                leitor = leitor.dir();
            } else if (parseInt(leitor.value()) > parseInt(info.valor)) {
                leitor = leitor.esq();
            } else if (parseInt(leitor.value()) === parseInt(info.valor)) {
                return false;
            }
        }

        leitor.alloc(info);
        stack.push(leitor);
        return stack;
        //this.case1(stack);
    };


    /**
     * @param {nodeRB} pai //alguns autores não utilizam, e buscam pelo pai
     * @param {nodeRB} no
     */
    this.rotacaoEsquerda = function (pai, no) {
        var q = no.dir();
        var temp = q.esq();

        q.ref.esq = no;
        no.ref.dir = temp;
        if (pai) {
            if (pai.ref.dir === no) {
                pai.ref.dir = q;
            } else {
                pai.ref.esq = q;
            }
        } else {
            this.raiz = q;
        }
    };

    /**
     * @param {nodeRB} pai //alguns autores não utilizam, e buscam pelo pai
     * @param {nodeRB} no
     */
    this.rotacaoDireita = function (pai, no) {
        var q = no.esq();
        var temp = q.dir();

        q.ref.dir = no;
        no.ref.esq = temp;

        if (pai) {
            if (pai.ref.dir === no) {
                pai.ref.dir = q;
            } else {
                pai.ref.esq = q;
            }
        } else {
            this.raiz = q;
        }
    };

    this.remove = function (value) {

        var stack = new StackRB();
        var leitor = this.raiz;

        while (!leitor.ehNull() && parseInt(leitor.value()) !== parseInt(value)) {
            stack.push(leitor);
            if (parseInt(leitor.value()) < parseInt(value)) {
                leitor = leitor.dir();
            } else if (parseInt(leitor.value()) > parseInt(value)) {
                leitor = leitor.esq();
            }
        }

        if (leitor.ehNull()) {
            return null;
        } else {
            var pop = null;

            if (leitor.ref.dir.ref.ref === null) {
                pop = new nodeRB(leitor.ref);
                leitor.ref = leitor.ref.esq.ref;
                stack.noremoved(leitor);
            } else if (leitor.ref.esq.ref.ref === null) {
                pop = new nodeRB(leitor.ref);
                leitor.ref = leitor.ref.dir.ref;
                stack.noremoved(leitor);
            } else {
                stack.push(leitor);
                var sucessor = leitor.ref.dir;
                while (sucessor.ref.esq.ref.ref !== null) {
                    stack.push(sucessor);
                    sucessor = sucessor.ref.esq;
                }

                leitor.ref.value = sucessor.ref.value;
                pop = new nodeRB(sucessor.ref);
                sucessor.ref = sucessor.ref.dir.ref;
                stack.noremoved(sucessor);
            }

            stack.push(pop);
            return stack;
        }

    };

}

(function () {
    var collection = new RB();
    var nullpointer = null;

    organizar = function () {
        if ($("#organizar_select").hasClass("expand")) {
            organizarSimetrico(2000);
        } else {
            organizarEspacoReservado(2000);
        }
    };

    getCollection = function () {
        return collection;
    };
    rotateLeft = function () {
        spanRotateLeft(collection.raiz);
    };
    rotateRight = function () {
        spanRotateRight(collection.raiz);
    };

    var
            updateInitial = function () {
                $("span.initial").remove();
                $("#" + collection.raiz.ref.id).append("<span class='initial'>Raiz</span>");
            },
            setFinalRight = function (elId, key) {
                $("#" + elId).find("span.finalright").remove();
                if (key) {
                    $("#" + elId).append("<span class='finalright'></span>");
                }
            },
            setFinalLeft = function (elId, key) {
                $("#" + elId).find("span.finalleft").remove();
                if (key) {
                    $("#" + elId).append("<span class='finalleft'></span>");
                }
            },
            organizarEspacoReservado = function (time) {

                if (time === undefined) {
                    time = 2000;
                }

                var list_ordem = [];
                if (collection.raiz.ehNull()) {
                    return;
                }
                var preordem = function (no, altura) {
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
                    Plumb.moveTo(data.no.ref.id, iniLeft + i * sizeNode, offsetTop + offsetY * data.altura, time);
                    i++;
                }

            },
            organizarSimetrico = function (time) {

                if (time === undefined) {
                    time = 2000;
                }

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
            /**
             * ponto médio (2d) entre um nó e seus filhos
             * @param {nodeRB} no
             * @returns {soma}
             */
            mean = function (no) {
                var total = 1;
                var soma = no.position();

                if (no.hasEsq()) {
                    soma.top += no.esq().positionTop();
                    total++;
                }
                if (no.hasDir()) {
                    soma.top += no.dir().positionTop();
                    total++;
                }

                soma.top = soma.top / total;
                return soma;
            },
            spanRotateLeft = function (no) {
                var pos = mean(no);
                var span = document.createElement("div");
                span.className = "rotate-span";
                span.id = "rotate-left-span";
                span.style.left = pos.left + "px";
                span.style.top = pos.top + "px";

                span.style.opacity = 0;
                document.getElementById("main").appendChild(span);
                Plumb.fadeIn(span.id, 200);
                timeout(function () {
                    Plumb.fadeOut(span.id, 200, function () {
                        $(span).remove();
                    });
                }, 1800);
            },
            spanRotateRight = function (no) {
                var pos = mean(no);
                var span = document.createElement("div");
                span.className = "rotate-span";
                span.id = "rotate-right-span";
                span.style.left = pos.left + "px";
                span.style.top = pos.top + "px";

                span.style.opacity = 0;
                document.getElementById("main").appendChild(span);
                Plumb.fadeIn(span.id, 200);
                timeout(function () {
                    Plumb.fadeOut(span.id, 200, function () {
                        $(span).remove();
                    });
                }, 1800);

            },
            conectarEsquerda = function (source, target) {
                if (source.ref.esq.ref.ref !== null) {
                    setFinalLeft(source.ref.id, true);
                    Plumb.desconectarTodosCom({source: source.ref.id, target: source.ref.esq.ref.id});
                }
                if (target && target.ref.ref !== null) {
                    setFinalLeft(source.ref.id, false);
                    Plumb.conectar(prepare4(source.ref.id), prepare2(target.ref.id), "esquerda");
                }
            },
            conectarDireita = function (source, target) {
                if (source.ref.dir.ref.ref !== null) {
                    setFinalRight(source.ref.id, true);
                    Plumb.desconectarTodosCom({source: source.ref.id, target: source.ref.dir.ref.id});
                }
                if (target && target.ref.ref !== null) {
                    setFinalRight(source.ref.id, false);
                    Plumb.conectar(prepare3(source.ref.id), prepare(target.ref.id), "direita");
                }
            },
            animationRotacaoEsquerda = function (pai, no) {
                spanRotateLeft(no);
                var q = no.ref.dir;
                var temp = q.ref.esq;

                //q.ref.esq = no;
                conectarEsquerda(q, no);

                //no.ref.dir = temp;
                conectarDireita(no, temp);

                if (pai) {
                    if (pai.ref.dir === no) {
                        // pai.ref.dir = q;
                        conectarDireita(pai, q);
                    } else {
                        // pai.ref.esq = q;
                        conectarEsquerda(pai, q);
                    }
                    collection.rotacaoEsquerda(pai, no);
                } else {
                    collection.rotacaoEsquerda(pai, no);
                    updateInitial();
                }

                organizar();
            },
            animationRotacaoDireita = function (pai, no) {

                spanRotateRight(no);
                var q = no.ref.esq;
                var temp = q.ref.dir;

                //q.ref.dir = no;
                conectarDireita(q, no);

                // no.ref.esq = temp;
                conectarEsquerda(no, temp);

                if (pai) {
                    if (pai.ref.dir === no) {
                        //pai.ref.dir = q;
                        conectarDireita(pai, q);
                    } else {
                        //pai.ref.esq = q;
                        conectarEsquerda(pai, q);
                    }
                    collection.rotacaoDireita(pai, no);
                } else {
                    collection.rotacaoDireita(pai, no);
                    updateInitial();
                }

                organizar();
            },
            /**
             * Caso 1: Raiz da Árvore deve ser preta
             * @param {StackRB} stack representa o caminho
             * @param {Function} quandoEncerrar
             */
            case1_animation = function (stack, quandoEncerrar) {
                var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                highlighter.clear(10);
                StepRecord.add("<i class='fa fa-search'></i> Caso 1");
                if (stack.no() === collection.raiz) {
                    highlighter.line(21,10);
                    highlighter.lineGreen(22,1000);
                    stack.no().ref.cor = cor.preto;
                    $(stack.no().dom()).turnBlack();
                    StepRecord.add("Caso 1: Alterasse a cor da raiz para preta");
                    timeout(quandoEncerrar, 2000);
                } else { //logo possui um pai
                    highlighter.line(23,10);
                    highlighter.lineRed(21,10);
                    highlighter.lineGreen(24,1000);
                    case2_animation(stack, quandoEncerrar);
                }
            },
            /**
             * Caso 2: Se o pai do inserido for preto
             * @param {StackRB} stack representa o caminho
             * @param {Function} quandoEncerrar
             */
            case2_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                    highlighter.clear(10);
                    StepRecord.add("<i class='fa fa-search'></i> Caso 2");
                    if (stack.pai().ehVermelho()) {
                        highlighter.line(25,10);
                        highlighter.lineGreen(26,1000);
                        case3_animation(stack, quandoEncerrar); //logo possui um avo
                    } else {
                        highlighter.lineRed(25,10);
                        timeout(quandoEncerrar, 2000);
                    }
                }, 2000);
            },
            /**
             * Caso 3: Se o pai do inserido for vermelho, onde altera a cor do pai,tio e avô 
             * @param {StackRB} stack representa o caminho
             * @param {Function} quandoEncerrar
             */
            case3_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 3");
                    var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                    highlighter.clear(10);
                    var tio = stack.tio();
                    
                    if (!tio.ehNull() && tio.ehVermelho()) {
                       
                        timeout(function(){
                            $(tio.dom()).turnBlack();
                            $(stack.pai().dom()).turnBlack();
                            $(stack.avo().dom()).turnRed();
                            tio.ref.cor = cor.preto;
                            stack.pai().ref.cor = cor.preto;
                            stack.avo().ref.cor = cor.vermelho;
                            StepRecord.add("Caso 3: Alterasse cores do tio, pai e avo");
                        },500);
                        timeout(function(){
                            stack.pop();
                            stack.pop();
                        },1000);
                        timeout(function(){
                            case1_animation(stack, quandoEncerrar); //logo possui um nó, pois existe avo
                        },2000);
                        
                        highlighter.line(27,10);
                        highlighter.lines(29,31,500);
                        highlighter.lines(32,33,1000);
                        highlighter.lineGreen(34,1500);
                    } else {
                        highlighter.line(36,10);
                        highlighter.lineRed(27,10);
                        highlighter.lineGreen(37,1000);
                        case4_animation(stack, quandoEncerrar); //logo possui avo
                    }
                }, 2000);
            },
            /**
             * Caso 4: Rotações de Joelho
             * @param {StackRB} stack representa o caminho
             * @param {Function} quandoEncerrar
             */
            case4_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 4");
                    var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                    highlighter.clear(10);
                    if (stack.joelhoEsquerdo()) {
                        highlighter.line(38,10);
                        highlighter.line(40,500);
                        highlighter.line(41,1000);
                        animationRotacaoEsquerda(stack.avo(), stack.pai());
                        StepRecord.add("Caso 4: Realiza rotação a esquerda");
                        stack.rotate();
                    } else if (stack.joelhoDireito()) {
                        highlighter.line(43,10);
                        highlighter.lineRed(38,10);
                        highlighter.line(45,500);
                        highlighter.line(46,1000);
                        animationRotacaoDireita(stack.avo(), stack.pai());
                        StepRecord.add("Caso 4: Realiza rotação a direita");
                        stack.rotate();
                    }
                    highlighter.lineGreen(48,1500);
                    case5_animation(stack, quandoEncerrar);
                }, 2000);
            },
            /**
             * Caso 5
             * @param{StackRB} stack representa o caminho
             * @param {Function} quandoEncerrar
             */
            case5_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 5");
                    var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                    highlighter.clear(10);
                    highlighter.lines(49,50,10);
                    $(stack.pai().dom()).turnBlack();
                    $(stack.avo().dom()).turnRed();
                    stack.pai().ref.cor = cor.preto;
                    stack.avo().ref.cor = cor.vermelho;
                    if (stack.pai().esq() === stack.no()) {
                        highlighter.line(51,500);
                        highlighter.lineGreen(52,1000);
                        animationRotacaoDireita(stack.bisavo(), stack.avo());
                        StepRecord.add("Caso 5: Realiza rotação a direita");
                    } else {
                        highlighter.line(53,500);
                        highlighter.lineRed(51,500);
                        highlighter.lineGreen(54,1000);
                        animationRotacaoEsquerda(stack.bisavo(), stack.avo());
                        StepRecord.add("Caso 5: Realiza rotação a esquerda");
                    }
                    timeout(quandoEncerrar, 2000);
                }, 2000);
            },
            animationAdd = function (info) {
                UI.lock();
                setFinalLeft(info.id, true);
                setFinalRight(info.id, true);
                $(info.d).turnRed();
                var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
                highlighter.lines(0,2,10);
                var pai = null;
                var raiz = collection.raiz;
                var pos = {left: 500, top: 125};
                var i = 0;
                StepRecord.start();
                StepRecord.add("Estado Inicial");
                timeout(function(){
                    StepRecord.add("Varredura inicia na raiz da árvore");
                },2000);
                while (!raiz.ehNull()) {
                    pos = raiz.position();
                    Plumb.moveTo(info.id, pos.left, pos.top + 40, 2000);
                    pai = raiz;
                    highlighter.line(3,(i+1)*2000);
                    highlighter.line(5,(i+1)*2000+500);
                    if (parseInt(info.valor) < parseInt(raiz.value())) {
                        raiz = raiz.esq();
                        highlighter.line(8,(i+1)*2000+1000);
                        highlighter.lineRed(6,(i+1)*2000+1000);
                        highlighter.line(9,(i+1)*2000+1500);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-left'></i> Varredura continua para o nó-filho a esquerda");
                        },2000*(i+2));
                    } else if (parseInt(info.valor) > parseInt(raiz.value())) {
                        raiz = raiz.dir();
                        highlighter.line(6,(i+1)*2000+1000);
                        highlighter.line(7,(i+1)*2000+1500);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-right'></i>Varredura continua para o nó-filho a direita");
                        },2000*(i+2));
                    } else {
                        highlighter.line(10,(i+1)*2000+1000);
                        highlighter.lineRed(6,(i+1)*2000+1000);
                        highlighter.lineRed(8,(i+1)*2000+1000);
                        highlighter.line(11,(i+1)*2000+1500);
                        timeout(function () {
                            Plumb.fadeOut(info.id, 1000, function () {
                                StepRecord.add("Varredura encerra pois elemento já está na árvore");
                                StepRecord.end();
                                highlighter.clear(0);
                                $(info.d).remove();
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            });
                        }, 2000 * (i + 1));
                        return;
                    }
                    i++;
                }

                timeout(function () {
                    var stack = collection.insere(info);
                    highlighter.clear(10);
                    highlighter.lineRed(3,10);
                    highlighter.clear(500);
                    highlighter.lineGreen(13,500);
                    highlighter.clear(1000);
                    highlighter.lineGreen(14,1000);
                    highlighter.lineGreen(15,1500);
                    organizar();
                    timeout(function () {
                        if (pai !== null) {
                            connectDisc(pai, info);
                        }
                        StepRecord.add("Nó é alocado e inserido na árvore");
                        $(nullpointer.d).remove();
                        updateInitial();
                        case1_animation(stack, function () {
                            StepRecord.add("Verificação se encerra");
                            StepRecord.end();
                            highlighter.clear(0);
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        });
                    }, 2000);
                }, (i+1) * 2000);
            },
            animationSearch = function (info) {
                UI.lock();
                StepRecord.start();
                StepRecord.add("Estado Inicial");
                var raiz = collection.raiz;
                var j = 0;
                var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
                highlighter.lines(0,1,10);
                timeout(function(){
                    StepRecord.add("Varredura inicia na raiz da árvore");
                },2000);
                while (raiz.ref.ref !== null) {
                    Plumb.moveTo(info.id, parseFloat(raiz.ref.ref.style.left), parseFloat(raiz.ref.ref.style.top) + 40, 2000);
                    highlighter.line(2,2000*(j+1));
                    if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                        raiz = raiz.ref.esq;
                        highlighter.line(6,2000*(j+1)+500);
                        highlighter.lineRed(4,2000*(j+1)+500);
                        highlighter.line(7,2000*(j+1)+1000);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-left'></i> Varredura continua para o nó-filho a esquerda");
                        },2000*(j+2));
                    } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                        raiz = raiz.ref.dir;
                        highlighter.line(4,2000*(j+1)+500);
                        highlighter.line(5,2000*(j+1)+1000);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-right'></i> Varredura continua para o nó-filho a direita");
                        },2000*(j+2));
                    } else {
                        highlighter.line(8,2000*(j+1)+500);
                        highlighter.lineRed(4,2000*(j+1)+500);
                        highlighter.lineRed(6,2000*(j+1)+500);
                        highlighter.line(9,2000*(j+1)+1000);
                        break;
                    }
                    j++;
                }

                timeout(function () {
                    Plumb.fadeOut(info.id, 1000);
                    if (raiz.ref.ref !== null) {
                        var id = raiz.ref.id;
                        Plumb.blink(id, 6000, function () {
                            highlighter.clear(0);
                            $("#" + info.id).remove();
                            StepRecord.add("Varredura se encerra pois elemento foi encontrado");
                            StepRecord.end();
                            UI.unlock();
                        });
                    } else {
                        highlighter.clear(10);
                        highlighter.lineRed(2,10);
                        highlighter.line(11,500);
                        timeout(function () {
                            highlighter.clear(0);
                            $("#" + info.id).remove();
                            StepRecord.add("Varredura se encerra pois elemento não foi encontrado");
                            StepRecord.end();
                            UI.unlock();
                        }, 1000);
                    }
                }, j * 2000 + 2000);
            },
            animationRemove = function (info) {
                UI.lock();
                StepRecord.start();
                StepRecord.add("Estado Inicial");
                var raiz = collection.raiz;
                var pos = {left: 500, top: 75};
                var j = 0;
                var pai = null;
                var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
                highlighter.lines(0,2,10);
                timeout(function(){
                    StepRecord.add("Varredura inicia na raiz da árvore");
                },2000);
                while (raiz.ref.ref !== null) {
                   
                    pos = {left: parseInt(raiz.ref.ref.style.left), top: parseInt(raiz.ref.ref.style.top) + 40};
                    Plumb.moveTo(info.id, pos.left, pos.top, 2000);

                    if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-left'></i> Varredura continua para o nó-filho a esquerda");
                        },2000*(j+2));
                        highlighter.line(3,2000*(j+1));
                        highlighter.line(5,2000*(j+1) + 500);
                        highlighter.line(8,2000*(j+1) + 1000);
                        highlighter.lineRed(6,2000*(j+1) + 1000);
                        highlighter.line(9,2000*(j+1) + 1500);
                        pai = raiz;
                        raiz = raiz.ref.esq;
                    } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                        highlighter.line(3,2000*(j+1));
                        highlighter.line(5,2000*(j+1) + 500);
                        highlighter.line(6,2000*(j+1) + 1000);
                        highlighter.line(7,2000*(j+1) + 1500);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-right'></i> Varredura continua para o nó-filho a direita");
                        },2000*(j+2));
                        pai = raiz;
                        raiz = raiz.ref.dir;
                    } else {
                        highlighter.lineRed(3,2000*(j+1));
                        break;
                    }
                    j++;
                }

                if (raiz.ref.ref === null) { //elemento não encontrado
                    timeout(function () {
                        highlighter.clear(10);
                        highlighter.lineRed(3,10);
                        highlighter.clear(1000);
                        highlighter.line(11,1000);
                        Plumb.fadeOut(info.id, 1000, function () {
                            $("#" + info.id).remove();
                            StepRecord.add("Varredura se encerra pois elemento não foi encontrado");
                            StepRecord.end();
                            highlighter.clear(0);
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        });
                    }, 2000 * (j + 1));
                    return;
                }

                timeout(function () {
                    Plumb.fadeOut(info.id, 1000);
                    highlighter.line(13,10);
                    highlighter.line(14,500);
                    if (raiz.ref.dir.ref.ref !== null && raiz.ref.esq.ref.ref !== null) { //busca por sucessor
                        var id = raiz.ref.id;
                        var discsuc = createDiscO(parseInt(raiz.ref.ref.style.left), parseInt(raiz.ref.ref.style.top));
                        timeout(function () {
                            highlighter.lineRed(15,10);
                            highlighter.lineRed(20,10);
                            highlighter.line(25,10);
                            highlighter.line(27,500);
                            highlighter.line(28,1000);
                            highlighter.line(29,1500);
                            timeout(function(){
                                StepRecord.add("Remoção necessita de um sucessor");
                            },2000);
                            $("#" + info.id).remove();
                            var sucessor = raiz.ref.dir;
                            var paisucessor = raiz;
                            var i = 0;
                            while (sucessor.ref.ref !== null) {
                                pos = {left: parseFloat(sucessor.ref.ref.style.left), top: parseFloat(sucessor.ref.ref.style.top)};
                                Plumb.moveTo(discsuc.id, pos.left, pos.top, 2000);
                                if(i !== 0){
                                    timeout(function(){
                                        StepRecord.add("<i class='fa fa-arrow-left'></i> Busca pelo sucessor continua para o nó-filho a esquerda");
                                    },2000*(i+1));
                                }
                                highlighter.line(30,2000*(i+1) + 500);
                                highlighter.line(32,2000*(i+1) + 1000);
                                highlighter.line(33,2000*(i+1) + 1500);
                                i++;
                                if (sucessor.ref.esq.ref.ref !== null) {
                                    paisucessor = sucessor;
                                    sucessor = sucessor.ref.esq;
                                } else {
                                    break;
                                }
                            }
                            timeout(function () {
                                highlighter.line(35, 10);
                                highlighter.line(36, 1000);
                                highlighter.line(37, 2000);
                                highlighter.line(38, 2500);
                                Plumb.fadeOut(discsuc.id, 1000, function () {
                                    $("#" + discsuc.id).remove();
                                });

                                var idsucessor = sucessor.ref.id;
                                Plumb.blink(idsucessor, 4000);
                                Plumb.blink(id, 4000, function () {
                                    $("#" + id).find(".itemValue").html(sucessor.ref.value);
                                    sucessor.ref.ref = raiz.ref.ref;
                                    
                                    StepRecord.add("Busca pelo sucessor se encerra e elemento a ser removido troca de posição com o sucessor");
                                    
                                    disconnect(sucessor, paisucessor);

                                    timeout(function () {
                                        Plumb.desconectarCompletamente(sucessor.ref.id);
                                        var stack = collection.remove(info.valor);
                                        organizar();
                                        timeout(function () {
                                            updateInitial();
                                            StepRecord.add("Remove-se o sucessor");
                                            if (stack.no().ehPreto()) {
                                                highlighter.line(40,10);
                                                highlighter.line(41,500);
                                                highlighter.line(42,1000);
                                                StepRecord.add("Verificação e tratamento de balanceamento da Árvore inicia, pois o sucessor removido é preto");
                                                caseremove1_animation(stack, function () {
                                                    updateInitial();
                                                    highlighter.clear(0);
                                                    StepRecord.end();
                                                    UI.unlock();
                                                    window.Eprogramada.nextQueue();
                                                });
                                            } else {
                                                highlighter.clear(10);
                                                highlighter.lineRed(40,10);
                                                highlighter.line(42,500);
                                                StepRecord.add("Remoção se encerra pois o sucessor é vermelho, logo não precisa de verificação e tratamento de balanceamento da Árvore");
                                                StepRecord.end();
                                                timeout(function(){
                                                    highlighter.clear(0);
                                                    UI.unlock();
                                                    window.Eprogramada.nextQueue();
                                                },1000);
                                            }
                                        }, 2000);
                                    }, 1000);
                                });
                            }, 2000 * (i + 1));
                        }, 1000);
                    } else { //caso simples de remoção (sem sucessor)
                        timeout(function () {
                            if (raiz.ref.dir.ref.ref == null){
                                highlighter.line(15,10);
                                highlighter.line(17,1000);
                                highlighter.line(18,2000);
                            } else {
                                highlighter.line(20,10);
                                highlighter.lineRed(15,10);
                                highlighter.line(22,1000);
                                highlighter.line(23,2000);
                            }
                            
                            $("#" + info.id).remove();
                            var id = raiz.ref.id;
                            Plumb.blink(id, 4000, function () {
                                Plumb.fadeOut(id, 1000);
                            });
                            timeout(function () {
                                disconnect(raiz, pai);
                                Plumb.desconectarCompletamente(raiz.ref.id);
                                $("#" + raiz.ref.id).remove();
                                StepRecord.add("Remove elemento sem precisar de sucessor");
                                var stack = collection.remove(info.valor);
                                organizar();
                                timeout(function () {
                                    updateInitial();
                                    if (stack.no().ehPreto()) {
                                        highlighter.line(40,10);
                                        highlighter.line(41,500);
                                        highlighter.line(42,1000);
                                        StepRecord.add("Verificação e tratamento de balanceamento da Árvore inicia, pois o nó removido é preto");
                                        caseremove1_animation(stack, function () {
                                            updateInitial();
                                            StepRecord.end();
                                            highlighter.clear(0);
                                            UI.unlock();
                                            window.Eprogramada.nextQueue();
                                        });
                                    } else {
                                        highlighter.clear(10);
                                        highlighter.lineRed(40,10);
                                        highlighter.line(42,500);
                                        StepRecord.add("Remoção se encerra pois o elemento é vermelho, logo não precisa de verificação e tratamento de balanceamento da Árvore");
                                        StepRecord.end();
                                        timeout(function(){
                                            highlighter.clear(0);
                                            UI.unlock();
                                            window.Eprogramada.nextQueue();
                                        },1000);
                                    }
                                }, 2000);
                            }, 6000);
                        }, 1000);
                    }
                }, (j + 1) * 2000);

            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove1_animation = function (stack, quandoEncerrar) {
                timeout(function(){
                    var pai = stack.pai();
                    StepRecord.add("<i class='fa fa-search'></i> Caso 1");
                    if (pai) {
                        StepRecord.add("Como o nó possui pai, segue-se para o caso 2");
                        caseremove2_animation(stack, quandoEncerrar);
                    } else {
                        StepRecord.add("Como o nó não possui pai, encerra-se a verificação");
                        timeout(quandoEncerrar, 2000);
                    }
                },2000);
            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove2_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 2");
                    var irmao = stack.irmao();
                    if (irmao.ehVermelho()) {
                        var pai = stack.pai();
                        pai.ref.cor = cor.vermelho;
                        $(pai.dom()).turnRed();
                        irmao.ref.cor = cor.preto;
                        $(irmao.ref.cor).turnBlack();
                        StepRecord.add("Como o nó-irmão é vermelho, altera-se a cor dos nós pai e irmão");
                        if (pai.esq() === stack.noremoved()) {
                            animationRotacaoEsquerda(stack.avo(), pai);
                            StepRecord.add("Realiza a rotação a esquerda");
                        } else if (pai.dir() === stack.noremoved()) {
                            animationRotacaoDireita(stack.avo(), pai);
                            StepRecord.add("Realiza a rotação a direita");
                        } else {
                            alert("inesperado");
                        }
                    } else {
                        StepRecord.add("Como o nó-irmão é preto, não necessita de tratamento no caso 2");
                    }
                    StepRecord.add("Verificação segue para o caso 3");
                    caseremove3_animation(stack, quandoEncerrar);
                }, 2000);
            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove3_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 3");
                    var irmao = stack.irmao();
                    var pai = stack.pai();

                    if (pai.ehPreto() && irmao.ehPreto() && !irmao.ehNull() && irmao.esq().ehPreto() && irmao.dir().ehPreto()) {
                        irmao.ref.cor = cor.vermelho;
                        $(irmao.dom()).turnRed();
                        StepRecord.add("Como a condição do caso 3 é verdadeira, alterasse a cor do irmão e segue para o caso 1 com o nó pai");
                        stack.pop();
                        caseremove1_animation(stack, quandoEncerrar);
                    } else {
                        StepRecord.add("Como a condição do caso 3 é falsa, a verificação segue para o caso 4");
                        caseremove4_animation(stack, quandoEncerrar);
                    }
                }, 2000);
            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove4_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 4");
                    var irmao = stack.irmao();
                    var pai = stack.pai();
                    if (pai.ehVermelho() && irmao.ehPreto() && !irmao.ehNull() && irmao.esq().ehPreto() && irmao.dir().ehPreto()) {
                        irmao.ref.cor = cor.vermelho;
                        $(irmao.dom()).turnRed();

                        pai.ref.cor = cor.preto;
                        $(pai.dom()).turnBlack();
                        StepRecord.add("Como a condição do caso 4 é verdadeira, alterase a cor do irmão e encerra-se a verificação");
                        timeout(quandoEncerrar, 2000);
                    } else {
                        StepRecord.add("Como a condição do caso 4 é falsa, verificação segue para o caso 5");
                        caseremove5_animation(stack, quandoEncerrar);
                    }
                }, 2000);
            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove5_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 5");
                    var irmao = stack.irmao();
                    var pai = stack.pai();
                    if (irmao.ehPreto()) {
                       
                        if (stack.noremoved() === pai.esq() && !irmao.ehNull() && irmao.dir().ehPreto() && irmao.esq().ehVermelho()) {
                            StepRecord.add("Como o nó irmão é preto e a primeira condição é verdadeira, necessita realizar tratamento");
                            irmao.ref.cor = cor.vermelho;
                            $(irmao.dom()).turnRed();
                            irmao.esq().ref.cor = cor.preto;
                            $(irmao.esq().dom()).turnBlack();
                            StepRecord.add("Alterasse a cor do nó-irmão e de seu nó-filho a esquerda");
                            animationRotacaoDireita(pai, irmao);
                            StepRecord.add("<i class='fa fa-rotate-right'></i>  Realiza rotação a direita");
                        } else if (stack.noremoved() === pai.dir() && !irmao.ehNull() && irmao.esq().ehPreto() && irmao.dir().ehVermelho()) {
                            StepRecord.add("Como o nó irmão é preto e a segunda condição é verdadeira, necessita realizar tratamento");
                            irmao.ref.cor = cor.vermelho;
                            $(irmao.dom()).turnRed();
                            irmao.dir().ref.cor = cor.preto;
                            $(irmao.dir().dom()).turnBlack();
                            StepRecord.add("Alterasse a cor do nó-irmão e de seu nó-filho a direita");
                            animationRotacaoEsquerda(pai, irmao);
                            StepRecord.add("<i class='fa fa-rotate-left'></i>  Realiza rotação a esquerda");
                        } else {
                            StepRecord.add("Apesar do nó irmão ser preto, nenhuma condição do caso 5 é verdadeira logo não necessita realizar tratamentos");
                        }
                    } else {
                        StepRecord.add("Como o nó irmão é preto, não necessita realizar tratamento no caso 5");
                    }
                    StepRecord.add("A verificação segue para o caso 6");
                    caseremove6_animation(stack, quandoEncerrar);
                }, 2000);
            },
            /**
             * @param {StackRB} stack
             * @param {Function} quandoEncerrar
             */
            caseremove6_animation = function (stack, quandoEncerrar) {
                timeout(function () {
                    StepRecord.add("<i class='fa fa-search'></i> Caso 6");
                    var irmao = stack.irmao();
                    var pai = stack.pai();

                    irmao.ref.cor = pai.ref.cor;
                    if (pai.ehPreto()) {
                        $(irmao.dom()).turnBlack();
                    } else if (pai.ehVermelho()) {
                        $(irmao.dom()).turnRed();
                    }
                    pai.ref.cor = cor.preto;
                    $(pai.dom()).turnBlack();
                    StepRecord.add("Alterasse a cor do nó-irmão e do nó-pai");
                    if (stack.noremoved() === pai.esq()) {
                        if (!irmao.ehNull()) {
                            irmao.dir().ref.cor = cor.preto;
                            $(irmao.dir().dom()).turnBlack();
                            StepRecord.add("Alterasse a cor do nó-filho a direita do nó-irmão");
                            animationRotacaoEsquerda(stack.avo(), pai);
                            StepRecord.add("<i class='fa fa-rotate-left'></i> Realiza rotação para esquerda do nó-pai");
                        }
                    } else if (stack.noremoved() === pai.dir()) {
                        if (!irmao.ehNull()) {
                            irmao.esq().ref.cor = cor.preto;
                            $(irmao.esq().dom()).turnBlack();
                            StepRecord.add("Alterasse a cor do nó-filho a esquerda do nó-irmão");
                            animationRotacaoDireita(stack.avo(), pai);
                            StepRecord.add("<i class='fa fa-rotate-right'></i> Realiza rotação para direita do nó-pai");
                        }
                    }
                    
                    timeout(quandoEncerrar, 2000);
                }, 2000);
            },
            runAnimation = function (list, output) {
                UI.lock();

                var index = 0;

                rec = function () {
                    timeout(function () {
                        if (index !== list.length) {
                            list[index](output, 2000);
                            index++;
                            rec();
                        } else {
                            $(".dinamicSmallDotSucessor").remove();
                            output.showCloseBtn();
                            UI.unlock();
                        }
                    }, 2000);
                };

                rec();
            },
            compileAnimationEmOrdem = function (raiz, list) {
                var disc = createDiscO(parseFloat($(raiz.ref.d).position().left), parseFloat($(raiz.ref.d).position().top));
                disc.d.style.display = "none";
                list.push(function () {
                    disc.d.style.display = "block";
                });

                if (raiz.ref.esq.ref.ref !== null) {
                    compileAnimationEmOrdem(raiz.ref.esq, list);
                }

                list.push(function (output, time) {
                    disc.d.style.borderColor = "#FC0";

                    UI.triggerNext();

                    timeout(function () {
                        output.print(raiz.ref.value, raiz.ref.id);
                    }, time / 2.0);
                    timeout(function () {
                        disc.d.style.borderColor = "#000";
                    }, time);
                });

                if (raiz.ref.dir.ref.ref !== null) {
                    compileAnimationEmOrdem(raiz.ref.dir, list);
                }

                list.push(function () {
                    disc.d.style.display = "none";
                });
            },
            compileAnimationPreOrdem = function (raiz, list) {
                var disc = createDiscO(parseFloat($(raiz.ref.d).position().left), parseFloat($(raiz.ref.d).position().top));

                disc.d.style.display = "none";
                list.push(function () {
                    disc.d.style.display = "block";
                });

                list.push(function (output, time) {
                    disc.d.style.borderColor = "#FC0";
                    timeout(function () {
                        output.print(raiz.ref.value, raiz.ref.id);
                    }, time / 2.0);
                    timeout(function () {
                        disc.d.style.borderColor = "#000";
                    }, time);
                });

                if (raiz.ref.esq.ref.ref !== null) {
                    compileAnimationPreOrdem(raiz.ref.esq, list);
                }

                if (raiz.ref.dir.ref.ref !== null) {
                    compileAnimationPreOrdem(raiz.ref.dir, list);
                }

                list.push(function () {
                    disc.d.style.display = "none";
                });

            },
            compileAnimationPosOrdem = function (raiz, list) {
                var disc = createDiscO(parseFloat($(raiz.ref.d).position().left), parseFloat($(raiz.ref.d).position().top));
                disc.d.style.display = "none";
                list.push(function () {
                    disc.d.style.display = "block";
                });

                if (raiz.ref.esq.ref.ref !== null) {
                    compileAnimationPosOrdem(raiz.ref.esq, list);
                }

                if (raiz.ref.dir.ref.ref !== null) {
                    compileAnimationPosOrdem(raiz.ref.dir, list);
                }

                list.push(function (output, time) {
                    disc.d.style.borderColor = "#FC0";
                    timeout(function () {
                        output.print(raiz.ref.value, raiz.ref.id);
                    }, time / 2.0);
                    timeout(function () {
                        disc.d.style.borderColor = "#000";
                    }, time);
                });

                list.push(function () {
                    disc.d.style.display = "none";
                });

            },
            compileAnimationNivel = function (topo, list) {

                var pilha = [];
                pilha.push(topo);

                do {
                    var novapilha = [];
                    for (var i = 0; i < pilha.length; i++) {
                        const raiz = pilha[i];
                        const disc = createDiscO(parseFloat($(raiz.ref.d).position().left), parseFloat($(raiz.ref.d).position().top));
                        disc.d.style.display = "none";
                        list.push(function () {
                            disc.d.style.display = "block";
                        });
                        list.push(function (output, time) {
                            disc.d.style.borderColor = "#FC0";
                            timeout(function () {
                                output.print(raiz.ref.value, raiz.ref.id);
                            }, time / 2.0);
                            timeout(function () {
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
                } while (novapilha.length !== 0);
            },
            prepare = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isTarget: false, isSource: true, isPrimary: true, anchor: "Top"});
            },
            prepare2 = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isTarget: false, isSource: true, isPrimary: false, anchor: "Top"});
            },
            prepare3 = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isTarget: true, isSource: false, isPrimary: true, anchor: [1, 0.8, 0, -1]});
            },
            prepare4 = function (elId) {
                return Plumb.adicionarPontoDeConexao(elId, {isTarget: true, isSource: false, isPrimary: false, anchor: [0, 0.8, 0, -1]});
            },
            connectDisc = function (pai, elem) {
                if (pai != null) {
                    if (parseInt(pai.ref.value) < parseInt(elem.valor)) {
                        Plumb.conectar(prepare3(pai.ref.id), prepare(elem.id), "direita");
                        setFinalRight(pai.ref.id, false);
                    } else {
                        Plumb.conectar(prepare4(pai.ref.id), prepare2(elem.id), "esquerda");
                        setFinalLeft(pai.ref.id, false);
                    }
                }
            },
            disconnect = function (raiz, pai) {
                var conectar = null;
                if (pai !== null) {
                    if (pai.ref.dir === raiz) {
                        conectar = conectarDireita;
                    } else {
                        conectar = conectarEsquerda;
                    }

                    if (raiz.ref.dir.ref.ref === null && raiz.ref.esq.ref.ref === null) {

                        if (pai !== null) {
                            conectar(pai, null);
                        } else {
                            createDiscNull();
                        }
                    } else {
                        if (raiz.ref.dir.ref.ref !== null) { //dir != null
                            conectar(pai, raiz.ref.dir);
                        } else if (raiz.ref.esq.ref.ref !== null) { //esq != null
                            conectar(pai, raiz.ref.esq);
                        }

                        if (raiz.ref.dir.ref.ref === null || raiz.ref.esq.ref.ref === null) {
                            if (collection.raiz === raiz) {
                                $("span.initial").remove();
                                $("#" + raiz.ref.dir.ref.id).append("<span class='initial'>Raiz</span>");
                            }
                        }
                    }
                }
            },
            createDiscNull = function () {
                var width = parseInt($("#main").width()) - 500;
                nullpointer = Element.createElement(
                        {className: "dinamicSmallDotNull",
                            innerHTML: "<span class='itemValue'>nulo</span>",
                            left: (width / 2 - 20) + "px",
                            top: "110px",
                            title: "Lista",
                            idParent: "main"});
                $("#" + nullpointer.id).append("<span class='initial'>Raiz</span>");
            },
            createDiscO = function (left, top) {
                var elem = Element.createElement(
                        {className: "dinamicSmallDotSucessor",
                            left: left + "px",
                            innerHTML: "",
                            top: top + "px",
                            idParent: "main"});
                return elem;
            },
            createDisc = function (value) {
                var elem = Element.createElement(
                        {className: "dinamicSmallDot altColor",
                            innerHTML: "<span class='itemValue altColorTitle' style='top: 7px'>" + value + "</span>",
                            left: "0px",
                            top: "75px",
                            title: value,
                            idParent: "main"});
                elem.valor = value;
                return elem;
            },
            createSelectTypeOrganizar = function () {
                var button = document.createElement("button");

                button.id = "organizar_select";
                button.className = "toggleButtonOrganizar expand";

                button.onclick = function () {
                    if ($(button).hasClass("expand")) {
                        $(button).removeClass("expand").addClass("minimize");
                    } else {
                        $(button).removeClass("minimize").addClass("expand");
                    }
                    if (collection.raiz.ref.ref !== null) {
                        organizar();
                        $(button).attr("disabled", "disabled");
                        timeout(function () {
                            $(button).removeAttr("disabled");
                        }, 2000);
                    }
                };

                document.getElementById("main").appendChild(button);
            };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc, this.removeValue, this.searchValue);
            UI.setProperty("primaryColorProperty", true);
            collection.inicia();
            UI.InitInterface(this.search, this.elementToString);
            createDiscNull();
            createSelectTypeOrganizar();
            $("#main").css("padding-right", "400px");
            $("#pre-ordem").click(this.preordem);
            $("#pos-ordem").click(this.posordem);
            $("#em-ordem").click(this.emordem);
            $("#altura").click(this.nivel);
            jQuery.fn.turnRed = function () {
                var o = $(this[0]);
                o.removeClass("black").addClass("red");
                return this;
            };
            jQuery.fn.turnBlack = function () {
                var o = $(this[0]);
                o.removeClass("red").addClass("black");
                return this;
            };
            Tooltip.createStyle("tooltipStatic", {
                extends: "dark",
                showOn: null,
                tipJoint: "bottom",
                showEffectDuration: 0.01,
                hideEffectDuration: 0.01,
                target: true,
                background: "#333333",
                removeElementsOnHide: true,
                delay: 0.01
            });
        },
        elementToString: function (id) {
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.value};
                result._vizinhos = [];
                result.cor = (element.cor === cor.vermelho ? "VERMELHO" : "PRETO");
                if (element.esq.ref.ref !== null) {
                    var nextId = (element.esq.ref.id * 1).toString(16).toUpperCase();
                    result.esquerda = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.esquerda = {id: element.esq.ref.id, tooltipdir: "e"};
                } else {
                    result.esquerda = 'nulo';
                }
                if (element.dir.ref.ref !== null) {
                    var nextId = (element.dir.ref.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.direita = {id: element.dir.ref.id, tooltipdir: "w"};
                } else {
                    result.direita = 'nulo';
                }
                return result;
            }
            return false;
        },
        emordem: function () {
            if (collection.raiz.ref.ref !== null) {
                UI.subtitle("Executando varredura Em-ordem");
                var output = Element.createOutputStack("Varredura Em-ordem");
                var list = [];
                compileAnimationEmOrdem(collection.raiz, list);
                runAnimation(list, output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        preordem: function () {
            if (collection.raiz.ref.ref !== null) {
                UI.subtitle("Executando varredura Pré-ordem");
                var output = Element.createOutputStack("Varredura Pré-ordem");
                var list = [];
                compileAnimationPreOrdem(collection.raiz, list);
                runAnimation(list, output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        posordem: function () {
            if (collection.raiz.ref.ref !== null) {
                UI.subtitle("Executando varredura Pós-ordem");
                var output = Element.createOutputStack("Varredura Pós-ordem");
                var list = [];
                compileAnimationPosOrdem(collection.raiz, list);
                runAnimation(list, output);
            } else {
                UI.lancarMensagem("A árvore está vázia");
            }
        },
        nivel: function () {

            if (collection.raiz.ref.ref !== null) {
                var output = Element.createOutputStack("Varredura Pós-ordem");
                UI.subtitle("Executando varredura em Nível");
                UI.lock();
                var list = [];
                compileAnimationNivel(collection.raiz, list);
                runAnimation(list, output);
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
                var value = UI.value('valor', 'Insira apenas números inteiros');
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>" + value + "</b>");
                    var info = createDisc(value);
                    Plumb.tornarArrastavel(info.id);
                    $(info.d).click(function () {
                        UI.highlightInput("valor", $(info.d).find(".itemValue").text());
                    });
                    animationAdd(info);
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {

            var value = UI.value('valor', 'Insira apenas números inteiros');
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>" + value + "</b>");
                var info = createDisc(value);
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value('valor', 'Insira apenas números inteiros');
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>" + value + "</b>");
                var info = createDisc(value);
                animationSearch(info);
            }
        }

    };
})();

