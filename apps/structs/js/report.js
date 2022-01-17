

function report(){
    swal({
        title: "Reportar Problema",
        text: "Relate o problema encontrado nesta página !<br>\
            Quanto mais detalhes forem colocados<br>\
            mais fácil de ser corrigido<br>\
            <small>Obs: O Feedback é anônimo</small><br>",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        html: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar"
    },
    function(inputValue){
        if (inputValue === false) 
            return false;
        var history = [];
        var input = History.stackHistory.array;

        for(var i=0;i<input.length;i++){
            history[i] = {info:input[i].info,type:input[i].type};
        }
        var postData = {descricao:inputValue,idestrutura:idestrutura,historico:JSON.stringify(history)};
        post('./ajax/insertReport.php',function(data){
            swal({title:"Enviado",text:"Sucesso ao reportar!",type:"success"});
        },postData);
    });
    
}