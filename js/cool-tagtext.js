jQuery.fn.coolTagText = function () {

    var controls;
    var element = this[0];
    var obj = $(element);

    obj.keydown(function (e) {
        var event = e.originalEvent;
        if (event.ctrlKey) {

            switch (event.code) {
                case "KeyB":
                    tag("b");
                    event.preventDefault();
                    break;
                case "KeyI":
                    tag("i");
                    event.preventDefault();
                    break;
                case "KeyU":
                    tag("u");
                    event.preventDefault();
                    break;
            }
        }
        if (event.code === "Tab") {
            if (event.shiftKey) {
                tab();
            }
            event.preventDefault();
        }
    });


    function tab() {
        var ini = obj.prop("selectionStart");
        var end = obj.prop("selectionEnd");
        var value = obj.val();
        if (ini === end) {
            obj.val(toggleTag(value, ini, "\t"));
            obj.prop("selectionStart", ini + 1).prop("selectionEnd", end + 1).focus();
        } else {
            var before = value.substring(0, ini);
            var mid = value.substring(ini, end);
            var after = value.substring(end);
            var splits = mid.split("\n");
            var last = before.lastIndexOf("\n");
            if (last !== -1) {
                last += 1;
            } else {
                last = 0;
            }
            before = toggleTag(before, last, "\t");
            for (var i = 1; i < splits.length; i++) {
                splits[i] = "\n\t" + splits[i];
            }
            mid = "";
            for (var i = 0; i < splits.length; i++) {
                mid += splits[i];
            }

            obj.val(before + mid + after);
            obj.prop("selectionStart", ini + 1).prop("selectionEnd", end + splits.length).focus();

        }
    }

    function tag(key) {
        var start = obj.prop("selectionStart");
        var end = obj.prop("selectionEnd");
        var value = obj.val();
        if (start !== 0 || end !== 0) {
            var newvalue = clearTag(value, start, end, key);

            if (newvalue === value) {
                value = toggleTag(value, end, "</" + key + ">");
                value = toggleTag(value, start, "<" + key + ">");

                newvalue = value;
                obj.val(newvalue);
                obj.prop("selectionStart", start).prop("selectionEnd", end + ("</" + key + "><" + key + ">").length).focus();
            } else {
                obj.val(newvalue);
                obj.prop("selectionStart", start).prop("selectionEnd", end - ("</" + key + "><" + key + ">").length).focus();
            }


        }
    }

    function clearTag(value, ini, end, tagToken) {
        var before = value.substring(0, ini);
        var mid = value.substring(ini, end);
        var after = value.substring(end);
        if (mid.startsWith("<" + tagToken + ">") && mid.endsWith("</" + tagToken + ">")) {
            mid = mid.substring(("<" + tagToken + ">").length, mid.length - ("</" + tagToken + ">").length);
            return before + mid + after;
        }

        return value;
    }

    function toggleTag(value, index, tag) {
        var before = value.substring(0, index);
        var after = value.substring(index);

        return before + tag + after;
    }

    function showHelp() {

        swal({title: "Ajuda", text: "Você pode utilizar as TAGS:" +
                    "<br>&ltb&gt ou [Ctrl+B] para escrever em <b>negrito</b>" +
                    "<br>&lti&gt ou [Ctrl+I] para escrever em <i>italico</i>" +
                    "<br>&ltu&gt ou [Ctrl+U] para escrever em <u>sublinhado</u> " +
                    "<br>&ltbig&gt para letras maiores" +
                    "<br>&ltsmall&gt para letras menores" +
                    "<br>&lth1&gt ... &lth6&gt para Titulos<br>" +
                    "<br>Exemplo: &lti&gt&ltbig&gt texto &lt/big&gt&lt/i&gt -> <i><big>texto</big></i> <br>" +
                    "<br>Utilizar Espaço ao lado dos sinais: < (maior) ou > (menor)<br>", html: true});
    }

    function appendButtons() {
        var buttonHelp = document.createElement("button");
        var buttonB = document.createElement("button");
        var buttonI = document.createElement("button");
        var buttonU = document.createElement("button");

        controls = document.createElement("div");

        buttonHelp.innerHTML = "Ajuda";
        buttonB.innerHTML = "<b>B</b>";
        buttonI.innerHTML = "<i>I</i>";
        buttonU.innerHTML = "<u>U</u>";

        buttonB.style.width = "30px";
        buttonU.style.width = "30px";
        buttonI.style.width = "30px";


        buttonHelp.addEventListener("click", function () {
            showHelp();
        });
        buttonB.addEventListener("click", function () {
            tag("b");
        });
        buttonU.addEventListener("click", function () {
            tag("u");
        });
        buttonI.addEventListener("click", function () {
            tag("i");
        });

        buttonHelp.style.float = "right";
        buttonB.style.float = "left";
        buttonI.style.float = "left";
        buttonU.style.float = "left";
        buttonHelp.type = "button";
        buttonB.type = "button";
        buttonI.type = "button";
        buttonU.type = "button";
        controls.className = "cooltagbutton";

//        obj.css("min-height", "30px");
        obj.css("tab-size", "4");
//        obj.css("resize", "vertical");
        if (obj.css("z-index") === "auto") {
            obj.css("z-index", 0);
            controls.style.zIndex = 1;
        } else {
            var zindex = parseInt(obj.css("z-index"));
            controls.css("z-index", zindex + 1);
        }
        var paddingtop = parseInt(obj.css("padding-top"));
        var paddingbottom = parseInt(obj.css("padding-bottom"));
        var paddingwidth = parseInt(obj.css("padding-left")) + parseInt(obj.css("padding-right"));
        obj.css("padding-top", (paddingtop + 45) + "px");
        obj.css("padding-bottom", (paddingbottom + 10) + "px");

        controls.style.top = (obj.position().top + parseInt(obj.css("margin-top")) + parseInt(obj.css("border-top-width"))) + "px";
        controls.style.left = (obj.position().left + parseInt(obj.css("margin-left")) + parseInt(obj.css("border-left-width"))) + "px";
        controls.style.width = obj.width() + paddingwidth + "px";
        controls.appendChild(buttonHelp);
        controls.appendChild(buttonI);
        controls.appendChild(buttonU);
        controls.appendChild(buttonB);

        $(controls).insertBefore(element);
    }

    obj.bind("appendCooltexttag", appendButtons);
    obj.on("remove", function () {
        $(controls).remove();
    });

    return obj;
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};