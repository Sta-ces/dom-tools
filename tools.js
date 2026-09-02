/**
 * Version: 2.1.1
 */

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\"/g, '&quot;')
              .replace(/'/g, '&#x27;');
}

const escapeHTMLPolicy = (typeof trustedTypes !== 'undefined')
    ? trustedTypes.createPolicy("myEscapePolicy", {
        createHTML: (string) => escapeHTML(string)
    })
    : null;

const observerMap = new WeakMap();

const DOMTools = {
    action: (event, callback, { element = document, options = false } = {}) => {
        element.addEventListener(event, callback, options)
        return element
    },
    noaction: (event, callback, { element = document, options = false } = {}) => {
        element.removeEventListener(event, callback, options)
        return element
    },
    click: (callback, { element = document, options = false } = {}) => {
        element.addEventListener("click", callback, options)
        return element
    },
    getElId: (id) => { if(id === "") return null; return document.getElementById(id) },
    getQuery: (query, { element = document } = {}) => {
        if(query === "" || !(element instanceof Node)) return null
        let el;
        try{
            el = element.querySelector(query)
        } catch(e){
            console.error("Invalid selector:", query, e)
            el = null
        }
        return el;
    },
    getQueries: (query, { element = document,  toArray = false } = {}) => {
        if(query === "" || !(element instanceof Node)) return null
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
    scrollSmooth: ({ element = document, duration = 1000, stopDistance = 100 } = {}) => {
        if(!element && !(element instanceof Node)) return null
        let animationId = null
        duration = Number(duration)
        stopDistance = Number(stopDistance)

        if (isNaN(duration) || isNaN(stopDistance)) {
            console.error("Invalid arguments: duration and stopDistance must be numbers")
            return null
        }

        DOMTools.click(() => {
            if (animationId) cancelAnimationFrame(animationId)

            let href = (element.hasAttribute("href"))
                ? element.getAttribute("href")
                : element.getAttribute("data-href")
            let target = href ? DOMTools.getQuery(href) : document.body

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
        }, { element: element })
    },
    scrollToTop: ({ top = 0, behavior = 'smooth' } = {}) => { window.scrollTo({ top, behavior }); },
    filterSearch: ({element = document, inputElement, container, classfilter = "filter-search", symbols = true, action = "keyup", msg = "No Result", tag = "li"} = {}, fn = () => {}) => {
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
                DOMTools.appendChildren({ children: filteredItems, element: container })
            } else {
                const messageElement = document.createElement(tag)
                messageElement.className = "filter-msg"
                messageElement.textContent = msg
                container.appendChild(messageElement.cloneNode(true))
            }
            fn()
        }, { element: element })
    },
    appendChildren: ({ children, element = document } = {}) => {
        if(!element && !(element instanceof Node) && !Array.isArray(children) && !(children instanceof NodeList)) return null
        children.forEach(child => {
            if(child instanceof Node)
                element.appendChild(child.cloneNode(true))
        })
    },
    clone: (container, { position = "after", element = document } = {}) => {
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
    html: (string, { element = document } = {}) => {
        if(!element && !(element instanceof Node)) return null
        const escaped = escapeHTMLPolicy
            ? escapeHTMLPolicy.createHTML(string)
            : escapeHTML(string);
        element.innerHTML = escaped
    },
    between: ({ number = Number, max, min } = {}) => {
        if(typeof number !== 'number' || Number.isNaN(number)) return null
        return Math.min(Math.max(number,min),max)
    },
    isbetween: ({ number = Number, max, min } = {}) => {
        if(typeof number !== 'number' || Number.isNaN(number)) return null
        return number > Math.min(min, max) && number < Math.max(min, max)
    },
    percentage: (number, { execute = "percentage", max = 100, min = 0, reduce = 0 } = {}) => {
        if(typeof number !== 'number' || Number.isNaN(number)) return null
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
    random: ({ max = 1, min = 0 } = {}) => {
        if (isNaN(min) && isNaN(max)) return;
        min = parseFloat(min); max = parseFloat(max);
        return Math.round(min + Math.random() * (max - min));
    },
    randomArray: ({ elements, count = 1 } = {}) => { return Array.from({ length: count }, () => elements[DOMTools.random(elements.length-1)]) },
    insert: ({ element = document, position, string } = {}) => {
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

        const escaped = escapeHTMLPolicy
            ? escapeHTMLPolicy.createHTML(string)
            : escapeHTML(string);
        element.insertAdjacentHTML(position, escaped)
    },
    model: ({ elements, input } = {}) => {
        if(!input && !(input instanceof Node)) return null
        DOMTools.action(input, "keyup", () => {
            if (elements instanceof NodeList || elements instanceof Array) elements.forEach(el => DOMTools.html(el, input.value) )
            else DOMTools.html(elements, input.value)
        })
    },
    watchAttr: ({ element, nameAttr = "", fn } = {}) => {
        if (!element || !(element instanceof Node)) return null;

        if (observerMap.has(element)) {
            observerMap.get(element).disconnect();
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && (nameAttr === "" || mutation.attributeName === nameAttr)) {
                    fn(mutation, mutation.attributeName);
                }
            });
        });

        observer.observe(element, { attributes: true });
        observerMap.set(element, observer);

        const cleanupObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (Array.from(mutation.removedNodes).includes(element)) {
                    if (observerMap.has(element)) {
                        observerMap.get(element).disconnect();
                        observerMap.delete(element);
                    }
                    cleanupObserver.disconnect();
                }
            });
        });
        cleanupObserver.observe(document, { childList: true, subtree: true });

        return observer;
    },
    unwatchAttr: ({ element } = {}) => {
        if (observerMap.has(element)) {
            observerMap.get(element).disconnect();
            observerMap.delete(element);
        }
    },
    toCapitalize: (string) => {
        if(!(string instanceof String)) return null
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    isMobile: () => { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
    accentsReplace: (string) => { return string.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "") },
    aprostReplace: (string) => { return string.replaceAll(/.\'/g, "") },
    ClassLists: class ClassLists{
        constructor(nodeList){
            this.nodeList = nodeList
        }
        add(classname){
            if (typeof classname !== 'string') return;
            this.nodeList.forEach(el => el.classList.add(classname))
        }
        remove(classname){
            if (typeof classname !== 'string') return;
            this.nodeList.forEach(el => el.classList.remove(classname))
        }
        toggle(classname){
            if (typeof classname !== 'string') return;
            this.nodeList.forEach(el => el.classList.toggle(classname))
        }
        contains(classname){
            if (typeof classname !== 'string') return;
            return Array.from(this.nodeList).some(el => el.classList.contains(classname))
        }
        replace(oldClass, newClass){
            if (typeof oldClass !== 'string' || typeof newClass !== 'string') return;
            this.nodeList.forEach(el => el.classList.replace(oldClass, newClass))
        }
    },
};

const DOMToolsPrototype = {
    add: function(proto, name, fn = null, { enumerable = false, configurable = true, writable = false } = {}) {
        if (!proto.prototype || proto.prototype.hasOwnProperty(name)) return null;
            
        if(fn === null){
            if(DOMTools.hasOwnProperty(name)) fn = DOMTools[name]
            else return null
        }

        Object.defineProperty(proto.prototype, name, {
            value: function(...args){
                if(!this) return null
                let callback = null;

                switch (proto) {
                    case Window:
                    case Document:
                    case HTMLElement:
                    case Number:
                        let el = proto === Window ? document : this;
                        args.element = el
                        callback = fn(...args)
                        break;
                    case NodeList:
                    case Array:
                        if(!this.length) return null
                        callback = Array.from(this).flatMap(t => {
                            args.element = t
                            return fn(...args)
                        })
                        break;
                    default:
                        args.element = this
                        callback = fn(...args)
                        break;
                }
                return callback
            },
            enumerable,
            configurable,
            writable,
        });
    },
    remove: function(proto, name){
        if(proto.prototype.hasOwnProperty(name)){
            delete proto.prototype[name]
            return true
        }
        return false
    }
};

if (typeof window !== 'undefined') {
    DOMToolsPrototype.add(Window, 'action');
    DOMToolsPrototype.add(Document, 'action');
    DOMToolsPrototype.add(HTMLElement, 'action');
    DOMToolsPrototype.add(NodeList, 'action');
    DOMToolsPrototype.add(Array, 'action');
    Object.defineProperty(Array.prototype, 'random', {
        value: function(count = 1){
            return DOMTools.randomArray(this, count)
        },
        enumerable: false,
        configurable: true,
    })
    Object.defineProperty(NodeList.prototype, 'classList', {
        get: function(){
            return new DOMTools.ClassLists(this);
        }
    })
    Object.defineProperty(Array.prototype, 'classList', {
        get: function(){
            return new DOMTools.ClassLists(this);
        }
    })
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
const getQuery = DOMTools.getQuery;
const getQueries = DOMTools.getQueries;
const action = DOMTools.action;
const noaction = DOMTools.noaction;
const click = DOMTools.click;
const getElId = DOMTools.getElId;
const random = DOMTools.random;
const randomArray = DOMTools.randomArray;
const html = DOMTools.html;
export { DOMTools, DOMToolsPrototype, getQuery, getQueries, action, noaction, click, getElId, random, randomArray, html };