
(function () {

    var timer;

    function requestTotal(callback) {
        post("./request/notify/check.php", function (data) {
            callback(data.reply);
        }, {}, {hideErrorMessage: true, hideFalseMessage: true, hide: true,
            callbackFalse: function () {
                alert("falha ao buscar atualizações: Falha no Banco");
                clearInterval(timer);
            },
            callbackError: function () {
                alert("falha ao buscar atualizações: Erro Critico");
                clearInterval(timer);
            }
        });
    }

    function requestList(callback) {
        post("./request/notify/list.php", function (data) {
            callback(data.reply);
        }, {}, {hide: true});
    }

    function requestGet(id, callback) {
        post("./request/notify/get.php", function (data) {
            callback(data);
        }, {id: id}, {hide: true});
    }

    function requestRead(id, callback) {
        post("./request/notify/visto.php", function (data) {
            callback(data);
        }, {id: id}, {hide: true});
    }

    function setTotal(total) {
        document.getElementsByClassName("notify-btn")[0].setAttribute("count",total);
    }

    window.notify = {
        init: function () {
            document.getElementsByClassName("notify-btn")[0].addEventListener("click",window.notify.toggleListNotify);
            window.notify.update();
        },
        update: function () {
            requestTotal(function (total) {
                setTotal(total);
            });
        },
        openList: function () {
            requestList(function (html) {
                $(html).insertAfter(".topbar");
                $(".notify-tab").hide().slideDown(100);
            });
        },
        closeList: function () {
            $(".notify-tab").slideUp(100, function () {
                $(".notify-tab").remove();
            });
        },
        toggleListNotify: function () {
            if (document.getElementsByClassName("notify-tab").length === 0) {
                window.notify.openList();
            } else {
                window.notify.closeList();
            }
        },
        openNotify: function (id) {
            window.notify.closeList();
            requestGet(id, function (data) {
                swal({title: data.title,
                    html: true,
                    text: data.view,
                    showCancelButton: true,
                    confirmButtonColor: "#0000DD",
                    confirmButtonText: "Marcar como lido",
                    cancelButtonText: "Voltar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, function () {
                    window.notify.readNotify(id);
                    return false;
                });
            });
        },
        readNotify: function (id) {
            requestRead(id, function () {
                window.notify.update();
                swal.close();
            });
        }
    };
    
    //timer = setInterval(window.notify.update,10000);

})();

$(document).ready(window.notify.init);
