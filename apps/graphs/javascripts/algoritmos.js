/* 
 Author     : joaog
 */

$(document).ready(function() {
    $("#selectalgoritmo").change(updateAlgoritmoDesc).change();
});


function updateAlgoritmoDesc(){
    var value = $("#selectalgoritmo").val();
    $(".details-algo").hide();
    $(".details-algo#"+value).show();
}