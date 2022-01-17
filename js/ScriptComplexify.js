(function () {
   var intervaloColors =  [[0,"#666"],[10,"#F06C6C"],[30," #F96"],[50,"yellow"],[80,"#7AF02C"],[100,"#AAF"]];

    $("#password[status=scan]").complexify({}, function (valid, complexity) {
        complexity*=2;
        if(complexity>100)
                complexity=100;
            
        var i=0;

        if(complexity>intervaloColors[i][0])
        {
            for(i=1;i<intervaloColors.length;i++)
                    if(complexity<=intervaloColors[i][0])
                            break;
        }
        	
        $(".progress .float").stop().animate({ 'width':complexity+"%",backgroundColor: intervaloColors[i][1]},1000,"easeOutElastic");

    });
    
    $("#password[status='scan']").val("");
        
})();
