jsPlumb.bind("ready", function () {
    Cadilag.init();
});

var ORDEM = 5;
var MIN_ELEMENTO = parseInt(ORDEM/2);
var offsety = 125;
var marginlvls = 125;
var collection = new TREEB();

function ArrayList() {
    this.qtd = 0;
    this.actions = [];

    this.add = function (a) {
        this.actions[this.qtd] = a;
        this.qtd++;
    };
}

function lancarTooltip(text,color,disc,dy){
    this.start = function(time){
        var d = document.createElement("div");
        d.className = "tooltip";
        document.getElementById("main").appendChild(d);
        var id = '' + ((new Date().getTime()));
        d.setAttribute("id", id);
        
        if(dy>0)
            d.style.top = (parseInt(disc.d.style.top)+20)+"px";
        else
            d.style.top = (parseInt(disc.d.style.top)-40)+"px";
        
        d.style.left = parseInt(disc.d.style.left)+"px";
        $("#"+id).css("width",(10+40*ORDEM)+"px");
        $("#"+id).css("color",color);
        $("#"+id).html("<p>"+text+"</p>");
        $("#"+id).animate({"opacity":"0","top":(parseInt(d.style.top)+dy)+"px"},time,function(){
            $("#"+id).remove();
        });
    };
}

function arrumarArvore(No) {
    this.start = function (time) {

        var minleft = 0;

        var max_level = this.max_level(No);
        var widthnode = this.getWidth();
        var arrayLvl = [];
        for (var i = 0; i < max_level; i++) {
            arrayLvl[i] = [];
        }

        this.preencher(No, arrayLvl, 0);
        var key = false;
        var length = arrayLvl[max_level - 1].length;
        var maxlenght = (window.innerWidth - 220) / 2 - (length * widthnode / 2);
        var top = offsety + marginlvls * (max_level - 1);
        
        for (var j = 0; j < length; j++) {
            var left = maxlenght + j * widthnode;
            if (minleft > left)
                minleft = left;
            if (minleft < 0) {
                left -= minleft;
            }
            if (arrayLvl[max_level - 1][j].disc.d.style.left !== left || arrayLvl[max_level - 1][j].disc.d.style.top !== top) {
                Plumb.moveTo(arrayLvl[max_level - 1][j].disc.id, left, top, time);
                arrayLvl[max_level - 1][j].disc.correctPosition = {left:left,top:top};
                key = true;
            }
        }
        
        for (var i = max_level - 2; i >= 0; i--) {
            var length = arrayLvl[i].length;
            var top = offsety + marginlvls * i;
            for (var j = 0; j < length; j++) {
                if (arrayLvl[i][j].disc.d.style.left !== left || arrayLvl[i][j].disc.d.style.top !== top) {
                    var element = arrayLvl[i][j];
                    var lastpos = 0;
                    for(lastpos=0;lastpos<element.filhos.length;lastpos++)
                        if(element.filhos[lastpos]===null)
                            break;
                    var lastchild = element.filhos[lastpos - 1];
                    var leftchild = element.filhos[0].disc.correctPosition.left;
                    var widthchild = lastchild.disc.correctPosition.left - leftchild + widthnode;
                    Plumb.moveTo(arrayLvl[i][j].disc.id, leftchild + (widthchild / 2 - widthnode / 2), top, time);
                    arrayLvl[i][j].disc.correctPosition = {left:leftchild + (widthchild / 2 - widthnode / 2),top:top};
                    key = true;
                }
            }
        }
        setTimeout(function () {
            Plumb.repintarTudo();
        }, time);
        var time = (key ? time : 0);

        return time;
    };
    
    this.preencher = function(No,arrayLvl,lvl){
        if(No!==null){
            var length = arrayLvl[lvl].length;
            No.disc.lvl = lvl;
            arrayLvl[lvl][length] = No;
            for(var i=0;i<=ORDEM;i++){
                if(No.filhos[i]!==null)
                    this.preencher(No.filhos[i],arrayLvl,lvl+1);
                else
                    break;
            }
        }
    };
    
    this.getWidth = function(){
        return 10+40*ORDEM;  
    };
    
    this.max_level = function(No){
        
        var leitor = No;
        var level = 0;
        
        while(leitor!==null){
            leitor = leitor.filhos[0];
            level++;
        }
        
        return level;
    };
    
}

function runListaAnimation(ListaAnimation, After) {

    this.run = function (i) {
        if (i === ListaAnimation.qtd){
            After();
        } else {
            var speed = getSpeed();
            var eumesmo = this;
            ListaAnimation.actions[i].start(2000 * speed);
            setTimeout(function () {
                i++;
                eumesmo.run(i);
            }, 2000 * speed);
        }
    };
}

function PackActions(array){
    this.start = function(time){
        var total = array.length;
        for(var i=0;i<total;i++){
            array[i].start(time);
        }
    };
}

//Animações
function setValue(disc,index,value,text){
    this.start = function(time){
        var timediv = time/2;
        if(text===undefined)
            text = "Inserindo";
        Tooltip.show(disc.space[index].id,text,'#4183F4',time);
        $("#"+disc.id).animate({'border-color':'#4183F4'},timediv);
        $("#"+disc.space[index].id).animate({'background-color':'#4183F4'},timediv,function(){
            disc.write(index,value);
            $("#"+disc.space[index].id).animate({'background-color':'#777'},timediv);
            $("#"+disc.id).animate({'border-color':'#555'},timediv);
        });
    };    
}

function connectSplitUp(NoDisc,FilhosDisc,NovoDisc){
    this.start = function(time){

        var total = ORDEM+1;
        var mid = total/2;
        
        var i=0;
        while(i !== total){
            NoDisc.disconnect(FilhosDisc[i]);
            i++;
        }
        setTimeout(function(){
            i = 0;

            while (i !== mid)
            {
                NovoDisc.connect(i, FilhosDisc[i]);
                i++;
            }
            while (i !== total)
            {
                NoDisc.connect(i - mid, FilhosDisc[i]);
                i++;
            }
        },time/2);
        
    };
}

function connectSplitDown(filhos,firstdisc,seconddisc) {
    this.start = function (time) {

        setTimeout(function(){
            var mid = filhos.length/2;
            for(var i=0;i<filhos.length;i++)
            {
                if(i<mid)
                    firstdisc.connect(i,filhos[i].disc);
                else
                    seconddisc.connect(i-mid,filhos[i].disc);
            }
            setTimeout(function(){
                Plumb.repintarTudo();
            },time);
        },time);
    };
    
}

function disconnectAll(disc,filhosdisc){
    this.start = function(time){
        for(var i=0;i<filhosdisc.length;i++)
        {
            disc.disconnect(filhosdisc[i]);
        }
    };
}

function hoverElem(disc,index,color,texto){
    this.start = function(time){
        
        if(color===undefined)
            color = '#1A6';
        var timediv = time/2;
        Tooltip.show(disc.space[index].id,texto,color,timediv*2);
        $("#"+disc.id).animate({'border-color':color},timediv);
        $("#"+disc.space[index].id).animate({'border-color':color},timediv,function(){
            $("#"+disc.space[index].id).animate({'border-color':"#555"},timediv);
            $("#"+disc.id).animate({'border-color':"#555"},timediv);
        });
    };
}

function TranslateConnections(Noto,Nofrom,Index){
    this.start = function(time){
        var timediv = time/3;
        Noto.disconnect(Nofrom);
        setTimeout(function(){
            Noto.connect(Index+1,Nofrom);
        },timediv*2);
    };
}

function FadeOutAndRemove(NoDisc){
    this.start = function (time) {
        $("#"+NoDisc.id).fadeOut(time);
        Plumb.desconectarCompletamente(NoDisc.id);
        setTimeout(function(){
            $("#"+NoDisc.id).remove();
        },time);
    };
}

function Switch(Nofrom,Indexfrom,Noto,Indexto) {
    
    this.start = function (time) {
        var timediv = time/3;
        
        if (Noto === Nofrom && Indexto === Indexfrom) {
            window.console.log("Entrada e Saída Troca são iguais");
        } else {
            
            $("#"+Noto.id).animate({'border-color':'#ffa500'},timediv);
            if(Noto!==Nofrom){
                $("#"+Nofrom.id).animate({'border-color':'#ffa500'},timediv);
                if(Nofrom.lvl===Noto.lvl)
                   Tooltip.show(Nofrom.space[Indexfrom].id,"Movendo para outro elemento",'#ffa500',timediv*2);
                else if(Nofrom.lvl<Noto.lvl)
                   Tooltip.show(Nofrom.space[Indexfrom].id,"Movendo para baixo",'#ffa500',timediv*2);
                else
                   Tooltip.show(Nofrom.space[Indexfrom].id,"Movendo para cima",'#ffa500',timediv*2);
            } else
                Tooltip.show(Noto.space[Indexto].id,"Deslocando",'#ffa500',timediv*2);
            
            $("#"+Nofrom.space[Indexfrom].id).animate({'background-color':'#ffa500'},timediv);
            $("#"+Noto.space[Indexto].id).animate({'background-color':'#ffa500'},timediv);
            setTimeout(function(){
                var aux = Noto.read(Indexto);
                Noto.write(Indexto,Nofrom.read(Indexfrom));
                
                Nofrom.write(Indexfrom,aux);
                $("#"+Nofrom.space[Indexfrom].id).animate({'background-color':'#777'},timediv);
                $("#"+Noto.space[Indexto].id).animate({'background-color':'#777'},timediv);
                if(Noto!==Nofrom)
                    $("#"+Nofrom.id).animate({'border-color':'#555'},timediv);
                $("#"+Noto.id).animate({'border-color':'#555'},timediv);
            },timediv*2);
        }
    };
}

function CreateNo(Pai,index){
    this.disc;
    this.init = function(){
        this.disc = createNO(ORDEM);
        $("#"+this.disc.id).hide();
        return this.disc;
    };
    this.start = function(time){
        var timediv = time/2;
        var disc = this.disc;
        $("#"+this.disc.id).fadeIn(timediv,function(){
            disc.configureEndpoints(false);
            Pai.disc.connect(index,disc);
            Plumb.repintarTudo();
        });
    };
}

function SplitDown(No){
    
    this.first;
    this.second;
    
    this.init = function(){
        this.first = createNO(ORDEM);
        this.second = createNO(ORDEM);
        $("#"+this.first.id).hide();
        $("#"+this.second.id).hide();
        return {firstdisc:this.first,seconddisc:this.second};
    };
    
    this.start = function(time){
        var timediv = time/2;
        var first = this.first;
        var second = this.second;
        $("#"+this.first.id).fadeIn(timediv);
        $("#"+this.second.id).fadeIn(timediv,function(){
            first.configureEndpoints(false);
            second.configureEndpoints(false);
            No.disc.connect(0,first);
            No.disc.connect(1,second);
            Plumb.repintarTudo();
        });
    };
}

//Objects and Endpoints
var 
prepareTopNo = function(elId){
    return Plumb.adicionarPontoDeConexao(elId,{isPrimary:true,isSource:true,isTarget:true,anchor:"Top"});
},
        
prepareBottomDivisor = function(elId,posy){
    return Plumb.adicionarPontoDeConexao(elId,{isPrimary:true,isSource:true,isTarget:true,anchor:[posy, 0.9, 0, -1]});
},

addEndPoints = function(disc){

    disc.endpoint = prepareTopNo(disc.id);

    var total = ORDEM+1;

    var offset = 7.5 / (total * 10 + (total - 1) * 40);
    var offsetx = 0.3/total;
    for (var i = 0; i < total; i++)
        disc.filho[i] = prepareBottomDivisor(disc.id, i /(total+1) + offsetx + offset * (i + 1));

},

createNO = function (value) {
    var d = document.createElement("div");
    d.className = "treebno";
    document.getElementById("main").appendChild(d);
    var id = '' + ((new Date().getTime()));
    d.setAttribute("id", id);
    $("#"+id).css("width",ORDEM*40+"px");
    var span = document.createElement("div");
    d.appendChild(span);
    d.style.top = offsety+"px";
    d.style.left = "75px";

    var filho = [];
    var space = [];

    for (var i = 0; i <= value; i++) {
        var f = document.createElement("span");
        f.className = 'divisor';
        f.setAttribute('id',id+"d"+i);
        filho[i] = {span:f,id:id+"d"+i};
    }

    for (var i = 0; i < value; i++) {
        var s = document.createElement("span");
        s.className = 'space itemValue';
        s.setAttribute('id',id+"s"+i);
        space[i] = {span:s,id:id+"s"+i};
    }

    var i;
    for (i = 0; i < value; i++) {
        span.appendChild(filho[i].span);
        Tooltip.register(space[i].id,space[i].span,"tooltipB");
        Tooltip.deactivate(space[i].id);
        span.appendChild(space[i].span);
    }

    span.appendChild(filho[i].span);

    var disc = {
        d: d, 
        id: id, 
        filho: filho, 
        space: space,
        span: span,
        endpoint: null,
        lvl:-1,
        setInicial : function(key){
            if(key) {
                $("#"+id).append("<span class='initial hide'>Início</span>");
                setTimeout(function(){
                    $("#"+id+" span.initial").removeClass("hide");
                },500);
            } else {
                
            }
        },
        disconnect : function(anotherdisc){
            Plumb.desconectar({source: id, target: anotherdisc.id});
        },
        connect : function(thisindex,anotherdisc){
            Plumb.conectar(filho[thisindex],anotherdisc.endpoint);
        },
        getObj : function(index){
            return $("#"+space[index].id);
        },

        read : function(index){
            var obj = this.getObj(index);
            return obj.html();
        },

        write : function(index,value){
            if(value===null)
                window.console.log("Setando valor no array como nulo");
            else if(value===undefined)
                window.console.log("Setando valor no array como undefined");
            else {
                var obj = this.getObj(index);
                obj.html(value);
                if(value==="") {
                    obj.removeClass("withValue");
                } else{
                    obj.addClass("withValue");
                }
            }
        },
        
        configureEndpoints:function(){
            addEndPoints(this);
        }
    };
    Plumb.tornarArrastavel(id);
    
    return disc;
};

function TREEB() {
    
    this.campos; //vetor de inteiros
    this.filhos;
    this.pai;
    this.disc;
    this.qtd;
    this.qtdfilhos;

    this.init = function(disc){
        this.campos = [];
        this.filhos = [];
        this.pai = null;
        var i = 0;
        this.qtdfilhos = 0;
        this.qtd = 0;
        this.disc = disc;
        while(i<ORDEM)
        {
            this.campos[i] = null;
            this.filhos[i] = null;
            i++;
        }
        this.filhos[i] = null;
    };

    
    this.insere = function(No,info,ListaAnimation){

        var i = 0;
        while (i !== ORDEM && No.campos[i] !== null)
        {
            if(No.campos[i] === info) {
                ListaAnimation.add(new hoverElem(No.disc,i,'#4183F4',"Já inserido"));
                return;
            } else if(No.campos[i] > info) {
                if(No.filhos[i] !== null){
                    ListaAnimation.add(new hoverElem(No.disc,i,'#1A6',"↙"));
                    this.insere(No.filhos[i],info,ListaAnimation);
                    return;
                } else {
                    break;
                }
            } else {
                ListaAnimation.add(new hoverElem(No.disc,i,'#1A6',"→"));
            }
            i++;
        }

        if(No.filhos[i] !== null) {
            ListaAnimation.add(new hoverElem(No.disc,i-1,'#1A6',"↘"));
            this.insere(No.filhos[i],info,ListaAnimation);
        } else {
            if (No.campos[i] !== null) {
                var j = No.qtd;
                while (i !== j) {
                    No.campos[j] = No.campos[j-1];
                    ListaAnimation.add(new Switch(No.disc,j,No.disc,j-1));
                    j--;
                }
            } 
                
            No.campos[i] = info;
            ListaAnimation.add(new setValue(No.disc,i,info));
            No.qtd++;

            if(No.qtd===ORDEM) {
                if(No.pai===null) {
                    this.SplitDown(No,ListaAnimation);
                } else {
                    this.SplitUp(No,ListaAnimation);
                }
            }

        }
        
    };
        
    this.SplitDown = function(No,ListaAnimation){
        
        var mid = Math.floor(ORDEM/2);
       
        var animation = new SplitDown(No);
        var vars = animation.init();
        
        var firstdisc = vars.firstdisc;
        var seconddisc = vars.seconddisc;
        
        var firstno = new TREEB();
        var secondno = new TREEB();
        
        firstno.init(firstdisc);
        secondno.init(seconddisc);
        
        firstno.pai = No;
        secondno.pai = No;
        
        ListaAnimation.add(new PackActions([new arrumarArvore(collection),new lancarTooltip("Split Down<br>&#8595;","green",No.disc,50)]));
        
        if(No.qtdfilhos!==0)
        {
            var filhosdisc = [];
            var filhosno = [];
            
            for(i=0;i<=ORDEM;i++)
            {
                if(i<=mid)
                {
                    firstno.filhos[i] = No.filhos[i];
                    No.filhos[i].pai = firstno;
                }
                else
                {
                    secondno.filhos[i-mid-1] = No.filhos[i];
                    No.filhos[i].pai = secondno;
                }
                filhosno[i] = No.filhos[i];
                filhosdisc[i] = No.filhos[i].disc;
                No.filhos[i] = null;

            }
            firstno.qtdfilhos = mid+1;
            secondno.qtdfilhos = mid+1;
            
            ListaAnimation.add(new disconnectAll(No.disc,filhosdisc));
            ListaAnimation.add(animation);
            ListaAnimation.add(new connectSplitDown(filhosno,firstdisc,seconddisc));
        }
        else
            ListaAnimation.add(animation);

        var i = 0;
        while(i<mid)
        {
            firstno.campos[i] = No.campos[i];
            No.campos[i] = null;
            ListaAnimation.add(new Switch(No.disc,i,firstno.disc,i));
            i++;
        }
        i++;
        var j=0;
        while(i<ORDEM)
        {
            secondno.campos[j] = No.campos[i];  
            No.campos[i] = null;
            ListaAnimation.add(new Switch(No.disc,i,secondno.disc,j));
            i++;
            j++;
        }
        
        No.filhos[0] = firstno;
        No.filhos[1] = secondno;
        No.campos[0] = No.campos[mid];
        No.campos[mid] = null;

        ListaAnimation.add(new Switch(No.disc,0,No.disc,mid));
        No.qtd = 1;
        No.qtdfilhos = 2;
        firstno.qtd = mid;
        secondno.qtd = mid;
        
        
    };
    
    this.SplitUp = function(No,animation){
        var mid = Math.floor(ORDEM/2);
        var Pai = No.pai;
        var pos = 0;

        while(Pai.campos[pos] < No.campos[0] && pos < Pai.qtd){
            pos++;
        }

        var j=Pai.qtd;
        animation.add(new PackActions([new arrumarArvore(collection),new lancarTooltip("&#8593;<br>Split Up","red",No.disc,-70)]));

        while(j>pos){
            animation.add(new TranslateConnections(Pai.disc,Pai.filhos[j].disc,j));
            animation.add(new Switch(Pai.disc,j-1,Pai.disc,j));
            Pai.campos[j] = Pai.campos[j-1];
            Pai.filhos[j+1] = Pai.filhos[j];
            j--;
        }
        animation.add(new TranslateConnections(Pai.disc,Pai.filhos[j].disc,j));
        Pai.filhos[j+1] = Pai.filhos[j];

        var novo = new TREEB();
        var anima = new CreateNo(Pai,pos);
        var disc = anima.init();
        novo.init(disc);
        novo.pai = Pai;
        animation.add(anima);
        Pai.filhos[pos] = novo;
        Pai.campos[pos] = No.campos[mid];
        No.campos[mid] = null;
        animation.add(new Switch(No.disc,mid,Pai.disc,pos));

        if(No.qtdfilhos!==0)
        {
            var filhosfirst = [];

            var midfilhos = (ORDEM+1)/2;
            var i = 0;

            while(i !== midfilhos)
            {
                filhosfirst[i] = No.filhos[i].disc;
                novo.filhos[i] = No.filhos[i];
                novo.filhos[i].pai = novo;
                i++;
            }
            while(i !== ORDEM+1)
            {
                filhosfirst[i] = No.filhos[i].disc;
                No.filhos[i-midfilhos] = No.filhos[i];
                No.filhos[i] = null;
                i++;
            }

            animation.add(new connectSplitUp(No.disc,filhosfirst,disc));

            No.qtdfilhos = midfilhos;
            novo.qtdfilhos = midfilhos;

        }

        var i = 0;
        while (i !== mid) {
            novo.campos[i] = No.campos[i];
            No.campos[i] = null;
            animation.add(new Switch(No.disc,i,disc,i));
            i++;
        }
        i=0;

        while(i !== mid){
            No.campos[i] = No.campos[i+mid+1];
            No.campos[i+mid+1] = null;
            animation.add(new Switch(No.disc,i,No.disc,i+mid+1));
            i++;
        }

        No.qtd = mid;
        novo.qtd = mid;
        Pai.qtd++;
        Pai.qtdfilhos++;

        if(Pai.qtd===ORDEM)
        {
            if(Pai.pai!==null)
                this.SplitUp(Pai,animation);
            else
                this.SplitDown(Pai,animation);
        }

    };
    
    this.remove = function(No,info,ListaAnimation){
        
        window.console.log(No.disc);
    };
    
    this.searchBool = function(No,info){
        var i = 0;
        while (i !== ORDEM && No.campos[i] !== null) {
            if(No.campos[i] === info) {
                return true;
            }
            else if(No.campos[i] > info) {
                if(No.filhos[i] !== null){
                    return this.searchBool(No.filhos[i],info);
                } else {
                    break;
                }
            }
            i++;
        }
        if(No.filhos[i] !== null) {
            return this.searchBool(No.filhos[i],info);
        }
        return false;
        
    };
    
    this.search = function(No,info,ListaAnimation){
        var i = 0;
        while (i !== ORDEM && No.campos[i] !== null) {
            
            if(No.campos[i] === info) {
                ListaAnimation.add(new hoverElem(No.disc,i,'#4183F4',"Encontrado"));
                return No;
            }
            else if(No.campos[i] > info) {
                if(No.filhos[i] !== null){
                    ListaAnimation.add(new hoverElem(No.disc,i,'#1A6',"↙"));
                    return this.search(No.filhos[i],info,ListaAnimation);
                } else {
                    break;
                }
            } else{
                ListaAnimation.add(new hoverElem(No.disc,i,'#1A6',"→"));
            }
            i++;
        }
        if(No.filhos[i] !== null) {
            ListaAnimation.add(new hoverElem(No.disc,i-1,'#1A6',"↘"));
            return this.search(No.filhos[i],info,ListaAnimation);
        } else {
            ListaAnimation.add(new hoverElem(No.disc,i,'#F44341',"Não encontrado"));
        }
        return null;
    };
    
    this.remove = function(No,info,ListaAnimation){
        if(No!==null){
            if(No.qtdfilhos===0){
                this.removeNaFolha(No,info,ListaAnimation);
            } else {
                var index = this.getIndexForInfo(No,info);
                var sucessorVars = this.buscarSucessor(No,index);
                No.campos[index] = sucessorVars.no.campos[sucessorVars.index];
                sucessorVars.no.campos[sucessorVars.index] = info;
                ListaAnimation.add(new Switch(sucessorVars.no.disc,sucessorVars.index,No.disc,index));
                this.removeNaFolha(sucessorVars.no,info,ListaAnimation);
            }
        }
    };
    
    this.removeNaFolha = function(No,info,ListaAnimation){
        for(var i=0;i<No.qtd;i++) {
            if(No.campos[i]===info){
                ListaAnimation.add(new setValue(No.disc,i,"","Removendo"));
                No.campos[i] = null;
            } else if(No.campos[i]>info) {
                ListaAnimation.add(new Switch(No.disc,i,No.disc,i-1));
                No.campos[i-1] = No.campos[i];
                No.campos[i] = null;
            }
        }
        No.qtd--;
        var pai = No.pai;
        if(pai!==null && No.qtd<MIN_ELEMENTO) { // Se for diferente da raiz
            var posParent = this.getChildIndex(No);
            if (posParent === 0) {
                var irmao = pai.filhos[1];
                if (irmao.qtd + 1 + No.qtd < ORDEM) {
                    No.campos[No.qtd] = pai.campos[0];
                    ListaAnimation.add(new Switch(No.disc,No.qtd,pai.disc,0));
                    No.qtd++;
                    for(var i=0;i<irmao.qtd;i++){
                        No.campos[No.qtd] = irmao.campos[i];
                        ListaAnimation.add(new Switch(No.disc,No.qtd,irmao.disc,i));
                        No.qtd++;
                    }
                    pai.filhos[1] = null;
                    ListaAnimation.add(new FadeOutAndRemove(irmao.disc));
                    for(var i=1;i<pai.qtd;i++) {
                        pai.campos[i-1] = pai.campos[i]; 
                        ListaAnimation.add(new Switch(pai.disc,i-1,pai.disc,i));
                        pai.filhos[i] = pai.filhos[i+1];
                        ListaAnimation.add(new TranslateConnections(pai.disc,pai.filhos[i].disc,i-1));
                    }
                    pai.qtd--;
                    pai.qtdfilhos--;
                    pai.filhos[pai.qtdfilhos] = null;
                    pai.campos[pai.qtd] = null;
                    if(pai.qtd<MIN_ELEMENTO){
                        this.splitReverse(pai,ListaAnimation);
                    } else {
                        ListaAnimation.add(new arrumarArvore(collection));
                    }
                } else {
                    No.campos[No.qtd] = pai.campos[0];
                    ListaAnimation.add(new Switch(No.disc,No.qtd,pai.disc,0));
                    No.qtd++;
                    pai.campos[0] = irmao.campos[0];
                    ListaAnimation.add(new Switch(pai.disc,0,irmao.disc,0));
                    for(var i=1;i<irmao.qtd;i++){
                        irmao.campos[i-1] = irmao.campos[i];
                        ListaAnimation.add(new Switch(irmao.disc,i,irmao.disc,i-1));
                    }
                    irmao.qtd--;
                    irmao.campos[irmao.qtd] = null;
                }
            } else {
                var irmao = pai.filhos[posParent - 1];
                if (irmao.qtd + 1 + No.qtd < ORDEM) {
                    irmao.campos[irmao.qtd] = pai.campos[posParent-1];
                    ListaAnimation.add(new Switch(irmao.disc,irmao.qtd,pai.disc,posParent-1));
                    irmao.qtd++;
                    for(var i=0;i<No.qtd;i++){
                        irmao.campos[irmao.qtd] = No.campos[i];
                        ListaAnimation.add(new Switch(irmao.disc,irmao.qtd,No.disc,i));
                        irmao.qtd++;
                    }
                    pai.filhos[posParent] = null;
                    ListaAnimation.add(new FadeOutAndRemove(No.disc));
                    for(var i=posParent;i<pai.qtd;i++) {
                        pai.campos[i-1] = pai.campos[i]; 
                        ListaAnimation.add(new Switch(pai.disc,i-1,pai.disc,i));
                        pai.filhos[i] = pai.filhos[i+1];
                        ListaAnimation.add(new TranslateConnections(pai.disc,pai.filhos[i].disc,i-1));
                    }
                    pai.qtd--;
                    pai.qtdfilhos--;
                    pai.filhos[pai.qtdfilhos] = null;
                    pai.campos[pai.qtd] = null;
                    if(pai.qtd<MIN_ELEMENTO){
                        this.splitReverse(pai,ListaAnimation);
                    } else {
                        ListaAnimation.add(new arrumarArvore(collection));
                    }
                } else {
                    for(var i=No.qtd;i>0;i--){
                        No.campos[i] = No.campos[i-1];
                        ListaAnimation.add(new Switch(No.disc,i,No.disc,i-1));
                    }
                    No.campos[0] = pai.campos[posParent-1];
                    ListaAnimation.add(new Switch(pai.disc,posParent-1,No.disc,0));
                    No.qtd++;
                    pai.campos[posParent-1] = irmao.campos[irmao.qtd-1];
                    ListaAnimation.add(new Switch(irmao.disc,irmao.qtd-1,pai.disc,posParent-1));
                    irmao.campos[irmao.qtd-1] = null;
                    irmao.qtd--;
                }
            }
        }
    };
    this.splitReverse = function(No,ListaAnimation){
        var pai = No.pai;
        if (pai === null) {
            ListaAnimation.add(new FadeOutAndRemove(No.disc));
            No.filhos[0].pai = null;
            collection = No.filhos[0];
            ListaAnimation.add(new arrumarArvore(collection));
        } else {
            var posParent = this.getChildIndex(No);
            var irmao;
            if(posParent===0){
                irmao = pai.filhos[1];
                No.campos[0] = pai.campos[0];
                ListaAnimation.add(new Switch(pai.disc,0,No.disc,0));
                No.campos[No.qtd] = irmao.campos[0];
                No.qtd++;
            } else {
                irmao = pai.filhos[posParent-1];

            }
        }
    };
    this.buscarSucessor = function(No,index){
        return this.maiorDireita(No.filhos[index]);
    };
    this.maiorDireita = function(No){
        if(No.filhos[0]!==null){
            return this.maiorDireita(No.filhos[No.qtd]);
        } else {
            return {no:No,index:No.qtd-1};
        }
    };
    this.getIndexForInfo = function(No,info){
        for(var i=0;i<No.qtd;i++){
            if(No.campos[i]===info)
                return i;
        }  
    };
    this.getChildIndex = function(No){
        if(No.pai!==null) {
            for(var i=0;i<No.pai.qtdfilhos;i++) {
                if(No.pai.filhos[i]===No) {
                    return i;
                }
            }
        }
        return null;
    };
}


(function () {

    var iniciarPrimeiroNo = function(){
        var disc = createNO(ORDEM);
        disc.d.style.left = ((window.innerWidth-220)/2-(10+40*ORDEM)/2)+"px";
        disc.d.style.top = offsety+"px";
        disc.configureEndpoints(true);
//        disc.setInicial(true);
        Plumb.repintarTudo();
        collection.init(disc,0);
    },

    animationAdd = function(value){
        var Lista = new ArrayList();
        collection.insere(collection,value,Lista);
        new runListaAnimation(Lista,function(){               
            UI.unlock();
            window.Eprogramada.nextQueue();                
        }).run(0); 
    },
    
    animationRemove = function(value){
        var Lista = new ArrayList();
        var no = collection.search(collection,value,Lista);
        collection.remove(no,value,Lista);
        new runListaAnimation(Lista,function(){               
            UI.unlock();
            window.Eprogramada.nextQueue();                
        }).run(0); 
    },
    
    animationSearch = function(value){
        var Lista = new ArrayList();
        collection.search(collection,value,Lista);
        new runListaAnimation(Lista,function(){               
            UI.unlock();
        }).run(0); 
    };

    window.Cadilag = {
        init: function () {
            UI.lock();
            Plumb.init();
            Tooltip.createStyle("tooltipB",{
                extends: "dark",
                showOn:null,
                tipJoint: "top",
                showEffectDuration: 0.1,
                hideEffectDuration: 0.1,
                target: true,
                background: "#333333",
                removeElementsOnHide: true,
                delay: 0.5
            });
            $("#newStruct").click(this.newStruct);
            UI.InitInterface(this.search);
        },
        newStruct: function(){
            var ordem = UI.value("ordem");
            if(ordem!=="") {
                UI.setParameters({"ORDEM":ordem});
                UI.InitFunctions(Cadilag.addDisc,Cadilag.removeValue,Cadilag.searchValue);
                $("#newStruct").unbind('click');
                ORDEM = parseInt(ordem);
                iniciarPrimeiroNo();
                UI.unlock();
                $("#subtopbar").animate({"top":"0px"},500,function(){
                    $(this).remove();
                });
            }
        },
        search: function(){
            var value = UI.value("valor");
            if(value!==""){
                return collection.searchBool(collection,value);
            }
            return false;
        },
        addDisc: function () {
            if(UI.checkInterface()){
                var value = UI.value("valor","Valor informado deve ser um número inteiro");
                if (value !== "") {
                    UI.subtitle("Inserindo o valor <b>"+value+"</b>");
                    UI.lock();
                    animationAdd(parseInt(value));
                }
            } else {
                History.rollbackAppendInput();
            }
        },
        removeValue: function () {
            var value = UI.value("valor","Valor informado deve ser um número inteiro");

            if (value !== ""){
                UI.lock();
                UI.subtitle("Removendo o valor <b>"+value+"</b>");
                animationRemove(parseInt(value));
            }
        },
        searchValue: function () {
            var value = UI.value("valor","Valor informado deve ser um número inteiro");

            if (value !== ""){
                UI.lock();
                UI.subtitle("Buscando o valor <b>"+value+"</b>");
                animationSearch(parseInt(value));
            }
        }

    };
})();

