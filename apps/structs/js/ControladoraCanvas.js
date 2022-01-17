(function(){
    window.Canvas = {
        array:[],
        arrayOverflow:[],
        arrayLabels:[],
        alternate:undefined,
        elementToString:undefined,
        offset:function(el){
            var _x = 0;
            var _y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return {top: _y, left: _x};
        },
        initInterface:function(elementoToSting){
            Canvas.elementToString = elementoToSting;
        },
        mouseEnterEvent:function(id,index){
            if($("#enableDescritor").hasClass('selected')) {
                var overflow = false;
                if(index<0){
                    index*=-1;
                    index--;
                    overflow = true;
                }
                var array = Canvas.elementToString(index,overflow);
                if (array) {
                    var saida;
                    var saida = "<p class='tipsy-head'>";
                    saida += array._title;
                    saida += "["+array._index+"]";
                    saida += "</p>";
                    if(array._replaceAll===undefined){
                        saida += "<table class='tipsy-table'><tr><th>Campo</th><th>Valor</th></tr>";

                        for (var key in array) {
                            if(!key.startsWith("_"))
                                saida += "<tr><td>" + key + "</td><td>" + array[key] + "</td></tr>";
                        }
                        saida += "</table>";
                    } else {
                        saida += array._replaceAll;
                    }
                    var obj = $("#" + id);
                    obj.attr('tipsy-title', saida);
                    obj.tipsy(true).show();
                }
            }
        },
        mouseExitEvent:function(id,index){
            var obj = $("#"+id);
            obj.tipsy(true).hide();
        },
        /**
         * @param indice Indice do Elemento a receber o Highlight
         * @param canvasId A id da Div Canvas
         */
        highlight:function(parameter){
            if(this.alternate==="html") {
                $(this.array[parameter.indice]).css("background","rgb(255, 122, 60)");
            } else {
                var canvas = document.getElementById(parameter.canvasId);
                var ctx = canvas.getContext('2d');
                var grd = ctx.createLinearGradient(0, 0, 170, 0);
                grd.addColorStop(0, "rgba(255, 200, 200, 0.5)");
                grd.addColorStop(1, "rgb(200, 122, 60)");
                ctx.fillStyle = grd;
                var y = 300;
                this.roundRect(ctx, 72 * parameter.indice, y - 25, 70, 70, 5, true, false);
            }

        },
        /**
         * @param indice Indice do Elemento a receber o Highlight
         * @param canvasId A id da Div Canvas
         */
        highlightHash:function(parameter){
            $(this.array[parameter.indice]).css("background","rgb(255, 122, 60)");
        },
        highlightHashOverflow:function(parameter){
            $(this.arrayOverflow[parameter.indice]).css("background","rgb(255, 122, 60)");
        },
        resetHash:function(parameter){
            $(this.array[parameter.indice]).css("background","");
        },
        resetHashOverflow:function(parameter){
            $(this.arrayOverflow[parameter.indice]).css("background","");
        },
        reset:function(parameter){
            $(this.array[parameter.indice]).css("background","");
        },
        updateLabels:function(parameter){
            for(var i=0;i<parameter.total;i++){
                this.arrayLabels[i].setAttribute("value",parameter.labels[i]);
                this.arrayLabels[i].innerHTML = "<p>"+parameter.labels[i]+"</p>";
            }
        },
        appendEventHorizontal:function(d,index,lastindex,toId){
            var id = d.id;
            if(toId !== undefined){
                id = toId;
            }
            var obj = $(d);
            obj.mouseover(function () {
                Canvas.mouseEnterEvent(id, index);
            });
            obj.mouseout(function () {
                Canvas.mouseExitEvent(id, index);
            });
            obj.attr('tipsy-title', '');
            obj.tipsy({title: 'tipsy-title', trigger: 'manual', html: true, gravity: (index===0?'sw':(index===lastindex?'se':'s'))});
        },
        appendEventVertical:function(d,index,toId){
            var id = d.id;
            if(toId !== undefined){
                id = toId;
            }
            var obj = $(d);
            obj.mouseover(function () {
                Canvas.mouseEnterEvent(id, index);
            });
            obj.mouseout(function () {
                Canvas.mouseExitEvent(id, index);
            });
            obj.attr('tipsy-title', '');
            obj.tipsy({title: 'tipsy-title', trigger: 'manual', html: true, gravity: 'e'});
        },
        /**
         * @param total Tamanho do Array
         * @param canvasId A id da Div Canvas
         * @param labels array com subtitulos dos elementos
         */
        drawArray:function(parameter){
            var main = document.getElementById('main');

            if(parameter.labels !== undefined){
                var d = document.createElement("div");
                d.className = "staticArrayValue array0";
                main.appendChild(d);
                d.style.left = "10px";
                d.style.top = "277px";
                d.innerHTML = "<p>info</p>";

                d = document.createElement("div");
                d.className = "staticArrayNext array0";
                main.appendChild(d);
                d.style.left = "10px";
                d.style.top = "252px";
                d.innerHTML = "<p>prox</p>";
            }

            for(var i = 0;i<parameter.total;i++){
                var d = document.createElement("div");
                d.id = "array"+i;
                d.className = "staticArrayValue";
                if(i===0){
                    d.className += "  array0";
                }
                main.appendChild(d);
                d.style.left = (i*72 + 100)+"px";
                d.style.top = "277px";
                this.array[i] = d;
                if (Canvas.elementToString !== undefined) {
                    Canvas.appendEventHorizontal(d,i,parameter.total-1);
                }
                d = document.createElement("div");
                d.id = "arraylabel"+i;
                d.className = "staticArrayIndex";

                main.appendChild(d);
                d.style.left = (i*72 + 100)+"px";
                d.style.top = "340px";
                d.innerHTML = "<p>"+i+"</p>";
            }
            if(parameter.labels !== undefined){
                for (var i = 0; i < parameter.total; i ++){
                    d = document.createElement("div");
                    d.className = "staticArrayNext";
                    if(i===0){
                        d.className += "  array0";
                    }
                    main.appendChild(d);
                    d.style.left = (i*72 + 100)+"px";
                    d.style.top = "252px";
                    d.setAttribute("value",parameter.labels[i]);
                    d.innerHTML = "<p>"+parameter.labels[i]+"</p>";
                    d.id = "arraynext"+i;
                    if (Canvas.elementToString !== undefined) {
                        Canvas.appendEventHorizontal(d,i,parameter.total-1);
                    }
                    this.arrayLabels[i] = d; 

                }
            }
            this.alternate = parameter.alternate;
            
        },
        /**
         * @param total Tamanho do Array
         */
        drawHashTable:function(parameter){
            this.alternate = parameter.alternate;
            var main = document.getElementById("main");
            
            var d = document.createElement("div");
            d.className = "staticArrayVerticalTitle";
            d.innerHTML = "Tabela HASH";
            main.appendChild(d);
            
            for (var i = 0; i < parameter.total; i++) {
                var d = document.createElement("div");
                d.className = "staticArrayVerticalValue";
                d.style.left = "600px";
                d.style.top = (i*52 + 100)+"px";
                d.id = "array"+i;
                this.array[i] = d;
                main.appendChild(d);
                if (Canvas.elementToString !== undefined) {
                    Canvas.appendEventVertical(d,i);
                }

                d = document.createElement("div");
                d.className = "staticArrayVerticalIndex";
                d.style.left = "570px";
                d.style.top = (i*52 + 100)+"px";
                d.innerHTML = "<p>"+i+"</p>";
                main.appendChild(d);
            }
            
            if(parameter.nextLabels){
                for (var i = 0; i < parameter.total; i++){
                    var d = document.createElement("div");
                    d.className = "staticArrayVerticalNext";
                    d.style.left = "650px";
                    d.innerHTML = "-1";
                    d.style.top = (i*52 + 100)+"px";
                    d.id = "arraynext"+i;
                    if (Canvas.elementToString !== undefined) {
                        Canvas.appendEventVertical(d,i,"array"+i);
                    }
                    main.appendChild(d);
                }
            }
            
            var hashFunctionDot = document.createElement("div");
            hashFunctionDot.className = "hashFunctionDot";
            hashFunctionDot.style.left = "290px";
            hashFunctionDot.style.top = "245px";
            hashFunctionDot.innerHTML = "<p><b>y</b> = hash(&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:white;'>x</span>&nbsp;&nbsp;&nbsp;&nbsp;)</p>";
            main.appendChild(hashFunctionDot);
            
        },
        /**
         * @param total Tamanho do Array
         */
        drawHashOverflowTable:function(parameter){
            this.alternate = parameter.alternate;
            var main = document.getElementById("main");
            
            var d = document.createElement("div");
            d.className = "staticArrayVerticalOverflowTitle";
            d.innerHTML = "Área de Overflow";
            main.appendChild(d);
            
            for (var i = 0; i < parameter.total; i++){
                var d = document.createElement("div");
                d.className = "staticArrayVerticalValue";
                d.style.left = "800px";
                d.style.top = (i*52 + 100)+"px";
                d.id = "arrayoverflow"+i;
                this.arrayOverflow[i] = d;
                main.appendChild(d);
                if (Canvas.elementToString !== undefined) {
                    Canvas.appendEventVertical(d,-1*(i+1));
                }

                d = document.createElement("div");
                d.className = "staticArrayVerticalIndex";
                d.style.left = "770px";
                d.style.top = (i*52 + 100)+"px";
                d.innerHTML = "<p>"+i+"</p>";
                main.appendChild(d);
            }
            
            for (var i = 0; i < parameter.total; i++){
                var d = document.createElement("div");
                d.className = "staticArrayVerticalNext";
                d.style.left = "850px";
                d.innerHTML = ""+((i+1)!=parameter.total?(i+1):"-1");
                d.style.top = (i*52 + 100)+"px";
                d.id = "arraynextoverflow"+i;
                if (Canvas.elementToString !== undefined) {
                    Canvas.appendEventVertical(d,-1*(i+1),"arrayoverflow"+i);
                }
                main.appendChild(d);
            }
            
        }
    };
})();