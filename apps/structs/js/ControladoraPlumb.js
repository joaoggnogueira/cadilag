$( document ).ready(function() {
    Plumb.setPrimaryColor("#0000ff");
    Plumb.setSecondaryColor("#ff0000");
});
//Midleware JsPlumb
//v 2.1.7

(function () {

    window.Plumb = {
        color1:"#0000ff",color1light:"#5555ff",color2:"#ff0000",color2light:"#ff5555",
        config:{
            deleteEndpointsOnDetach:false
        },
        setPrimaryColor: function(rgb){
            this.color1 = rgb;
            this.color1light = this.lightColor(rgb.substring(1));
        },
        setSecondaryColor: function(rgb){
            this.color2 = rgb;
            this.color2light = this.lightColor(rgb.substring(1));            
        },
        componentToHex: function(c) {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        },
        rgbToHex: function(r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        lightColor: function(hex){
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return this.rgbToHex(parseInt((r*2+255)/3),parseInt((g*2+255)/3),parseInt((b*2+255)/3));
        },
        /**
         * 
         * @param {String} idDoElemento
         * @param {Number} left
         * @param {Number} top
         * @param {Number} time
         * @param {Function} oncomplete
         * @returns {undefined}
         */
        moveTo: function(idDoElemento,left,top,time,oncomplete){
            queueAnimation(idDoElemento,{left:left,top:top},time,{updateConnection:true});
            if(oncomplete){
                timeout(oncomplete,time);
            }
        },
        fadeOut: function(idDoElemento,time,oncomplete){
            queueAnimation(idDoElemento,{opacity:0},time,{easing:"swing"});
            if(oncomplete){
                timeout(oncomplete,time);
            }
        },
        noqueue: function(idDoElemento,css,time,oncomplete){
            noqueueAnimation(idDoElemento,css,time,{easing:"swing"});
            if(oncomplete){
                timeout(oncomplete,time);
            }
        },
        fadeIn: function(idDoElemento,time,oncomplete){
            queueAnimation(idDoElemento,{opacity:1},time,{easing:"swing",onInit:function(){
                var d = document.getElementById(idDoElemento);
                if(d.style.display === "none"){
                    d.style.display = "block";
                    d.style.opacity = "0";
                }
            }});
            if(oncomplete) {
                timeout(oncomplete,time);
            }
        },
        blink: function(idDoElemento,timeTotal,oncomplete){
            var time = timeTotal/2000;
            for (var i = 0; i < time; i++) {
                Plumb.fadeOut(idDoElemento, 1000);
                Plumb.fadeIn(idDoElemento, 1000);
            }
            if(oncomplete){
                timeout(oncomplete,timeTotal);
            }
        },
        
        init: function(deleteEndpointsOnDetach){
            
            jsPlumb.importDefaults({
                DragOptions: {cursor: "grab", zIndex: 20},
                Connector: ["Straight", { width:30, height:10 }],
                ConnectionsDetachable: false
            });
            
            if(deleteEndpointsOnDetach !== undefined)
                this.config.deleteEndpointsOnDetach = deleteEndpointsOnDetach;

        },
        tornarArrastavel: function(idDoElemento){
            jsPlumb.draggable(idDoElemento);
        },
        repintarTudo: function(){
            jsPlumb.repaintEverything();
        },
        repintarElemento: function(idDoElemento){
            jsPlumb.revalidate(idDoElemento);
        },
        removeConnection: function(conn){
            jsPlumb.detach(conn);
        },
        adicionarPontoDeConexao: function(idDoElemento,parametros){
            
            var format,colorC;
            
            if(parametros.isPrimary) {
                if(parametros.isSource){
                    format = {fillStyle: this.color1light,radius: 5};
                } else {
                    format = {fillStyle: this.color1light,radius: 5};
                }
                colorC = this.color1;
            } else {
                if(parametros.isSource){
                    format = {fillStyle: this.color2light,radius: 5};
                } else {
                    format = {fillStyle: this.color2light,radius: 5};
                }
                colorC = this.color2;
            }
            
            if(idDoElemento===null){
                console.error("Não é possível adiconar conexão pois o id do Elemento é null");
                return;
            }
            
            var endpoint = jsPlumb.addEndpoint(idDoElemento, {
                anchor: parametros.anchor,
                paintStyle: format,
                connectorStyle: {lineWidth: 3, strokeStyle: colorC},
                connectorHoverStyle: {lineWidth: 4},
                endpointsOnTop: true,
                isSource: parametros.isSource,
                isTarget: parametros.isTarget,
                enabled: false
            });

            if(parametros.type!==undefined){
                switch (parametros.type){
                    case "Flowchart":
                        if(parametros.isSource){
                            endpoint.connector = ["Flowchart", {stub: [-50,30], alwaysRespectStubs: true, midpoint: 0.0001}];
                        } else{
                            endpoint.connector = ["Flowchart", {stub: [-50,30], alwaysRespectStubs: true, midpoint: 0.0001}];
                        }
                    ;
                }
            }
            
            endpoint.isPrimary = parametros.isPrimary;
            return endpoint;
        },
        showMessage:function(text,time){
        
            var d = document.createElement("div");
            d.innerHTML = text;

            d.style.left = "100px";
            d.style.top = "200px";
            d.style.fontSize = "16px";
            d.style.position = "absolute";
            d.style.background = "black";
            d.style.color = "white";
            d.style.borderRadius = "10px";
            d.style.padding = "5px 10px";

            $("#main").append(d);

            timeout(function(){
                $(d).remove();
            },time);

        },
        clearEndpoints:function(){
            var list = jsPlumb.selectEndpoints();
            for(var i=0;i<list.length;i++){
                  if($("#"+list.get(i).elementId).length==0){
                       jsPlumb.deleteEndpoint(list.get(i));
                  }
            }  
        },
        desconectarCompletamente:function(elId){
            jsPlumb.remove(elId);
        },
        desconectar:function(parametros,index){
            if(!index){
                index = 0;
            }
            var cnc = jsPlumb.getConnections(parametros);
            if (cnc[index] !== null && cnc[index] !== "undefined" && cnc[index]!==undefined){
                jsPlumb.detach(cnc[index]);
            } else{
                console.log("conexão não encontrada");
                console.log(cnc);
            }
        },
        desconectarTodosCom:function(parametros){
            var cnc = jsPlumb.getConnections(parametros);
            for(var i=0;i<cnc.length;i++)
                if (cnc[i] !== null && cnc[i] !== "undefined" && cnc[i]!==undefined)
                    jsPlumb.detach(cnc[i]);
        },
        conectar:function(origem,destino,title){
            var overlays;
            var color;
            
            if(origem.isPrimary) {
                color = this.color1;
            } else {
                color = this.color2;
            }
            if(origem.isTarget && destino.isTarget) {
                overlays = 
                    [[
                        "PlainArrow", {
                            location: 1,
                            direction: 1,
                            width: 13,
                            length: 15,
                            paintStyle: {
                                fillStyle: color
                            }
                        }
                    ],[
                        "PlainArrow", {
                        location: 0,
                        width: 13,
                        direction: -1,
                        length: 15,
                        paintStyle: {
                            fillStyle: color
                        }
                    }]];
            } else if(origem.isTarget && !destino.isTarget) {
                overlays = 
                    [[
                        "PlainArrow", {
                            location: 0.5,
                            direction: 1,
                            width: 13,
                            length: 15,
                            paintStyle: {
                                fillStyle: color
                            }
                        }
                    ]];
            } else if(!origem.isTarget && destino.isTarget) {
                overlays = 
                    [[
                        "PlainArrow", {
                            location: 0.5,
                            direction: -1,
                            width: 13,
                            length: 15,
                            paintStyle: {
                                fillStyle: color
                            }
                        }
                    ]];
            }
            var connection = jsPlumb.connect({source: origem, target: destino, deleteEndpointsOnDetach: this.config.deleteEndpointsOnDetach},{overlays:overlays});
            if(title) {
                connection.bind("mouseover", function(conn) {
                    var overlay = [
                        "Label", { 
                        label: title, 
                        location: 0.5, 
                        id: "connLabel"
                    } ];
                
                    if(origem.isPrimary) {
                        overlay[1].cssClass = "labelConnectionBlue";
                    } else {
                        overlay[1].cssClass = "labelConnectionRed";
                    }
                    conn.addOverlay(overlay);
                }); 

                connection.bind("mouseout", function(conn) {
                    conn.removeOverlay("connLabel");
                });
            }
            return connection;
        }
    };
    
})();