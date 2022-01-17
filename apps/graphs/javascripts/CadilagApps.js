
$(function () {

    var VK_NOTHING = -1;
    var VK_EDICAO = 0;
    var VK_OPERACOES = 1;
    var VK_ESTRUTURA = 2;
    var Apps = [["#projetohud"], ['#operacoeshud'], ['#structhud']];
    var selectedarea = VK_NOTHING;
    
    window.showApp = function(id){
        for (var i = 0; i < Apps.length; i++) {
            if(Apps[i][0]===id && (selectedarea!==i)){
                toggleAREA(i);
                break;
            }
        }
    };
    
    window.hideApp = function(){
        toggleAREA(selectedarea);
    };
    
    $('#projeto-btn').on('click', function () {
        if (toggleAREA(VK_EDICAO))
            $(this).addClass('appselected');
    });
    $('#algoritmo-btn').on('click', function () {
        if (toggleAREA(VK_OPERACOES))
            $(this).addClass('appselected');
    });
    $('#estruturas-btn').on('click', function () {
        if (toggleAREA(VK_ESTRUTURA))
            $(this).addClass('appselected');
    });

    $("#hidesidebar").on('click', function () {
        toggleAREA(selectedarea);
    });
    $("#navsidebar").on('click', function () {
        $("#sidebarselect").toggleClass("showDetail");
    });

    closeTip = function (tip) {
        if (tip === undefined)
            tip = $(".tip");
        tip.remove();
    };

    toggleAREA = function (i) {
        $('.appselected').removeClass('appselected');

        if (selectedarea !== -1) {
            for (var j = 0; j < Apps[selectedarea].length; j++) {
                var objapp = $(Apps[selectedarea][j]);
                objapp.fadeOut(400);
            }
        }

        $("#sidebarselect").removeClass("showDetail");
        if (i !== selectedarea) {
            $("#hidesidebar").fadeIn(400);
            $("#navsidebar").hide();
            for (var j = 0; j < Apps[i].length; j++) {
                var objapp = $(Apps[i][j]);
                objapp.fadeIn(400);
            }
            selectedarea = i;

            return true;
        } else {
            $("#hidesidebar").hide();
            $("#navsidebar").fadeIn(400);
            selectedarea = VK_NOTHING;
            return false;
        }
    };

});