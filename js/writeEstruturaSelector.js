$(document).ready(function () {
    var listaEnconded = localStorage.getItem('lastStructCadilag');
    var lista;
    var urlPath = location.pathname.split("/");
    var url = urlPath[urlPath.length - 1];
    var title = $(document.head).find("title").text();
    var datetime = new Date().toLocaleString();
    var newView = {title: title, url: url, datetime: datetime};

    if (listaEnconded && listaEnconded !== "null") {
        try {
            lista = JSON.parse(listaEnconded);

            for (var i = 0; i < lista.total; i++) {
                if (lista.queue[i]) {
                    $("#lastViews ul").append("<li><a href=" + lista.queue[i].url + ">" + lista.queue[i].title + "<br/><small>" + lista.queue[i].datetime + "</small></a></li>");
                }
            }

            if (url === "index.php" || url === "") {
                return;
            }
            //Checando se já esta na lista
            for (var i = 0; i < lista.total; i++) {
                if (lista.queue[i]) {
                    if (lista.queue[i].url === url) {
                        lista.queue[i] = null;
                        while (i < lista.total - 1) {
                            lista.queue[i] = lista.queue[i + 1];
                            i++;
                        }
                    }
                } else {
                    break;
                }
            }

            //Deslocando para adicionar na lista
            for (var i = lista.total - 1; i > 0; i--) {
                lista.queue[i] = lista.queue[i - 1];
            }
        } catch (e) {
            console.error("Falha ao fazer parser da lista de últimas estruturas abertas");
            console.log(e);
        }
    } else {
        $("#lastViews").hide();
        if (url === "index.php" || url === "") {
            return;
        }
        var lista = {total: 3, queue: []};
    }
    lista.queue[0] = newView;
    localStorage.setItem('lastStructCadilag', JSON.stringify(lista));
});

$(".subsidebar").css('transition', 'none');

showSidebar = function () {
    $(".subsidebar").show();
    $("#searchestrutura").focus();
    $("#huboptions").fadeOut(100);
    $(".subsidebar").animate({'left': '0px'}, 500);
    $("#main").animate({'left': '230px'}, 500);
    $("#canv").animate({'left': '230px'}, 500);
    $("#topbar").animate({'left': '230px'}, 500);
    $("#subtopbar").animate({'left': '250px'}, 500);
    closeTip();
};

hideSidebar = function () {
    $("#searchestrutura").blur();
    $(".subsidebar").animate({'left': '-270px'}, 500);
    $("#topbar").animate({'left': '0px'}, 500);
    $("#canv").animate({'left': '0px'}, 500);
    $("#main").animate({'left': '0px'}, 500);
    $("#subtopbar").animate({'left': '0px'}, 500);
    setTimeout(function () {
        $(".subsidebar").hide();
    }, 500);
};

toggleHideSidebar = function(){
    if ($(".subsidebar").css('left') === '0px'){
        hideSidebar();
    }
};

toggleShowSidebar = function(){
    if ($(".subsidebar").css('left') === '0px'){
        showSidebar();
    }
};

toggleSidebar = function () {

    if ($(".subsidebar").css('left') !== '0px') {
        showSidebar();
    } else {
        hideSidebar();
    }
};

$(".navbar").click(function () {
    toggleSidebar();
});

function replaceSpecialChars(str) {
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[èéê]/, "e");
    str = str.replace(/[óòôõ]/, "o");
    str = str.replace(/[íìî]/, "i");
    str = str.replace(/[úùû]/, "u");

    return str;
}

function addSearchInput(id, fn) {
    $("#" + id).keyup(function () {
        $(".subsidebar").show();
        var busca = $(this).val().toLowerCase();
        var comp = busca.length;
        if (comp !== 0) {
            var kout = true;
            $(".estruturas").fadeOut(100, function () {
                $(".selectestrutura").fadeIn(100);
            });
            if (fn && fn.addicionalContentToHide) {
                for (var i=0;i<fn.addicionalContentToHide.length;i++) {
                    $(fn.addicionalContentToHide[i]).fadeOut(100);
                }
            }
            $(".optionestrutura > a > p").each(function () {
                var parent = $(this).parent().parent();
                var valor = parent.attr('title').toLowerCase();

                var tags = parent.attr('tags').toLowerCase().split(',');
                var valororiginal = parent.attr('title');
                valor = replaceSpecialChars(valor);
                
                var length = busca.length;
                if (valor.substring(0,length)===busca) {
                    parent.fadeIn(100);
                    $(this).html("<bold>" + valororiginal.substring(0, comp) + "</bold>" + valororiginal.substring(comp, valor.length));
                    parent.removeAttr('tag');
                    kout = false;
                    $("#emptyestrutura").fadeOut(100);
                    var id = parent.attr('id');
                    $(".optionestrutura#" + id + " .subtag").html('');
                } else if (valor.indexOf(" " + busca) !== -1) {
                    var index = valor.indexOf(" " + busca);
                    parent.fadeIn(100);
                    var before = valororiginal.substring(0, index);
                    var after = valororiginal.substring(index + busca.length + 1);
                    $(this).html(before + "<bold>" + valororiginal.substring(index, index + busca.length + 1) + "</bold>" + after);
                    parent.removeAttr('tag');
                    kout = false;
                    $("#emptyestrutura").fadeOut(100);
                    var id = parent.attr('id');
                    $(".optionestrutura#" + id + " .subtag").html('');
                } else {
                    var k = true;
                    for (var i = 0; i < tags.length; i++) {
                        var length = busca.length;
                        if (tags[i].substring(0,length)===busca) {
                            $(this).html(valororiginal);
                            parent.fadeIn(100);
                            kout = false;
                            var id = parent.attr('id');
                            parent.attr('tag', 'tag');
                            $(".optionestrutura#" + id + " .subtag").html('<p><bold>' + tags[i].substring(0, comp) + '</bold>' + tags[i].substring(comp, tags[i].length) + '</p>');
                            k = false;
                            break;
                        }
                    }

                    if (k) {
                        parent.fadeOut(100);
                        parent.removeAttr('tag');
                        var id = parent.attr('id');
                        $(".optionestrutura#" + id + " .subtag").html('');

                    }
                }
            });
            if (kout)
                $("#emptyestrutura").fadeIn(100);
            else
                $("#emptyestrutura").fadeOut(100);
        } else {

            $(".optionestrutura").fadeOut(100);
            $(".selectestrutura").fadeOut(100, function () {
                if (fn && fn.addicionalContentToHide) {
                    for (var key in fn.addicionalContentToHide) {
                        $(fn.addicionalContentToHide[key]).fadeIn(100);
                    }
                    $(".subsidebar").hide();
                } else {
                    $(".estruturas").fadeIn(100);
                }
            });
        }

    });
}

addSearchInput("searchestrutura");

$('.item').click(function () {
    var obj = $(this);
    var next = obj.next('.subitens').eq(0);
    if (obj.next('.subitens').length === 0) {
        var parentnext = obj.parent().next('.item-bg');
        if (parentnext.length !== 0) {
            next = obj.parent().next('.item-bg').eq(0).children('.subitens');
        } else {
            next = obj.parent().next('.subitens').eq(0);
        }
    }
    if (obj.attr('open') === undefined) {
        obj.attr('open', 'open');
        next.attr('open', 'open');
    } else {
        obj.removeAttr('open');
        next.removeAttr('open');
    }
});

