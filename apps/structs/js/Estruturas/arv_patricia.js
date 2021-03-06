jsPlumb.bind("ready", function () {
    Cadilag.init();
});

function ActionList(inix, iniy) {
    this.qtd = 0;
    this.possiveis_nodes = [];
    this.pqtd = 0;
    this.actions = [];
    this.steprecords = [];
    this.YPositionAdd;
    this.x = inix;
    this.y = iniy;

    this.add = function (a,step) {
        this.actions[this.qtd] = a;
        this.steprecords[this.qtd] = step;
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
        $("#" + id).find(".value").html(str);
        Plumb.repintarTudo();
    };
}

function Translate(x, y, id) {
    this.start = function (time,raiz) {
        var f = new organizar();
        f.start(time,raiz);
    };
}

function UpdateInitialPointer(){
    this.start = function (time,collection) {
        $("span.initial").remove();
        if(collection) {
            $(collection.dados.d).append("<span class='initial'>Raiz</span>");
            $(".dinamicSmallDotNull").remove();
        } else {
            var nullpointer = Element.createElement(
                {className: "dinamicSmallDotNull",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "50px",
                    top: "107px",
                    title: "Lista",
                    idParent: "main"});
            $(nullpointer.d).append("<span class='initial'>Raiz</span>");
        }
    };
};

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
        this.disc.d.innerHTML += "<span class='value'>" + info + "</span>";
        
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
            pai.find(".value").html($("#"+Pai.dados.id+" span").html()+$("#"+Filho.dados.id+" span").html());
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
        
        var left = parseInt(dados.d.style.left) - 4;
        var top = parseInt(dados.d.style.top) - 5;
        var width = $(dados.d).width()+39;
            
        if($(".patriciaHover").css("display") === "none"){
            $(".patriciaHover")
                .css("display","block")
                .css("left",left+"px")
                .css("top",top+"px")
                .css("width",width+"px");
        } else {
            var id = $(".patriciaHover").attr("id");
            Plumb.moveTo(id,left,top,time);
            Plumb.noqueue(id,{width:width},time);
        }
    };
}

function FadeOutHover(){
    this.start = function(time){
        var id = $(".patriciaHover").attr("id");
        Plumb.fadeOut(id,time,function(){
            $(".patriciaHover").remove();
        });
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
        $(pai.d).find("span.finalright").remove();
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
        $(pai.d).find("span.finalbottom").remove();
        Plumb.conectar(this.prepare1(pai.id),this.prepare(filho.id));
    };
}

function organizar(){
    
    this.start = function (time,raiz) {
        
        if(raiz === null){
            return;
        }
        
        var offset = 90;
        var inix = 150;
        var iniy = 150;
        
        var column = [];
        
        var rec = function(no,xindex,yindex,f){
            
            f(no,xindex,yindex);
            
            if(column[xindex] === undefined){
                column[xindex] = [];
            }
            column[xindex].push(yindex);
            
            if(no.abaixo !== null){
                rec(no.abaixo,xindex,yindex+1,f);
            }
            if(no.direita !== null){
                var inc = 1;

                if(no.direita.abaixo!==null){
                    while(column[xindex+inc] !== undefined){
                        inc++;
                    }
                }
                
                rec(no.direita,xindex+inc,yindex,f);
            }

        };
        
        var comprimento = [];
        rec(raiz,0,0,function(no,xindex,yindex){
            var size = $(no.dados.d).width();
            if(comprimento[xindex] === undefined){
                comprimento[xindex] = size;
            } else {
                if(comprimento[xindex] < size) {
                    comprimento[xindex] = size;
                }
            }
        });
        
        var positionsx = [];
        var sum = inix;
        
        for(var key in comprimento){
            positionsx[key] = sum;
            sum += comprimento[key] + offset;
        }

        column = [];
        rec(raiz,0,0,function(no,xindex,yindex){
            var w = $(no.dados.d).width();
            Plumb.moveTo(no.dados.id, positionsx[xindex] - w / 2.0, iniy + (yindex * 91), time);
        });
    
    };
    
}

function Patricia() {
    this.info; //STRING
    this.dados; //ID
    this.direita; //N?? a direita
    this.abaixo; //N?? a abaixo
    this.finalString; //Indica se ?? uma silaba final

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
     * C??digo de inser????o recursivo e referenci??vel
     */
    this.insere = function (anteriorpai, anterior, addInfo, dadosInterface, actions, y) {
        var i = 0;
        actions.add(new PassouPorAqui(this.dados));

        while (i < this.info.length && i < addInfo.length) {
            //Caractere Diferente encontrado     
            if (this.info.charCodeAt(i) != addInfo.charCodeAt(i)) {
                //O primeiro caractere ?? o diferente
                if (i == 0){
                    //N??o ?? essa posi????o certa
                    if (addInfo.charCodeAt(0) > this.info.charCodeAt(0)) {
                        //Continua a busca do local de inser????o ?? direita
                        if (this.direita != null) {
                            return this.direita.insere(null, this, addInfo, dadosInterface, actions, y);
                        }
                        //Ao lado ?? nulo, ent??o pode ser inserido a direita sem nenhuma outra verfica????o
                        else {
                            actions.add(new FadeOutHover());
                            actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                            actions.add(new ConnectToRight(this.dados, dadosInterface));
                            actions.add(new SetFinalString(dadosInterface));
                            
                            this.direita = new Patricia();
                            this.direita.init(addInfo);
                            this.direita.dados = dadosInterface;
                            Element.bind(this.direita,dadosInterface.id);
                            this.direita.finalString = true;
                            return;
                        }
                    }
                    //Deslocamento do atual ?? direita e t??rmino dessa Inser????o
                    else {
                        actions.add(new FadeOutHover());
                        var NovoAoDireita = new Patricia();
                        NovoAoDireita.init(this.info);
                        NovoAoDireita.dados = this.dados;
                        NovoAoDireita.direita = this.direita;
                        NovoAoDireita.abaixo = this.abaixo;
                        
                        if (anteriorpai != null) {
                            actions.add(new Disconnect(anteriorpai.dados, this.dados));
                        }
                        if (anterior != null) {
                            actions.add(new Disconnect(anterior.dados, this.dados));
                        }
                        actions.add(new DeslocarADireita(NovoAoDireita, dadosInterface.id, 50));
                        actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                        actions.add(new ConnectToRight(dadosInterface, this.dados));
                        
                        if (anterior != null) {
                            actions.add(new ConnectToRight(anterior.dados, dadosInterface));
                        }
                        if (anteriorpai != null) {
                            actions.add(new ConnectToDown(anteriorpai.dados, dadosInterface));
                        }

                        actions.add(new SetFinalString(dadosInterface));
                        actions.add(new UpdateInitialPointer());
                        this.dados = dadosInterface;
                        this.info = addInfo;
                        this.direita = NovoAoDireita;
                        this.abaixo = null;
                        
                        Element.bind(this,dadosInterface.id);
                        Element.bind(NovoAoDireita,NovoAoDireita.dados.id);
                        
                        if (this.finalString)
                            this.direita.finalString = true;

                        this.finalString = true;
                        return;
                    }
                }
                //Parte da silaba est?? correta ent??o ocorre quebra
                else {
                    actions.add(new FadeOutHover());
                    var Quebra = new Patricia();
                    Quebra.init(this.info.substring(i, this.info.length));
                    Quebra.abaixo = this.abaixo;

                    this.abaixo = Quebra;
                    this.info = this.info.substring(0, i);

                    if (this.finalString){
                        this.abaixo.finalString = true;
                        this.finalString = false;
                    }

                    actions.add(new PackActions([new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)), new SetCharacters(this.dados.id, this.info)], 2));
                    if (!this.finalString)
                        actions.add(new RemoveFinalString(this.dados));

                    var NovaQuebraDados = new NovaQuebra(Quebra.info, this, Quebra.abaixo, 50,this.abaixo.finalString);
                    this.abaixo.dados = NovaQuebraDados.init();
                    
                    Element.bind(this.abaixo,this.abaixo.dados.id);
                    $(this.abaixo.dados.d).append("<span class='finalright'></span>").append("<span class='finalbottom'></span>");
       
                    actions.add(NovaQuebraDados);

                    if (this.direita != null)
                        actions.addNode(this.direita, y);

                    this.abaixo.insere(this, null, addInfo.substring(i, addInfo.length), dadosInterface, actions, y + 1);

                    return;
                }
            }
            //Carat??r ?? igual ent??o verificamos os pr??ximos
            else
                i++;

        }
        //Todos caracteres s??o iguais e os tamanhos dos dois blocos s??o iguais
        if (this.info.length == addInfo.length) {

            //Este bloco j?? final, ent??o significa que j?? foi incluso
            if (this.finalString){
                actions.add(new RemoveDisc(dadosInterface));
            }
            //Este bloco j?? fragmentado, s?? precisa se tornar final
            else {
                actions.add(new FadeOutHover());
                actions.add(new PackActions([new RemoveDisc(dadosInterface),new SetFinalString(this.dados)],2));
                actions.setYPositionAdd(y);
                this.finalString = true;
            }
        }
        //Todos caracteres s??o iguais, logo a inser????o ser?? abaixo
        else {
            //O bloco a ser adicionado ?? maior do que do que j?? foi inserido, ent??o ?? quebra do que ser?? inserido
            if (i == this.info.length) {
                //O bloco a ser adicionado ?? quebrado e continua abaixo
                if (this.abaixo != null) {
                    actions.add(new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)));
                    if (this.direita != null)
                        actions.addNode(this.direita, y);
                    this.abaixo.insere(this, null, addInfo.substring(i, addInfo.length), dadosInterface, actions, y + 1); //addInfo perdendo
                }
                //Caso abaixo for nulo, ?? adicionado o novo bloco abaixe sem precisar de verifica????es
                else {
                    actions.add(new FadeOutHover());
                    actions.add(new SetCharacters(dadosInterface.id, addInfo.substring(i, addInfo.length)));
                    actions.add(new Translate(actions.x, actions.y, dadosInterface.id));
                    actions.add(new ConnectToDown(this.dados, dadosInterface));
                    actions.add(new SetFinalString(dadosInterface));
                    actions.setYPositionAdd(y + 1);
                    
                    this.abaixo = new Patricia();
                    this.abaixo.init(addInfo.substring(i, addInfo.length));
                    this.abaixo.dados = dadosInterface;
                    this.abaixo.finalString = true;
                    Element.bind(this.abaixo,dadosInterface.id);
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
                Element.bind(this.abaixo,dadosInterface.id);
                actions.add(new FadeOutHover());
                actions.add(new PackActions([new SetCharacters(this.dados.id, this.info), new SetCharacters(dadosInterface.id, QuebraAbaixo.info)], 2));
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
                    actions.add(new PassouPorAqui(this.dados));
                    return this.direita.busca(palavra, actions);
                } else {
                    actions.add(new PassouPorAqui(this.dados));
                    return false;
                }
            }

            actions.add(new PassouPorAqui(this.dados));
            return false;

        }

        var b = palavra.substring(0, this.info.length);

        if (b.charAt(0) > this.info.charAt(0)) {
            if (this.direita != null) {
                actions.add(new PassouPorAqui(this.dados));
                return this.direita.busca(palavra, actions);
            } else {
                actions.add(new PassouPorAqui(this.dados));
                return false;
            }
        }

        if (b == this.info) {
            if (palavra.length == this.info.length) {
                actions.add(new PassouPorAqui(this.dados, this.finalString ? "#0000FF" : "red"));
                return this.finalString;
            } else if (this.abaixo != null) {
                actions.add(new PassouPorAqui(this.dados));
                return this.abaixo.busca(palavra.substring(this.info.length), actions);
            } else {
                actions.add(new PassouPorAqui(this.dados));
                return false;
            }
        }

        actions.add(new PassouPorAqui(this.dados));
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
    var nullpointer = null;
    
    
    organizarTudo = function(){
      
        var f = new organizar();
        f.start(2000,collection);
    };
    
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
    createDiscNull = function() {
        nullpointer = Element.createElement(
                {className: "dinamicSmallDotNull",
                    innerHTML: "<span class='itemValue'>nulo</span>",
                    left: "50px",
                    top: "107px",
                    title: "Lista",
                    idParent: "main"});
        $(nullpointer.d).append("<span class='initial'>Raiz</span>");
    },
    createDiscHover = function(){
        var elem = Element.createElement(
            {className: "patriciaHover",
            left: "50px",
            top: "107px",
            idParent: "main"}
        );
        elem.d.style.display = "none";
    },
    runAction = function () {
        Lista_de_actions.actions[i].start(1000,collection);
        i++;
        if (i == Lista_de_actions.qtd) {
            clearTimerInterval();
            Plumb.repintarTudo();
            timeout(function () {
                organizarTudo();
                 $(".patriciaHover").remove();
//                UpdateBindings(collection);
                UI.unlock();
                window.Eprogramada.nextQueue();
            }, 1000);
        }
    },
    animationSearch = function (value) {
        if (collection != null) {
            createDiscHover();
            i = 0;
            Lista_de_actions = new ActionList(0, 0);
            collection.busca(value, Lista_de_actions);
            Lista_de_actions.add(new FadeOutHover());
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
        createDiscHover();
        Plumb.tornarArrastavel(disc.id);
        $(disc.d).append("<span class='finalright'></span>").append("<span class='finalbottom'></span>");
        if (collection == null) {
            collection = new Patricia();
            collection.inicia(value, disc);
            Lista_de_actions.add(new Translate(150, 150, disc.id));
            Lista_de_actions.add(new SetFinalString(disc));
            Lista_de_actions.add(new UpdateInitialPointer());
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
            createDiscNull();
        },
        elementToString: function(id){
            var element = Element.get(id);
            if (element !== undefined) {
                var result = {'info': element.info};
                result.PalavraFinal = (element.finalString?"Verdadeiro":"Falso");
                result._vizinhos = [];
                if (element.direita !== null) {
                    var nextId = (element.direita.dados.id * 1).toString(16).toUpperCase();
                    result.direita = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.direita = {id: element.direita.dados.id, tooltipdir: "w"};
                } else {
                    result.direita = 'nulo';
                }
                if (element.abaixo !== null) {
                    var nextId = (element.abaixo.dados.id * 1).toString(16).toUpperCase();
                    result.abaixo = '*' + (nextId.substring(nextId.length - 5));
                    result._vizinhos.abaixo = {id: element.abaixo.dados.id};
                } else {
                    result.abaixo = 'nulo';
                }
                return result;
            }
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
                    swal({type:"error",title:"Opss",text:"Entrada est?? vazia"});
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
                swal({type:"error",title:"Opss",text:"Entrada est?? vazia"});
            }
        },
        
        searchValue: function () {
            var value = UI.value('valor');
            
            if (value !== ""){
                UI.lock();
                UI.subtitle("Buscando a palavra \"<b>"+value+"</b>\"");
                animationSearch(value);
            } else {
                 swal({type:"error",title:"Opss",text:"Entrada est?? vazia"});
            }
        }

    };

})();
