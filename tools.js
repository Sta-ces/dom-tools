/**
 * Version: 2.0
 */

const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
    createHTML: (string) => {
        if (typeof string !== 'string') return string;
        return string
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        },
});

const DOMTools = {
    action: (element, event, callback, options = false) => { element.addEventListener(event, callback, options) },
    noaction: (element, event, callback, options = false) => { element.removeEventListener(event, callback, options) },
    click: (element, callback, options = false) => { element.addEventListener("click", callback, options) },
    getElId: (element, id) => { if(id === "") return null; return document.getElementById(id) },
    getQuery: (query) => { DOMTools.getQuery(document, query) },
    getQuery: (element, query) => {
        if(query === "" && !(element instanceof Node)) return null
        let el;
        try{
            el = element.querySelector(query)
        } catch(e){
            console.error("Invalid selector:", query, e)
            el = null
        }
        return el;
    },
    getQueries: (element, query, toArray = false) => {
        if(query === "" && !(element instanceof Node)) return null
        let els;
        try{
            els = element.querySelectorAll(query)
        } catch(e){
            console.error(query)
            console.error(e)
            console.error("Invalid selector:", query, e)
            els = null
        }
        return (els !== null && toArray) ? Array.from(els) : els;
    },
    scrollSmooth: (element, duration = 1000, stopDistance = 100) => {
        if(!element && !(element instanceof Node)) return null
        let animationId = null
        duration = Number(duration)
        stopDistance = Number(stopDistance)

        if (isNaN(duration) || isNaN(stopDistance)) {
            console.error("Invalid arguments: duration and stopDistance must be numbers")
            return null
        }

        DOMTools.click(element, () => {
            if (animationId) cancelAnimationFrame(animationId)

            let href = (element.hasAttribute("href"))
                ? element.getAttribute("href")
                : element.getAttribute("data-href")
            let target = DOMTools.getQuery(href)

            if(target === null) return null

            let targetPosition = target.getBoundingClientRect().top + window.scrollY - stopDistance
            let startPosition = window.scrollY
            let distance = targetPosition - startPosition
            let startTime = null
    
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime
                let timeElapsed = currentTime - startTime
                let run = ease(timeElapsed, startPosition, distance, duration)
                window.scrollTo(0, run)
                if (timeElapsed < duration) animationId = requestAnimationFrame(animation)
            }
    
            animationId = requestAnimationFrame(animation);
        })
    },
    filterSearch: (element, {inputElement, container, classfilter = "filter-search", symbols = true, action = "keyup", msg = "No Result", tag = "li"}, fn = () => {}) => {
        if(!element && !(element instanceof Node)) return null
        DOMTools.action(action, () => {
            let inputValue = inputElement.value.toLowerCase()
            if(symbols) inputValue = inputValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            const items = Array.from(container.children);
            const filteredItems = items.filter(item => {
                let textContent = "";
                const filterElements = item.querySelectorAll(`.${classfilter}`)
                if (filterElements.length > 0) {
                    filterElements.forEach(el => {
                        textContent += el.textContent.toLowerCase() + " "
                    })
                } else {
                    textContent = item.textContent.toLowerCase()
                }
                return textContent.includes(inputValue)
            })

            container.innerHTML = ""
            if (filteredItems.length > 0) {
                container.appendChildren(filteredItems)
            } else {
                const messageElement = document.createElement(tag)
                messageElement.className = "filter-msg"
                messageElement.textContent = msg
                container.appendChild(messageElement)
            }
            fn()
        })
    },
    appendChildren: (element, children) => {
        if(!element && !(element instanceof Node) && !Array.isArray(children)) return null
        children.forEach(child => {
            if(child instanceof Node)
                element.appendChild(child.cloneNode(true))
        })
    },
    clone: (element, container, position = "after") => {
        if(!element && !(element instanceof Node)) return null
        let node = element;
        container = container instanceof Node ? [container] : container;
        Array.from(container).map( c => {
            const contentNode = document.importNode(node, true)
            switch(position){
                case "before": c.insertBefore(contentNode, c.firstChild); break;
                case "after": default: c.appendChild(contentNode); break;
            }
        } )
    },
    html: (element, txt) => {
        if(!element && !(element instanceof Node)) return null
        const escaped = escapeHTMLPolicy.createHTML(txt)
        if(escaped instanceof TrustedHTML) element.innerHTML = escaped
    },
    between: (number, a, b) => {
        if(!number && !(number instanceof Number)) return null
        return Math.min(Math.max(number,a),b)
    },
    isbetween: (number, a, b) => {
        if(!number && !(number instanceof Number)) return null
        let min = Math.min.apply(Math, [a, b]), max = Math.max.apply(Math, [a, b])
        return number > min && number < max
    },
    percentage: (number, { execute = "percentage", max = 100, min = 0, reduce = 0 }) => {
        if(!number && !(number instanceof Number)) return null
        if (Number.isNaN(number) || Number.isNaN(max) || Number.isNaN(min) || Number.isNaN(reduce)) return null
        let result = null
        switch(execute){
            case "percentage": result = valToPerc(number, max, min); break;
            case "value": result = percToVal(number, max, min); break;
            case "reduce": result = reducePerc(number, reduce); break;
            default: return null;
        }
        return reduce > 0 && execute !== "reduce" ? reducePerc(result, reduce) : result;
    },
    random: (max = 1, min = 0) => {
        if (isNaN(min) && isNaN(max)) return;
        min = parseFloat(min); max = parseFloat(max);
        return Math.round(min + Math.random() * (max - min));
    },
    insert: (element, position, string) => {
        if(!element && !(element instanceof Node)) return null
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

        const escaped = escapeHTMLPolicy.createHTML(string);
        if(escaped instanceof TrustedHTML)
            element.insertAdjacentHTML(position, escaped)
    },
    model: (element, elements) => {
        if(!element && !(element instanceof Node)) return null
        const model = element;
        DOMTools.action(model, "keyup", () => {
            if (elements instanceof NodeList || elements instanceof Array) elements.forEach(el => DOMTools.html(el, model.value) )
            else DOMTools.html(elements, model.value)
        })
    },
    watchAttr: (element, nameAttr = "", fn) => {
        if(!element && !(element instanceof Node)) return null
        let observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if(mutation.type === "attributes" && (nameAttr === "" || mutation.attributeName === nameAttr))
                    { fn(mutation, mutation.attributeName) } 
            })
        })
        observer.observe(element, { attributes: true })
        element._mutationObserver = observer
        return observer
    },
    unwatchAttr: (element) => {
        if (element._mutationObserver) {
            element._mutationObserver.disconnect();
            element._mutationObserver = null;
        }
    },
    toCapitalize: (string) => {
        if(!(string instanceof String)) return null
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    isMobile: () => { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
    isMobileAndTablet: () => { return DOMTools.isMobile() },
    sender: ({action, params = {}, method = "POST", type = "text"}, fn = null) => {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === xhr.DONE) {
                if (this.status >= 200 && this.status < 300) {
                    if(fn !== null) fn(this.responseText);
                } else {
                    console.error("Request failed:", this.status, this.statusText);
                    if(fn !== null) fn(null, new Error(`Request failed with status ${this.status}`));
                }
            }
        }
        xhr.onerror = function() {
            if(fn !== null) fn(null, new Error("Network error"));
        }
        xhr.open(method, action, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.responseType = type
        xhr.send(params instanceof string ? encodeURIComponent(params) : params)
    },
    loadView: async ({url, container}, fn = null) => {
        if(!container || !url) return null
        try{
            const response = await fetch(url)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            const result = await response.text()
            DOMTools.html(container, result)
            if (fn !== null) fn(container)
        } catch(e){
            console.error("Failed to load view", error)
            if (fn !== null) fn(null, error)
        }
    },
    accentsReplace: (string) => { return string.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "") },
    aprostReplace: (string) => { return string.replaceAll(/.\'/g, "") },
    appendChildren: (children) => {
        if(!Array.isArray(children) && !(children instanceof NodeList)) return null
        children.forEach(child => {
            if(child instanceof Node)
                this.appendChild(child.cloneNode(true))
        })
    },
};

const DOMToolsPrototype = {
    add: addPrototypeMethod,
    remove: removePrototypeMethod
};

function addPrototypeMethod(proto, name, fn = null) {
    if (!proto.prototype.hasOwnProperty(name)) {
        
        if(fn === null){
            if(DOMTools.hasOwnProperty(name)) fn = DOMTools[name]
            else return null
        }

        proto.prototype[name] = function(...args) {
            if(!this) return null
            let callback = null;

            switch (proto) {
                case Window:
                case Document:
                case HTMLElement:
                case Number:
                    let el = this;
                    if(el instanceof Window) el = document;
                    callback = fn(el, ...args)
                    break;
                case NodeList:
                case Array:
                    if(!this.length) callback = null
                    callback = Array.from(this).flatMap(t => fn(t, ...args))
                    break;
                default:
                    callback = fn(...args)
                    break;
            }
            return callback
        };
    }
}

function removePrototypeMethod(proto, name){
    if(proto.prototype.hasOwnProperty(name)){
        delete proto.prototype[name]
        console.info(`Prototype ${name} removed`)
        return true
    }
    else{
        console.error(`Prototype ${name} not found`)
        return false
    }
}

// Polyfill pour NodeList.forEach (IE11)
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
// Polyfill pour fetch (IE11)
if (!window.fetch) {
    window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(options ? options.method || 'GET' : 'GET', url);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({ ok: true, status: xhr.status, text: () => Promise.resolve(xhr.responseText) });
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(options ? options.body : null);
        });
    };
}

// NOT PERCENTAGE
if(typeof valToPerc !== "function") { function valToPerc(number, max = 100, min = 0){ return ((number - min) * 100) / (max - min); } }
if(typeof percToVal !== "function") { function percToVal(number, max = 100, min = 0){ return (number * (max - min) / 100) + min; } }
if(typeof reducePerc !== "function") { function reducePerc(number, percentage){ return ((100 - percentage) / 100) * number; } }

// ANIMATIONS
if(typeof ease !== "function"){
    function ease(t, b, c, d) {
        t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// EXPORTS
export { DOMTools, DOMToolsPrototype };