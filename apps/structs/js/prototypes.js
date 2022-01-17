
function stringfyArray(array,path) {
    if(path === undefined){
        path = [];
    }
    var result = "";
    for (var i = 0; i < array.length; i++) {
        var con = array[i];
        for (var j = 0; j < path.length; j++) {
            con = con[path[j]];
        }
        result += con;
    }
    return result;
};

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}