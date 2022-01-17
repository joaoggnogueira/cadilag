
$(function () {

    var VK_NOTHING = -1;
    var VK_ALGORITMO = 0;
    var VK_EPROGRAMADA = 1;
    var VK_STRUCT = 2;
    var VK_REVISAO = 5;
    var VK_HISTORY = 4;
    var Apps = [["#AlgoritmoDiv"], ['#EntradaProgramadaDiv'], ['#StructDiv'], ['#ConfigDiv'], ['#HistoryDiv'],['#RevisaoDiv']];
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
    
    $('#sourcecode-btn').on('click', function () {
        if (toggleAREA(VK_ALGORITMO))
            $(this).addClass('appselected');
    });
    $('#revisao-btn').on('click', function () {
        if (toggleAREA(VK_REVISAO))
            $(this).addClass('appselected');
    });
    $('#eprogramada-btn').on('click', function () {
        if (toggleAREA(VK_EPROGRAMADA))
            $(this).addClass('appselected');
    });
    $('#structview-btn').on('click', function () {
        if (toggleAREA(VK_STRUCT))
            $(this).addClass('appselected');
    });

    $('#history-btn').on('click', function () {
        if (toggleAREA(VK_HISTORY))
            $(this).addClass('appselected');
    });
    $("#hidesidebar").on('click', function () {
        toggleAREA(selectedarea);
    });
    $("#navsidebar").on('click', function () {
        $("#sidebar").toggleClass("showDetail");
    });
    $(".tip").on('click', function () {
        closeTip($(this));
    });

    closeTip = function (tip) {
        if (tip === undefined)
            tip = $(".tip");
        tip.remove();
    };

    toggleAREA = function (i) {
        toggleHideSidebar();
        $('.appselected').removeClass('appselected');
        closeTip();

        if (selectedarea !== -1) {
            for (var j = 0; j < Apps[selectedarea].length; j++) {
                var objapp = $(Apps[selectedarea][j]);
                objapp.fadeOut(400);
            }
        }

        $("#sidebar").removeClass("showDetail");
        
        if (i !== selectedarea) {
            $("#hidesidebar").fadeIn(400);
            $("#navsidebar").hide();
            for (var j = 0; j < Apps[i].length; j++) {
                var objapp = $(Apps[i][j]);
                objapp.fadeIn(400);
            }
            selectedarea = i;
            if(i === VK_ALGORITMO){
                AlgServer.fixSize();
            }
            return true;
        } else {
            $("#hidesidebar").hide();
            $("#navsidebar").fadeIn(400);
            selectedarea = VK_NOTHING;
            return false;
        }
    };

});


(function () {

    window.TimeApp = {

        updateTimeLabel: function () {

            var timelabel = $("#timelabel");
            var time = $("#time");
            var timeval = time.val();

            timelabel.val(timeval + "x");
            if (parseFloat(timeval) !== 0) {
                setSpeed(1.0 / parseFloat(timeval));
            } else {
                time.val('1.0');
                setSpeed(1);
            }
        },
        updateTime: function () {
            var timelabel = $("#timelabel");
            var time = $("#time");
            var timeval = parseFloat(timelabel.val());
            if (timeval + "" === "NaN") {
                timeval = 1;
            } else {
                if (timeval < 0.25) {
                    timeval = 0.25;
                } else if (timeval > 10) {
                    timeval = 10;
                }
            }
            timelabel.val(timeval + "x");
            time.val(timeval);
            setSpeed(1.0 / timeval);
        }
    };
    window.ButtonApp = {
        lightupAdd: function () {
            $("#add").addClass("selected");
            $("#remove").removeClass("selected");
            $("#search").removeClass("selected");
        },
        lightupRem: function () {
            $("#add").removeClass("selected");
            $("#remove").addClass("selected");
            $("#search").removeClass("selected");
        },
        lightupSearch: function () {
            $("#add").removeClass("selected");
            $("#remove").removeClass("selected");
            $("#search").addClass("selected");
        }

    };
})();

$("#sair").click(function () {
    localStorage.setItem('emailCadilag', null);
    localStorage.setItem('senhaCadilag', null);
    window.location.replace("../../closesession.php");
});