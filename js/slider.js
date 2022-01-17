


$(document).ready(function () {
    var total = $(".slider .about").length;
    
    var sliderfooter = document.createElement("div");
    sliderfooter.className = "slidefooter";
    
    function generateF(i){
        return function(){
          slider.toggleAbout(i);  
        };
    }
    
    for (var i = 0; i < total; i++) {
        var d = document.createElement("div");
        d.className = "sliderselect";
        $(d).click(generateF(i));
        d.innerHTML = (i+1);
        sliderfooter.appendChild(d);
    }
    
    $(sliderfooter).insertBefore(".slider-content");
    
    slider.startInterval();
    slider.setAbout(0);

});

slider = {
    toggleAbout: function(i){
        clearInterval(slider.interval);
        slider.setAbout(i);
    },
    setAbout: function (i) {
        $(".slider .sliderselect").removeClass("selected");
        $(".slider .sliderselect").eq(i).addClass("selected");
        if(slider.selected !== i){
            if(i > slider.selected){
                $(".slider .about").eq(slider.selected).css({left:0}).animate({left:-300},500);
                $(".slider .about").eq(i).show().css({left:300}).animate({left:0},500);
            } else {
                $(".slider .about").eq(slider.selected).css({left:0}).animate({left:300},500);
                $(".slider .about").eq(i).show().css({left:-300}).animate({left:0},500);
            }
            var ant = slider.selected;
            slider.selected = i;
            setTimeout(function(){
                $(".slider .about").eq(ant).hide();
            },500);
        }
    }, 
    interval: null, 
    selected: 0,
    startInterval: function () {
        
        var total = $(".slider .about").length;
        this.interval = setInterval(function () {
            slider.setAbout((slider.selected + 1) % total);
        }, 15000);
    }
};