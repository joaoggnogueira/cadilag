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
                    this.removeSucessor(raiz, raiz.ref.dir);
                    if (Math.abs(this.fatorBalanceamento(raiz)) >= 2) {
                        this.verifica(pai, raiz);
                    }
                }
            }
        }
    };

    this.removeSucessor = function (q, p) {
        if (p.ref.esq.ref.ref == null) {
            q.ref.value = p.ref.value;
            q.ref.ref = p.ref.ref;

            p.ref = p.ref.dir.ref;
        } else {
            this.removeSucessor(q, p.ref.esq);
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
        var selected = document.getElementById("organizar_select").value;
        if(selected === "simetrico") {
            organizarSimetrico(2000);
        } else if(selected === "reduzido") {
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
    
    animationRotacao = function(){
        var temp = null;
        var totalRotacoes = 0;
        if((temp = collection.getRotacao()) && (temp !== null)) {
            if (temp.id_rotacao === 1) {//1: Rotaciona para Esquerda
                totalRotacoes = 1;
                animationRotacaoEsquerda(temp.pai,temp.raiz);
            } else if (temp.id_rotacao === 2) {//2: Rotaciona para Direita e depois Esquerda
                totalRotacoes = 2;
                animationRotacaoDireitaEsquerda(temp.pai,temp.raiz);
            } else if (temp.id_rotacao === 3) {//3: Rotaciona para Direita
                totalRotacoes = 1;
                animationRotacaoDireita(temp.pai,temp.raiz);
            } else if (temp.id_rotacao === 4) { //4: Rotaciona para Esquerda e depois Direita
                totalRotacoes = 2;
                animationRotacaoEsquerdaDireita(temp.pai,temp.raiz);
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
        
        while (raiz.ref.ref != null) {
            pos = {left: parseInt(raiz.ref.ref.style.left), top: parseInt(raiz.ref.ref.style.top)};
            Plumb.moveTo(info.id, pos.left,pos.top + 40, 2000);
            pai = raiz;

            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                raiz = raiz.ref.esq;
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                raiz = raiz.ref.dir;
            } else {
                timeout(function(){
                    Plumb.fadeOut(info.id,1000,function(){
                        $("#"+info.id).remove();
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    });
                },2000*(i+1));
                return;                            
            }
            i++;
        }

        timeout(function(){
            collection.insere(info);
            organizar();
            if (pai != null) {
                connectDisc(pai, info);
            }
            timeout(function(){
                var totalRotacoes = animationRotacao();
                
                timeout(function(){
                    if(totalRotacoes===0){
                        connectDisc(pai, info);
                    }
                    $(nullpointer.d).remove();
                    updateInitial();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                }, totalRotacoes * 2000);
            },2000);
        }, i * 2000);
    },
    animationSearch = function (info) {
        UI.lock();
        var raiz = collection.raiz;
        var j = 0;

        while (raiz.ref.ref !== null) {
            Plumb.moveTo(info.id,parseFloat(raiz.ref.ref.style.left), parseFloat(raiz.ref.ref.style.top) + 40,2000);

            if (parseInt(info.valor) < parseInt(raiz.ref.value)){
                raiz = raiz.ref.esq;
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                raiz = raiz.ref.dir;
            } else {
                break;
            }
            j++;
        }

        timeout(function(){
            Plumb.fadeOut(info.id,1000);
            if (raiz.ref.ref !== null) {
                Plumb.blink(raiz.ref.id,6000,function(){
                    $("#" + info.id).remove();
                    UI.unlock();
                });
            } else {
                timeout(function(){
                    $("#" + info.id).remove();
                    UI.unlock();
                }, 1000);
            }
        }, j * 2000 + 2000);
    },
    animationRemove = function (info) {
        UI.lock();
        var raiz = collection.raiz;
        var pos = {left: 500, top: 75};
        var j = 0;
        var pai = null;
        while (raiz.ref.ref !== null) {
            pos = {left: parseInt(raiz.ref.ref.style.left), top: parseInt(raiz.ref.ref.style.top)+40};
            Plumb.moveTo(info.id, pos.left,pos.top, 2000);

            if (parseInt(info.valor) < parseInt(raiz.ref.value)) {
                pai = raiz;
                raiz = raiz.ref.esq;
            } else if (parseInt(info.valor) > parseInt(raiz.ref.value)) {
                pai = raiz;
                raiz = raiz.ref.dir;
            } else {
                break;
            }
            j++;
        }

        if(raiz.ref.ref===null) { //elemento não encontrado
            timeout(function(){
                Plumb.fadeOut(info.id,1000,function(){
                    $("#"+info.id).remove();
                    UI.unlock();
                    window.Eprogramada.nextQueue();
                });
            },2000*(j+1));
            return;      
        }

        timeout(function(){
            Plumb.fadeOut(info.id, 1000);
            if (raiz.ref.dir.ref.ref !== null && raiz.ref.esq.ref.ref !== null) { //busca por sucessor
                var id = raiz.ref.id;
                var discsuc = createDiscO(parseInt(raiz.ref.ref.style.left), parseInt(raiz.ref.ref.style.top));
                timeout(function(){
                    $("#"+info.id).remove();
                    var sucessor = raiz.ref.dir;
                    var paisucessor = raiz;
                    var i = 0;
                    while(sucessor.ref.ref !== null) {
                        pos = {left: parseFloat(sucessor.ref.ref.style.left), top: parseFloat(sucessor.ref.ref.style.top)};
                        Plumb.moveTo(discsuc.id, pos.left, pos.top, 2000);
                        i++;
                        if(sucessor.ref.esq.ref.ref !== null) {
                            paisucessor = sucessor;
                            sucessor = sucessor.ref.esq;
                        } else {
                            break;
                        }
                    }
                    timeout( function(){
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
                                    var totalRotacoes = animationRotacao();
                                    timeout(function(){
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
                            var totalRotacoes = animationRotacao();
                            timeout(function(){
                                UI.unlock();
                                window.Eprogramada.nextQueue();
                            },totalRotacoes*2000);
                        },2000);
                    }, 6000);
                },1000);
            }
        }, (j+1) * 2000);

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
                console.log("pai: ");
                console.log(pai);
                console.log("raiz: ");
                console.log(raiz);
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
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.setProperty("primaryColorProperty",true);
            collection.inicia();
            UI.InitInterface(this.search,this.elementToString);
            createDiscNull();
            createSelectTypeOrganizar();
        },
        elementToString: function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var result = {'info':element.value};
                result._vizinhos = [];
                if (element.esq.ref.ref !== null) {
                    var nextId = (element.esq.ref.id * 1).toString(16).toUpperCase();
                    result.esquerda = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.esquerda = {id:element.esq.ref.id,tooltipdir:"e"};
                } else
                    result.esquerda = 'nulo';
                if (element.dir.ref.ref !== null) {
                    var nextId = (element.dir.ref.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length-5));
                    result._vizinhos.direita = {id:element.dir.ref.id,tooltipdir:"w"};
                } else
                    result.direita = 'nulo';
                return result;
            }
            return false;
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
                if(value!=="") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
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

