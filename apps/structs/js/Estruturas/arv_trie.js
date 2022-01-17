jsPlumb.bind("ready", function () {
    Cadilag.init();
});


function Trie() {
    
    Trie.criaRef = function () { //abstração de ponteiro
        return {ref: null};
    };
    
    Trie.criaNo = function (elem, fim) {
        var novo = {
            id: elem.id, //inteiro {id do elemento na tela}
            d: elem.d, //referência ao elemento na tela
            fim: fim, //é o fim de uma palavra
            info: elem.valor, //caracter
            direita: Trie.criaRef(), //poteiro para elemento a direita
            abaixo: Trie.criaRef(),
            endpoint: {
                top: null,
                left: null,
                bottom: null,
                right: null
            },//para a interface
            connector: {
                abaixo: null,
                direita: null
            }//para a interface, ponteiro para o elemento a abaixo e a direita
        };
        Element.bind(novo, elem.id);
        return novo;
    };

    this.raiz = Trie.criaRef(); //inicializa o raiz da arvore
    
    this.findWordBy = function(elem){//encontra a palavra que termina no elemento DOM
        
        var stack = [];
        
        stack.push(this.raiz);
        
        while(stack.length !== 0){
            
            var no = stack[stack.length - 1];
            
            if(no.ref.d === elem) { //encontrado
                return stringfyArray(stack,["ref","info"]);
            }
            
            if(no.ref.abaixo.ref !== null){ //avança abaixo
                stack.push(no.ref.abaixo);
            } else { //volta acima e tenta avançar a direita
                while(stack.length !== 0 && no.ref.direita.ref === null){
                    stack.pop();
                    no = stack[stack.length - 1];
                }
                if(stack.length === 0){
                    return null;
                } else {
                    stack.pop();
                    stack.push(no.ref.direita);
                }
            }
            
        }
        
    };
    
    this.insere = function (elem) { //insere elem[] na arvore/estrutura
        
        var leitor = this.raiz;
        var acima = null;
        var esquerda = null;
        var ind = 0;
        while(leitor.ref !== null) {
            
            if(leitor.ref.info < elem[ind].valor) { //avança para o próximo a direita
                acima = null;
                esquerda = leitor;
                leitor = leitor.ref.direita;
            } else if(leitor.ref.info > elem[ind].valor) { //inserção no meio da lista 
                break;
            } else if(leitor.ref.info === elem[ind].valor) { //continua pesquisa
                acima = leitor;
                esquerda = null;
                ind++;
                if(ind === elem.length) {
                    leitor.ref.fim = true;
                    return {busca:leitor,novo:false};
                }
                leitor = leitor.ref.abaixo;
            }
        }

        if(leitor.ref === null) {
            this.inserirRamificacao(leitor, elem, ind);
            return {busca:leitor,novo:true,esquerda:esquerda,acima:acima};
        } else { //leitor.ref.info < elem[ind].valor
            var novo = Trie.criaRef();
            novo.ref = Trie.criaNo(elem[ind],(ind + 1 === elem.length));
            if(acima === null) {
                if(esquerda !== null) {
                    esquerda.ref.direita = novo;
                    novo.ref.direita = leitor;
                } else {
                    novo.ref.direita = this.raiz;
                    this.raiz = novo;
                }
            } else {
                acima.ref.abaixo = novo;
                novo.ref.direita = leitor;
            }
            this.inserirRamificacao(novo.ref.abaixo, elem, ind + 1);
            return {busca:novo,novo:true,esquerda:esquerda,acima:acima};
        }
    },
            
    this.inserirRamificacao = function(leitor,elem,ind){
        while(ind < elem.length) {
            leitor.ref = Trie.criaNo(elem[ind],(ind + 1 === elem.length));
            leitor = leitor.ref.abaixo;
            ind++;
        }
    },

    this.remove = function (palavra) {
        var leitor = this.raiz;
        var index = 0;
        var stack = [];
        
        while(leitor.ref !== null && palavra.length !== index){
            
            if(leitor.ref.info === palavra[index]) {
                stack.push(leitor);
                leitor = leitor.ref.abaixo;
                index++;
            } else if(leitor.ref.info < palavra[index]) {
                leitor = leitor.ref.direita;
            } else {
                break;
            }
            
        }
        var copy = stack;
        if(palavra.length === index) {
            var last = stack[stack.length - 1];
            if(last.ref.fim){
                return copy;
            } else {
                console.log("não é final");
            }
        }
        return false;
    };

}

deslocarRamificacao = function (raiz, dx, time) {
    var speed = getSpeed();
    if (raiz.ref !== null) {
        var pos = {left: parseInt(document.getElementById(raiz.ref.id).style.left), top: parseInt(document.getElementById(raiz.ref.id).style.top)};
        Plumb.moveTo(raiz.ref.id, pos.left + dx, pos.top,1000 * speed + time * speed);

        deslocarRamificacao(raiz.ref.baixo, dx, time + 100);
        deslocarRamificacao(raiz.ref.prox, dx, time);
    }
},

(function () {
    var collection = new Trie();
    organizarTudo = function(){
        organizar();
    };
    imprimirTudo = function(){
        imprimir();
    };
    getCollection = function(){
        return collection;
    };
    var nullpointer = null;
    var
    setInitial = function(elId,key){
        $("span.initial").remove();
        if(key) {
            $("#"+elId).append("<span class='initial'>Raiz</span>");
        }
    },
    setRightNull = function(elId,key){
        $("#"+elId).find("span.finalright").remove();
        if(key) {
            $("#"+elId).append("<span class='finalright'></span>");
        }
    },
    setBottomNull = function(elId,key){
        $("#"+elId).find("span.finalbottom").remove();
        if(key) {
            $("#"+elId).append("<span class='finalbottom'></span>");
        }
    },
    prepare = function (elId) { //top
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:false,anchor:"Top"});
    },
    prepare2 = function (elId) { //right
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:true,anchor:[1, 0.5, 0, -1]});
    },
    prepare3 = function (elId) { //bottom
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:false,anchor:"Bottom"});
    },
    prepare4 = function (elId) { //left
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:true,anchor:[0, 0.5, 0, 1]});
    },
    imprimir = function(){
        
    },
    organizar = function(quandoCompletar){
        
        var totalPalavras = 0;
        const offset = {left: 50, top: 120};
        const gap = {left: 80, top: 60};
        const time = 2000;
        var key = 0;
        function r(leitor,altura){
            
            var left = offset.left + totalPalavras * gap.left;
            var top = offset.top + altura * gap.top;
            
            if(leitor.ref.d.style.display !== "none") {
                key = 1;
                Plumb.moveTo(leitor.ref.id, left , top, time);
            } else {
                leitor.ref.d.style.left = left+"px";
                leitor.ref.d.style.top = top+"px";
            }
            
            if(leitor.ref.abaixo.ref !== null){
                r(leitor.ref.abaixo,altura + 1);
            }
            
            if(leitor.ref.direita.ref !== null){
                totalPalavras++;
                r(leitor.ref.direita,altura);
            }
        }   

        r(collection.raiz,0);
        timeout(quandoCompletar,2000*key + 100);
    },
    disconnectAbaixo = function(no){
        if(no.ref.connector.abaixo !== null){
            Plumb.removeConnection(no.ref.connector.abaixo);
            no.ref.endpoint.bottom = prepare3(no.ref.id);
            setBottomNull(no.ref.id,true);
        }
    },
    disconnectDireita = function(no){
        if(no.ref.connector.direita !== null){
            Plumb.removeConnection(no.ref.connector.direita);
            no.ref.endpoint.right = prepare2(no.ref.id);
            setRightNull(no.ref.id,true);
        }
    },
    animationMove = function(disc,no,time){
        if(time === undefined){
            time = 2000;
        }
        var left = parseFloat(no.ref.d.style.left);
        var top = parseFloat(no.ref.d.style.top);

        Plumb.moveTo(disc.id,left,top,time);
    }, 
    connectarDireita = function(de,para){
        disconnectDireita(de);
        
        if(de.ref.endpoint.right === null){
            de.ref.endpoint.right = prepare2(de.ref.id);
        }
        para.ref.endpoint.left = prepare4(para.ref.id);
        de.ref.connector.direita = Plumb.conectar(de.ref.endpoint.right, para.ref.endpoint.left, "direita");
        setRightNull(de.ref.id,false);
    },
    connectarAbaixo = function(pai, filho){
        disconnectAbaixo(pai);

        filho.ref.endpoint.top = prepare(filho.ref.id);
        pai.ref.connector.abaixo = Plumb.conectar(pai.ref.endpoint.bottom, filho.ref.endpoint.top, "abaixo");
        setBottomNull(pai.ref.id,false);
    },
    animationFind = function(elem,header,busca,disc,quandoEncontrar){
        var hightlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        Plumb.fadeIn(disc.id,1000,function(){
            StepRecord.add("Verredura começa na raiz da Árvore");  
            if(collection.raiz === busca) {
                quandoEncontrar(0);
            } else {
                
                var leitor = collection.raiz;
                var ind = 0;
                var passos = 0;
                header.next();
                while(leitor !== busca) {
                    hightlighter.line(6,2000*(passos+1));
                    animationMove(disc,leitor);
                    if(leitor.ref.info < elem[ind].valor) { //avança para o próximo a direita
                        hightlighter.line(8,2000*(passos+1)+400);
                        hightlighter.line(10,2000*(passos+1)+800);
                        hightlighter.line(11,2000*(passos+1)+1200);
                        hightlighter.line(12,2000*(passos+1)+1600);
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-right'></i> Verredura continua o nó a direita");  
                        },(passos+1)*2000);
                        leitor = leitor.ref.direita;
                    } else if(leitor.ref.info === elem[ind].valor) { //continua pesquisa
                        hightlighter.line(6,2000*(passos+1)+400);
                        hightlighter.lineRed(8,2000*(passos+1)+400);
                        hightlighter.lineRed(14,2000*(passos+1)+400);
                        hightlighter.line(18,2000*(passos+1)+800);
                        hightlighter.line(19,2000*(passos+1)+1200);
                        hightlighter.line(20,2000*(passos+1)+1600);
                        leitor = leitor.ref.abaixo;
                        ind++;
                        if(leitor !== busca){
                            hightlighter.lineRed(21,2000*(passos+1)+1800);
                        }
                        timeout(function(){
                            StepRecord.add("<i class='fa fa-arrow-down'></i> Verredura continua o nó abaixo"); 
                            header.next();
                        },2000*(passos+1));
                    }
                    
                    passos++;
                }
                
                timeout(function(){
                    quandoEncontrar(ind);
                },(passos)*2000);

            }
        });
        
    },
    animationAdd = function (info,busca,isNovo,esquerda,acima,header) {
        UI.lock();
        
        var disc = createDiscO(50,120);
        $(disc.d).hide();
        
        var hightlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        hightlighter.lines(0,5,10);
        
        var ending = function(){
            header.remove();
            Plumb.fadeOut(disc.id,2000,function(){
                StepRecord.end();
                hightlighter.clear(0);
                $(disc.d).remove();
                UI.unlock();
                Plumb.repintarTudo();
                window.Eprogramada.nextQueue();
            });
        };
        
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        
        animationFind(info,header, busca, disc, function(ind) {
            hightlighter.clear(10);
            hightlighter.lineRed(6,10);
            if (!isNovo) { //só muda a flag
                hightlighter.line(21,1000);
                hightlighter.line(23,2000);
                hightlighter.line(24,3000);

                for (var i = 0; i < info.length; i++) {
                    $(info[i].d).remove();
                }
                animationMove(disc, busca, 1000);
                timeout(function(){
                    StepRecord.add("Palavra encontrada mas flag é falsa, alterando a flag somente");  
                    $(busca.ref.d).final(true);
                    ending();
                }, 2000);
            } else { //insere ramificação
                for (var i = 0; i < ind; i++) {
                    $(info[i].d).remove();
                }
                organizar(function(){
                    Plumb.repintarTudo();

                    var i = 1;
                    var leitor = busca;
                    var pai = acima;
                    const novo = leitor;
                    var caseindex = 0;
                    timeout(function(){
                        if(novo === collection.raiz) {
                            if(nullpointer !== null){
                                $(nullpointer.d).remove();
                                nullpointer = null;
                            }
                            setInitial(busca.ref.id, true);
                        }
                        if(esquerda === null && novo.ref.direita.ref !== null) {
                            connectarDireita(novo,novo.ref.direita);
                            if(acima !== null) {
                                connectarAbaixo(acima,novo);
                            }
                        }
                        if(esquerda !== null){
                            connectarDireita(esquerda,novo);
                            if(novo.ref.direita.ref !== null){
                                connectarDireita(novo,novo.ref.direita);
                            }
                        }
                    },7000);

                    if(esquerda === null && novo.ref.direita.ref === null){
                        hightlighter.line(29,10);
                        hightlighter.lineGreen(30,1500);
                        caseindex = -1;
                    } else {
                        if(acima === null){
                            hightlighter.line(31,10);
                            hightlighter.lineRed(29,10);
                            if(esquerda !== null){
                                hightlighter.line(37,500);
                                hightlighter.line(39,1000);
                                hightlighter.line(40,1500);
                            } else {
                                hightlighter.lineRed(37,500);
                                hightlighter.line(42,500); 
                                hightlighter.line(44,1000);
                                hightlighter.line(45,1500);
                            }
                        } else {
                            hightlighter.line(48,10);
                            hightlighter.lineRed(35,10);
                            hightlighter.line(50,600);
                            hightlighter.line(51,1200);
                        }
                        hightlighter.line(53,2000);
                    }
                    hightlighter.lines(55,56,3000);
                    while(leitor.ref !== null){
                        const obj = leitor;
                        const objPai = pai;
                        const index = i;
                        timeout(function() {
                            animationMove(disc,obj,1000);
                            if (index !== caseindex) {
                                hightlighter.line(57,10);
                                hightlighter.lineGreen(59,500);
                                hightlighter.line(60,1000);
                                hightlighter.line(61,1500);
                            }
                            timeout(function() {

                                Plumb.fadeIn(obj.ref.id,500,function(){
                                    header.next();
                                    obj.ref.endpoint.bottom = prepare3(obj.ref.id);
                                    if(obj.ref.endpoint.right === null){
                                        obj.ref.endpoint.right = prepare2(obj.ref.id);
                                    }
                                    Plumb.repintarElemento(obj.ref.id);
                                    if(objPai!==null) {
                                        connectarAbaixo(objPai,obj);
                                    }
                                    StepRecord.add("Aloca-se novo elemento na ramificação");  
                                });
                            },1000);
                        },2000 * i + 2000);
                        pai = leitor;
                        leitor = leitor.ref.abaixo;
                        i++;
                    }
                    timeout(function(){
                        hightlighter.clear(10);
                        hightlighter.lineRed(57,10);
                    },2000*(i+1) + 2000);
                    timeout(ending,2000*(i+1) + 2000);
                });
            }
        });

    },
    animationSearch = function (busca,header) {
        var disc = createDiscO(50,120);
        $(disc.d).hide();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        timeout(function(){
            StepRecord.add("Verredura começa na raiz da Árvore");  
        },2000);
        var hightlighter = new HighlighterAlgoritmo(VK.BUSCA);
        hightlighter.lines(0,4,10);
        UI.lock();
        
        Plumb.fadeIn(disc.id,2000,function(){
            var leitor = collection.raiz;
            var ind = 0;
            var passos = 0;
            header.next();
            var total = busca.length - 1;
            var first = true;
            while(leitor.ref !== null) {
                
                if(first) {
                    first = false;
                } else {
                    animationMove(disc, leitor);
                }
                
                if(leitor.ref.info < busca[ind]) { //avança para o próximo a direita
                    leitor = leitor.ref.direita;
                    timeout(function(){
                        StepRecord.add("Verredura continua o nó a direita");  
                    },(passos+1)*2000);
                    timeout(function(){
                        hightlighter.line(5,10);
                        hightlighter.line(7,500);
                        hightlighter.line(8,1000);
                    },2000*passos);
                } else if(leitor.ref.info === busca[ind]) { //continua pesquisa
                    if(ind === total) {
                        break;
                    }
                    leitor = leitor.ref.abaixo;
                    ind++;
                    
                    timeout(function(){
                        hightlighter.line(5,10);
                        hightlighter.line(9,400);
                        hightlighter.lineRed(7,400);
                        hightlighter.clear(800);
                        hightlighter.lineRed(11,800);
                        hightlighter.line(13,1200);
                        hightlighter.line(14,1600);
                    },2000*(passos));
                    timeout(function(){
                        header.next();
                        StepRecord.add("Verredura continua o nó a abaixo");  
                    },2000*(passos+1));
                }
                passos++;
            }
            
            if(leitor.ref !== null){
                animationMove(disc, leitor);
            }
            timeout(function () {
                header.remove();

                Plumb.fadeOut(disc.id, 2000, function () {
                    $(disc.d).remove();
                });
                if (leitor.ref !== null) {
                    hightlighter.line(5, 10);
                    hightlighter.line(9, 1000);
                    hightlighter.lineRed(7, 1000);
                    hightlighter.line(11, 2000);
                    hightlighter.line(12, 3000);
                    Plumb.blink(leitor.ref.id, 6000, function () {
                        hightlighter.clear(0);
                        StepRecord.add("Varredura encerra pois o elemento foi encontrado");
                        StepRecord.end();
                        UI.unlock();
                    });
                } else {
                    hightlighter.lineRed(5, 10);
                    hightlighter.line(15, 1000);
                    timeout(function () {
                        hightlighter.clear(0);
                        StepRecord.add("Varredura encerra pois o elemento não foi encontrado");
                        StepRecord.end();
                        UI.unlock();
                    }, 2000);
                }

            }, (passos + 1) * 2000);

        });

    },
    animationRemovePhase2 = function(value,disc){
        
        var stack = collection.remove(value);
        var index = stack.length - 1;
        
        var leitor = stack[index];
        var hightlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        
        if(leitor.ref.abaixo.ref !== null){
            StepRecord.add("Alterando somente a flag, pois o nó possui um nó-filho abaixo");
            hightlighter.line(21,10);
            hightlighter.line(22,500);
            leitor.ref.fim = false;
            $(leitor.ref.d).final(false);
            Plumb.fadeOut(disc.id,1000,function(){
                hightlighter.clear(0);
                $(disc.d).remove();
                StepRecord.end();
                UI.unlock();
                Plumb.repintarTudo();
                window.Eprogramada.nextQueue();
            });
        } else {
            index--;
            var passos = 0;
            var pai = stack[index];
            hightlighter.line(23,10);
            hightlighter.lineRed(21,10);
            hightlighter.line(25,500);
            hightlighter.lines(26,27,1000);
            StepRecord.add("Remove-se a ramificação no qual só pertence a palavra a ser removida");
            while(pai && !pai.ref.fim && pai.ref.abaixo.ref.direita.ref === null){
                
                animationMove(disc, pai);
                passos++;
                const no = pai;
                timeout(function(){
                    hightlighter.line(28,0);
                    hightlighter.lines(30,31,600);
                    hightlighter.lines(32,33,1200);
                    disconnectAbaixo(no);
                    Plumb.fadeOut(no.ref.abaixo.ref.id,1000,function(){
                        Plumb.desconectarCompletamente(no.ref.abaixo.ref.id);
                        StepRecord.add("Remove e desaloca o nó-filho");
                    });
                },passos*2000);
                index--;
                pai = stack[index];
            }
            if(pai) {
                animationMove(disc, pai);
            }
            passos += 2;
            timeout(function(){
                if (pai && pai.ref.abaixo.ref.direita.ref === null) { //remove até elemento com fim = true
                    StepRecord.add("Apenas se remove e desaloca o nó-filho");
                    hightlighter.line(35,10);
                    hightlighter.line(37,500);
                    hightlighter.line(38,1000);
                    disconnectAbaixo(pai);
                    Plumb.fadeOut(pai.ref.abaixo.ref.id, 1000, function(){
                        Plumb.desconectarCompletamente(pai.ref.abaixo.ref.id);
                        pai.ref.abaixo.ref = null;
                        Plumb.fadeOut(disc.id, 1000, function(){
                            hightlighter.clear(0);
                            $(disc.d).remove();
                            StepRecord.end();
                            UI.unlock();
                            Plumb.repintarTudo();
                            window.Eprogramada.nextQueue();
                        });
                    });

                } else if (pai) { //remove até elemento do inicio da lista
                    timeout(function(){
                        StepRecord.add("Percorre lista para remover o inicio da ramificação");
                    },2000);
                    hightlighter.line(40,10);
                    hightlighter.lineRed(35,10);
                    hightlighter.lines(42,44,1000);
                    var passos = 1;
                    var leitor = pai.ref.abaixo;
                    var ant = null;
                    animationMove(disc,leitor);
                    while(leitor !== stack[index+1]) {
                        ant = leitor;
                        leitor = leitor.ref.direita;
                        animationMove(disc,leitor);
                        passos++;
                        hightlighter.line(45, 10 + passos * 2000);
                        hightlighter.line(47, 500 + passos * 2000);
                        hightlighter.line(48, 1000 + passos * 2000);
                        timeout(function(){
                            StepRecord.add("Varredura avança para o próximo nó da lista");
                        },passos*2000);
                    }
                    timeout(function(){
                        if(ant !== null){
                            timeout(function(){
                                StepRecord.add("Nó anterior aponta para o próximo");
                            },1000);
                            hightlighter.line(50, 10);
                            hightlighter.line(51, 500);
                            if(leitor.ref.direita.ref !== null){
                                connectarDireita(ant,leitor.ref.direita);
                            } else {
                                disconnectDireita(ant);
                            }
                            ant.ref.direita = leitor.ref.direita;
                        } else {
                            timeout(function(){
                                StepRecord.add("Pai aponta para o próximo filho na lista");
                            },1000);
                            hightlighter.line(52, 10);
                            hightlighter.lineRed(50, 10);
                            hightlighter.line(53, 500);
                            connectarAbaixo(pai,leitor.ref.direita);
                            pai.ref.abaixo = leitor.ref.direita;
                        }
                        hightlighter.line(54, 1000);
                        Plumb.fadeOut(disc.id,1000);
                        Plumb.fadeOut(leitor.ref.id,1000,function(){
                            Plumb.desconectarCompletamente(leitor.ref.id);
                            $(disc.d).remove();
                            organizar(function(){
                                hightlighter.clear(0);
                                StepRecord.end();
                                UI.unlock();
                                Plumb.repintarTudo();
                                window.Eprogramada.nextQueue();
                            });
                        });
                    },(passos+1)*2000);
                } else { //remove único elemento
                    StepRecord.add("Remove toda a árvore, pois ela possui somente uma palavra");
                    hightlighter.lineRed(35,10);
                    hightlighter.lineRed(40,10);
                    hightlighter.line(56,500);
                    hightlighter.line(57,1000);
                    var leitor = collection.raiz;
                    Plumb.fadeOut(disc.id,2000);
                    Plumb.fadeOut(leitor.ref.id,2000,function(){
                        hightlighter.clear(0);
                        Plumb.desconectarCompletamente(leitor.ref.id);
                        $(disc.d).remove();
                        StepRecord.end();
                        collection.raiz.ref = null;
                        createDiscNull();
                        UI.unlock();
                        window.Eprogramada.nextQueue();
                    });
                }
             },passos*2000);
        }
    },
    animationRemove = function (value, header) { //só animação de busca
    
        UI.lock();
        var disc = createDiscO(50,120);
        $(disc.d).hide();
        
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        
        var hightlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        hightlighter.lines(0,5,10);
        
        Plumb.fadeIn(disc.id,2000,function(){
            var leitor = collection.raiz;
            var ind = 0;
            var passos = 0;
            header.next();
            var total = value.length - 1;
            StepRecord.add("Varredura inicia-se na Raiz da Árvore");
            while(leitor.ref !== null) {
                hightlighter.line(6,2000*passos);
                if(ind !== 0) {
                    animationMove(disc, leitor);
                }
                if(leitor.ref.info < value[ind]) { //avança para o próximo a direita
                    hightlighter.line(8,2000*passos+500);
                    hightlighter.line(9,2000*passos+1000);
                    leitor = leitor.ref.direita;
                    timeout(function(){
                         StepRecord.add("Varredura avança para o nó-irmão a direita");
                    },2000*(passos+1));
                } else if(leitor.ref.info === value[ind]) { //continua pesquisa
                    hightlighter.line(10,2000*passos+500);
                    hightlighter.lineRed(8,2000*passos+500);
                    if(ind === total) {
                        hightlighter.line(12,2000*passos+1000);
                        hightlighter.line(13,2000*passos+1500);
                        passos++;
                        break;
                    }
                    hightlighter.clear(2000*passos+1000);
                    hightlighter.lineRed(12,2000*passos+1000);
                    hightlighter.lines(14,16,2000*passos+1500);
                    leitor = leitor.ref.abaixo;
                    ind++;
                    timeout(function(){
                        header.next();
                        StepRecord.add("Varredura avança para o nó-filho abaixo");
                    },2000*(passos+1));
                }
                passos++;
            }
            
            if(leitor.ref !== null){
                animationMove(disc, leitor);
            }
            timeout(function(){
                header.remove();
                if(leitor.ref !== null && leitor.ref.fim) {
                    hightlighter.line(19,10);
                    StepRecord.add("Varredura encerra e pois a Palavra foi encontrada");

                    Plumb.blink(leitor.ref.id,6000,function(){
                        animationRemovePhase2(value,disc);
                    });
                } else {
                    if(leitor.ref === null) {
                        hightlighter.clear(0);
                        hightlighter.lineRed(6,10);
                        hightlighter.clear(1500);
                        hightlighter.lineRed(19,1500);
                        StepRecord.add("Varredura encerra e o nó é nulo, logo a palavra não está inclusa na árvore");
                    } else {
                        hightlighter.line(10,10);
                        hightlighter.lineRed(8,500);
                        hightlighter.line(12,1000);
                        hightlighter.line(13,1500);
                        hightlighter.clear(2000);
                        hightlighter.lineRed(19,2000);
                        StepRecord.add("Varredura encerra e o nó não é o final de uma palavra, logo a palavra não está inclusa na árvore");
                    }                         
                    
                    Plumb.fadeOut(disc.id,3000,function(){
                        hightlighter.clear(0);
                        $(disc.d).remove();
                        StepRecord.end();
                        UI.unlock();
                        Plumb.repintarTudo();
                        window.Eprogramada.nextQueue();
                    });
                }
                
            },(passos+1)*2000);

        });

    },
    createDisc = function (value) {
       var elem = Element.createElement(
                {className:"dinamicSmallDot altColor",
                innerHTML:"<span class='itemValue altColorTitle' style='top:7px'>" + value + "</span>",
                left:"30px",
                top:"150px",
                idParent:"main"});
        $("#"+elem.id).hide();
        $("#"+elem.id).fadeIn(600*getSpeed());
        setRightNull(elem.id,true);
        setBottomNull(elem.id,true);
        elem.valor = value;
        return elem;
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
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "dinamicSmallDotNull",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "50px",
                    top: "107px",
                    title: "Lista",
                    idParent: "main"});
        setInitial(nullpointer.id,true);
    },
    createDiscFinal = function (value) {
       var elem = Element.createElement(
                {className:"dinamicSmallDot altColor1 finalPalavra",
                innerHTML:"<span class='itemValue altColorTitle1' style='top:7px'>" + value + "</span>",
                left:"30px",
                top:"150px",
                title:value,
                idParent:"main"});
        $("#"+elem.id).hide();
        $("#"+elem.id).fadeIn(600*getSpeed());
        setRightNull(elem.id,true);
        setBottomNull(elem.id,true);
        elem.valor = value;
        return elem;
    },
    createPalavraHeader = function(palavra){
        var elem = {d:document.createElement("div")};
        elem.id = elem.d.id = "palavraHeader";
        elem.d.className = "palavraHeader";
        elem.array = [];
        for(var i=0;i<palavra.length;i++){
            var letter = document.createElement("div");
            letter.className = "letter";
            letter.innerHTML = palavra[i];
            elem.d.appendChild(letter);
            elem.array[i] = letter;
        }
        
        var ind = -1;
        elem.next = function(){
            if(ind !== -1) {
                elem.array[ind].className = "letter";
            }
            ind++;
            if(ind<elem.array.length) {
                elem.array[ind].className = "letter selected";
            }
        };
        elem.remove = function(){
            Plumb.fadeOut(elem.id,1000,function(){
                $(elem.d).remove();
            });
        };
        
        document.getElementById("main").appendChild(elem.d);
        return elem;
    };
    window.Cadilag = {
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.InitInterface(this.search,this.elementToString);
            UI.setProperty("primaryColorProperty", true);
            UI.setProperty("secondaryColorProperty", true);
            jQuery.fn.final = function (flag) {
                var o = $(this[0]);
                if(flag === undefined){
                    return o.hasClass("finalPalavra");
                }
                
                if(flag){
                    o.addClass("finalPalavra");
                    o.addClass("altColor1").removeClass("altColor");
                    o.find(".itemValue").addClass("altColorTitle1").removeClass("altColorTitle");
                } else {
                    o.removeClass("finalPalavra");
                    o.addClass("altColor").removeClass("altColor1");
                    o.find(".itemValue").addClass("altColorTitle").removeClass("altColorTitle1");
                }
                
                
                UI.changeColorComponentPrimary();
                UI.changeColorComponentSecondary();
                return this;
            };
            createDiscNull();
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
                var result = {'info': element.info,"fim": (element.fim?"true":"false")};
                result._vizinhos = [];
                if (element.abaixo.ref !== null) {
                    var nextId = (element.abaixo.ref.id * 1).toString(16).toUpperCase();
                    result.abaixo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.abaixo = {id:element.abaixo.ref.id,tooltipdir:"w"};
                } else {
                    result.abaixo = 'nulo';
                }
                if (element.direita.ref !== null) {
                    var nextId = (element.direita.ref.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.direita = {id:element.direita.ref.id,tooltipdir:"w"};
                } else {
                    result.direita = 'nulo';
                }
                result._gravity = "s";
                return result;
            }
            return false;
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    value = value.toLowerCase();
                    var info = [];

                    for (var i = 0; i < value.length; i++)  {
                        if (i + 1 !== value.length) {
                            info[i] = createDisc(String.fromCharCode(value.charCodeAt(i)));
                        } else {
                            info[i] = createDiscFinal(String.fromCharCode(value.charCodeAt(i)));
                        }
                        const objthis = info[i];
                        $(objthis.d).hide().click(function(){
                            var result = collection.findWordBy(objthis.d);
                            UI.highlightInput("valor",result);

                        });
                        Plumb.tornarArrastavel(info[i].id);
                    }
                    var header = createPalavraHeader(value);
                    var op = collection.insere(info);
                    UI.subtitle('Inserindo a palavra "<b>'+value+'</b>"');
                    animationAdd(info,op.busca,op.novo,op.esquerda,op.acima,header);
                } else {
                    swal({type:"error",title:"Opss",text:"Entrada está vazia"});
                }
            } else {
                History.rollbackAppendInput();
            }

        },
        removeValue: function () {

            var value = UI.value('valor');

            if (value !== "") {
                var header = createPalavraHeader(value);
                UI.subtitle("Removendo a palavra \"<b>"+value+"</b>\"");
                animationRemove(value,header);
            } else{
                 swal({type:"error",title:"Opss",text:"Entrada está vazia"});
            }

        },
        searchValue: function () {

            var value = UI.value('valor');

            if (value !== "") {
                var header = createPalavraHeader(value);
                UI.subtitle("Buscando a palavra \"<b>"+value+"</b>\"");
                animationSearch(value,header);
            } else {
                 swal({type:"error",title:"Opss",text:"Entrada está vazia"});
            }
        }
    };
})();