/* 
 Author     : joaog
 */
/* global jsPlumb */

$('document').ready(function () {
    
    $("#sidebarselect > ul > li").each(function () {
        var thisObj = $(this);
        var title = thisObj.attr('title');
        thisObj.tipsy({title: function () {
                return "<tipsym>" + title + "</tipsym>";
            }, html: true, gravity: 'e'});
    });
    
    $("#workspace").click(function (event) {
        $(".element.selected").removeClass('selected');
    });

    $("#workspace").dblclick(function (event) {
        var object = getObjectOn();
        if (object === undefined) {
            Machine.addNode(event);
        } else {

        }
    });

    $(".cool-radiobutton.radio-connect").addClass("selected");

    $(".cool-radiobutton").click(function () {
        $(".cool-radiobutton").removeClass("selected");
        $(this).addClass("selected").trigger("selected");
    });
    $(".radio-connect").tipsy({title: 'title', html: true, gravity: 's', delayIn: 100});

    $(".radio-move").tipsy({title: 'title', html: true, gravity: 'sw', delayIn: 100});

    $(".appbuttons button").each(function () {
        $(this).tipsy({title: 'title', html: true, gravity: 'n', delayIn: 200});
    });
    
    $("#readinputdialog").click(function () {
        $(this).select();
    });

    $("#statushud .switch").click(function (event) {
        $("#statushud .switch").toggleClass('checked');
        $('#statushud').toggleClass('hide');
    });
    $("#statushud > .title").click(function (event) {
        $("#statushud .switch").toggleClass('checked');
        $('#statushud').toggleClass('hide');
    });

    $(".nodeendpoint").attr("oncontextmenu", "clickEventNodeEndpoint(event.target,1);return false;");

    $(".nodeendpoint").click(function (event) {
        clickEventNodeEndpoint(event.target, 0);
    });

    $("#UserDiv").click(function () {
        $("#huboptions").slideToggle({duration: 300, easing: "easeOutCirc"});
    });

    $("#clearlabels").click(function () {
        swal({
            type: "warning",
            title: "Remover rótulos?",
            text: "Você poderá perder dados caso a estrutura não esteja salva",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                removeAllLabels();
            }
        });

    });

    $("#clearconnections").click(function() {
        swal({
            type: "warning",
            title: "Remover conexões?",
            text: "Você poderá perder dados caso a estrutura não esteja salva",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                removeAllConnections();
            }
        });
    });

    $("#clearall").click(function() {
        swal({
            type: "warning",
            title: "Limpar tudo?",
            text: "Você poderá perder a estrutura caso não esteja salva",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                clearAll();
            }
        });
    });

    $("#new").click(function() {
        swal({
            type: "warning",
            title: "Limpar e começar novo projeto?",
            text: "Você poderá perder a estrutura caso não esteja salva",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {
            if (isConfirm) {
                clearAll();
                $("#nameofproject").val("Sem Título");
                $("input[name='ponderado'][value='false']").get(0).checked = true;
                $("input[name='digrafo'][value='true']").get(0).checked = true;
            }
        });
    });
    $("#selectorstruct").change(function(){
        var id_wrapper = $("#selectorstruct").val();
        $(".wrapperstruct").hide();
        $("#"+id_wrapper).show();
    });

});

function getObjectOn() {
    var connectionList = jsPlumb.getConnections();
    for (var i = 0; i < connectionList.length; i++) {
        if (connectionList[i].isHover())
        {
            connectionList[i].title = 'connector';
            return connectionList[i];
        }
    }
}

var atualconnectionEdit = null;

function clearSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty)
            window.getSelection().empty();

        else if (window.getSelection().removeAllRanges)
            window.getSelection().removeAllRanges();
    } else if (document.selection)
        document.selection.empty();
}

function toggleGrid() {
    if ($("#showgrid:checked").val() === 'on') {
        $("body").addClass('withGrid');
    } else {
        $("body").removeClass('withGrid');
    }
}

function toggleMinimap() {

}