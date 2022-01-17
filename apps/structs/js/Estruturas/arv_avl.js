jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function AVL() {
    this.raiz = null;
    this.queue = null;

    AVL.criaNo = function () {
        return {ref: null, id: null, value: null, esq: null, dir: null};
    };

    AVL.criaRef = function () {
        return {ref: null};
    };

    this.inicia = function () {
        this.raiz = AVL.criaRef();
        this.raiz.ref = AVL.criaNo();
        this.id_rotacao = 0;
        this.queue = [];
    };

    this.altura = function (no) {
        if (!no.ref.ref)
            return -1;

        var esq = this.altura(no.ref.esq) + 1;
        var dir = this.altura(no.ref.dir) + 1;

        return esq > dir ? esq : dir;
    };

    this.fatorBalanceamento = function (no) {
        return this.altura(no.ref.dir) - this.altura(no.ref.esq);
    };

    this.rotacaoEsquerda = function (pai, no) {
        var q = no.ref.dir;
        var temp = q.ref.esq;

        q.ref.esq = no;
        no.ref.dir = temp;
        if (pai != null) {
            if (pai.ref.dir == no)
                pai.ref.dir = q;
            else
                pai.ref.esq = q;
        } else
            this.raiz = q;
    };

    this.rotacaoDireita = function (pai, no) {
        var q = no.ref.esq;
        var temp = q.ref.dir;

        q.ref.dir = no;
        no.ref.esq = temp;

        if (pai != null) {
            if (pai.ref.dir == no)
                pai.ref.dir = q;
            else
                pai.ref.esq = q;
        } else
            this.raiz = q;
    };

    this.verifica = function (pai, raiz) {
        var balRaiz = this.fatorBalanceamento(raiz);
        if (balRaiz > 0) {
            if (this.fatorBalanceamento(raiz.ref.dir) > 0) {
                this.queue.push({pai:pai,raiz:raiz, id_rotacao: 1});
            } else {
                this.queue.push({pai:pai,raiz:raiz, id_rotacao: 2});
            }
        } else {
            if (this.fatorBalanceamento(raiz.ref.esq) < 0) {
                this.queue.push({pai:pai,raiz:raiz, id_rotacao: 3});
            } else {
                this.queue.push({pai:pai,raiz:raiz, id_rotacao: 4});
            }
        }
    };

    this.insere2 = function (raiz, pai, elem) {
        if (raiz.ref.ref == null) {

            var noEsq = AVL.criaRef();
            var noDir = AVL.criaRef();
            noEsq.ref = AVL.criaNo();
            noDir.ref = AVL.criaNo();
            raiz.ref.ref = elem.d;
            raiz.ref.d = elem.d;
            raiz.ref.id = elem.id;
            raiz.ref.value = elem.valor;
            raiz.ref.esq = noEsq;
            raiz.ref.dir = noDir;
            Element.bind(raiz.ref,raiz.ref.id);

        } else if (parseInt(raiz.ref.value) < parseInt(elem.valor)) {
            this.insere2(raiz.ref.dir, raiz, elem);
            if (Math.abs(this.fatorBalanceamento(raiz)) >= 2){
                this.verifica(pai, raiz);//verifica se necessita de rotação 
            }
        } else if (parseInt(raiz.ref.value) > parseInt(elem.valor)) {
            this.insere2(raiz.ref.esq, raiz, elem);
            if (Math.abs(this.fatorBalanceamento(raiz)) >= 2){
                this.verifica(pai, raiz);//verifica se necessita de rotação 
            }
        }
    };

    this.insere = function (elem) {
        this.insere2(this.raiz, null, elem);
    };

    this.search2 = function (raiz, value) {
        if (raiz.ref.ref == null)
            return null;
        if (parseInt(raiz.ref.value) == parseInt(value))
            return raiz;
        else if (parseInt(raiz.ref.value) < parseInt(value))
            return this.search2(raiz.ref.dir, value);
        else
            return this.search2(raiz.ref.esq, value);
    };

    this.search = function (value) {
        return this.search2(this.raiz, value);
    };

    this.remocao2 = function (raiz, pai, value) {
        if (raiz.ref.ref != null) {
            if (parseInt(raiz.ref.value) < parseInt(value)) {
                this.remocao2(raiz.ref.dir, raiz, value);
                if (Math.abs(this.fatorBalanceamento(raiz)) >= 2){
                    this.verifica(pai, raiz);
                }
            } else if (parseInt(raiz.ref.value) > value) {
                this.remocao2(raiz.ref.esq, raiz, value);
                if (Math.abs(this.fatorBalanceamento(raiz)) >= 2){
                    this.verifica(pai, raiz);
                }
            } else {
                if (raiz.ref.dir.ref.ref == null) {
                    raiz.ref = raiz.ref.esq.ref;
                } else if (raiz.ref.esq.ref.ref == null) {
                    raiz.ref = raiz.ref.dir.ref;
                } else {
                    this.removeSucessor(raiz, raiz.ref.dir, raiz);
                    if (Math.abs(this.fatorBalanceamento(raiz)) >= 2) {
                        this.verifica(pai, raiz);
                    }
                }
            }
        }
    };

    /**
     * @param {type} q pai
     * @param {type} p filho
     * @returns {undefined}
     */
    this.removeSucessor = function (q, p, pai) {
        if (p.ref.esq.ref.ref == null) {
            q.ref.value = p.ref.value;
            q.ref.ref = p.ref.ref;

            p.ref = p.ref.dir.ref;
        } else {
            this.removeSucessor(q, p.ref.esq, p);
            if (Math.abs(this.fatorBalanceamento(p)) >= 2) {
                this.verifica(q, p, pai);
            }
        }
    };

    this.remove = function (value) {
        this.remocao2(this.raiz, null, value);
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

    this.resetRotacao = function () {
        this.queue = [];
    };

    this.getRotacao = function () {
        return this.queue.shift();
    };

}

(function () {
    var collection = new AVL();
    var nullpointer = null;
    
    organizar = function(){
        if($("#organizar_select").hasClass("expand")) {
            organizarSimetrico(2000);
        } else {
            organizarEspacoReservado(2000);
        }
    };

    getCollection = function(){
        return collection;
    };
    
    var
    updateInitial = function(){
        $("span.initial").remove();
        $("#"+collection.raiz.ref.id).append("<span class='initial'>Raiz</span>");
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

    //ponto médio (2d) entre um nó e seus filhos
    mean = function(no){
        var total = 1;
        var soma = {left:parseFloat(no.ref.ref.style.left),top:parseFloat(no.ref.ref.style.top)};
        
        if(no.ref.esq.ref.ref!==null){
            soma.top += parseFloat(no.ref.esq.ref.ref.style.top);
            total++;
        }
        if(no.ref.dir.ref.ref!==null){
            soma.top += parseFloat(no.ref.dir.ref.ref.style.top);
            total++;
        }
        
        soma.top = soma.top / total;
        return soma;
    };
    
    spanRotateLeft = function(no){
        var pos = mean(no);
        var span = document.createElement("div");
        span.className = "rotate-span";
        span.id = "rotate-left-span";
        span.style.left = pos.left+"px";
        span.style.top = pos.top+"px";
        
        span.style.opacity = 0;
        document.getElementById("main").appendChild(span);
        Plumb.fadeIn(span.id,200);
        timeout(function(){
            Plumb.fadeOut(span.id,200,function(){
                $(span).remove();
            });
        },1800);
    },
    
    spanRotateRight = function(no){
        var pos = mean(no);
        var span = document.createElement("div");
        span.className = "rotate-span";
        span.id = "rotate-right-span";
        span.style.left = pos.left+"px";
        span.style.top = pos.top+"px";

        span.style.opacity = 0;
        document.getElementById("main").appendChild(span);
        Plumb.fadeIn(span.id,200);
        timeout(function(){
            Plumb.fadeOut(span.id,200,function(){
                $(span).remove();
            });
        },1800);
        
    },  
    
    conectarEsquerda = function(source, target) {
        
       if(source.ref.esq.ref.ref !== null) {
           setFinalLeft(source.ref.id,true);
           Plumb.desconectarTodosCom({source:source.ref.id,target:source.ref.esq.ref.id});
       }
       if(target && target.ref.ref !== null) {
           setFinalLeft(source.ref.id,false);
           Plumb.conectar(prepare4(source.ref.id), prepare2(target.ref.id),"esquerda");
       }
    },
    conectarDireita = function(source,target) {
        if(source.ref.dir.ref.ref !== null) {
            setFinalRight(source.ref.id,true);
            Plumb.desconectarTodosCom({source:source.ref.id,target:source.ref.dir.ref.id});
        }
        if(target && target.ref.ref !== null) {
            setFinalRight(source.ref.id,false);
            Plumb.conectar(prepare3(source.ref.id), prepare(target.ref.id),"direita");
        }
    },
    animationRotacaoEsquerda = function (pai,no) {
        
        spanRotateLeft(no);
        var q = no.ref.dir; //644
        var temp = q.ref.esq; //null
        
        //q.ref.esq = no;
        conectarEsquerda(q,no); //vermelho
        
        //no.ref.dir = temp;
        conectarDireita(no,temp); //

        if(pai!==null){
            if (pai.ref.dir === no){
                // pai.ref.dir = q;
                conectarDireita(pai,q);
            } else {
                // pai.ref.esq = q;
                conectarEsquerda(pai,q);
            }
            collection.rotacaoEsquerda(pai, no);
        } else {
            collection.rotacaoEsquerda(pai, no);
            updateInitial();
        }
        
        organizar();
    },
    
    animationRotacaoDireita = function (pai,no) {
        spanRotateRight(no);
        var q = no.ref.esq;
        var temp = q.ref.dir;

        //q.ref.dir = no;
        conectarDireita(q,no);
        
        // no.ref.esq = temp;
        conectarEsquerda(no,temp);
        
        if(pai!==null){
            if (pai.ref.dir === no){
                //pai.ref.dir = q;
                conectarDireita(pai,q);
            } else {
                //pai.ref.esq = q;
                conectarEsquerda(pai,q);
            }
            collection.rotacaoDireita(pai, no);
        } else {
            collection.rotacaoDireita(pai, no);
            updateInitial();
        }
        
        organizar();
    },
    
    animationRotacaoDireitaEsquerda = function (pai,no) {
        animationRotacaoDireita(no, no.ref.dir);
        timeout(function(){
            animationRotacaoEsquerda(pai, no);
        }, 2000);
    },
    
    animationRotacaoEsquerdaDireita = function (pai,no) {
        animationRotacaoEsquerda(no, no.ref.esq);
        timeout(function(){
            animationRotacaoDireita(pai, no);
        }, 2000);
    },
    
    animationRotacao = function(remocaocase){
        var temp = null;
        var totalRotacoes = 0;
        var sumline = 0;
        var vk = VK.INSERCAO;
        if (remocaocase) {
            sumline = 24;
            vk = VK.REMOCAO;
        }
        
        if ((temp = collection.getRotacao()) && (temp !== null)) {
            StepRecord.add("Sub-Árvore desbalanceada detectada");
            var highlighter = new HighlighterAlgoritmo(vk);
            if (temp.id_rotacao === 1) {//1: Rotaciona para Esquerda
                timeout(function(){
                   StepRecord.add("Realizada a rotação para Esquerda"); 
                },2000);
                highlighter.line(28 + sumline, 0);
                highlighter.line(30 + sumline, 600);
                highlighter.line(31 + sumline, 1200);
                totalRotacoes = 1;
                animationRotacaoEsquerda(temp.pai, temp.raiz);
            } else if (temp.id_rotacao === 2) {//2: Rotaciona para Direita e depois Esquerda
                timeout(function(){
                   StepRecord.add("Realizada a rotação para Direita"); 
                   timeout(function(){
                       StepRecord.add("Realizada a rotação para Esquerda"); 
                   },2000);
                },2000);
                totalRotacoes = 2;
                highlighter.line(28 + sumline, 0);
                highlighter.line(32 + sumline, 1000);
                highlighter.lineRed(30 + sumline, 1000);
                highlighter.line(34 + sumline, 2000);
                highlighter.line(35 + sumline, 3000);
                animationRotacaoDireitaEsquerda(temp.pai, temp.raiz);
            } else if (temp.id_rotacao === 3) {//3: Rotaciona para Direita
                timeout(function(){
                   StepRecord.add("Realizada a rotação para Direita"); 
                },2000);
                highlighter.line(38 + sumline, 0);
                highlighter.lineRed(28 + sumline, 0);
                highlighter.line(40 + sumline, 600);
                highlighter.line(41 + sumline, 1200);
                totalRotacoes = 1;
                animationRotacaoDireita(temp.pai, temp.raiz);
            } else if (temp.id_rotacao === 4) { //4: Rotaciona para Esquerda e depois Direita
                timeout(function(){
                   StepRecord.add("Realizada a rotação para Esquerda"); 
                   timeout(function(){
                       StepRecord.add("Realizada a rotação para Direita"); 
                   },2000);
                },2000);
                totalRotacoes = 2;
                highlighter.line(38 + sumline, 0);
                highlighter.lineRed(28 + sumline, 0);
                highlighter.line(42 + sumline, 1000);
                highlighter.lineRed(40 + sumline, 1000);
                highlighter.line(44 + sumline, 2000);
                highlighter.line(45 + sumline, 3000);
                animationRotacaoEsquerdaDireita(temp.pai, temp.raiz);
            }
        }
        return totalRotacoes;
    },
    
    animationAdd = function (info) {
        UI.lock();
        setFinalLeft(info.id,true);
        setFinalRight(info.id,true);
        collection.resetRotacao();
        var pai = null;
        var raiz = collection.raiz;
        var pos = {left: 500, top: 125};
        var i = 0;
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        timeout(function(){
            StepRecord.add("Verredura começa na raiz da Árvore");  
        },2000);
        while (raiz.ref.ref != null) {
            highlighter.line(5,2000*i);
            highlighter.lineRed(0,2000*i);
            
            pos = {left: parseInt(raiz.ref.ref.style.left), top: parseInt(raiz.ref.ref.style.top)};
            Plumb.moveTo(info.id, pos.left,pos.top + 40, 2000);
            pai = raiz;

            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                highlighter.lineRed(7,2000*i + 500);
                highlighter.line(9,2000*i + 500);
                highlighter.lineGreen(10,2000*i + 1000);
                raiz = raiz.ref.esq;
                timeout(function(){
                    StepRecord.add("Verredura continua para o nó-filho até a esquerda");  
                },(i+2)*2000);
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                highlighter.line(7,2000*i + 500);
                highlighter.lineGreen(8,2000*i + 1000);
                raiz = raiz.ref.dir;
                timeout(function(){
                    StepRecord.add("Verredura continua para o nó-filho até a direita");  
                },(i+2)*2000);
            } else {
                highlighter.lineRed(7,2000*i + 500);
                highlighter.lineRed(9,2000*i + 500);
                highlighter.line(11,2000*i + 500);
                highlighter.line(12,2000*i + 1000);
                timeout(function(){
                    Plumb.fadeOut(info.id,1000,function(){
                        StepRecord.add("Inserção se encerra pois o elemento já está inserido");  
                        StepRecord.end();
                        highlighter.clear(0);
                        $("#"+info.id).remove();
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    });
                },2000*(i+2));
                return;                            
            }
            i++;

        }
        timeout(function(){
            highlighter.line(0,0);
            highlighter.line(2,600);
            highlighter.line(3,1200);
            collection.insere(info);
            organizar();
            if (pai != null) {
                connectDisc(pai, info);
            }
            timeout(function () {
                StepRecord.add("Pesquisa se encerra pois elemento é nulo, e elemento é alocado");
                var totalRotacoes = animationRotacao();
                timeout(function () {
                    if (totalRotacoes === 0) {
                        connectDisc(pai, info);
                    }
                    highlighter.clear(0);
                    $(nullpointer.d).remove();
                    updateInitial();
                    StepRecord.end();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }, totalRotacoes * 2000 + 1000);
            }, 2000);
        }, (i+1)*2000);
    },
    animationSearch = function (info) {
        UI.lock();
        var raiz = collection.raiz;
        var j = 0;
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        timeout(function(){
            StepRecord.add("Verredura começa na raiz da Árvore");  
        },2000);

        while (raiz.ref.ref !== null) {
            Plumb.moveTo(info.id, parseFloat(raiz.ref.ref.style.left), parseFloat(raiz.ref.ref.style.top) + 40, 2000);
            highlighter.clear(2000 * j);
            highlighter.line(0, 2000 * j);
            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                raiz = raiz.ref.esq;
                highlighter.line(4, 2000 * j + 600);
                highlighter.lineRed(2, 2000 * j + 600);
                highlighter.line(5, 2000 * j + 1200);
                timeout(function(){
                    StepRecord.add("Verredura continua para o nó-filho até a esquerda");  
                },(j+2)*2000);
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                raiz = raiz.ref.dir;
                highlighter.line(2, 2000 * j + 600);
                highlighter.line(3, 2000 * j + 1200);
                timeout(function(){
                    StepRecord.add("Verredura continua para o nó-filho até a direita");  
                },(j+2)*2000);
            } else {
                break;
            }
            j++;
        }

        timeout(function () {
            Plumb.fadeOut(info.id, 2000);
            if (raiz.ref.ref !== null) {
                highlighter.line(6, 0);
                highlighter.lineRed(2, 0);
                highlighter.lineRed(4, 0);
                highlighter.line(7, 1000);
                Plumb.blink(raiz.ref.id, 6000, function () {
                    StepRecord.add("Verredura encerra pois elemento foi encontrado");  
                    StepRecord.end();
                    highlighter.clear(0);
                    $("#" + info.id).remove();
                    UI.unlock();
                });
            } else {
                highlighter.line(9, 0);
                highlighter.lineRed(0, 0);
                highlighter.line(10, 1000);
                timeout(function () {
                    StepRecord.add("Verredura encerra pois elemento não foi encontrado");  
                    StepRecord.end();
                    highlighter.clear(0);
                    $("#" + info.id).remove();
                    UI.unlock();
                }, 2000);
            }
        }, j * 2000 + 2000);
    },
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        var raiz = collection.raiz;
        var pos = {left: 500, top: 75};
        var j = 0;
        var pai = null;
        timeout(function(){
            StepRecord.add("Verredura começa na raiz da Árvore");  
        },2000);
        while (raiz.ref.ref !== null) {
            pos = {left: parseInt(raiz.ref.ref.style.left), top: parseInt(raiz.ref.ref.style.top)+40};
            Plumb.moveTo(info.id, pos.left,pos.top, 2000);
            highlighter.line(0,2000*j);
            
            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                timeout(function () {
                    StepRecord.add("Verredura continua para o nó-filho até a esquerda");
                }, (j + 2) * 2000);
                highlighter.line(2,2000*j+500);
                highlighter.line(6,2000*j+1000);
                highlighter.lineRed(4,2000*j+1000);
                highlighter.line(7,2000*j+1500);
                pai = raiz;
                raiz = raiz.ref.esq;
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                timeout(function () {
                    StepRecord.add("Verredura continua para o nó-filho até a direita");  
                }, (j + 2) * 2000);
                highlighter.line(2,2000*j+500);
                highlighter.line(4,2000*j+1000);
                highlighter.line(5,2000*j+1500);
                pai = raiz;
                raiz = raiz.ref.dir;
            } else {
                highlighter.line(13,2000*j+500);
                highlighter.lineRed(2,2000*j+500);
                break;
            }
            j++;
        }

        if(raiz.ref.ref === null) { //elemento não encontrado
            timeout(function(){
                highlighter.clear(0);
                highlighter.lineRed(0,0);
                Plumb.fadeOut(info.id,1000,function(){
                    highlighter.clear(0);
                    StepRecord.add("Verredura encerra pois elemento não foi encontrado");
                    StepRecord.end();
                    $("#"+info.id).remove();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                });
            },2000*(j+1));
            return;      
        }

        timeout(function(){
            StepRecord.add("Verredura encerra pois elemento foi encontrado");
            Plumb.fadeOut(info.id, 1000);
            if (raiz.ref.dir.ref.ref !== null && raiz.ref.esq.ref.ref !== null) { //busca por sucessor
                
                var id = raiz.ref.id;
                var discsuc = createDiscO(parseInt(raiz.ref.ref.style.left), parseInt(raiz.ref.ref.style.top));
                timeout(function(){
                    
                    highlighter.line(19,0);
                    highlighter.lineRed(15,0);
                    highlighter.lineRed(17,0);
                    highlighter.clear(1000);
                    highlighter.lineGreen(21,1000);
                    highlighter.line(34,2000);
                    highlighter.line(35,2000);
                    highlighter.lineRed(29,2000);

                    $("#"+info.id).remove();
                    var sucessor = raiz.ref.dir;
                    var paisucessor = raiz;
                    var i = 0;
                    
                    StepRecord.add("Inicia-se uma busca pelo sucessor");
                    
                    while(sucessor.ref.ref !== null) {
                        pos = {left: parseFloat(sucessor.ref.ref.style.left), top: parseFloat(sucessor.ref.ref.style.top)};
                        Plumb.moveTo(discsuc.id, pos.left, pos.top, 2000);
                        i++;
                        timeout(function () {
                            StepRecord.add("Busca sucessor continua para o nó-filho á esquerda");
                        }, i * 2000);
                        if(sucessor.ref.esq.ref.ref !== null) {
                            paisucessor = sucessor;
                            sucessor = sucessor.ref.esq;
                        } else {
                            break;
                        }
                    }
                    timeout( function(){
                        highlighter.line(29,0);
                        highlighter.line(31,1000);
                        highlighter.line(32,2000);
                        Plumb.fadeOut(discsuc.id,1000,function(){
                            $("#"+discsuc.id).remove();
                        });
                        
                        var idsucessor = sucessor.ref.id;
                        Plumb.blink(idsucessor,4000);
                        Plumb.blink(id,4000,function(){
                            $("#"+id).find(".itemValue").html(sucessor.ref.value);
                            sucessor.ref.ref = raiz.ref.ref;
                            disconnect(sucessor,paisucessor);
                            timeout(function(){
                                Plumb.desconectarCompletamente(sucessor.ref.id);
                                collection.remove(info.valor);
                                organizar();
                                timeout(function(){
                                    var totalRotacoes = animationRotacao(true);
                                    timeout(function(){
                                        StepRecord.end();
                                        highlighter.clear(0);
                                        UI.unlock();
                                        window.Eprogramada.nextQueue();
                                    },totalRotacoes*2000);
                                },2000);
                            }, 1000);
                        });
                    },2000*(i+1));
                },1000);
            } else { //caso simples de remoção (sem sucessor)
                timeout(function() {
                    if(raiz.ref.dir.ref.ref === null) {
                        highlighter.line(15,0);
                        highlighter.line(16,1000);
                    } else if(raiz.ref.esq.ref.ref === null) {
                        highlighter.line(17,0);
                        highlighter.lineRed(15,0);
                        highlighter.line(18,1000);
                    }
                    $("#"+info.id).remove();
                    var id = raiz.ref.id;
                    Plumb.blink(id,4000,function(){
                        Plumb.fadeOut(id,1000);
                    });
                    timeout(function(){
                        disconnect(raiz,pai);
                        Plumb.desconectarCompletamente(raiz.ref.id);
                        $("#"+raiz.ref.id).remove();
                        collection.remove(info.valor);
                        organizar();
                        timeout(function(){
                            StepRecord.add("Remove o elemento sem precisar de um sucessor");
                            var totalRotacoes = animationRotacao(true);
                            timeout(function(){
                                StepRecord.end();
                                highlighter.clear(0);
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            },totalRotacoes*2000);
                        },2000);
                    }, 6000);
                },1000);
            }
        }, (j+1) * 2000);

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
            
            UI.triggerNext();
            
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
        return Plumb.adicionarPontoDeConexao(elId,{isTarget:false,isSource:true,isPrimary:true,anchor:"Top"});
    },
    prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isTarget:false,isSource:true,isPrimary:false,anchor:"Top"});
    },
    prepare3 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isTarget:true,isSource:false,isPrimary:true,anchor:[1, 0.8, 0, -1]});
    },
    prepare4 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isTarget:true,isSource:false,isPrimary:false,anchor:[0, 0.8, 0, -1]});
    },
    connectDisc = function (pai, elem) {
        if (pai != null) {
            if (parseInt(pai.ref.value) < parseInt(elem.valor)){
                Plumb.conectar(prepare3(pai.ref.id),prepare(elem.id),"direita");
                setFinalRight(pai.ref.id,false);
            } else {
                Plumb.conectar(prepare4(pai.ref.id),prepare2(elem.id),"esquerda");
                setFinalLeft(pai.ref.id,false);
            }
        }
    },
    disconnect = function(raiz,pai){
        var conectar = null;
        if (pai !== null) {
             if(pai.ref.dir === raiz){
                conectar = conectarDireita;
             } else {
                conectar = conectarEsquerda;
             }
        
            if (raiz.ref.dir.ref.ref === null && raiz.ref.esq.ref.ref === null) {
                if (pai !== null) {
                    conectar(pai,null);
                } else {
                    createDiscNull();
                }
            } else {
                if (raiz.ref.dir.ref.ref !== null) { //dir != null
                    conectar(pai,raiz.ref.dir);
                } else if (raiz.ref.esq.ref.ref !== null) { //esq != null
                    conectar(pai,raiz.ref.esq);
                }

                if(raiz.ref.dir.ref.ref === null || raiz.ref.esq.ref.ref === null){
                    if (collection.raiz === raiz) {
                        $("span.initial").remove();
                        $("#"+raiz.ref.dir.ref.id).append("<span class='initial'>Raiz</span>");
                    }
                }
            }  
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
        $("#"+nullpointer.id).append("<span class='initial'>Raiz</span>");
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
            {className:"dinamicSmallDot altColor",
            innerHTML:"<span class='itemValue altColorTitle' style='top: 7px'>" + value + "</span>",
            left:"0px",
            top:"75px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    },
    createSelectTypeOrganizar = function(){
        var button = document.createElement("button");

        button.id =  "organizar_select";
        button.className = "toggleButtonOrganizar expand";

        button.onclick = function(){
            if($(button).hasClass("expand")){
                $(button).removeClass("expand").addClass("minimize");
            } else {
                $(button).removeClass("minimize").addClass("expand");
            }
            if (collection.raiz.ref.ref !== null) {
                organizar();
                $(button).attr("disabled","disabled");
                timeout(function(){
                    $(button).removeAttr("disabled");
                },2000);
            }
        };
        
        document.getElementById("main").appendChild(button);
    };

    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.setProperty("primaryColorProperty",true);
            collection.inicia();
            $("#main").css("padding-right","400px");
            $("#pre-ordem").click(this.preordem);
            $("#pos-ordem").click(this.posordem);
            $("#em-ordem").click(this.emordem);
            $("#altura").click(this.nivel);
            UI.InitInterface(this.search, this.elementToString);
            UI.InitInterface(this.search,this.elementToString);
            createDiscNull();
            createSelectTypeOrganizar();
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
            if(element !== undefined){
                var result = {'info':element.value};
                result._vizinhos = [];
                if (element.esq.ref.ref !== null) {
                    var nextId = (element.esq.ref.id * 1).toString(16).toUpperCase();
                    result.esquerda = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.esquerda = {id:element.esq.ref.id,tooltipdir:"e"};
                } else {
                    result.esquerda = 'nulo';
                }
                if (element.dir.ref.ref !== null) {
                    var nextId = (element.dir.ref.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.direita = {id:element.dir.ref.id,tooltipdir:"w"};
                } else {
                    result.direita = 'nulo';
                }
                return result;
            }
            return false;
        },
        emordem:function(){
            if(collection.raiz.ref.ref!==null){
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
            if (collection.raiz.ref.ref!==null) {
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
            if (collection.raiz.ref.ref!==null) {
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
            
            if (collection.raiz.ref.ref!==null) {
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
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return $(".dinamicSmallDot[title='"+value+"']").length!==0;
            }
            return false;
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor','Insira apenas números inteiros');
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>" + value + "</b>");
                    var info = createDisc(value);
                    Plumb.tornarArrastavel(info.id);
                    animationAdd(info);
                    $(info.d).click(function () {
                        UI.highlightInput("valor", $(info.d).find(".itemValue").text());
                    });
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {

            var value = UI.value('valor','Insira apenas números inteiros');
            if(value!=="") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationRemove(info);
            }

        },
        searchValue: function () {
            var value = UI.value('valor','Insira apenas números inteiros');
            if(value!=="") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationSearch(info);
            }
        }

    };
})();