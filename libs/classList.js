if(!NodeList.prototype.hasOwnProperty("classList")){
    Object.defineProperty(NodeList.prototype, "classList", {
        get: function(){ return new ClassLists(this) }
    })
}
if(!Array.prototype.hasOwnProperty("classList")){
    Object.defineProperty(Array.prototype, "classList", {
        get: function(){ return new ClassLists(this) }
    })
}

/** PRIVATES */
if(typeof ClassLists !== "class"){
    class ClassLists{
        constructor(nodeList){
            this.nodeList = nodeList
        }
        add(classname){ this.nodeList.forEach(el => el.classList.add(classname)) }
        remove(classname){ this.nodeList.forEach(el => el.classList.remove(classname)) }
        toggle(classname){ this.nodeList.forEach(el => el.classList.toggle(classname)) }
        contains(classname){ return !!Array.from(this.nodeList).filter(el => el.classList.contains(classname)).length }
        replace(oldClass, newClass){ this.nodeList.forEach(el => el.classList.replace(oldClass, newClass)) }
    }
}