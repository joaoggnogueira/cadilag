jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ActionList(inix, iniy) {
    this.qtd = 0;
    this.possiveis_nodes = [];
    this.pqtd = 0;
    this.actions = [];
    this.YPositionAdd;
    this.x = inix;
    this.y = iniy;

    this.add = function (a) {
        this.actions[this.qtd] = a;
        this.qtd++;
    },
    this.addNode = function (node, ind) {
        this.possiveis_nodes[this.pqtd] = {node: node, index: ind};
        this.pqtd++;
    },
    this.accumulate = function (tx, ty)
    {
        this.x += parseInt(tx);
        this.y += parseInt(ty);
    },
    this.setYPositionAdd = function (i) {
        this.YPositionAdd = i;
    },
    this.accumulateX = function (id, tx)
    {
        var obj = $("#" + id);
        var w;

        if (obj.width() == null)
            w = 0;
        else
            w = obj.width() + parseInt(obj.css("padding-left")) + parseInt(obj.css("padding-right")) + tx;

        this.x += w;
    },
    this.accumulateY = function (id, ty)
    {
        var obj = $("#" + id);

        var h;

        if (obj.height() == null)
            h = 0;
        else
            h = obj.height() + parseInt(obj.css("padding-top")) + parseInt(obj.css("padding-bottom")) + ty;

        this.y += h;
    },
    this.setPosition = function (tx, ty)
    {
        this.x = parseInt(tx);
        this.y = parseInt(ty);
    };

}

function UpdateBindings(No){
    
    if(No!==null){
        if(No.disc!==undefined &&  No.disc!==null)
            Element.bind(No,No.disc.id);
        UpdateBindings(No.direita);
        UpdateBindings(No.abaixo);
    }
    
}

function AfterAccumulateY(id, idTarget, ty) {

    this.start = function (time) {
        var obj = $("#" + idTarget);
        var h = obj.height() + parseInt(obj.css("padding-bottom")) + parseInt(obj.css("padding-top")) + ty;
        Plumb.moveTo(id,parseInt($("#" + id).css("left")),parseInt($("#" + id).css("top"))+ h,time);
    };

}

function AfterAccumulateX(id, idTarget, tx) {

    this.start = function (time) {
        var obj = $("#" + idTarget);
        var w = obj.width() + parseInt(obj.css("padding-left")) + parseInt(obj.css("padding-right")) + tx;
        Plumb.moveTo(id, parseInt($("#" + id).css("left")) + w, parseInt($("#" + id).css("top")),time);
    };

}

function SetCharacters(id, str) {
    this.start = function (time) {
        $("#" + id).html("<span class='value'>" + str + "</span>");
    };
}

function Translate(x, y, id) {
    this.start = function (time) {
        Plumb.moveTo(id,  x, y, time);
    };
}

function DeslocarX(patricia_node, offsetx) {
    this.start = function (time) {
        this.rec(patricia_node, offsetx, time);
    },
    this.rec = function (patricia_node, offsetx, time) {
        if (patricia_node != null) {
            this.deslocar(patricia_node.dados.id, parseInt(patricia_node.dados.d.style.left), parseInt(patricia_node.dados.d.style.top), offsetx, time);
            this.rec(patricia_node.direita, offsetx, time);
            this.rec(patricia_node.abaixo, offsetx, time);
        }
    },
    this.deslocar = function (id, left, top, offsetx, time) {
        Plumb.moveTo(id, left + offsetx, top,time);
    };

}

function DeslocarADireita(patricia_node, id, tx) {
    this.start = function (time) {
        var obj = $("#" + id);
        var offsetx;
        if(obj.width()!=null) {
            if(tx>0)
                offsetx = obj.width() + parseInt(obj.css("padding-left")) + parseInt(obj.css("padding-right")) + tx;
            else if(tx<0)
                offsetx = - obj.width() - parseInt(obj.css("padding-left")) - parseInt(obj.css("padding-right")) + tx;
            else
                window.console.log('warning: deslocando 0px a direita');
        }
        else
            offsetx = tx;
        
        this.rec(patricia_node, offsetx, time);
    },
    this.rec = function (patricia_node, offsetx, time) {
        if (patricia_node != null) {
            this.deslocar(patricia_node.dados.id, parseInt(patricia_node.dados.d.style.left), parseInt(patricia_node.dados.d.style.top), offsetx, time);
            this.rec(patricia_node.direita, offsetx, time);
            this.rec(patricia_node.abaixo, offsetx, time);
        }
    },
    this.deslocar = function (id, left, top, offsetx, time) {
        Plumb.moveTo(id, left + offsetx, top, time);
    };

};

function DeslocarABaixo(patricia_node, id, ty) {
    this.start = function (time) {
        var obj = $("#" + id);
        var offsety;
        if(obj.height()!=null) {
            if(ty>0)
                offsety = obj.height() + parseInt(obj.css("padding-bottom")) + parseInt(obj.css("padding-top")) + ty;
            else if(ty<0)
                offsety = - obj.height() - parseInt(obj.css("padding-bottom")) - parseInt(obj.css("padding-top")) + ty;
            else
                window.console.log('warning: deslocando 0px a abaixo');
        } else {
            offsety = ty;
        }
        this.rec(patricia_node, offsety, time);
    },
            
    this.rec = function (patricia_node, offsety, time) {
        if (patricia_node != null) {
            this.deslocar(patricia_node.dados.id, parseInt(patricia_node.dados.d.style.left), parseInt(patricia_node.dados.d.style.top), offsety, time);
            this.rec(patricia_node.direita, offsety, time);
            this.rec(patricia_node.abaixo, offsety, time);
        }
    },
            
    this.deslocar = function (id, left, top, offsety, time) {
        Plumb.moveTo(id, left, top + offsety, time);
    };
 
}

function NovaQuebra(info, pai, filho, ty,finalString) {
    if(finalString===undefined)
        finalString = true;
    this.disc;
    this.init = function () {
        this.disc = Element.createElement(
                {className:"node",
                left:pai.dados.d.style.left,
                top:pai.dados.d.style.top,
                idParent:"main"});
        this.disc.valor = info;
        $("#"+this.disc.id).hide();
        return this.disc;
    };

    this.start = function (time) {
        document.getElementById("main").appendChild(this.disc.d);
        this.disc.d.innerHTML = "<span class='value'>" + info + "</span>";
        
        Plumb.tornarArrastavel(this.disc.id);
        var obj = $("#" + this.disc.id);
        $("#"+this.disc.id).show();
        var offsety = obj.height() + parseInt(obj.css("padding-top")) + parseInt(obj.css("padding-bottom")) + ty;

        new ConnectToDown(pai.dados, this.disc).start();
        
        if(finalString)
            new SetFinalString(this.disc).start();
        
        Plumb.moveTo(this.disc.id,parseInt(this.disc.d.style.left), parseInt(this.disc.d.style.top) + offsety,time);
        if (filho != null) {
            new Disconnect(pai.dados, filho.dados).start();
            new ConnectToDown(this.disc, filho.dados).start();
            new DeslocarABaixo(filho, filho.dados.id, 50).start();
        }
        
    };
}

function PackActions(actions, qtd)
{
    this.start = function (time) {
        for (var i = 0; i < qtd; i++) {
            actions[i].start(time);
        }
    };
}

function Unir(Pai,Filho)
{
    
    this.start = function(time){
        
        var filho = $("#"+Filho.dados.id);
        var pai = $("#"+Pai.dados.id);
        new Disconnect(Pai.dados, Filho.dados).start();


        if(Pai.abaixo !== null){
            new Disconnect(Filho.dados, Pai.abaixo.dados).start();
        }
        
        if(Pai.finalString || Filho.finalString)
            new SetFinalString(Pai.dados).start(time);
        var left = parseInt(Pai.dados.d.style.left)+pai.width()+parseInt(pai.css("padding-left"))+parseInt(pai.css("padding-right"));
        var top = parseInt(Pai.dados.d.style.top);
        Plumb.moveTo(Filho.dados.id,left,top,time,function(){
            pai.html("<span class='value'>" + $("#"+Pai.dados.id+" span").html()+$("#"+Filho.dados.id+" span").html() + "</span>");
            if(Pai.abaixo !== null) {
                new ConnectToDown(Pai.dados,Pai.abaixo.dados).start();
            }
            filho.remove();
        });

        if(Pai.abaixo !== null){
            new DeslocarABaixo(Pai.abaixo,Pai.id,-100).start();
        }

    };
}

function RemoveFinalString(dados) {
    this.start = function (time) {
        dados.d.style.background = "#333";
        dados.d.style.boxShadow = "0 0 10px #333";
        timeout(function (){
            dados.d.style.boxShadow = "none";
        }, time);
    };
}

function SetFinalString(dados) {
    this.start = function (time) {
        timeout(function () {
            dados.d.style.background = "#A33";
            dados.d.style.boxShadow = "0 0 10px #A33";
            timeout(function (){
                dados.d.style.boxShadow = "none";
            }, 2*time/3);
        }, time/3);
    };
};

function RemoveFinalString(dados) {
    this.start = function (time) {
        dados.d.style.background = "#333";
        dados.d.style.boxShadow = "0 0 10px #333";
        timeout(function () {
            dados.d.style.boxShadow = "none";
        }, time);
    };
}

function Hover(dados, color) {
    this.start = function (time) {
        var aux = dados.d.style.backgroundColor;
        dados.d.style.backgroundColor = color;
        dados.d.style.boxShadow = "0 0 10px " + color;
        timeout(function () {
            dados.d.style.backgroundColor = aux;
            dados.d.style.boxShadow = "none";
        }, time);
    };
}

function PassouPorAqui(dados){
    this.start = function (time){
        var aux = dados.d.style.backgroundColor;
        dados.d.style.backgroundColor = "#00F";
        dados.d.style.boxShadow = "0 0 10px #00F";
        timeout(function (){
            dados.d.style.backgroundColor = aux;
            dados.d.style.boxShadow = "none";
        }, time);
    };
}

function FadeOutAndRemove(disc){
    this.start = function(time){
        Plumb.fadeOut(disc.id,time,function(){
            $("#"+disc.id).remove();
        });

    };
}

function Disconnect(pai, filho) {
    this.start = function (time) {
        if (pai != null && filho != null){
            var cnc = jsPlumb.getConnections({source: pai.id, target: filho.id});

            if (cnc[0] != null && cnc[0] != "undefined"){
                jsPlumb.detach(cnc[0]);
            }
        }
    };
}

function RemoveDisc(dados) {
    this.start = function (time) {
        Plumb.fadeOut(dados.id,time,function(){
            $("#" + dados.id).remove();
        });

    };
}

function ConnectToRight(pai, filho) {
    this.pai = pai;
    this.filho = filho;

    this.prepare2 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:true,anchor:[1, 0.5, 0, -1]});
    },
    this.prepare1 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:true,anchor:[0, 0.5, 0, 1]});
    },
    this.start = function (time) {
        Plumb.conectar(this.prepare2(pai.id),this.prepare1(filho.id));
    };
}

function ConnectToDown(pai, filho) {
    this.pai = pai;
    this.filho = filho;

    this.prepare = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:true,isTarget:false,isPrimary:false,anchor:"Top"});
    },
    this.prepare1 = function (elId) {
        return Plumb.adicionarPontoDeConexao(elId,{isSource:false,isTarget:true,isPrimary:false,anchor:"Bottom"});
    },

    this.start = function (time) {
        Plumb.conectar(this.prepare1(pai.id),this.prepare(filho.id));
    };
}

function Patricia() {
    this.info; //STRING
    this.dados; //ID
    this.direita; //Nó a direita
    this.abaixo; //Nó a abaixo
    this.finalString; //Indica se é uma silaba final

    this.inicia = function (info, dados) {
        this.direita = null;
        this.abaixo = null;
        this.finalString = true;
        this.info = info;
        this.dados = dados;
        Element.bind(this,this.dados.id);
    },
    this.init = function (info){
        this.direita = null;
        this.abaixo = null;
        this.finalString = false;
        this.info = info;
        
    },
    /**
     * Código de inserção recursivo e referenciável
     */
    this.insere = function (anteriorpai, anterior, addInfo, dadosInterface, actions, y) {
        var i = 0;
        actions.add(new PassouPorAqui(this.dados));

        while (i < this.info.length && i < addInfo.length) {
            //Caractere Diferente encontrado     
            if (this.info.charCodeAt(i) != addInfo.charCodeAt(i)) {
                //O primeiro caractere é o diferente
                if (i == 0){
                    //Não é essa posição certa
                    if (addInfo.charCodeAt(0) > this.info.charCodeAt(0)) {
                        actions.accumulateX(this.dados.id, 50);
                        //Continua a busca do local de inserção á direita
                        if (this.direita != null) {
                            return this.direita.insere(null, this, addInfo, dadosInterface, actions, y);
                        }
                        //Ao lado é nulo, então pode ser inserido a direita sem nenhuma outra verficação
                        else {
                            actions.setYPositionAdd(y + 1);
                            actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                            actions.add(new ConnectToRight(this.dados, dadosInterface));
                            actions.add(new SetFinalString(dadosInterface));
                            this.direita = new Patricia();
                            this.direita.init(addInfo);
                            this.direita.dados = dadosInterface;
                            this.direita.finalString = true;
                            return;
                        }
                    }
                    //Deslocamento do atual á direita e término dessa Inserção
                    else {

                        var NovoAoDireita = new Patricia();
                        NovoAoDireita.init(this.info);
                        NovoAoDireita.dados = this.dados;
                        NovoAoDireita.direita = this.direita;
                        NovoAoDireita.abaixo = this.abaixo;
                        if (anteriorpai != null)
                            actions.add(new Disconnect(anteriorpai.dados, this.dados));
                        if (anterior != null)
                            actions.add(new Disconnect(anterior.dados, this.dados));

                        actions.add(new DeslocarADireita(NovoAoDireita, dadosInterface.id, 50));
                        actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                        actions.add(new ConnectToRight(dadosInterface, this.dados));

                        if (anterior != null)
                            actions.add(new ConnectToRight(anterior.dados, dadosInterface));
                        if (anteriorpai != null)
                            actions.add(new ConnectToDown(anteriorpai.dados, dadosInterface));

                        actions.add(new SetFinalString(dadosInterface));

                        this.dados = dadosInterface;
                        this.info = addInfo;
                        this.direita = NovoAoDireita;
                        this.abaixo = null;

                        if (this.finalString)
                            this.direita.finalString = true;

                        this.finalString = true;
                        actions.setYPositionAdd(y);
                        return;
                    }
                }
                //Parte da silaba está correta então ocorre quebra
                else {

                    var Quebra = new Patricia();
                    Quebra.init(this.info.substring(i, this.info.length));
                    Quebra.abaixo = this.abaixo;

                    this.abaixo = Quebra;
                    this.info = this.info.substring(0, i);

                    if (this.finalString){
                        this.abaixo.finalString = true;
                        this.finalString = false;
                    }

                    actions.accumulateY(this.dados.id, 50);
                    actions.add(new PackActions([new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)), new SetCharacters(this.dados.id, this.info)], 2));
                    if (!this.finalString)
                        actions.add(new RemoveFinalString(this.dados));

                    var NovaQuebraDados = new NovaQuebra(Quebra.info, this, Quebra.abaixo, 50,this.abaixo.finalString);
                    this.abaixo.dados = NovaQuebraDados.init();
                    actions.add(NovaQuebraDados);

                    if (this.direita != null)
                        actions.addNode(this.direita, y);

                    this.abaixo.insere(this, null, addInfo.substring(i, addInfo.length), dadosInterface, actions, y + 1);

                    if (Quebra.info.charCodeAt(0) < addInfo.substring(i, addInfo.length).charCodeAt(0))
                        actions.add(new AfterAccumulateX(dadosInterface.id, Quebra.dados.id, 50));
                    return;
                }
            }
            //Caratér é igual então verificamos os próximos
            else
                i++;

        }
        //Todos caracteres são iguais e os tamanhos dos dois blocos são iguais
        if (this.info.length == addInfo.length) {

            //Este bloco já final, então significa que já foi incluso
            if (this.finalString){
                actions.add(new RemoveDisc(dadosInterface));
            }
            //Este bloco já fragmentado, só precisa se tornar final
            else {
                actions.add(new PackActions([new RemoveDisc(dadosInterface),new SetFinalString(this.dados)],2));
                actions.setYPositionAdd(y);
                this.finalString = true;
            }
        }
        //Todos caracteres são iguais, logo a inserção será abaixo
        else {
            //O bloco a ser adicionado é maior do que do que já foi inserido, então á quebra do que será inserido
            if (i == this.info.length) {
                //O bloco a ser adicionado é quebrado e continua abaixo
                if (this.abaixo != null) {
                    actions.accumulateY(this.dados.id, 50);
                    actions.add(new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)));
                    if (this.direita != null)
                        actions.addNode(this.direita, y);
                    this.abaixo.insere(this, null, addInfo.substring(i, addInfo.length), dadosInterface, actions, y + 1); //addInfo perdendo
                }
                //Caso abaixo for nulo, é adicionado o novo bloco abaixe sem precisar de verificações
                else {
                    actions.accumulateY(this.dados.id, 50);
                    actions.add(new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)));
                    actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                    actions.add(new ConnectToDown(this.dados, dadosInterface));
                    actions.add(new SetFinalString(dadosInterface));
                    actions.setYPositionAdd(y + 1);
                    this.abaixo = new Patricia();
                    this.abaixo.init(addInfo.substring(i, addInfo.length));
                    this.abaixo.dados = dadosInterface;
                    this.abaixo.finalString = true;
                }
            }
            //Apenas fragmenta este bloco e seta como final
            else {
                var QuebraAbaixo = new Patricia();
                QuebraAbaixo.init(this.info.substring(i, this.info.length));
                QuebraAbaixo.abaixo = this.abaixo;
                QuebraAbaixo.dados = dadosInterface;

                this.abaixo = QuebraAbaixo;
                this.info = this.info.substring(0, i);

                this.finalString = true;
                this.abaixo.finalString = true;
                actions.add(new PackActions([new SetCharacters(this.dados.id, this.info), new SetCharacters(dadosInterface.id, QuebraAbaixo.info)], 2));
                actions.accumulateY(this.dados.id, 50);
                actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                actions.add(new ConnectToDown(this.dados, QuebraAbaixo.dados));
                if (QuebraAbaixo.abaixo != null){
                    actions.add(new Disconnect(this.dados, QuebraAbaixo.abaixo.dados));
                    actions.add(new ConnectToDown(QuebraAbaixo.dados, QuebraAbaixo.abaixo.dados));
                    actions.add(new DeslocarABaixo(QuebraAbaixo.abaixo, this.dados.id, 50));
                }

                actions.add(new SetFinalString(dadosInterface));
                actions.setYPositionAdd(y + 1);
            }

        }

    },

    this.remove = function(palavra,anterior,ultimoPai,actions,dadosInterface){

        actions.add(new PassouPorAqui(this.dados));

        if(palavra.charCodeAt(0)===this.info.charCodeAt(0)) {
            if(palavra.length > this.info.length) {
                if(palavra.startsWith(this.info)) {
                    palavra = palavra.substring(this.info.length);
                    actions.add(new SetCharacters(dadosInterface.id, palavra));
                    if(this.abaixo!==null) {
                        this.abaixo.remove(palavra,this,this,actions,dadosInterface);
                    } else {
                        actions.add(new FadeOutAndRemove(dadosInterface));
                    }
                }
            } else if(palavra === this.info && this.finalString) {
                actions.add(new FadeOutAndRemove(dadosInterface));
                if(anterior===null) {
                    if(this.abaixo===null) {
                        if(this.direita!==null) {
                            actions.add(new Disconnect(this.dados,this.direita.dados));
                            actions.add(new DeslocarADireita(this.direita,this.dados.id,-50));
                        }
                        actions.add(new FadeOutAndRemove(this.dados));

                        this.finalString = false;
                    } else {
                        if(this.abaixo.direita!==null) {
                            actions.add(new RemoveFinalString(this.dados));
                            this.finalString = false;
                        } else {
                            actions.add(new Unir(this,this.abaixo));
                            actions.add(new DeslocarADireita(this.direita,this.abaixo.id,parseInt($("#"+this.abaixo.dados.id).width())));

                            this.info+=this.abaixo.info;
                            this.abaixo = this.abaixo.abaixo;  
                        }
                    }
                } else if(anterior.abaixo === this) {
                    if(this.abaixo===null){
                        anterior.abaixo = this.direita;

                        actions.add(new PackActions([new Disconnect(anterior.dados,this.dados),new DeslocarADireita(this.direita,this.dados.id,-50)],2));
                        if(this.direita !== null) {
                            actions.add(new PackActions([new Disconnect(this.dados,this.direita.dados),new FadeOutAndRemove(this.dados),new ConnectToDown(anterior.dados,this.direita.dados)],3));

                            if(this.direita.direita === null) {
                                anterior.finalString = true;
                                actions.add(new Unir(anterior,this.direita));
                                anterior.info+=this.direita.info;
                                anterior.abaixo=null;
                            }
                        } else {
                            actions.add(new FadeOutAndRemove(this.dados));
                        }
                    } else {
                        if(this.abaixo.direita !== null) {
                            this.finalString = false;
                            actions.add(new RemoveFinalString(this.dados));
                        } else {
                            if(this.abaixo !== null && this.abaixo.direita === null) {
                                actions.add(new Unir(this,this.abaixo));
                                this.info+=this.abaixo.info;
                                this.abaixo=this.abaixo.abaixo;
                            }
                        }
                    }
                }
                else if(anterior.direita === this) {
                    if(this.abaixo === null) {
                        if(this.direita !== null) {
                            actions.add(new PackActions([new Disconnect(anterior.dados,this.dados),new Disconnect(this.dados,this.direita.dados),new FadeOutAndRemove(this.dados)],3));
                            actions.add(new PackActions([new ConnectToRight(anterior.dados,this.direita.dados),new Translate(parseInt(this.dados.d.style.left),parseInt(this.dados.d.style.top),this.direita.dados.id)],2));
                        } else {
                            actions.add(new PackActions([new Disconnect(anterior.dados,this.dados),new FadeOutAndRemove(this.dados)],2));
                        }
                        anterior.direita=this.direita;
                        if(ultimoPai.abaixo === anterior && anterior.direita === null) {
                            if(anterior.abaixo !== null){
                                actions.add(new Disconnect(anterior.dados,anterior.abaixo.dados));
                            }
                            actions.add(new Unir(ultimoPai,anterior));
                            ultimoPai.finalString = ultimoPai.finalString || anterior.finalString;
                            ultimoPai.info += anterior.info;
                            ultimoPai.abaixo = anterior.abaixo;
                        }
                    } else {
                        if(this.abaixo.direita === null) {
                            actions.add(new Unir(this,this.abaixo));
                            actions.add(new DeslocarADireita(this.direita,this.abaixo.id,parseInt($("#"+this.abaixo.dados.id).width())));
                            this.info += this.abaixo.info;
                            this.abaixo = this.abaixo.abaixo;
                        } else {
                            actions.add(new RemoveFinalString(this.dados));
                            this.finalString=false;
                        }
                    }
                }

            } else {
                actions.add(new FadeOutAndRemove(dadosInterface));
            }
        } else if(this.direita!==null && palavra.charCodeAt(0)>this.info.charCodeAt(0)){
            this.direita.remove(palavra,this,ultimoPai,actions,dadosInterface);
        } else {
            actions.add(new FadeOutAndRemove(dadosInterface));
        }

    };

    this.busca = function (palavra, actions) {

        if (palavra.length < palavra.length) {
            if (palavra.charCodeAt(0) > this.info.charCodeAt(0)) {
                if (this.direita != null) {
                    actions.add(new Hover(this.dados, "yellow"));
                    return this.direita.busca(palavra, actions);
                } else {
                    actions.add(new Hover(this.dados, "red"));
                    return false;
                }
            }

            actions.add(new Hover(this.dados, "red"));
            return false;

        }

        var b = palavra.substring(0, this.info.length);

        if (b.charAt(0) > this.info.charAt(0)) {
            if (this.direita != null) {
                actions.add(new Hover(this.dados, "yellow"));
                return this.direita.busca(palavra, actions);
            } else {
                actions.add(new Hover(this.dados, "red"));
                return false;
            }
        }

        if (b == this.info) {
            if (palavra.length == this.info.length) {
                actions.add(new Hover(this.dados, this.finalString ? "#0000FF" : "red"));
                return this.finalString;
            } else if (this.abaixo != null) {
                actions.add(new Hover(this.dados, "#55FF55"));
                return this.abaixo.busca(palavra.substring(this.info.length), actions);
            } else {
                actions.add(new Hover(this.dados, "red"));
                return false;
            }
        }

        actions.add(new Hover(this.dados, "red"));
        return false;

    },
    this.search = function(palavra){
        if (palavra.length < palavra.length) {
            if (palavra.charCodeAt(0) > this.info.charCodeAt(0)) {
                if (this.direita != null) {
                    return this.direita.search(palavra);
                } else {
                    return false;
                }
            }
            return false;
        }
        var b = palavra.substring(0, this.info.length);
        if (b.charAt(0) > this.info.charAt(0)) {
            if (this.direita != null) {
                return this.direita.search(palavra);
            } else {
                return false;
            }
        }
        if (b == this.info) {
            if (palavra.length == this.info.length) {
                return this.finalString;
            } else if (this.abaixo != null) {
                return this.abaixo.search(palavra.substring(this.info.length));
            } else {
                return false;
            }
        }
        return false;
    };
    this.printdebug = function (Accinfo) {
        if (this.finalString == true)
            console.log(Accinfo + "[" + this.info + "]");

        if (this.abaixo != null)
            this.abaixo.printdebug(Accinfo + "[" + this.info + "]");

        if (this.direita != null)
            this.direita.printdebug(Accinfo);
    };
}

(function () {
            
    var collection = null;
    var Lista_de_actions;
    var disc;
    var i = 0;
    var timer;

    var 
    createDisc = function (value) {
        var elem = Element.createElement(
                {className:"node",
                innerHTML:"<span class='value'>" + value + "</span>",
                left:"30px",
                top:"50px",
                idParent:"main"});
        elem.valor = value;
        return elem;
    },
    runAction = function () {
        Lista_de_actions.actions[i].start(1000);
        i++;
        if (i == Lista_de_actions.qtd) {
            clearTimerInterval();
            Plumb.repintarTudo();
            timeout(function () {
//                UpdateBindings(collection);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 1000);
        }
    },
    animationSearch = function (value) {
        if (collection != null) {
            i = 0;
            Lista_de_actions = new ActionList(0, 0);
            collection.busca(value, Lista_de_actions);
            timerInterval(runAction, 2000 );
        } else
            UI.unlock();
    },

    animationRem = function(value) {
        disc = createDisc(value);
        Lista_de_actions = new ActionList(parseInt(disc.d.style.top), parseInt(disc.d.style.left));

        if (collection != null) {
            Lista_de_actions.setPosition(collection.dados.d.style.top, collection.dados.d.style.left);
            collection.remove(value,null,collection,Lista_de_actions,disc);
            if(!collection.finalString && collection.abaixo===null) {
                collection = collection.direita;
            }
        }
        i = 0;
        timerInterval(runAction, 2000);

    },

    animationAdd = function (value) {
        disc = createDisc(value);
        Lista_de_actions = new ActionList(parseInt(disc.d.style.top), parseInt(disc.d.style.left));

        Plumb.tornarArrastavel(disc.id);

        if (collection == null) {
            collection = new Patricia();
            collection.inicia(value, disc);
            Lista_de_actions.add(new Translate(150, 150, disc.id));
            Lista_de_actions.add(new SetFinalString(disc));
        } else {
            Lista_de_actions.setPosition(collection.dados.d.style.top, collection.dados.d.style.left);
            collection.insere(null, null, value, disc, Lista_de_actions, 0);
        }

        i = 0;

        timerInterval(runAction, 2000);

    };
    window.Cadilag = {
        
        init: function () {
            Plumb.init(true);
            UI.InitFunctions(this.addDisc,this.removeValue,this.searchValue);
            UI.InitInterface(this.search,this.elementToString);
        },
        elementToString: function(id){

            return false;
        },
        search: function(){
            var value = UI.value("valor");
            if(collection !== null && value !== "") {
                return collection.search(value);
            }
            return false;
        },
        
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value('valor');
                if (value !== "") {
                    UI.subtitle("Inserindo a palavra \"<b>"+value+"</b>\"");
                    UI.lock();
                    animationAdd(value);
                } else {
                    swal({type:"error",title:"Opss",text:"Entrada está vazia"});
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        
        removeValue: function () {
            var value = UI.value('valor');
            
            if (value !== ""){
                UI.lock();
                UI.subtitle("Removendo a palavra \"<b>"+value+"</b>\"");
                animationRem(value);
            } else {
                swal({type:"error",title:"Opss",text:"Entrada está vazia"});
            }
        },
        
        searchValue: function () {
            var value = UI.value('valor');
            
            if (value !== ""){
                UI.lock();
                UI.subtitle("Buscando a palavra \"<b>"+value+"</b>\"");
                animationSearch(value);
            } else {
                 swal({type:"error",title:"Opss",text:"Entrada está vazia"});
            }
        }

    };

})();
