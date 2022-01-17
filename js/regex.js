function Color2Pseudo(innerHtml) {
    innerHtml = innerHtml.replace(/[-|/|+|*|%|.]/g, function (match) {
        if(match==='.'){
            return "<g class='high' title='operador acesso'>.</g>";
        } else {
            return "<g class='high' title='operador aritmético'>" + match + "</g>";
        }
    });
    innerHtml = innerHtml.replace(":=", "<g class='high' title='operador atribuição'>:=</g>");
    innerHtml = innerHtml.replaceAll("!=", "<g class='high' title='operador diferença'>!=</g>");
    innerHtml = innerHtml.replaceAll("==", "<g class='high' title='operador igualdade'>==</g>");
    innerHtml = innerHtml.replace(" = ", "<g class='high' title='operador atribuição'> = </g>");
    innerHtml = innerHtml.replace(" : ", " <g class='high' title='defini o tipo da variável'>:</g> ");
    innerHtml = innerHtml.replaceAll(" ou ", "<g class='high' title='operador lógico similar á || ou OR'> ou </g>");
    innerHtml = innerHtml.replaceAll(" e ", "<g class='high' title='operador lógico similar á && ou AND'> e </g>");
    innerHtml = innerHtml.replaceAll(",", "<b>,</b>");

    innerHtml = innerHtml.replace(/(Break|Retornar|Senão|Se |Enquanto |então|Para |até |passo |faça| de |se )/g, function (match) {
        switch (match){
            case "Break": return "<b class='high' title='operador de quebra de laço'>" + match + "</b>";
            case "Retornar": return "<b class='high' title='similar á return'>" + match + "</b>";
            case "Senão": return "<b class='high' title='operador de desvio condicional, similar á else'>" + match + "</b>";
            case "Se ": return "<b class='high' title='operador de desvio condicional, similar á if'>" + match + "</b>";
            case "Enquanto ": return "<b class='high' title='operador de laço condicional, similar á while'>" + match + "</b>";
            case "Para ": return "<b class='high' title='operador de laço condicional, similar á for'>" + match + "</b>";
            case "então": return "<b class='high' title='similar a then'>" + match + "</b>";
            case "faça": return "<b class='high' title='similar a do'>" + match + "</b>";
            default: return "<b>" + match + "</b>";
        }
        
    });
    innerHtml = innerHtml.replace(/([a-z|À-ú|A-Z|_][a-z|À-ú|A-Z|_|0-9]*)?[(]/g, function (match) {
        var proc = match.substring(0, match.length - 1).toUpperCase();
        switch(proc){
            case "ALOCAR": return "<b class='high' title='Chamada a função/procedimento/rotina " + proc + ", similar á malloc ou new em C'>" + match + "</b>";
            case "LIBERAR": return "<b class='high' title='Chamada a função/procedimento/rotina " + proc + ", similar á free em C'>" + match + "</b>";
            default: return "<b class='high' title='Chamada a função/procedimento/rotina " + proc + "'>" + match + "</b>";
        }
        
    });

    innerHtml = innerHtml.replaceAll(" &gt; ", " <g> &gt </g>");
    innerHtml = innerHtml.replaceAll(" &lt; ", " <g> &lt </g>");
    innerHtml = innerHtml.replaceAll(" &gt;= ", "<g> &gt= </g>");
    innerHtml = innerHtml.replaceAll(" &lt;= ", "<g> &lt= </g>");

    innerHtml = innerHtml.replace("Verdadeiro", "<d class='high' title='valor lógico'>Verdadeiro</d>");
    innerHtml = innerHtml.replace("Falso", "<e class='high' title='valor lógico'>Falso</e>");
    innerHtml = innerHtml.replace("nulo", "<e class='high' title='similar á null ou undefined'>nulo</e>");

    innerHtml = innerHtml.replaceAll(")", "<b>)</b>");
    innerHtml = innerHtml.replaceAll("[", "<e>[</e>");
    innerHtml = innerHtml.replaceAll("]", "<e>]</e>");
    innerHtml = innerHtml.replace(/(INICIO|FIM)/, function (match) {
        if(match==="INICIO"){
           return "<c class='high' title='delimitador de bloco, similar á begin ou { (Abre-Chaves)'>" + match + "</c>";
        } else if(match==="FIM") {
            return "<c class='high' title='delimitador de bloco, similar á end ou } (Fecha-Chaves)'>" + match + "</c>";
        }
    });
    innerHtml = innerHtml.replace(/(NoLista|NoFila|#DEFINE|NoPilha|No[a-zA-Z_][a-zA-Z_]*|Enum[a-zA-Z_]*|Estrutura[a-zA-Z_]*|booleano|inteiro|caracter|vetor|String)/g, function (match) {
        switch(match){
            case "String": 
                return "<struct class='high' title='similar á cadeia de caracteres'>" + match + "</struct>";
            case "inteiro":
                return "<struct class='high' title='similar á integer ou int'>" + match + "</struct>";
            case "caracter":
                return "<struct class='high' title='similar á char'>" + match + "</struct>";
            case "vetor":
                return "<struct class='high' title='similar á arranjo, array ou cadeia'>" + match + "</struct>";
            case "booleano":
                return "<struct  class='high'title='similar á boolean, bool ou bit'>" + match + "</struct>";
            case "NoFila":
            case "NoPilha":
            case "NoLista":
                return "<struct class='high' title='similar á Registro ou Struct'>" + match + "</struct>";
            case "#DEFINE":
                return "<struct class='high' title='Defindo Macro'>" + match + "</struct>";
            default: 
                if(match.startsWith("Estrutura") || match.startsWith("No")){
                    return "<struct class='high' title='similar á Registro ou Struct'>" + match + "</struct>";
                } else if(match.startsWith("Enum")){
                     return "<struct class='high' title='Tipo Enumerado'>" + match + "</struct>";
                } else {
                    return "<struct class='high' title='Tipo de Variável'>" + match + "</struct>";
                }
        }
        
    });
    return innerHtml;
}

function strip(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
}