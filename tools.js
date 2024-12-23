if(!Window.prototype.hasOwnProperty("action"))
    Window.prototype.action = function(event, callback, options = false){ addEventListener(event, callback, options); return callback }
if(!HTMLElement.prototype.hasOwnProperty("action"))
    HTMLElement.prototype.action = function(event, callback, options = false) { if(!this) return null; this.addEventListener(event, callback, options); return callback }
if(!NodeList.prototype.hasOwnProperty("action"))
    NodeList.prototype.action = function(event, callback, options = false) { if(!this.length) return null; Array.from(this).action(event, callback, options); return callback }
if(!Array.prototype.hasOwnProperty("action"))
    Array.prototype.action = function(event, callback, options = false) { if(!this.length) return null; this.map(t => { t.action(event, callback, options) }); return callback }
if(!Window.prototype.hasOwnProperty("noaction"))
    Window.prototype.noaction = function(event, callback = () => {}, options = false, element = document){ element.removeEventListener(event, callback, options) }
if(!HTMLElement.prototype.hasOwnProperty("noaction"))
    HTMLElement.prototype.noaction = function(event, callback = () => {}, options = false) { this.removeEventListener(event, callback, options) }
if(!NodeList.prototype.hasOwnProperty("noaction"))
    NodeList.prototype.noaction = function(event, callback = () => {}, options = false) { this.forEach(el => el.noaction(event, callback, options)) }
if(!Window.prototype.hasOwnProperty("load"))
    Window.prototype.load = function(callback, options = false){ action("load", callback, options) }
if(!Window.prototype.hasOwnProperty("click"))
    Window.prototype.click = function(callback, options = false){ action("click", callback, options) }
if(!HTMLElement.prototype.hasOwnProperty("click"))
    HTMLElement.prototype.click = function(callback, options = false){ this.action("click", callback, options) }
if(!NodeList.prototype.hasOwnProperty("click"))
    NodeList.prototype.click = function(callback, options = false){ Array.from(this).map(e => e.action("click", callback, options)) }
if(!Window.prototype.hasOwnProperty("getElId"))
    Window.prototype.getElId = function(id){ if(id === "") return null; return document.getElementById(id) }
if(!Window.prototype.hasOwnProperty("getQuery"))
    Window.prototype.getQuery = function(query){ if(query === "") return null; return document.querySelector(query) }
if(!HTMLElement.prototype.hasOwnProperty("getQuery"))
    HTMLElement.prototype.getQuery = function(query){ if(query === "") return null; return this.querySelector(query) }
if(!NodeList.prototype.hasOwnProperty("getQuery")){
    NodeList.prototype.getQuery = function(query){
        if(!this.length || query === "") return null
        return Array.from(this).map(e => [...e.getQuery(query)] )
    }
}
if(!Window.prototype.hasOwnProperty("getQueries")){
    Window.prototype.getQueries = function(query, toArray = false){
        if(query === "") return null
        let el = document.querySelectorAll(query)
        return (toArray) ? Array.from(el) : el;
    }
}
if(!HTMLElement.prototype.hasOwnProperty("getQueries")){
    HTMLElement.prototype.getQueries = function(query, toArray = false){
        if(query === "") return null
        let el = this.querySelectorAll(query)
        return (toArray) ? Array.from(el) : el;
    }
}
if(!NodeList.prototype.hasOwnProperty("getQueries")){
    NodeList.prototype.getQueries = function(query){
        if(!this.length || query === "") return null
        return Array.from(this).map(e => [...e.getQueries(query, true)] )
    }
}
if(!NodeList.prototype.hasOwnProperty("classList")){
    Object.defineProperty(NodeList.prototype, "classList", {
        get: function(){ return new ClassLists(this) }
    })
}
if(!HTMLElement.prototype.hasOwnProperty("scrollSmooth")){
    HTMLElement.prototype.scrollSmooth = function(duration = 1000, stopDistance = 100) {
        if(!this) return null
        this.action("click", () => {
            let href = (this.hasAttribute("href"))
                ? this.getAttribute("href")
                : this.getAttribute("data-href")
            let target = getQuery(href)
            let targetPosition = target.offsetTop - stopDistance
            let startPosition = document.scrollingElement.scrollTop
            let distance = targetPosition - startPosition
            let startTime = null
    
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime
                let timeElapsed = currentTime - startTime
                let run = ease(timeElapsed, startPosition, distance, duration)
                window.scrollTo(0, run)
                if (timeElapsed < duration) requestAnimationFrame(animation)
            }
    
            function ease(t, b, c, d) {
                t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
    
            requestAnimationFrame(animation);
        })
    }
}
if(!NodeList.prototype.hasOwnProperty("scrollSmooth")){
    NodeList.prototype.scrollSmooth = function(duration = 1000, stopDistance = 100) {
        if (!this.length) return null
        Array.from(this).map(element => element.scrollSmooth(duration, stopDistance) )
    }
}
if(!HTMLElement.prototype.hasOwnProperty("filterSearch")){
    HTMLElement.prototype.filterSearch = function({models, classfilter = "filter-search", symbols = true, action = "keyup", msg = "No Result", tag = "li"}, callback = () => {}) {
        this.action(action, () => {
            let input_val = models.value.toLowerCase()
            if(symbols){
                const REGEXP = new RegExp("\\"+getSymbols(true), "gmi")
                input_val = input_val.replace(REGEXP,"")
            }
            let new_listing = Array.from(models.children).filter(item => {
                let txtCont = "";
                let it = item.getQueries(classfilter, true)
                if(!it) it.map(i => txtCont += i.textContent.toLowerCase()+" " )
                else txtCont = item.textContent.toLowerCase()
                return txtCont.includes(input_val)
            })
            models.innerHTML = ""
            if(new_listing.length) models.appendChildren(new_listing)
            else models.appendChild(`<${tag} class='filter-msg'>${msg}</${tag}>`)
            callback()
        })
    }
}
if(!NodeList.prototype.hasOwnProperty("filterSearch")){
    NodeList.prototype.filterSearch = function ({classfilter = "filter-search", models, symbols = true, action = "keyup", msg = "No Result", tag = "li"}, callback = () => {}) {
        if(!this.length) return null
        this.forEach(element => element.filterSearch({classfilter, models, symbols, action, msg, tag}, callback) )
    }
}
if(!HTMLElement.prototype.hasOwnProperty("appendChildren")){
    HTMLElement.prototype.appendChildren = function(children){
        if(!Array.isArray(children)) return null
        for(let c = 0; c < children.length; c++) this.appendChild(children[c])
    }
}
if(!NodeList.prototype.hasOwnProperty("appendChildren")){
    NodeList.prototype.appendChildren = function(children){
        if(!Array.isArray(children) || !this.length) return null
        this.forEach(child => child.appendChildren(children))
    }
}
if(!NodeList.prototype.hasOwnProperty("appendChild")){
    NodeList.prototype.appendChild = function(children){
        if(!this.length) return null
        this.forEach(child => child.appendChild(children))
    }
}
if(!HTMLElement.prototype.hasOwnProperty("clone")){
    HTMLElement.prototype.clone = function(container, position = "after"){
        let node = this;
        let container = container instanceof Node ? [container] : container;
        Array.from(container).map( c => {
            const contentNode = document.importNode(node, true)
            switch(position){
                case "before": c.insertBefore(contentNode, c.firstChild); break;
                case "after": default: c.appendChild(contentNode); break;
            }
        } )
    }
}
if(!Array.prototype.hasOwnProperty("loop"))
    Array.prototype.loop = function(callback) { this.forEach(element => callback(element)) }
if(!NodeList.prototype.hasOwnProperty("loop"))
    NodeList.prototype.loop = function(callback) { Array.from(this).loop(callback) }
if(!HTMLElement.prototype.hasOwnProperty("html"))
    HTMLElement.prototype.html = function(txt){ this.innerHTML = txt }
if(!NodeList.prototype.hasOwnProperty("html"))
    NodeList.prototype.html = function(txt){ this.forEach(el => el.html(txt)) }

if(!Number.prototype.hasOwnProperty("between"))
    Number.prototype.between = function(a, b) { return Math.min(Math.max(this,a),b) }
if(!Number.prototype.hasOwnProperty("isbetween")){
    Number.prototype.isbetween = function(a, b) {
        let min = Math.min.apply(Math, [a, b]), max = Math.max.apply(Math, [a, b])
        return this > min && this < max
    }
}

if(!Number.prototype.hasOwnProperty("percentage")){
    Number.prototype.percentage = function({excute = "percentage", max = 100, min = 0, reduce = 0}) {
        if (Number.isNaN(this) || Number.isNaN(max) || Number.isNaN(min) || Number.isNaN(reduce)) return null;
        let rslt = null;
        switch(excute){
            case "percentage": rslt = valToPerc(this, max, min); break;
            case "value": rslt = percToVal(this, max, min); break;
            case "reduce": rslt = reducePerc(this, reduce); break;
        }
        if(excute != "reduce" && reduce > 0) rslt = reducePerc(rslt, reduce);
        return rslt;
    }
}

if(typeof random !== "function"){
    function random(max = 1, min = 0) {
        if (isNaN(min) && isNaN(max)) return;
        min = parseFloat(min); max = parseFloat(max);
        return Math.round(min + Math.random() * (max - min));
    }
}
if(typeof sRandom !== "function"){ function sRandom(max = 1, min = 0) { return random(max, min) } } // TO ERASED

if(typeof numbersRandom !== "function"){
    function numbersRandom(count, max = 1, min = 0){
        let aRand = []
        for (let i = 0; i < count; i++)
            aRand[i] = random(max, min)
        return aRand;
    }
}
if(typeof sMultiRandom !== "function"){ function sMultiRandom(count, max = 1, min = 0){ return numbersRandom(count, max, min) } } // TO ERASED

if(!Array.prototype.hasOwnProperty("random")){
    Array.prototype.random = function(count = 1){
        if(count > 1){
            let aRand = []
            for (let i = 0; i < count; i++)
                aRand[i] = this[random(this.length-1)]
            return aRand
        }
        else return this[random(this.length-1)]
    }
}
if(typeof arrayRandom !== "function")
    function arrayRandom(array){ return array[random(array.length-1)] }
if(typeof sArrayRandom !== "function") // TO ERASED
    function sArrayRandom(array){ return arrayRandom(array) }

let defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
    {'base':'AA','letters':'\uA732'},
    {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
    {'base':'AO','letters':'\uA734'},
    {'base':'AU','letters':'\uA736'},
    {'base':'AV','letters':'\uA738\uA73A'},
    {'base':'AY','letters':'\uA73C'},
    {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
    {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
    {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0'},
    {'base':'DZ','letters':'\u01F1\u01C4'},
    {'base':'Dz','letters':'\u01F2\u01C5'},
    {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
    {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
    {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
    {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
    {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
    {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
    {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
    {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
    {'base':'LJ','letters':'\u01C7'},
    {'base':'Lj','letters':'\u01C8'},
    {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
    {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
    {'base':'NJ','letters':'\u01CA'},
    {'base':'Nj','letters':'\u01CB'},
    {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
    {'base':'OI','letters':'\u01A2'},
    {'base':'OO','letters':'\uA74E'},
    {'base':'OU','letters':'\u0222'},
    {'base':'OE','letters':'\u008C\u0152'},
    {'base':'oe','letters':'\u009C\u0153'},
    {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
    {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
    {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
    {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
    {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
    {'base':'TZ','letters':'\uA728'},
    {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
    {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
    {'base':'VY','letters':'\uA760'},
    {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
    {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
    {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
    {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
    {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
    {'base':'aa','letters':'\uA733'},
    {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
    {'base':'ao','letters':'\uA735'},
    {'base':'au','letters':'\uA737'},
    {'base':'av','letters':'\uA739\uA73B'},
    {'base':'ay','letters':'\uA73D'},
    {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
    {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
    {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
    {'base':'dz','letters':'\u01F3\u01C6'},
    {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
    {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
    {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
    {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
    {'base':'hv','letters':'\u0195'},
    {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
    {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
    {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
    {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
    {'base':'lj','letters':'\u01C9'},
    {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
    {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
    {'base':'nj','letters':'\u01CC'},
    {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
    {'base':'oi','letters':'\u01A3'},
    {'base':'ou','letters':'\u0223'},
    {'base':'oo','letters':'\uA74F'},
    {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
    {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
    {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
    {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
    {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
    {'base':'tz','letters':'\uA729'},
    {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
    {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
    {'base':'vy','letters':'\uA761'},
    {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
    {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
    {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
    {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
]
let diacriticsMap = {}
for (let i=0; i < defaultDiacriticsRemovalMap.length; i++){
    let letters = defaultDiacriticsRemovalMap[i].letters
    for (let j=0; j < letters.length; j++)
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base
}
if(typeof accentReplace !== "function") // TO ERASED
    function accentReplace(str){ return accentsReplace(str) }
if(typeof accentsReplace !== "function")
    function accentsReplace(str){ return str.replace(/[^\u0000-\u007E]/g, function(a){ return diacriticsMap[a] || a }) }
if(typeof aprostReplace !== "function")
    function aprostReplace(str){ return str.replace(/.\'/g, "") }
if(typeof compressReplace !== "function") // TO ERASED
    function compressReplace(str, space = "-"){ return (aprostReplace(accentsReplace(str)).toLowerCase()).replace(" ", space) }

if(!HTMLElement.prototype.hasOwnProperty("insert")){
    HTMLElement.prototype.insert = function(position, string) {
        switch (position) {
            case "before": case "beforebegin": case "begin":
            case "start": case "previous":
                position = "beforebegin"; break;

            case "after": case "afterend":
            case "end": case "next":
                position = "afterend"; break;

            case "inbefore": case "instart": case "afterbegin":
            case "insert": case "insertBefore":
                position = "afterbegin"; break;

            case "inafter": case "inend": case "beforeend":
            case "append": case "appendChild": default:
                position = "beforeend"; break;
        }

        this.insertAdjacentHTML(position, string.trim())
    }
}
if(!HTMLElement.prototype.hasOwnProperty("sInsert")){
    HTMLElement.prototype.sInsert = function(position, string){
        this.insert(position, string)
    }
}
if(!NodeList.prototype.hasOwnProperty("insert")){
    NodeList.prototype.insert = function(position, string) {
        if (this.length <= 0) return
        this.forEach(element => element.insert(position, string) )
    }
}
if(!NodeList.prototype.hasOwnProperty("sInsert")){
    NodeList.prototype.sInsert = function(position, string) {
        if (this.length <= 0) return
        this.insert(position, string)
    }
}

if(!HTMLElement.prototype.hasOwnProperty("model")){
    HTMLElement.prototype.model = function(elements) {
        const model = this;
        model.addEventListener("keyup", () => {
            if (elements instanceof NodeList) elements.forEach((element) => element.innerHTML = model.value )
            else elements.innerHTML = model.value
        })
    }
}
if(!HTMLElement.prototype.hasOwnProperty("sModel")){
    HTMLElement.prototype.sModel = function(elements) { this.model(elements) }
}

if(!HTMLElement.prototype.hasOwnProperty("watchAttr")){
    HTMLElement.prototype.watchAttr = function(nameAttr = "", callback) {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if(mutation.type === "attributes" && (nameAttr === "" || mutation.attributeName === nameAttr))
                    callback(mutation, mutation.attributeName)
            })
        })
        observer.observe(this, { attributes: true })
    }
}
if(!NodeList.prototype.hasOwnProperty("watchAttr")){
    NodeList.prototype.watchAttr = function(nameAttr = "", callback) {
        if (this.length <= 0) return
        this.forEach(element => element.watchAttr(nameAttr, callback))
    }
}

if(!String.prototype.hasOwnProperty("toCapitalize"))
    String.prototype.toCapitalize = function(){ return this.charAt(0).toUpperCase() + this.slice(1); }

if(typeof isMobileAndTablet !== "function")
    function isMobileAndTablet(){ return isMobile() }
if(typeof isMobile !== "function"){
    function isMobile(){
        let check = false
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera)
        return check
    }
}

if(typeof sender !== "function"){
    function sender({action, params = "", method = "POST", type = "text/html"}, callback) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === xhr.DONE && this.status === 200) callback(this.responseText)
        }
        xhr.open(method, action, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.type = type
        xhr.send(params)
    }
}

if(typeof loadView !== "function"){
    async function loadView({url, container}, callback = null){
        if(!container || !url) return null
        const result = await fetch(url).then(response => { return response.text() })
        const getResult = (async () => {
            container.innerHTML = await result
            if(callback !== null) callback(container)
        })()
    }
}

if(typeof clog !== "function") function clog(msg){ console.log(msg) }
if(typeof cwarn !== "function") function cwarn(msg){ console.warn(msg) }
if(typeof cerror !== "function") function cerror(msg){ console.error(msg) }
if(typeof ctable !== "function") function ctable(msg){ console.table(msg) }

/** PRIVATES */
if(typeof ClassLists !== "function"){
    function ClassLists(nl){
        this.add = function(classname){ nl.forEach(el => el.classList.add(classname)) }
        this.remove = function(classname){ nl.forEach(el => el.classList.remove(classname)) }
        this.toggle = function(classname){ nl.forEach(el => el.classList.toggle(classname)) }
        this.contains = function(classname){ return !!Array.from(nl).filter(el => el.classList.contains(classname)).length }
        this.replace = function(oldClass, newClass){ nl.forEach(el => el.classList.replace(oldClass, newClass)) }
    }
}

// NOT PERCENTAGE
if(typeof valToPerc !== "function") function valToPerc(number, max = 100, min = 0){ return ((number - min) * 100) / (max - min); }
if(typeof percToVal !== "function") function percToVal(number, max = 100, min = 0){ return (number * (max - min) / 100) + min; }
if(typeof reducePerc !== "function") function reducePerc(number, percentage){ return ((100 - percentage) / 100) * number; }
