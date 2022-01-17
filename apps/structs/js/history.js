
(function () {
    window.History = {
        stackHistory: new (function () {
            this.array = [];
            this.contador = 0;
            this.add = function (element) {
                this.array[this.contador] = element;
                this.contador++;
            };
            this.rem = function () {
                this.contador--;
                return this.array[this.contador];
            };
            this.size = function () {
                return this.contador;
            };
        })(),
        invertHistory: function () {
            var ul = $('#history');
            ul.children().each(function (i, li) {
                ul.prepend(li);
            });
        },
        rollbackAppendInput: function () {
            var li = this.stackHistory.rem();
            $(li.d).remove();
            if (this.stackHistory.size() === 0) {
                var historyUl = document.getElementById('history');
                historyUl.innerHTML = '';
            }
        },
        appendInput: function (VK_ALGORITMO) {
            if (VK.BUSCA !== VK_ALGORITMO) {
                var objList = $("input.inputFunction");
                var total = objList.length;
                var li = document.createElement("li");
                var ul = document.createElement("ul");
                ul.className = "item-list-history";
                li.appendChild(ul);
                var value = {};
                var d = document.createElement("li");
                d.style.width = "70px";
                d.innerHTML = (this.stackHistory.size() + 1);
                d.style.fontWeight = "bold";
                ul.appendChild(d);
                objList.each(function () {
                    var d = document.createElement("li");
                    d.style.width = (250/total)+"px";
                    d.innerHTML = $(this).val();
                    value[$(this).attr("id")] = $(this).val();
                    ul.appendChild(d);
                });
                var span = document.createElement("span");
                li.appendChild(span);
                var className = "item-history-function";
                switch (VK_ALGORITMO) {
                    case VK.INSERCAO:
                        className += " insert_function";
                        break;
                    case VK.REMOCAO:
                        className += " remove_function";
                        break;
                }
                span.className = className;
                var list = document.getElementById("history");
                if (this.stackHistory.size() === 0) {
                    list.innerHTML = "";
                    list.appendChild(li);
                } else {
                    if ($("#historyorder").val() === "last")
                        $(list).prepend(li);
                    else
                        list.appendChild(li);
                }
                this.stackHistory.add({d: li, info: value,type: VK_ALGORITMO});
            }

        }
    };
})();
