if(typeof random !== "function"){
    function random(max = 1, min = 0) {
        if (isNaN(min) && isNaN(max)) return;
        min = parseFloat(min); max = parseFloat(max);
        return Math.round(min + Math.random() * (max - min));
    }
}
if(!Array.prototype.hasOwnProperty("random")){
    Array.prototype.random = function(count = 1){
        return Array.from({ length: count }, () => this[random(this.length-1)])
    }
}