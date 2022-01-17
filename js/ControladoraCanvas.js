(function(){
    window.Canvas = {
        array:[],
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
                var array = Canvas.elementToString(index);
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
            if(this.alternate!=="html"){
                var canvas = document.getElementById(parameter.canvasId);
                var grd = canvas.getContext('2d').createLinearGradient(0, 0, 170, 0);
                grd.addColorStop(0,"rgba(255, 200, 200, 0.5)");
                grd.addColorStop(1,"rgb(200, 122, 60)");

                var ctx = canvas.getContext('2d');
                ctx.fillStyle = grd;
                this.roundRect(ctx, 600, 52 * parameter.indice + 70, 50, 50, 5, true, false);
            } else {
                $(this.array[parameter.indice]).css("background","rgb(255, 122, 60)");
            }
        },
        resetHash:function(parameter){
            $(this.array[parameter.indice]).css("background","");
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
        appendEventHorizontal:function(d,index,lastindex){
            var obj = $(d);
            obj.mouseover(function () {
                Canvas.mouseEnterEvent(d.id, index);
            });
            obj.mouseout(function () {
                Canvas.mouseExitEvent(d.id, index);
            });
            obj.attr('tipsy-title', '');
            obj.tipsy({title: 'tipsy-title', trigger: 'manual', html: true, gravity: (index===0?'sw':(index===lastindex?'se':'s'))});
        },
        appendEventVertical:function(d,index){
            var obj = $(d);
            obj.mouseover(function () {
                Canvas.mouseEnterEvent(d.id, index);
            });
            obj.mouseout(function () {
                Canvas.mouseExitEvent(d.id, index);
            });
            obj.attr('tipsy-title', '');
            obj.tipsy({title: 'tipsy-title', trigger: 'manual', html: true, gravity: 'w'});
        },
        /**
         * @param total Tamanho do Array
         * @param canvasId A id da Div Canvas
         * @param labels array com subtitulos dos elementos
         */
        drawArray:function(parameter){
            if(parameter.alternate==="html") {
                var main = document.getElementById('main');
                
                var d = document.createElement("div");
                d.className = "staticArrayValue array0";
                main.appendChild(d);
                d.style.left = "10px";
                d.style.top = "277px";
                
                d = document.createElement("div");
                d.className = "staticArrayIndex";
                main.appendChild(d);
                d.style.left = "10px";
                d.style.top = "340px";
                d.innerHTML = "<p>Posição</p>";
                
                if(parameter.labels !== undefined){
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
                        this.arrayLabels[i] = d; 
                        
                    }
                }
                this.alternate = parameter.alternate;
            } else {
                var canvas = document.getElementById(parameter.canvasId);
                var ctx = canvas.getContext('2d');
                var grd = ctx.createLinearGradient(150, 170, 170, 255);
                grd.addColorStop(0, "rgb(0, 0, 200)");
                grd.addColorStop(1, "rgb(8, 8, 138)");
                var y = 300;
                ctx.canvas.width = (parameter.total*72);
                ctx.fillStyle = grd;
                for (var i = 0; i < parameter.total; i ++) {
                    this.roundRect(ctx, i*72, y - 25, 70, 70, 5, true, false);
                }
                ctx.font = "20px Verdana";
                ctx.fillStyle = "black";
                ctx.textAlign = "right";
                for (var i = 0; i < parameter.total; i ++)
                    ctx.fillText("" + i, (i+1)*72, y + 61);

                if(parameter.labels!==undefined){
                    grd = ctx.createLinearGradient(255, 255, 0, 0);
                    grd.addColorStop(0, "rgb(200,50, 50)");
                    grd.addColorStop(1, "rgb(138, 8, 8)");
                    ctx.fillStyle = grd;
                    if(parameter.labelTitle!==undefined) {
                        ctx.textAlign = "left";
                        ctx.font = "15px Verdana";
                        ctx.fillText(parameter.labelTitle, 0, y - 75);
                    }
                    ctx.font = "20px Verdana";
                    ctx.textAlign = "center";
                    for (var i = 0; i < parameter.total; i ++)
                        this.roundRect(ctx, i*72, y - 52, 25, 25, 5, true, false);
                    ctx.font = "bold 15px Verdana";
                    ctx.fillStyle = "white";
                    for (var i = 0; i < parameter.total; i ++)
                        ctx.fillText("" + parameter.labels[i], i*72+12, y - 35);

                }
            }
            
        },
        /**
         * @param total Tamanho do Array
         * @param canvasId A id da Div Canvas
         */
        drawHashTable:function(parameter){
            if(parameter.alternate === "html") {
                this.alternate = parameter.alternate;
                var main = document.getElementById("main");
                for (var i = 0; i < parameter.total; i++){
                    var d = document.createElement("div");
                    d.className = "staticArrayVerticalValue";
                    d.style.left = "600px";
                    d.style.top = (i*52 + 70)+"px";
                    d.id = "array"+i;
                    this.array[i] = d;
                    main.appendChild(d);
                    if (Canvas.elementToString !== undefined) {
                        Canvas.appendEventHorizontal(d,i);
                    }
                    
                    d = document.createElement("div");
                    d.className = "staticArrayVerticalIndex";
                    d.style.left = "570px";
                    d.style.top = (i*52 + 70)+"px";
                    d.innerHTML = "<p>"+i+"</p>";
                    main.appendChild(d);
                }
                
                var hashFunctionDot = document.createElement("div");
                hashFunctionDot.className = "hashFunctionDot";
                hashFunctionDot.style.left = "290px";
                hashFunctionDot.style.top = "245px";
                hashFunctionDot.innerHTML = "<p><b>y</b> = hash(&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#f0607c;'>x</span>&nbsp;&nbsp;&nbsp;&nbsp;)</p>";
                main.appendChild(hashFunctionDot);
            } else {
                
                var canvas = document.getElementById(parameter.canvasId);
                var ctx = canvas.getContext('2d');
                ctx.canvas.height = ((parseInt(parameter.total)+1)*52+50);

                var grd = ctx.createLinearGradient(0, 0,canvas.width,canvas.height);

                grd.addColorStop(0, "rgba(0, 0, 200, 0.5)");
                grd.addColorStop(1, "rgb(8, 8, 138)");
                ctx.fillStyle = grd;

                for (var i = 0; i < parameter.total; i ++)
                    this.roundRect(ctx, 600, i*52 + 70, 50, 50, 5, true, false);

                grd.addColorStop(0, "rgba(200, 0, 0, 0.5)");
                grd.addColorStop(1, "rgb(138, 8, 8)");

                ctx.fillStyle = grd;
                this.roundRect(ctx, 280, 240, 60, 60, 5, true, false);

                ctx.font = "18px Verdana";
                ctx.fillStyle = "black";

                ctx.fillText("Função Hash", 253, 320);

                ctx.font = "20px Verdana";
                ctx.textAlign = "right";
                for (var i = 0; i < parameter.total; i ++)
                    ctx.fillText(i, 590, i*52 + 110);
            }
        },
        
        roundRect:function (ctx, x, y, width, height, radius, fill, stroke) {
            if (typeof stroke == "undefined") {
                stroke = true;
            }
            if (typeof radius === "undefined") {
                radius = 5;
            }
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }
        }
    };
})();