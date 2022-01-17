jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ListaCruzada() {
    this.NLINHAS = 10;
    this.NCOLUNAS = 10;
    this.linhas = new Array(this.NLINHAS);
    this.colunas = new Array(this.NCOLUNAS);
    this.numElementos = 0;

    ListaCruzada.criaNo = function () {
        return {info: null, id: null, ref: null, coluna: null, linha: null, dir: null, baixo: null, conecDir: null, conecBaixo: null, endp1: null, endp2: null};
    };

    this.inicia = function (NCOLUNAS, NLINHAS) {
        this.NLINHAS = parseInt(NLINHAS) || this.NLINHAS;
        this.NCOLUNAS = parseInt(NCOLUNAS) || this.NCOLUNAS;
        for (var i = 0; i < this.NLINHAS; i++)
            this.linhas[i] = null;
        for (var i = 0; i < this.NCOLUNAS; i++)
            this.colunas[i] = null;
        this.numElementos = 0;
    };

    this.busca = function (i, j) {
        if (i < this.NLINHAS && j < this.NCOLUNAS) {
            var aux = this.linhas[i];

            while (aux) {
                if (aux.coluna == j)
                    return aux;
                aux = aux.dir;
            }
        }
        return null;
    };

    this.insere = function (i, j, valor, endp1, endp2) {
        if (i < this.NCOLUNAS && j < this.NLINHAS) {
            var novo = ListaCruzada.criaNo();
            this.numElementos++;
            novo.linha = i;
            novo.coluna = j;
            novo.info = valor.valor;
            novo.id = valor.id;
            novo.ref = valor.ref;
            novo.endp1 = endp1;
            novo.endp2 = endp2;
            Element.bind(novo, novo.id);
            var coluna, linha;
            var aux1 = this.colunas[j], anterior1 = null,
                    aux2 = this.linhas[i], anterior2 = null;

            if (aux1) {
                linha = this.colunas[j].linha;

                while (aux1.baixo && linha < i) {
                    anterior1 = aux1;
                    aux1 = aux1.baixo;
                    linha = aux1.linha;
                }
                if(linha !== i){
                    if (aux1.baixo || (!aux1.baixo && linha > i)) {
                        if (!anterior1) {
                            novo.baixo = aux1;
                            this.colunas[j] = novo;
                        } else {
                            novo.baixo = anterior1.baixo;
                            anterior1.baixo = novo;
                        }
                    } else {
                        novo.baixo = null;
                        aux1.baixo = novo;
                    }
                }  else {
                    return false;
                }
            } else {
                novo.baixo = null;
                this.colunas[j] = novo;
            }

            if (aux2) {
                coluna = this.linhas[i].coluna;

                while (aux2.dir && coluna < j) {
                    anterior2 = aux2;
                    aux2 = aux2.dir;
                    coluna = aux2.coluna;
                }
                if(coluna !== j){
                    if (aux2.dir || (!aux2.dir && coluna > j)) {
                        if (!anterior2) {
                            novo.dir = aux2;
                            this.linhas[i] = novo;
                        } else {
                            novo.dir = anterior2.dir;
                            anterior2.dir = novo;
                        }
                    } else {
                        novo.dir = null;
                        aux2.dir = novo;
                    }
                } else {
                    return false;
                }
            } else {
                novo.dir = null;
                this.linhas[i] = novo;
            }
            return true;
        }
 
    };

    this.remover = function (i, j) {
        var coluna = this.linhas[i].coluna;
        var leitorLinha = this.linhas[i], anteriorLinha = null;

        while (leitorLinha && coluna != j) {
            anteriorLinha = leitorLinha;
            leitorLinha = leitorLinha.dir;
            coluna = leitorLinha.coluna;
        }

        var leitorColuna = this.colunas[j], anteriorColuna = null;

        while (leitorColuna != leitorLinha) {
            anteriorColuna = leitorColuna;
            leitorColuna = leitorColuna.baixo;
        }

        if (anteriorLinha){
            anteriorLinha.dir = leitorLinha.dir;
        } else {
            this.linhas[i] = leitorLinha.dir;
        }

        if (anteriorColuna) {
            anteriorColuna.baixo = leitorColuna.baixo;
        } else {
            this.colunas[j] = leitorColuna.baixo;
        }
        var valor = leitorLinha.info;
        return valor;
    };
    
    this.search = function(id) {
        for (var i = 0; i < this.NLINHAS; ++i) {
            var aux = this.linhas[i];
            while (aux) {
                if (aux.id == id) {
                    break;
                }
                aux = aux.dir;
            }
            if (aux)
                break;
        }

        return aux;
    };

    this.getIJ = function (id) {
        var linha = -1;
        var coluna = -1;

        for (var i = 0; i < this.NLINHAS; ++i) {
            var aux = this.linhas[i];
            while (aux) {
                if (aux.id == id) {
                    linha = aux.linha;
                    coluna = aux.coluna;
                    break;
                }
                aux = aux.dir;
            }
            if (aux)
                break;
        }

        return {i: linha, j: coluna};
    };

    this.proximoColuna = function (posI, posJ) {
        posI = parseInt(posI);
        posJ = parseInt(posJ);

        var aux = null;
        for (var i = posJ + 1; i < this.NCOLUNAS; i++) {
            aux = this.busca(posI, i);
            if (aux)
                break;
        }
        return aux;
    };

    this.anteriorColuna = function (posI, posJ) {
        posI = parseInt(posI);
        posJ = parseInt(posJ);

        var aux = null;
        for (var i = posJ - 1; i >= 0; --i) {
            aux = this.busca(posI, i);
            if (aux)
                break;
        }

        return aux;
    };

    this.proximoLinha = function (posI, posJ) {
        posI = parseInt(posI);
        posJ = parseInt(posJ);

        var aux = null;
        for (var i = posI + 1; i < this.NLINHAS; ++i) {
            aux = this.busca(i, posJ);
            if (aux)
                break;

        }

        return aux;
    };

    this.anteriorLinha = function (posI, posJ) {
        posI = parseInt(posI);
        posJ = parseInt(posJ);

        var aux = null;
        for (var i = posI - 1; i >= 0; --i) {
            aux = this.busca(i, posJ);
            if (aux)
                break;
        }

        return aux;
    };

}

(function () {
    var collection = new ListaCruzada();
    var pointerDots = new Array(collection.NLINHAS + collection.NCOLUNAS);

    var setRightFinal = function(elId,key){
        $("#"+elId).find("span.finalright").remove();
        if(key) {
            $("#"+elId).append("<span class='finalright'></span>");
        }
    },
    setBottomFinal = function(elId,key){
        $("#"+elId).find("span.finalbottom").remove();
        if(key) {
            $("#"+elId).append("<span class='finalbottom'></span>");
        }
    },
    animationAdd = function (linha, coluna, info, infoLinha, infoColuna, novo, endp1, endp2) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        setRightFinal(info.id,true);
        setBottomFinal(info.id,true);
        $("#"+info.id).hide();
        var highlighter = new HighlighterAlgoritmo(VK.INSERCAO);
        var pos = {left: 50, top: 155};
        var elemFinal = false;
        var antColuna, antLinha;
        var animatePrepareLeitorColuna = function (info) {
            Plumb.moveTo(info.id, pos.left + 75 + coluna * 52 - 5, pos.top - 80, 2000);
            return 2000;
        };

        var animatePrepareLeitorLinha = function (info) {
            Plumb.moveTo(info.id, pos.left - 7, pos.top + (52 * linha) - 5, 2000);
            return 2000;
        };

        var animateLeitorColuna = function (info) {
            
            var i = 0;
            antColuna = null;
            var elem = collection.colunas[coluna];
            if (elem.linha === linha) {
               
                if (elem.baixo == null) {
                     
                    if (novo) {
                        StepRecord.add("Coluna está vazia");
                        highlighter.lineRed(10, 0);
                        highlighter.line(43, 500);
                    } else {
                        StepRecord.add("Elemento já está na coluna");
                        highlighter.line(10, 0);
                        highlighter.lineRed(13, 500);
                    }
                } else {
                    StepRecord.add("Novo elemento vai ser adicionado antes do primeiro atual da coluna");
                    highlighter.line(10, 0);
                    highlighter.line(12, 500);
                    highlighter.lineRed(13, 1000);
                }
                elemFinal = elem;

            } else {
                StepRecord.add("A Busca começa no início da coluna: "+coluna);
                highlighter.line(10, 0);
            }
            while (elem.linha !== linha) {
                highlighter.line(13, 2000 * i + 900);
                highlighter.line(15, 2000 * i + 1250);
                highlighter.line(16, 2000 * i + 1500);
                highlighter.line(17, 2000 * i + 1750);
                Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                antColuna = elem;
                elem = elem.baixo;
                timeout( function() {
                    StepRecord.add("Busca na coluna continua para o próximo elemento a abaixo");
                }, (i + 1) * 2000);
                i++;
                if (elem.linha === linha) {
                    elemFinal = elem;
                    highlighter.clear(2000 * i - 10);
                    highlighter.lineRed(13, 2000 * i);

                    timeout( function() {
                        if (novo) {
                            StepRecord.add("Busca na linha encerrada");
                        } else {
                            StepRecord.add("Busca na linha encerrada pois o elemento já está na coluna");
                        }
                    }, i * 2000);

                }
            }
            if (!novo) {
                Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                i++;
            }

            return i * 2000;
        };
        var animateLeitorLinha = function (info) {
            
            var i = 0;
            antLinha = null;
            var elem = collection.linhas[linha];
            if (elem.coluna === coluna) {
                highlighter.clear(0);
                if (elem.dir == null) {
                    StepRecord.add("Linha está vazia");
                    highlighter.lineRed(48, 10);
                    highlighter.line(76, 500);
                } else {
                    StepRecord.add("Novo elemento vai ser adicionado antes do primeiro atual da coluna");
                    highlighter.line(48, 0);
                    highlighter.line(50, 500);
                    highlighter.lineRed(51, 1000);
                }
            } else {
                StepRecord.add("A segunda busca começa no início da linha: "+linha);
                highlighter.line(48, 0);
            }
            while (elem.coluna !== coluna) {
                highlighter.line(51, 2000 * i + 900);
                highlighter.line(53, 2000 * i + 1250);
                highlighter.line(54, 2000 * i + 1500);
                highlighter.line(55, 2000 * i + 1750);
                Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                antLinha = elem;
                elem = elem.dir;
                timeout( function() {
                    StepRecord.add("Busca na linha continua para o próximo elemento a direita");
                }, (i + 1) * 2000);
                i++;
                if (elem.coluna === coluna) {
                    highlighter.clear(2000 * i - 10);
                    highlighter.lineRed(51, 2000 * i);
                    timeout( function() {
                        StepRecord.add("Busca na linha encerrada");
                    }, i * 2000);
                }
            }
            if (!novo) {
                Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                i++;
            }

            return i * 2000;
        };
        var MOVERPosicaoFinal = function (info) {
            Plumb.moveTo(info.id, pos.left + 75 + coluna * 52, pos.top + (52 * linha), 2000);
            return 2000;
        };

        highlighter.lines(0, 2, 10);
        highlighter.lines(3, 7, 500);
        timeout( function(){
            $("#"+info.id).show();
        },500);
        timeout( function() {
            highlighter.line(8, 0);
            var timeUntil = animatePrepareLeitorColuna(infoColuna);
            timeout( function() {
                highlighter.line(9, 0);
                timeUntil = animatePrepareLeitorLinha(infoLinha);
                timeout( function() {
                    timeUntil = animateLeitorColuna(infoColuna, highlighter);
                    timeout( function() {
                        if (novo) {
                            timeUntil = MOVERPosicaoFinal(info);
                            timeout( function() {
                                if (collection.colunas[coluna].linha === linha && collection.colunas[coluna].baixo == null) {
                                    highlighter.line(45, 1000);
                                    highlighter.line(46, 1500);
                                } else {
                                    highlighter.lineRed(19, 0);
                                    if (elemFinal.baixo) {
                                        highlighter.line(24, 500);
                                        if (collection.colunas[coluna].linha === linha) {
                                            highlighter.line(26, 800);
                                            highlighter.line(28, 1200);
                                            highlighter.line(29, 1600);
                                        } else {
                                            highlighter.line(31, 800);
                                            highlighter.lineRed(26, 800);
                                            highlighter.line(33, 1200);
                                            highlighter.line(34, 1600);
                                        }
                                    } else {
                                        highlighter.line(37, 500);
                                        highlighter.lineRed(24, 500);
                                        highlighter.line(39, 1200);
                                        highlighter.line(40, 1600);
                                    }
                                }
                                connectDiscColuna(info.id,antColuna);
                                timeout( function() {
                                    Plumb.fadeOut(infoColuna.id,400);
                                    timeUntil = animateLeitorLinha(infoLinha);
                                    timeout( function() {
                                        connectDiscLinha(info.id,antLinha);
                                        if (collection.linhas[linha].coluna === coluna && collection.linhas[linha].dir == null) {
                                            highlighter.line(78, 1000);
                                            highlighter.line(79, 1500);
                                        } else {
                                            if (elemFinal.dir) {
                                                highlighter.line(57, 500);
                                                if (collection.linhas[linha].coluna === coluna) {
                                                    highlighter.line(59, 800);
                                                    highlighter.line(61, 1200);
                                                    highlighter.line(62, 1600);
                                                } else {
                                                    highlighter.line(64, 800);
                                                    highlighter.lineRed(59, 800);
                                                    highlighter.line(66, 1200);
                                                    highlighter.line(67, 1600);
                                                }
                                            } else {
                                                highlighter.line(70, 500);
                                                highlighter.lineRed(57, 500);
                                                highlighter.line(72, 1200);
                                                highlighter.line(73, 1600);
                                            }
                                        }
                                        timeout( function() {
                                            Plumb.fadeOut(infoLinha.id,400);
                                            timeout( function() {
                                                
                                                $("#" + infoLinha.id).remove();
                                                $("#" + infoColuna.id).remove();
                                                highlighter.clear(0);
                                                UI.unlock();
                                                StepRecord.end();
                                                window.Eprogramada.nextQueue();
                                            }, 400);
                                        }, 2000);
                                    }, timeUntil);
                                }, 2000);
                            }, timeUntil);
                        } else {
                            highlighter.line(19, 500);
                            highlighter.line(21, 1000);
                            highlighter.line(22, 1500);
                            $("#" + elemFinal.id+" .itemValue").html(info.valor);
                            Plumb.fadeOut(infoLinha.id,400);
                            StepRecord.add("Como elemento já está na lista cruzada, atualiza o valor do elemento");
                            timeout( function() {
                                jsPlumb.deleteEndpoint(endp1);
                                jsPlumb.deleteEndpoint(endp2);
                                highlighter.clear(0);
                                $("#" + infoLinha.id).remove();
                                $("#" + infoColuna.id).remove();
                                $("#" + info.id).remove();
                                UI.unlock();
                                StepRecord.end();
                                window.Eprogramada.nextQueue();
                            }, 2000);
                        }
                    }, timeUntil);
                }, timeUntil);
            }, timeUntil);
        }, 1000);

    },
    animationSearch = function (linha, coluna, info) {
        UI.lock();
        StepRecord.start();
        StepRecord.add("Estado inicial");
        var pos = {left: 50, top: 155};

        var highlighter = new HighlighterAlgoritmo(VK.BUSCA);
        highlighter.lines(0, 1, 1000);
        Plumb.moveTo(info.id, pos.left - 5, pos.top + (52 * linha) - 5, 2000);

        timeout( function() {
            timeout( function(){
                StepRecord.add("Posicionando leitor no inicio da linha :"+linha);
            },2000);
            
            var i = 0;
            var elem = collection.linhas[linha];
            var ant = null;
            if (elem != null) {
                Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                while (elem.coluna < coluna) {
                    highlighter.line(2, 0 + 2000 * i);
                    highlighter.lineRed(4, 600 + 2000 * i);
                    highlighter.line(6, 1200 + 2000 * i);
                    Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                    if (elem.dir == null) {
                        break;
                    }
                    ant = elem;
                    elem = elem.dir;
                    i++;
                    timeout( function() {
                        StepRecord.add("Busca avança para o elemento a direita");
                    }, (i+2) * 2000);
                }
                if (elem.coluna == coluna) {
                    Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                    highlighter.line(2, 2000 * i);
                    highlighter.line(4, 600 + 2000 * i);
                    highlighter.line(5, 1200 + 2000 * i);
                    timeout( function() {
                        StepRecord.add("Busca encerrada e elemento encontrado");
                    }, ((i+2) * 2000 + 1000));
                } else {
                    Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                    highlighter.lineRed(2, 2000 * i);
                    highlighter.line(8, 2000 * i + 1000);
                    timeout( function() {
                        StepRecord.add("Busca encerrada e elemento não foi encontrado");
                    }, ((i+2) * 2000 + 1000));
                }
                highlighter.clear(2000 * i + 2000);
            } else {
                highlighter.lineRed(2, 0);
                highlighter.line(8, 1000);
                highlighter.clear(2000);
                elem = {coluna: -1, value: undefined};
                Plumb.moveTo(info.id, pos.left + 70, pos.top + (52 * linha) - 5, 2000);
                $("#" + info.id).css("z-index", "1000");
                timeout( function(){
                    StepRecord.add("O leitor é nulo, logo não existe nenhum elemento na linha");
                },5000);
            }

            timeout( function() {

                var time = 5000;
                if (elem.coluna === coluna) {
                    $("#" + info.id).css("background-image", "url(../../images/correct-symbol.svg)");
                } else {

                    $("#" + info.id).css("background-image", "url(../../images/xmark.svg)");
                }
                if (elem.coluna === -1) {
                    time = 1000;
                }
                Plumb.blink(elem.id,6000);
                
                timeout( function() {
                    Plumb.fadeOut(info.id,1000);
                    timeout( function() {
                        StepRecord.end();
                        $("#" + info.id).remove();
                        UI.unlock();
                    }, 1000);
                }, time);

            }, (i + 2) * 2000);
        }, 2000);

    },
    animationRemove = function (linha, coluna, infoLinha, infoColuna) {
        UI.lock();
        var pos = {left: 50, top: 155};
        var no = null;
        var anteriorLinha = null;
        var anteriorColuna = null;
        StepRecord.start();
        StepRecord.add("Estado inicial");
        
        var animatePrepareLeitorColuna = function (info) {
            Plumb.moveTo(info.id, pos.left + 75 + coluna * 52 - 5, pos.top - 80, 2000);
            return 2000;
        };

        var animatePrepareLeitorLinha = function (info) {
            Plumb.moveTo(info.id, pos.left - 5, pos.top + (52 * linha) - 5, 2000);
            return 2000;
        };

        var animateLeitorColuna = function (info) {
            timeout( function(){
                StepRecord.add("A segunda busca começa no início da coluna: "+coluna);
            },2000);
            var i = 0;
            var elem = collection.colunas[coluna];
            if(elem == null) {
                highlighter.clear(2000);
                highlighter.lineRed(11,2000);
                return 3000;
            }
            while (elem.linha < linha) {
                Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                anteriorColuna = elem;
                timeout( function() {
                    StepRecord.add("Busca na coluna continua para o próximo elemento a abaixo");
                }, (i + 2) * 2000);
                if (elem.baixo == null) {
                    break;
                }
                elem = elem.baixo;
                i++;
                highlighter.line(11, 2000 * i + 0);
                highlighter.line(13, 2000 * i + 500);
                highlighter.line(14, 2000 * i + 1000);
            }
            if (elem.linha == linha) {
                StepRecord.add("Elemento encontrado");
                Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                highlighter.lineRed(11, 2000 * i + 2000);
                no = elem;
            } else { //não pode ocorrer isso
                console.log("problemas");
                if (elem.baixo != null) {
                    Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                    i++;
                }
            }
            return (i * 2000 + 3000);
        };
        var animateLeitorLinha = function (info) {
            
            var i = 0;
            var elem = collection.linhas[linha];
            if (elem.coluna === coluna) {
                highlighter.clear(1000);
                highlighter.lineRed(3, 1000);
            }
            timeout( function() {
                StepRecord.add("Busca começa no início da linha: "+linha);
            }, 2000);

            while (elem.coluna < coluna) {
                highlighter.line(3, 2000 * i + 500);
                highlighter.line(5, 2000 * i + 1000);
                highlighter.line(6, 2000 * i + 1500);
                Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                anteriorLinha = elem;
                timeout( function() {
                    StepRecord.add("Busca na linha continua para o próximo elemento a direita");
                }, (i + 2) * 2000);
                if (elem.dir == null) {
                    break;
                }
                elem = elem.dir;
                i++;
            }
            
            highlighter.clear(2000 * (i + 1));
            highlighter.lineRed(3, 2000 * (i + 1));
            if (elem.coluna != coluna) {
                if (elem.baixo != null) {
                    Plumb.moveTo(info.id, pos.left + 70 + coluna * 52, pos.top + (52 * elem.linha) - 5, 2000);
                    i++;
                }
            } else {
                Plumb.moveTo(info.id, pos.left + 70 + elem.coluna * 52, pos.top + (52 * linha) - 5, 2000);
                no = elem;
            }
            return (i + 1) * 2000;
        };

        var highlighter = new HighlighterAlgoritmo(VK.REMOCAO);
        highlighter.lines(0, 1, 0);

        timeout( function() {
            highlighter.line(2, 0);
            var timeUntil = animatePrepareLeitorLinha(infoLinha);
            timeout( function() {
                if (collection.linhas[linha] != null) {
                    timeUntil = animateLeitorLinha(infoLinha);
                    timeout( function() {
                        if (no != null) {
                            StepRecord.add("Elemento encontrado");
                            timeUntil = animatePrepareLeitorColuna(infoColuna);
                            timeout( function() {
                                highlighter.line(8,500);
                                highlighter.line(10,1000);
                                timeUntil = animateLeitorColuna(infoColuna);
                                timeout( function() {
                                    if(anteriorLinha) {
                                        highlighter.line(16,10);
                                        highlighter.line(17,1000);
                                    } else {
                                        highlighter.line(18,10);
                                        highlighter.lineRed(16,10);
                                        highlighter.line(19,1000);
                                    }
                                    if(anteriorColuna) {
                                        highlighter.line(20,2000);
                                        highlighter.line(21,3000);     
                                    } else {
                                        highlighter.line(22,2000);
                                        highlighter.lineRed(20,2000);     
                                        highlighter.line(23,3000);     
                                    }
                                    Plumb.blink(no.id,6000,function(){
                                        Plumb.fadeOut(no.id,1000);
                                        Plumb.fadeOut(infoLinha.id,400);
                                        disconnectDiscLinha(anteriorLinha, no, linha);
                                        timeout( function() {
                                            Plumb.fadeOut(infoColuna.id,400);
                                            disconnectDiscColuna(anteriorColuna, no, coluna);
                                            timeout( function() {
                                                StepRecord.end();
                                                highlighter.clear();
                                                destroyDisc(no);
                                                UI.unlock();
                                                window.Eprogramada.nextQueue();
                                            }, 1000);
                                        }, 1000);
                                    });
                                }, timeUntil);
                            }, timeUntil);
                        } else {
                            $("#" + infoLinha.id).css("z-index","10000").css("background-image", "url(../../images/xmark.svg)");
                            StepRecord.add("Busca encerrada e elemento não foi encontrado");
                            highlighter.clear(2000);
                            highlighter.lineRed(8, 2000);
                            timeout( function() {
                                Plumb.fadeOut(infoLinha.id,400);
                                Plumb.fadeOut(infoColuna.id,400);
                                timeout( function() {
                                    StepRecord.end();
                                    highlighter.clear(0);
                                    UI.unlock();
                                    window.Eprogramada.nextQueue();
                                }, 1000);
                            }, 3000);
                        }
                    }, timeUntil);
                } else {
                    StepRecord.add("Elemento não foi encontrado pois a linha está vazia");
                    highlighter.clear(1000);
                    highlighter.lineRed(3, 1000);

                    highlighter.clear(2000);
                    highlighter.lineRed(8, 2000);
                    timeout( function() {
                        Plumb.fadeOut(infoLinha.id,400);
                        Plumb.fadeOut(infoColuna.id,400);
                        timeout( function() {
                            StepRecord.end();
                            highlighter.clear(0);
                            UI.unlock();
                            window.Eprogramada.nextQueue();
                        }, 1000);
                    }, 3000);
                }
            }, timeUntil);
        }, 2000);
    },
    prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: true, anchor: "Right"});
    },
    prepare1 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: false, isTarget: true, isPrimary: false, anchor: "Bottom"});
    },
    prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: false, anchor: "Top"});
    },
    prepare3 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId, {isSource: true, isTarget: false, isPrimary: true, anchor: "Left"});
    },
    connectDiscColuna = function (id,ant) {
        
        timeout( function() {
            var pos = collection.getIJ(id);
            var disc = collection.search(id);

            if (ant) {
                var nulo = true;
                if (ant.conecBaixo != null) {
                    jsPlumb.detach(ant.conecBaixo);
                    nulo = false;
                }
                ant.endp2 = prepare1(ant.id);
                setBottomFinal(ant.id, false);
                ant.conecBaixo = Plumb.conectar(ant.endp2, prepare2(id),"abaixo");
                StepRecord.add("Elemento anterior na coluna aponta para o novo, e o novo aponta para o próximo abaixo"+(nulo?", que no caso é um nulo":""));
            } else {
                StepRecord.add("Novo elemento se torna o primeiro da coluna");
                if (pointerDots[pos.j].conecBaixo) {
                    jsPlumb.detach(pointerDots[pos.j].conecBaixo);
                }
                pointerDots[pos.j].conecBaixo = Plumb.conectar(prepare1(pointerDots[pos.j].id), prepare2(id),"abaixo");
            }

            timeout( function() {
                if (disc.baixo) {
                    setBottomFinal(id,false);
                    disc.conecBaixo = Plumb.conectar(prepare1(id), prepare2(disc.baixo.id,"abaixo"));
                }
            }, 600);
        }, 600);


    },
    connectDiscLinha = function (id,ant) {
        timeout( function() {
            var pos = collection.getIJ(id);
            var disc = collection.search(id);

            if (ant) {
                var nulo = true;
                if (ant.conecDir != null) {
                    jsPlumb.detach(ant.conecDir);
                    nulo = false;
                }
                ant.endp1 = prepare(ant.id);
                setRightFinal(ant.id, false);
                ant.conecDir = Plumb.conectar(ant.endp1, prepare3(id), "direita");
                StepRecord.add("Elemento anterior na linha aponta para o novo, e o novo aponta para o próximo á direita"+(nulo?", que no caso é um nulo":""));
            } else {
                StepRecord.add("Novo elemento se torna o primeiro da linha");
                if (pointerDots[collection.NLINHAS + parseInt(pos.i)].conecDir){
                    jsPlumb.detach(pointerDots[collection.NLINHAS + parseInt(pos.i)].conecDir);
                }
                pointerDots[collection.NLINHAS + parseInt(pos.i)].conecDir = Plumb.conectar(prepare(pointerDots[collection.NLINHAS + parseInt(pos.i)].id), prepare3(id),"direita");
            }

            timeout( function() {
                if (disc.dir){
                    setRightFinal(id,false);
                    collection.busca(pos.i, pos.j).conecDir = Plumb.conectar(prepare(id), prepare3(disc.dir.id),"direita");
                }
            }, 600);
        }, 600);
    },
    disconnectDiscColuna = function (anterior, no, j) {
        j = j * 1;
        if (anterior) {
            jsPlumb.select({source: anterior.id, target: no.id}).detach();
            if (no.baixo) {
                jsPlumb.select({source: no.id, target: no.baixo.id}).detach();
                jsPlumb.deleteEndpoint(anterior.endp2);
                anterior.endp2 = prepare1(anterior.id);
                anterior.conecBaixo = Plumb.conectar(anterior.endp2, prepare2(no.baixo.id),"abaixo");
                StepRecord.add("Elemento anterior na coluna aponta para o próximo");
            } else {
                setBottomFinal(anterior.id,true);
                anterior.conecBaixo = null;
                StepRecord.add("Elemento anterior na coluna aponta para o próximo, que no caso é nulo");
            }
        } else {
            jsPlumb.select({source: pointerDots[j].id, target: no.id}).detach();
            if (no.baixo) {
                jsPlumb.select({source: no.id, target: no.baixo.id}).detach();
                pointerDots[j].conecBaixo = Plumb.conectar(prepare1(pointerDots[j].id), prepare2(no.baixo.id),"abaixo");
                StepRecord.add("Próximo elemento abaixo se torna o inicio da coluna");
            } else {
                pointerDots[j].conecBaixo = null;
                StepRecord.add("Início da coluna aponta para nulo");
            }
        }
    },
    
    disconnectDiscLinha = function (anterior, no, i) {
        i = i * 1;
        if (anterior) {
            jsPlumb.select({source: anterior.id, target: no.id}).detach();
            if (no.dir) {
                jsPlumb.select({source: no.id, target: no.dir.id}).detach();
                jsPlumb.deleteEndpoint(anterior.endp1);
                anterior.endp1 = prepare(anterior.id);
                anterior.conecDir = Plumb.conectar(anterior.endp1, prepare3(no.dir.id),"direita");
                StepRecord.add("Elemento anterior na linha aponta para o próximo");
            } else {
                setRightFinal(anterior.id,true);
                anterior.conecDir = null;
                StepRecord.add("Elemento anterior na linha aponta para o próximo, que no caso é nulo");
            }
        } else {
            jsPlumb.select({source: pointerDots[collection.NLINHAS + i].id, target: no.id}).detach();
            if (no.dir) {
                jsPlumb.select({source: no.id, target: no.dir.id}).detach();
                pointerDots[collection.NLINHAS + i].conecDir = Plumb.conectar(prepare(pointerDots[collection.NLINHAS + i].id), prepare3(no.dir.id),"direita");
                StepRecord.add("Próximo elemento abaixo se torna o inicio da linha");
            } else {
                pointerDots[collection.NLINHAS + i].conecDir = null;
                StepRecord.add("Início da linha aponta para nulo");
            }
        }

    },
    destroyDisc = function (noCorrente) {
        jsPlumb.detachAllConnections(noCorrente.id);
        jsPlumb.deleteEndpoint(noCorrente.endp1);
        jsPlumb.deleteEndpoint(noCorrente.endp2);
        $("#" + noCorrente.id).remove();
        collection.remover(noCorrente.linha, noCorrente.coluna);
        Plumb.clearEndpoints();
    },
    createDisc = function (value, linha, coluna) {
        var elem = Element.createElement(
                {className: "dinamicSmallDot altColor cruzadaDot",
                    innerHTML: "<span class='itemValue altColorTitle' style='top:7px'>" + value + "</span>",
                    left: "48px",
                    top: "80px",
                    title: value + "/" + linha + "/" + coluna,
                    idParent: "main"});
        elem.valor = value;
        return elem;
    },
    createDiscLinha = function (value) {
        var elem = Element.createElement(
                {className: "dinamicSmallDotLinha",
                    left: "43px",
                    innerHTML: value,
                    top: "75px",
                    idParent: "main"});
        return elem;
    },
    createDiscColuna = function (value) {
        var elem = Element.createElement(
                {className: "dinamicSmallDotColuna",
                    left: "43px",
                    top: "75px",
                    innerHTML: value,
                    idParent: "main"});
        return elem;
    },
    createPointerDot = function (top, left, radius) {
        var elem = Element.createElement(
                {className: "dotPointer",
                    innerHTML: "",
                    left: left,
                    top: top,
                    idParent: "main"});

        elem.d.style.borderRadius = radius;
        elem.conecDir = null;
        elem.conecBaixo = null;
        return elem;
    },
    setValue = function (d, i, id) {
        d.onclick = function() {
            UI.highlightInput(id, i);
        };
    },
    populateDotArray = function () {

        for (var i = 0, j = 130; i < collection.NLINHAS; ++i, j += 52) {
            pointerDots[i] = createPointerDot(97 + "px", j + "px", "10px 10px 0px 0px");
            prepare1(pointerDots[i].id);
            setValue(pointerDots[i].d, i, "coluna");
        }

        for (i = collection.NLINHAS, j = 247; i < collection.NLINHAS + collection.NCOLUNAS; ++i, j += 52) {
            pointerDots[i] = createPointerDot((j - 85) + "px", 65 + "px", "10px 0px 0px 10px");
            prepare(pointerDots[i].id);
            setValue(pointerDots[i].d, i - collection.NLINHAS, "linha");
        }
    },
    draw = function () {
        var main = document.getElementById('main');

        for (var i = 0; i < collection.NLINHAS; i++) {
            var d = document.createElement("div");
            d.className = "staticCruzadaValue";
            d.style.left = (i * 52 + 120) + "px";
            d.style.top = "75px";
            main.appendChild(d);
            d.innerHTML = "<p style='margin:0px;color:white;font-weight:bold;width:50px;text-align:center;margin-top:2px;'> " + i + "</p>";
            setValue(d, i, "coluna");
        }

        for (var i = 0; i < collection.NCOLUNAS; i++) {
            var d = document.createElement("div");
            d.className = "staticCruzadaValue";
            d.style.left = "43px";
            d.style.top = (i * 52 + 150) + "px";
            main.appendChild(d);
            d.innerHTML = "<p style='margin:0px;margin-left:5px;color:white;font-weight:bold;line-height:50px'>" + i + "</p>";
            setValue(d, i, "linha");
        }

    };

    window.Cadilag = {
        init: function () {
            
            Plumb.init(true);
            UI.AddInput('linha');
            UI.AddInput('coluna');
            UI.setProperty("primaryColorProperty", true);
            UI.lock();
            $("#stop").hide();
            $("#main").css("height", "100vh").addClass("cruzadastyle");
            $("#newStruct").click(this.newStruct);
            UI.InitInterface(this.search, this.elementToString);
        },
        search: function () {
            var value = UI.value("valor");
            var linha = UI.value("linha");
            var coluna = UI.value("coluna");
            if (value !== "" && coluna !== "" && linha !== "") {
                return $(".dinamicSmallDot[title='" + value + "/" + linha + "/" + coluna + "']").length !== 0;
            }
            return false;
        },
        elementToString: function (id) {
            var element = Element.get(id);
            
            if (element !== undefined) {
                var result = {'info': element.info, 'linha': element.linha, 'coluna': element.coluna};
                result._vizinhos = [];
                if (element.dir !== null) {
                    var nextId = (element.dir.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.direita = {id:element.dir.id,tooltipdir:"w"};
                } else {
                    result.direita = 'nulo';
                }
                if (element.baixo !== null) {
                    var nextId = (element.baixo.id * 1).toString(16).toUpperCase();
                    result.baixo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.abaixo = {id:element.baixo.id,tooltipdir:"n"};
                } else {
                    result.baixo = 'nulo';
                }
                return result;
            }
            return false;
        },
        newStruct: function () {
            var linhas = UI.value("sizeVer", "Numero de Linhas é invalido");
            var colunas = UI.value("sizeHor", "Numero de Colunas é invalido");
            if (linhas !== "" && colunas !== "") {
                UI.setParameters({N_LINHAS: linhas, N_COLUNAS: colunas});
                UI.InitFunctions(Cadilag.addDisc, Cadilag.removeValue, Cadilag.searchValue);
                $("#newStruct").unbind('click');
                $("#linha").attr("max", parseInt(linhas) - 1);
                $("#coluna").attr("max", parseInt(colunas) - 1);
                collection.inicia(linhas, colunas);
                draw();
                populateDotArray();
                UI.unlock();
                $("#subtopbar").animate({"top": "0px"}, 500, function () {
                    $(this).remove();
                });
            }
        },
        addDisc: function () {
            if (UI.checkInterface()) {
                var valor = UI.value('valor');
                var linha = UI.value('linha', "Linha deve ser um número");
                var coluna = UI.value('coluna', "Coluna deve ser um número");

                if (valor !== "" && coluna !== "" && linha !== "") {
                    var info = createDisc(valor, linha, coluna);
                    var infoLinha = createDiscLinha();
                    var infoColuna = createDiscColuna();

                    var endp1 = prepare1(info.id);
                    var endp2 = prepare(info.id);
                    UI.subtitle("Inserindo o valor <b>" + valor + "</b> na linha <b>" + linha + "</b> e coluna <b>" + coluna + "</b>");
                    var novo = collection.insere(linha, coluna, info, endp1, endp2);
                    animationAdd(linha, coluna, info, infoLinha, infoColuna, novo, endp1, endp2);
                    Plumb.tornarArrastavel(info.id);
                    $(info.d).click(function(){
                        UI.highlightInput("valor",$(info.d).find(".itemValue").text());
                        UI.highlightInput("linha",linha);
                        UI.highlightInput("coluna",coluna);
                    });
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            var linha = UI.value('linha', "Linha deve ser um número");
            var coluna = UI.value('coluna', "Coluna deve ser um número");

            if (coluna !== "" && linha !== "") {
                UI.subtitle("Removendo o nó na linha <b>" + linha + "</b> e coluna <b>" + coluna + "</b>");
                var infoLinha = createDiscLinha();
                var infoColuna = createDiscColuna();
                animationRemove(linha, coluna, infoLinha, infoColuna);
            }

        },
        searchValue: function () {
            var linha = UI.value('linha', "Linha deve ser um número");
            var coluna = UI.value('coluna', "Coluna deve ser um número");
            if (coluna !== "" && linha !== "") {
                var info = createDiscLinha();
                UI.subtitle("Buscando o valor na linha <b>" + linha + "</b> e coluna <b>" + coluna + "</b>");
                animationSearch(linha, coluna, info);
            }
        }
    };
})();
