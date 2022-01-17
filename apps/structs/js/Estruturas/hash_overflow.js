jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function HashColisao() {
    this.MAX = 10;
    this.MAXOVER = 10;
    this.DISP = 0;
    this.tabelaHash = new Array(this.MAX);
    this.tabelaOverflow = new Array(this.MAXOVER);

    HashColisao.criaNo = function (elem) {
        return {ref: elem.d, id: elem.id, value: elem.valor, prox: -1};
    };

    this.inicia = function (MAX,MAXOVER) {
        this.MAX = MAX || this.MAX;
        this.MAXOVER = MAXOVER || this.MAXOVER;
        for (var i = 0; i < this.MAX; ++i)
            this.tabelaHash[i] = null;
        for (var i = 0; i < this.MAXOVER; ++i){
            this.tabelaOverflow[i] = {ref: null, id: null, value: null, prox: (i+1!=this.MAXOVER?i+1:-1)};
        }
    };
    this.hashFunction = function (chave) {
        var qtd = chave.length;
        var soma = 0;

        for (var i = 0; i < qtd; ++i)
            soma += (i + 1) * chave.charCodeAt(i);

        return soma % this.MAX;
    };
    
    this.insere = function (elem) {
        var ind = this.hashFunction(elem.valor);
        if(this.tabelaHash[ind] !== null) {
            if(this.DISP !== -1) {
                if(this.tabelaHash[ind].prox === -1){
                    this.tabelaHash[ind].prox = this.DISP;
                } else {
                    var leitor = this.tabelaHash[ind].prox;
                    while(this.tabelaOverflow[leitor].prox !== -1){
                        leitor = this.tabelaOverflow[leitor].prox;
                    }
                    this.tabelaOverflow[leitor].prox = this.DISP;
                }
                
                var aux = this.tabelaOverflow[this.DISP].prox;
                this.tabelaOverflow[this.DISP] = HashColisao.criaNo(elem);
                Element.bind(this.tabelaOverflow[this.DISP],elem.id,{index:this.DISP,overflow:true});
                this.DISP = aux;

            } else {
                 this.tabelaHash[ind] = HashColisao.criaNo(elem);
                 Element.bind(this.tabelaHash[ind],elem.id,{index:ind,overflow:false});
            }
        } else {
            this.tabelaHash[ind] = HashColisao.criaNo(elem);
            Element.bind(this.tabelaHash[ind],elem.id,{index:ind,overflow:false});
        }
        
        return true;
    };

    this.remove = function (chave) {
        var ind = this.hashFunction(chave);

        if (this.tabelaHash[ind] != null) {
            if(this.tabelaHash[ind].value == chave) {
                if(this.tabelaHash[ind].prox == -1){
                    this.tabelaHash[ind] = null;
                } else {
                    var prox = this.tabelaHash[ind].prox;
                    this.tabelaHash[ind].value = this.tabelaOverflow[prox].value;
                    this.tabelaHash[ind].prox = this.tabelaOverflow[prox].prox;
                    this.tabelaOverflow[prox].ref = null;
                    this.tabelaOverflow[prox].id = null;
                    this.tabelaOverflow[prox].value = null;
                    this.tabelaOverflow[prox].prox = this.DISP;
                    this.DISP = prox;
                }
            } else {
                var ant = -1;
                var leitor = this.tabelaHash[ind].prox;
                while(leitor != -1 && this.tabelaOverflow[leitor].value != chave){
                    ant = leitor;
                    leitor = this.tabelaOverflow[leitor].prox;
                }
                if(leitor != -1) {
                    if(ant != -1) {
                        this.tabelaOverflow[ant].prox = this.tabelaOverflow[leitor].prox;
                    } else {
                        this.tabelaHash[ind].prox = this.tabelaOverflow[leitor].prox;
                    }
                    this.tabelaOverflow[leitor].prox = this.DISP;
                    this.tabelaOverflow[leitor].ref = null;
                    this.tabelaOverflow[leitor].id = null;
                    this.tabelaOverflow[leitor].value = null;
                    this.DISP = leitor;
                }
            }
        }

    };
}

(function () {
    var collection = new HashColisao();
    var counterDISP = null;
    var 
    updateCounterDISP = function(ind,time){
        if(ind === -1){
            ind = collection.MAXOVER;
        }
        Plumb.moveTo(counterDISP.id,875,(ind*52 + 95),time);
    },
    setHashFuctionText = function (value,hash) {
        if(value !== undefined){
            $(".hashFunctionDot p b").html(hash).addClass("grande");;
        } else {
            $(".hashFunctionDot p b").html("y").removeClass("grande");
        }
    },
    animationAdd = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[ind];
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        highlighter.line(0,10);
        highlighter.lineGreen(1,600);
        highlighter.clear(2000);
        Plumb.moveTo(info.id,295,250,2000);
        timeout(function(){
            setHashFuctionText(info.valor,ind);
            StepRecord.add("Calcula a função Hash para "+info.valor+" retornando a posição "+ind);
        }, 2000);
        if (elementoNaPosicao != null) {
            var disp = collection.DISP;
            Plumb.moveTo(info.id,parseInt(elementoNaPosicao.ref.style.left) - 50,parseInt(elementoNaPosicao.ref.style.top),2000);
            
            if(disp != -1){
                highlighter.line(8, 2000);
                highlighter.lineRed(2, 2000);
                timeout(function(){
                    timeout(function(){
                         StepRecord.add("A posição "+ind+" já possui um elemento, logo a inserção será na Área de Overflow");
                    },2000);
                    var count = 1;
                    if(elementoNaPosicao.prox != -1){
                        StepRecord.add("Lê-se a lista na área de overflow para inserir o novo elemento");
                        highlighter.line(12,0);
                        highlighter.lineRed(10,0);
                        highlighter.line(14,500);
                        highlighter.line(15,1000);
                        Plumb.moveTo(info.id,750, 105 + (elementoNaPosicao.prox * 52),2000);
                        var leitor = collection.tabelaHash[ind].prox;
                        while(collection.tabelaOverflow[leitor].prox !== -1){
                            timeout(function(){
                                 StepRecord.add("Busca avança na lista estática");
                            },2000+count*2000);
                            highlighter.line(16,count*2000);
                            highlighter.line(17,1000+count*2000);
                            leitor = collection.tabelaOverflow[leitor].prox;
                            Plumb.moveTo(info.id,750, 105 + (leitor * 52),2000);
                            count++;
                        }
                        highlighter.lineRed(16,count*2000);
                        highlighter.line(18,1000+count*2000);
                        count++;
                    } else { 
                        highlighter.line(10,0);
                        highlighter.line(11,1000);
                    }
                    Plumb.moveTo(info.id,805, 105 + (disp * 52),2000);
                    
                    timeout(function(){
                        highlighter.line(20,0);
                        highlighter.line(21,400);
                        highlighter.line(22,800);
                        highlighter.line(23,1200);
                        highlighter.line(24,1600);
                        if(elementoNaPosicao.prox == -1){
                            $("#arraynext"+ind).addClass("enabled").html(disp);
                        } else {
                            $("#arraynextoverflow"+leitor).html(disp).addClass("enabled");
                        }
                        $("#arraynextoverflow"+disp).html("-1");
                        updateCounterDISP(collection.tabelaOverflow[disp].prox,2000);
                        timeout(function(){
                            StepRecord.add("Insere o elemento na Área de Overflow");
                            highlighter.clear(0);
                            setHashFuctionText();
                            StepRecord.end();
                            collection.insere(info);
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        },2000);
                    },2000*count);
                },4000);
            } else {
                highlighter.line(26, 2000);
                highlighter.lineRed(2, 2000);
                highlighter.lineRed(8, 2000);
                highlighter.line(27, 3000);
                Plumb.showMessage("Estrutura Hash cheia",4000);    
                //6000
                Plumb.moveTo(info.id,parseInt(elementoNaPosicao.ref.style.left),parseInt(elementoNaPosicao.ref.style.top),2000);
                timeout(function() {
                    StepRecord.add("Como a área de Overflow está cheia, ocorre uma colisão");
                    Plumb.fadeOut(collection.tabelaHash[ind].id,2000,function(){
                        $(collection.tabelaHash[ind].ref).remove();
                        timeout(function(){
                            highlighter.clear(0);
                            setHashFuctionText();
                            StepRecord.end();
                            collection.insere(info);
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        },2000);
                    });
                },4000);
            }
        } else {
            highlighter.line(2, 2000);
            highlighter.lines(4, 6, 3000);
            
            Plumb.moveTo(info.id, 605, 105 + (ind * 52),2000);
            timeout(function(){
                $("#arraynext"+ind).show();
                highlighter.clear(0);
                StepRecord.add("Tabela Hash recebe o elemento no índice "+ind+" pois a posição está vazia");
                setHashFuctionText();
                StepRecord.end();
                collection.insere(info);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 4000);
        }

    },
    
    animationSearch = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[collection.hashFunction(info.valor)];
        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        Plumb.moveTo(info.id, 295, 250, 2000);
        Plumb.moveTo(info.id, 540, 105 + (ind * 52), 2000);
        highlighter.lines(0,1,10);
        highlighter.lineGreen(2,500);
        timeout(function(){
            setHashFuctionText(info.valor,collection.hashFunction(info.valor));
            StepRecord.add("Calcula a função Hash para "+info.valor+" retornando a posição "+ind);
        }, 2000);
        if (elementoNaPosicao != null) {
            highlighter.line(3,1000);  
            if(elementoNaPosicao.value == info.valor){
                highlighter.line(5,2000);
                highlighter.line(6,3000);
                timeout(function(){
                    StepRecord.add("Elemento foi encontrado na Tabela Hash");
                    Plumb.blink(elementoNaPosicao.id,6000);
                    changeColor(ind);
                    Plumb.fadeOut(info.id, 2000, function(){
                        highlighter.clear(0);
                        $(info.d).remove();
                        reset(ind);
                        UI.unlock();
                        StepRecord.end();
                        setHashFuctionText();
                    });
                }, 4000);
            } else {
                highlighter.line(7,2000);
                highlighter.lineRed(5,2000);
                highlighter.line(9,2500);
                highlighter.line(10,3000);
                timeout(function(){
                    StepRecord.add("Elemento não foi encontrado na Tabela Hash e busca continua para Área de Overflow");
                },4000);
                var i = 0;
                var leitor = elementoNaPosicao.prox;
                Plumb.moveTo(info.id, 750, 105 + (leitor * 52),2000);
                while(leitor != -1 && collection.tabelaOverflow[leitor].value != info.valor ){
                    leitor = collection.tabelaOverflow[leitor].prox;
                    timeout(function () {
                        StepRecord.add("Busca continua pela Área de Overflow");
                    }, 4000 + i * 2000);
                    if (leitor != -1) {
                        Plumb.moveTo(info.id, 750, 105 + (leitor * 52),2000);
                        highlighter.line(11,4000+i*2000);
                        highlighter.lineRed(13,4500+i*2000);
                        highlighter.line(15,5000+i*2000);
                        i++;
                    }
                }
                timeout(function() {
                    if(leitor != -1){
                        highlighter.line(13,2000);
                        highlighter.line(14,3000);
                        changeColorOverflow(leitor);
                        Plumb.fadeOut(info.id,2000);
                        Plumb.blink(collection.tabelaOverflow[leitor].id, 4000, function () {
                            StepRecord.add("Elemento foi encontrado na lista da Área de Overflow");
                            highlighter.clear(0);
                            $(info.d).remove();
                            resetOverflow(leitor);
                            UI.unlock();
                            StepRecord.end();
                            setHashFuctionText();
                        });
                    } else {
                        highlighter.lineRed(11,500);
                        highlighter.line(19,1000);
                        Plumb.fadeOut(info.id, 2000, function () {
                            StepRecord.add("Elemento mão foi encontrado na lista da Área de Overflow");
                            highlighter.clear(0);
                            $(info.d).remove();
                            UI.unlock();
                            StepRecord.end();
                            setHashFuctionText();
                        });
                    }
                },4000 + 2000*i);
            }
        } else {
            highlighter.lineRed(3,1000);
            highlighter.line(19,2000);
            highlighter.clear(3000);
            timeout(function(){
                Plumb.fadeOut(info.id, 1000);
                StepRecord.add("Elemento não foi encontrado");
                timeout(function(){
                    UI.unlock();
                    StepRecord.end();
                    setHashFuctionText();
                    $("#" + info.id).remove();
                },1000);
            },4000);
        }
    },
    animationRemove = function (info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado Inicial");
        var ind = collection.hashFunction(info.valor);
        var elementoNaPosicao = collection.tabelaHash[collection.hashFunction(info.valor)];
        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.line(0,10);
        highlighter.lineGreen(1,1000);
        timeout(function(){
            setHashFuctionText(info.valor,collection.hashFunction(info.valor));
            StepRecord.add("Calcula a funÃ§Ã£o Hash para "+info.valor+" retornando a posiÃ§Ã£o "+ind);
        }, 2000);
        
        var notfoundAnimation = function(){
            timeout(function () {
                StepRecord.add("Elemento não foi encontrado");
                Plumb.fadeOut(info.id, 1000, function () {
                    highlighter.clear(0);
                    $("#" + info.id).remove();
                    StepRecord.end();
                    UI.unlock();
                    StepRecord.end();
                    setHashFuctionText();
                    window.Eprogramada.nextQueue();
                });
            }, 4000);
        };
        
        Plumb.moveTo(info.id, 295, 250, 2000);
        Plumb.moveTo(info.id, 540, 105 + (ind * 52), 2000);
        
        if (elementoNaPosicao != null) {
            highlighter.line(2,2000);
            if (elementoNaPosicao.value == info.valor) {
                highlighter.line(4,3000);
                Plumb.fadeOut(info.id, 1000, function () {
                    changeColor(ind);
                });
                
                timeout(function () {
                    StepRecord.add("Elemento foi encontrado e removido");
                    Plumb.blink(elementoNaPosicao.id, 4000, function () {
                        Plumb.fadeOut(elementoNaPosicao.id, 1000);
                    });
                }, 4000);
                
                if (elementoNaPosicao.prox != -1) {
                    highlighter.clear(4000);
                    highlighter.lineRed(6,4000);
                    highlighter.lines(13,19,5000);
                    timeout(function () {
                        var left = parseInt(elementoNaPosicao.ref.style.left);
                        var top = parseInt(elementoNaPosicao.ref.style.top);
                        var id = collection.tabelaOverflow[elementoNaPosicao.prox].id;
                        Plumb.moveTo(id, left, top, 1000);
                        $("#arraynext" + ind).text(collection.tabelaOverflow[elementoNaPosicao.prox].prox);
                        if (collection.tabelaOverflow[elementoNaPosicao.prox].prox == -1) {
                            $("#arraynext" + ind).removeClass("enabled");
                        }
                        $("#arraynextoverflow" + elementoNaPosicao.prox).text(collection.DISP).removeClass("enabled");
                        updateCounterDISP(elementoNaPosicao.prox, 1000);
                    }, 8000);
                } else {
                    highlighter.line(6,4000);
                    highlighter.lines(8,9,5000);
                }

                timeout(function () {
                    if(elementoNaPosicao.prox==-1){
                         $("#arraynext"+ind).hide();
                    }
                    reset(ind);
                    collection.remove(info.valor);
                    $("#" + info.id).remove();
                    $("#" + elementoNaPosicao.id).remove();
                    highlighter.clear(0);
                    StepRecord.end();
                    UI.unlock();
                    StepRecord.end();
                    setHashFuctionText();
                    window.Eprogramada.nextQueue();
                }, 9000);
            } else if(elementoNaPosicao.prox != -1){
                highlighter.line(22,3000);
                highlighter.lineRed(4,3000);
                
                highlighter.lines(22,26,4000);
                
                timeout(function () {
                    var leitor = elementoNaPosicao.prox;
                    var ant = -1;
                    var i = 0;
                    var pos;
                    while(leitor != -1) {
                        pos = {
                            left:parseInt(collection.tabelaOverflow[leitor].ref.style.left) - 50,
                            top:parseInt(collection.tabelaOverflow[leitor].ref.style.top)
                        };
                        Plumb.moveTo(info.id, pos.left, pos.top, 2000);
                        highlighter.line(27, 2000 * i);
                        highlighter.line(29, 2000 * i + 500);
                        highlighter.line(30, 2000 * i + 1000);
                        i++;
                        timeout(function(){
                            StepRecord.add("Busca avança para o próximo elemento da lista na Área de Overflow");
                        },2000*i);
                        if(collection.tabelaOverflow[leitor].value == info.valor){
                            break;
                        }
                        ant = leitor;
                        leitor = collection.tabelaOverflow[leitor].prox;
                    }
                    timeout(function(){
                        if(leitor != -1){
                            highlighter.line(32,10);
                            elementoNaPosicao = collection.tabelaOverflow[leitor];
                            Plumb.fadeOut(info.id, 1000, function () {
                                changeColorOverflow(leitor);
                            });
                            
                            if(ant != -1) {
                                highlighter.line(34,1000);
                                highlighter.line(35,2000);
                                $("#arraynextoverflow"+ant).html(elementoNaPosicao.prox);
                                 if(elementoNaPosicao.prox==-1){
                                    $("#arraynextoverflow"+ant).removeClass("enabled");
                                }
                            } else {
                                highlighter.line(36,1000);
                                highlighter.lineRed(34,1000);
                                highlighter.line(37,2000);
                                $("#arraynext"+ind).html(elementoNaPosicao.prox);
                                if(elementoNaPosicao.prox==-1){
                                    $("#arraynext"+ind).removeClass("enabled");
                                }
                            }
                            
                            highlighter.line(38,2500);
                            highlighter.line(39,3000);
                            highlighter.line(40,3500);
                            $("#arraynextoverflow"+leitor).html(collection.DISP).removeClass("enabled");
                            
                            updateCounterDISP(leitor,1000);
                            
                            timeout(function () {
                                StepRecord.add("Elemento foi encontrado e removido");
                                Plumb.blink(elementoNaPosicao.id, 4000, function () {
                                    Plumb.fadeOut(elementoNaPosicao.id, 1000);
                                });
                            }, 4000);
                            
                            timeout(function () {
                                $(elementoNaPosicao.ref).remove();
                                resetOverflow(leitor);
                                collection.remove(info.valor);
                                $("#" + info.id).remove();
                                UI.unlock();
                                StepRecord.end();
                                setHashFuctionText();
                                window.Eprogramada.nextQueue();
                            }, 9000);
                        } else {
                            highlighter.lineRed(32,10);
                            notfoundAnimation();
                        }
                    }, 2000 * i);
                }, 5000);
            } else {
                highlighter.line(4,2000);
                notfoundAnimation();
            }
        } else {
            highlighter.lineRed(2,2000);
            notfoundAnimation();
        }

    },
    createDisc = function (value) {
        var elem = Element.createElement(
            {className:"dinamicSmallDotStatic altColor",
            innerHTML:"<span class='itemValue altColorTitle' style='top: 8px'>" + value + "</span>",
            left:"0px",
            top:"105px",
            title:value,
            idParent:"main"});
        elem.valor = value;
        return elem;
    },
    reset = function(ind){
        Canvas.resetHash({indice:ind});
    },
    resetOverflow = function(ind){
        Canvas.resetHashOverflow({indice:ind});
    },
    changeColor = function (ind) {
        Canvas.highlightHash({indice:ind});
    },
    changeColorOverflow = function(ind){
        Canvas.highlightHashOverflow({indice:ind});
    },
    draw = function () {
        Canvas.drawHashTable({canvasId:"canv",total:collection.MAX,nextLabels:true});
        Canvas.drawHashOverflowTable({canvasId:"canv",total:collection.MAXOVER,nextLabels:true});
        $(".staticArrayVerticalTitle").css("left","580px");
        var div = document.createElement("div");
        div.className = "counterVertical";
        div.id = "counterVertical";
        div.innerHTML = "<p>DISP</p>";
        document.getElementById("main").appendChild(div);
        counterDISP = div;
        updateCounterDISP(0,10);
        for(var i=0;i<collection.MAX;i++){
            $("#arraynext"+i).hide();
        }
        $(".staticArrayVerticalValue").css("width","77px").css("height","51px");
        $(".staticArrayVerticalNext").css("height","51px");
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            $("#stop").hide();
            $("#newStruct").click(this.newStruct);
            UI.setProperty("primaryColorProperty",true);
            UI.InitInterface(this.search,this.elementToString);
            Canvas.initInterface(this.elementIndexToString);
        },
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return $(".dinamicSmallDotStatic[title='"+value+"']").length!==0;
            }
            return false;
        },
        newStruct: function(){
            var size = UI.value("sizeArray","Tamanho do Vetor Ã© invalido");
            var sizeover = UI.value("sizeArrayOverflow","Tamanho do Vetor de Overflow Ã© invalido");

            if(size !== "" && sizeover !== "") {
                UI.setParameters({TAMANHO_DA_TABELA: collection.MAX});
                UI.InitFunctions(Cadilag.addDisc, Cadilag.removeValue, Cadilag.searchValue);
                $("#newStruct").unbind('click');
                collection.inicia(size,sizeover);
                draw();
                UI.unlock();
                $("#subtopbar").animate({"top": "0px"}, 500, function () {
                    $(this).remove();
                });
            }
        },
        elementIndexToString: function (index,overflow) {
            var arraypos = collection.tabelaHash[index];
            
            var tabela = 'TabelaHash';
            
            if(overflow) {
                tabela = "AreaDeOverflow";
                arraypos = collection.tabelaOverflow[index];
            }
            
            if (arraypos === null) {
                return {'_replaceAll':'nulo','_index':index,'_gravity':'e','_title':tabela};
            } else if(arraypos !== undefined) {
                return {'info':arraypos.value,'prox':arraypos.prox,'_index':index,'_gravity':'e','_title':tabela};
            }
            return false;
        },
        elementToString:function(id){
            var element = Element.get(id);
            if(element!==undefined){
                var vars  = Element.getVars(id);
                var result;
                if(vars.overflow){
                    element = collection.tabelaOverflow[vars.index];
                    if(element === null){
                        return result = {'_replaceAll':'nulo','_gravity':'e','_index':vars.index,'_title':'AreaDeOverflow'};
                    }
                    result = {'info':element.value,'prox':element.prox,'_gravity':'e','_index':vars.index,'_title':'AreaDeOverflow'};
                } else {
                    element = collection.tabelaHash[vars.index];
                    if(element === null){
                        return result = {'_replaceAll':'nulo','_gravity':'e','_index':vars.index,'_title':'TabelaHash'};
                    }
                    result = {'info':element.value,'prox':element.prox,'_gravity':'e','_index':vars.index,'_title':'TabelaHash'};
                }
                
                return result;
            }
            return false; 
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    var info = createDisc(value);
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
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
            var value = UI.value('valor');
            if (value !== "") {
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationRemove(info);
            }
        },
        searchValue: function () {
            var value = UI.value('valor');
            if (value !== "") {
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                var info = createDisc(value);
                animationSearch(info);
            }
        }
    };
})();