/* 
 Author     : joaog
 */

(function () {

    window.Persistencia = {

        salvarRascunho: function () {
            var data = DataGraph.retrieval();
            data.datetime = new Date().toLocaleString();
            $.cookie("lastgraph", JSON.stringify(data));
        },

        carregarRascunho: function () {
            var data = $.cookie("lastgraph");
            if (data) {
                data = JSON.parse(data);
                DataGraph.open(data);
            } else {
                console.log("nada para carregar");
            }
           
            
        }

    };

})();