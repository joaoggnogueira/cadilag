
/* global introJs */
$(document).ready(function () {

    window.initIntro = function (option) {
        if (option) {
            $(".sweet-alert .confirm").click();
        }
        switch (option) {
            case "overview":
                overview();
                break;
            case "howToPlay":
                howToPlay();
                break;
            case "navbar":
                navbar();
                break;
            case "pseudocodigo":
                pseudocodigo();
                break;
            case "eprogramada":
                eprogramada();
                break;
            default :
                menu();
        }

    };

    function animateText(query,text,time){
        var obj = $(query);
        
        if (text !== "") {
            var counter = 0;
            var timestep = time/text.length;
            function c(){
                counter++;
                if(counter !== text.length){
                    var palavra = text.substring(0,counter);
                    obj.val(palavra).keyup();
                    setTimeout(c,timestep);
                } else{
                    obj.val(text).keyup();
                }
            }
            c();
        } else {
            var text = obj.val();
            var counter = text.length;
            var timestep = time/counter;
            function c(){
                counter--;
                if(counter !== 0){
                    var palavra = text.substring(0,counter);
                    obj.val(palavra).keyup();
                    setTimeout(c,timestep);
                } else{
                    obj.val("").keyup();
                }
            }
            c();
        }
        
    }

    function run(input) {

        var intro = introJs();
        var steps = [];
        $(input).each(function () {
            if($(this.element).length<=1) {
                this.tooltipClass = "tooltipHelp";
                this.highlightClass = "highlightHelp";
                this.position = 'bottom-left-aligned';
                if (this.image && this.image.length !== 0) {
                    var img = $("<img/>")
                            .attr("src", "../../images/" + this.image)
                            .attr("width", "50")
                            .attr("height", "50")
                            .css("display", "inline-block");
                    this.intro =
                            $("<p/>")
                            .css("text-align", "center")
                            .append(img)
                    [0].outerHTML
                            + " " + this.intro;
                }
                steps.push(this);
            } else {
                console.log("Somente 0 ou 1 elemento ?? permitido para query "+this.element);
            }
        });
        var options = {
            nextLabel: "pr??ximo",
            prevLabel: "anterior",
            skipLabel: "encerrar",
            doneLabel: "encerrar",
            showStepNumbers: false,
            steps: steps
        };

        if (steps.length === 1) {
            options.showBullets = false;
            options.doneLabel = "fechar";
        } else {
            options.showProgress = true;
        }
        intro.setOptions(options);
        intro.start().onbeforechange(function () {
            var atual = steps[intro._currentStep];
            if (atual.before) {
                atual.before();
            }
        }).onafterchange(function () {
            var atual = steps[intro._currentStep];
            if(atual.after){
                atual.after();
            }
            if(atual.timeout){
                setTimeout(function(){
                    intro.refresh();
                },atual.timeout);
            } else {
                intro.refresh();
            }
        }).oncomplete(menu).onexit(menu);
    }

    function menu() {
        $(".selector-help").removeClass(".selector-help");
        var ul = $("<ul/>").append(
                    $("<li/>").append($("<a/>").html("Vis??o Geral").attr("onclick", "initIntro('overview')")).addClass("liHelp")
                ).append(
                    $("<li/>").append($("<a/>").html("Executando algoritmos").attr("onclick", "initIntro('howToPlay')")).addClass("liHelp")
                ).append(
                    $("<li/>").append($("<a/>").html("Escolhendo a estrutura").attr("onclick", "initIntro('navbar')")).addClass("liHelp")
                ).append(
                    $("<li/>").append($("<a/>").html("Pseudoc??digo").attr("onclick", "initIntro('pseudocodigo')")).addClass("liHelp")
                ).append(
                    $("<li/>").append($("<a/>").html("Entradas Programadas").attr("onclick", "initIntro('eprogramada')")).addClass("liHelp")
                );
        swal({title: "Tutoriais e Ajuda", text: ul[0].outerHTML, html: true});
    }

    function overview() {
        hideApp();
        run([{
                element: '.navbar',
                intro: 'Aqui fica o nome da estrutura selecionada. Clicando aqui voc?? pode acessar outras estrutura.',
                image: 'CadilagStructs/menu.svg'
            },{
                element: '#UserDiv',
                intro: 'Clique aqui para acessar atalhos para outras ??reas do <b>Cadilag</b>.',
                image: 'CadilagStructs/home.svg'
            },{
                element: '#sourcecode-btn',
                intro: 'Visualize o pseudoc??digo para os algoritmos b??sicos (<green>Inser????o</green>, <red>Remo????o</red> e <blue>Busca</blue>) da estrutura, junto com anima????o.',
                image: 'CadilagStructs/coding.svg',
                after: function(){
                    $("#sourcecode-btn").click();
                }
            },{
                element: '#structview-btn',
                intro: 'Visualize informa????es e a descri????o sobre a estrutura de dado.',
                image: 'CadilagStructs/info.svg',
                after: function(){
                    $("#structview-btn").click();
                }
            }, {
                element: '#eprogramada-btn',
                intro: 'Insira, salve, ou carregue diversas entradas para serem executadas',
                image: 'CadilagStructs/multiple-shots.svg',
                after: function(){
                    $("#eprogramada-btn").click();
                }
            },{
                element: '#revisao-btn',
                intro: "Veja passo-a-passo o que aconteceu na ??ltima anima????o.",
                image: 'CadilagStructs/revisao.svg',
                after: function(){
                    $("#revisao-btn").click();
                }
            },{
                element: '#history-btn',
                intro: "Veja quais foram as entradas realizadas para esta estrutura.",
                image: 'CadilagStructs/history.svg',
                after: function(){
                    $("#history-btn").click();
                }
            }, {
                element: '#hidesidebar',
                intro: "Para fechar a janela da ferramenta aberta clique aqui ou clique novamente sobre o ??cone dela.",
                image: 'CadilagStructs/hide.svg'
            },{
                element: '#ClockArea',
                intro: "Altere a velocidade da anima????o conforme desejar.",
                image: '',
                after: function(){
                    $("#hidesidebar").click();
                }
            }, {
                element: '#help',
                intro: "Aqui voc?? acessa diversos tutorais (assim como este).",
                image: ''
            }, {
                element: '#feedback',
                intro: "Aqui voc?? pode reportar qualquer problema encontrados na p??gina, ou dar sugest??es para esta e outras p??ginas.",
                image: ''
            }, {
                element: '#config',
                intro: "Aqui voc?? pode acessar configura????es e ativar (ou desativar) funcionalidades.",
                image: ''
            }
        ]);
    }

    function howToPlay() {
        var steps = [];
        $("#topbar input").each(function () {
            var tipo = null;
            var max = null;
            var digouchar = "caracteres";
            switch (this.pattern) {
                case '^-?[0-9][0-9]*([.,][0-9]{1,4})?$':
                    tipo = "n??mero real ou inteiro";
                    digouchar = "d??gitos";
                    break;
                case '^[0-9][0-9]*([.,][0-9]{1,4})?$':
                    tipo = "n??mero real ou inteiro positivo";
                    digouchar = "d??gitos";
                    break;
                case '^-?[0-9][0-9]{1,4}$':
                    tipo = "n??mero inteiro";
                    digouchar = "d??gitos";
                    break;
                default:
                    tipo = "qualquer";
            }
            if (this.maxLength !== -1) {
                max = ', m??ximo de <b>' + this.maxLength + ' ' + digouchar + '</b>';
            } else {
                if (this.max.length !== 0 && this.min.length !== 0) {
                    max = ', de <b>' + (this.min * 1 + 1) + ' at?? ' + (this.max * 1 + 1) + '</b>';
                    ;
                }
            }

            steps.push({
                element: "#" + this.id,
                intro: '\
                    Insira aqui um valor para o campo <b>' + this.name.toString().toUpperCase() + '</b>\
                    (tipo <b>' + tipo + "</b>" + max + ') \
                    para o algoritmo que vai ser executado.',
                image: ''
            });

        });
        $("#topbar .random-btn").each(function (k) {
            var itemref = $(this).attr("itemref");
            var input = $("#" + itemref)[0].name;
            steps.push({
                element: ".random-btn[itemref='" + itemref + "']",
                intro: 'Clicando aqui, um valor <u>aleat??rio</u> ser?? colocado no campo <b>' + input.toString().toUpperCase() + '</b>.',
                image: ''
            });
        });
        steps.push({
            element: "#add-li",
            intro: 'Clique aqui para executar a anima????o do algoritmo de <u>inser????o</u> de acordo com os parametros.',
            image: 'addbutton.png'
        });
        steps.push({
            element: "#remove-li",
            intro: 'Clique aqui para executar a anima????o do algoritmo de <u>remo????o</u> de acordo com os parametros (isso caso a remo????o necessite deles).',
            image: 'rembutton.png'
        });
        steps.push({
            element: "#search-li",
            intro: 'Clique aqui para executar a anima????o do algoritmo de <u>busca</u> de acordo com os parametros.',
            image: 'busbutton.png'
        });
        run(steps);
    }
    
    function navbar(){
        showSidebar();
        setTimeout(function(){
            run([
                {
                    element: '#logoSidebar',
                    intro: 'Clicando aqui voc?? retorna para o menu principal do <b>Cadilag</b>',
                    image: 'cadilag.svg'
                },{
                    element: '#searchestrutura',
                    intro: 'Utilize este campo para pesquisar o nome da estrutura',
                    image: 'CadilagStructs/search.png',
                    after: function(){
                        animateText("#searchestrutura","lista",500);
                    }
                },{
                    element: '#subtag14',
                    intro: 'Tamb??m ?? poss??vel encontrar estruturas com tags relacionadas a pesquisa (por exemplo, pesquisando <b>lista</b> voc?? encontrar?? hash com tratamento de colis??o que utiliza <b>listas encadeadas</b>)',
                    image: 'CadilagStructs/search.png'
                },{
                    element: '#searchestrutura',
                    intro: 'Para ver todas as estruturas mantenha o campo de pesquisa vazia.',
                    image: 'CadilagStructs/menu.svg',
                    after: function(){
                        $("#searchestrutura").val("").keyup();
                    }
                },{
                    element: '.estruturas',
                    intro: 'Selecionando por categoria voc?? pode navegar pelas estruturas.',
                    image: 'CadilagStructs/menu.svg',
                    after: function(){
                        $(".container1 > .item").click();
                        $(".container2 > .item-bg > .item").click();
                    }
                },{
                    element: '#lastViews',
                    intro: 'Veja quais foram as ??ltimas 3 estruturas acessadas.',
                    image: 'CadilagStructs/history.svg',
                    timeout: 500,
                    before: function(){
                        $(".container1 > .item").click();
                        $(".container2 > .item-bg > .item").click();
                        $("#lastViews summary").click();
                    }
                }
            ]);
        },500);
    }
    function eprogramada(){
        showApp("#EntradaProgramadaDiv");
        $(".epvalue").eq(0).addClass("selector-help");
        $(".epfunction").eq(1).addClass("selector-help");
        var steps = [{
                    intro: 'Insira, salve, ou carregue diversas entradas para serem executadas',
                    image: 'CadilagStructs/multiple-shots.svg'
                },{
                    element: '.epvalue.selector-help',
                    intro: 'Insira aqui a entrada para cada campo. Ao preencher um campo, um outro ser?? disponibilizado!',
                    image: 'pencilblack.svg',
                    before: function(){
                        animateText(".epvalue.selector-help","123",500);
                    }
                },{
                    element: '.epvalue.selector-help',
                    intro: 'Quando a entrada for inv??lida, ela aparecer?? em vermelho na lista, e n??o ser?? executada!',
                    image: 'pencilblack.svg',
                    before: function(){
                        animateText(".epvalue.selector-help","exemplo",500);
                    }
                },{
                    element: '.epvalue.selector-help',
                    intro: 'Quando a entrada estiver v??zia ou incompleta tamb??m n??o ser?? executada!',
                    image: 'pencilblack.svg',
                    before: function(){
                        animateText(".epvalue.selector-help","",500);
                    }
                },{
                    element: '.epfunction.selector-help',
                    intro: 'Selecione o algoritmo a ser executado para esta entrada!',
                    image: 'CadilagStructs/multiple-shots.svg',
                    before: function(){
                        animateText(".epvalue.selector-help","123",500);
                    }
                },{
                    element: '#ephistory',
                    intro: 'Voc?? tamb??m pode importar uma lista a partir do que j?? foi executado na estrutura.',
                    image: 'CadilagStructs/copyhistory.svg'
                },{
                    element: '#eprun',
                    intro: 'Clicando aqui voc?? executa o algoritmo para cada entrada.',
                    image: 'CadilagStructs/play.svg'
                },{
                    element: '#EpRunDiv',
                    intro: 'Voc?? tamb??m pode executar clicando aqui.',
                    image: 'CadilagStructs/play.svg'
                
                },{
                    element: '#epsave',
                    intro: 'Se voc?? deseja utilizar novamente esta entrada, voc?? pode salvar no sistema.',
                    image: 'CadilagStructs/save.svg'
                },{
                    element: '#epload',
                    intro: 'Recupere lista de entradas salvas por voc?? para esta estrutura.',
                    image: 'CadilagStructs/open.svg'
                },{
                    element: '#epclear',
                    intro: 'Limpe a lista clicando aqui.',
                    image: 'CadilagStructs/erase.svg'
                }
            ];
            run(steps);
    }
    function pseudocodigo(){
        showApp("#AlgoritmoDiv");
        setTimeout(function(){
            var steps = [{
                    intro: 'Visualize o pseudoc??digo para os algoritmos b??sicos (<green>Inser????o</green>, <red>Remo????o</red> e <blue>Busca</blue>) da estrutura, junto com anima????o.',
                    image: 'CadilagStructs/coding.svg'
                },{
                    element: '#pseudocodigo-appbutons',
                    intro: 'Selecione aqui o pseudoc??digo do algoritmo desejado ...',
                    image: 'CadilagStructs/coding.svg'
                },{
                    element: '#pseudocodigoedit-appbutons',
                    intro: 'Esta ?? a barra de edi????o, onde voc?? encontra op????es para editar seu pr??prio pseudoc??digo ...',
                    image: 'pencilblack.svg'
                },{
                    element: '#toggleOptions',
                    intro: '... e clicando aqui voc?? pode ocultar a barra de edi????o',
                    image: 'pencilblack.svg'
                },{
                    element: '#h0',
                    intro: 'Esta linha representa o cabe??alho do m??todo (ou fun????o), onde voc?? pode encontrar informa????es sobre os par??metros e o tipo de retorno',
                    image: 'CadilagStructs/coding.svg'
                },{
                    element: '#l0',
                    intro: 'Mantendo o mouse sobre a linha voc?? pode obter mais informa????es sobre a instru????o.',
                    image: 'CadilagStructs/coding.svg'
                },{
                    element: '#l1',
                    intro: 'Clicando na linha voc?? pode destac??-la. Voc?? tamb??m pode fazer isso segurando <b>SHIFT</b> ou <b>CTRL</b> para mais destacar mais de uma linha. \
                            Para retirar o destaque basta clicar novamente na linha.',
                    image: 'CadilagStructs/coding.svg'
                },{
                    element: '#l2',
                    intro: 'Al??m disso, quando o algoritmo estiver em execu????o a linha ser?? descatada informando o fluxo de execu????o no c??digo',
                    image: 'CadilagStructs/coding.svg'
                }
            ];
            run(steps);
        },500);
    }

});
