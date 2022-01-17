
jsPlumb.ready(function() {


});

(function () {

    var 
    connectionArrow = [["PlainArrow", {width: 15, length: 15, location: 0.6, id: "arrow"}]],
    connectorPaintStyle = {
        strokeWidth : 4,
        stroke: "#456"
    },
    connectorPaintStyleHover = {
        stroke: "#0078e7"
    },
    endpointsEndPaintStyle = {
        fill: "rgba(255,69,0,0.8)",
        radius: 8
    },
    endpointsEndPaintStyleHover = {
        fill: "rgba(0,59,255,0.8)",
        radius: 8
    },

    endpointsStartPaintStyle2 = {
        stroke: "none",
        radius: 0,
        strokeWidth : 0,
        outlineWidth: 0
    },
    endpointsStartPaintStyleHover2 = {
        stroke: "none"
    },
    connectorPaintStyle2 = {
        strokeWidth : 2,
        stroke: "#5F5",
        dashstyle: "2 2"
    },
    connectorPaintStyleHover2 = {
        stroke: "#1F1",
        dashstyle: "none"
        
    };
    
    window.Component = {
        node:{
            width: 50,
            height: 50,
            className: 'nodeelement',
            innerHTML: "<div class='itemValue'>${label}</div>"            
        }
    };
    window.Endpoints = {
        get:function(name) {
            switch (name){
                case "curvado": return Endpoints.node[0];
                case "retodigrafo": return Endpoints.node[1];
                case "retografo": return Endpoints.node[2];
            }
            alert("Falha ao busca tipo de conexão");
        },
        label:[{
            anchor: [ "Perimeter", { shape: "Rectangle" } ],
            title: 'output',
            paintStyle: endpointsStartPaintStyle2,
            hoverPaintStyle: endpointsStartPaintStyleHover2,
            connectorStyle: connectorPaintStyle2,
            connectorHoverStyle: connectorPaintStyleHover2,
            connectorOverlays: connectionArrow,
            scope: "labelspace"
        },{
            anchor: [ "Perimeter", { shape: "Circle" } ],
            title: 'output',
            paintStyle: endpointsStartPaintStyle2,
            hoverPaintStyle: endpointsStartPaintStyleHover2,
            connectorStyle: connectorPaintStyle2,
            connectorHoverStyle: connectorPaintStyleHover2,
            connectorOverlays: connectionArrow,
            scope: "labelspace"
        }],
        node:[{
            anchor: [ "Left" ],
            title: 'output',
            paintStyle: endpointsEndPaintStyle,
            hoverPaintStyle: endpointsEndPaintStyleHover,
            connectorStyle: connectorPaintStyle,
            connectorHoverStyle: connectorPaintStyleHover,
            connectorOverlays: connectionArrow,
            connector: ["StateMachine", {margin : 0,curviness: 10,proximityLimit :40}],
            scope: 'workspace'
        },{
            anchor: [ "Perimeter", { shape:"Circle" } ],
            title: 'input',
            paintStyle: endpointsEndPaintStyle,
            hoverPaintStyle: endpointsEndPaintStyleHover,
            connectorStyle: connectorPaintStyle,
            connectorHoverStyle: connectorPaintStyleHover,
            connectorOverlays: connectionArrow,
            connector: ["Straight", {gap: 0}],
            scope: 'workspace'
        },{
            anchor: [ "Perimeter", { shape:"Circle" } ],
            title: 'input',
            paintStyle: endpointsEndPaintStyle,
            hoverPaintStyle: endpointsEndPaintStyleHover,
            connectorStyle: connectorPaintStyle,
            connectorHoverStyle: connectorPaintStyleHover,
            connector: ["Straight", {gap: 0}],
            scope: 'workspace'
        },{
            anchor: "Continuous",
            title: 'input',
            paintStyle: endpointsEndPaintStyle,
            hoverPaintStyle: endpointsEndPaintStyleHover,
            connectorStyle: connectorPaintStyle,
            connectorHoverStyle: connectorPaintStyleHover,
            connectorOverlays: connectionArrow,
            connector: "StateMachine",
            scope: 'workspace'
        }]
    };

}());