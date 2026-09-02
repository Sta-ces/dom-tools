[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CDN](https://img.shields.io/badge/CDN-jsDelivr-blue.svg)](https://cdn.jsdelivr.net/gh/Sta-ces/dom-tools/tools.min.js)
![GitHub file size in bytes](https://img.shields.io/github/size/Sta-ces/dom-tools/tools.min.js)

# dom-tools.js
**Version 2.0** - A lightweight and intuitive JavaScript library designed to simplify DOM manipulation and extend native functionality with practical and high-performance methods.

---

## 📦 Installation

### Local download
1. Download [`tools.min.js`](https://github.com/Sta-ces/dom-tools/blob/main/tools.min.js) from the repository.
2. Import the module into your JavaScript script:
   ```javascript
   import { DOMTools, DOMToolsPrototype, getQuery, getQueries, action, noaction, click, getElId, random, randomArray, html } from './dom-tools/tools.js'
   ```
> ⚠️ **Note**: The library is designed to be used directly in the browser. If you are using a bundler (Webpack, Vite, etc.), please ensure that the prototype extensions are compatible with your environment.

---

---

## ⚡ Key features

dom-tools.js **extends the native prototypes** (`HTMLElement`, `NodeList`, `Window`, `Array`, `Number`, etc.) to provide a seamless and intuitive API.

### 🔍 Selection of items
| Method | Description | Example |
|---------|-------------|---------|
| `DOMTools.getQuery(selector)` | Equivalent to `document.querySelector()` | `DOMTools.getQuery('.ma-classe')` |
| `DOMTTools.getQueries(selector)` | Equivalent to `document.querySelectorAll()` | `DOMTTools.getQueries('.items')` |
| `DOMTools.getElId(id)` | Equivalent to `document.getElementById()` | `DOMTools.getElId('mon-id')` |

> ✨ **Bonus** : Ces methods sont disponibles sur **tous les éléments DOM** (pas seulement `document`).
> Example : `DOMTools.getQuery('#parent').DOMTools.getQuery('.enfant')`

---

### 🎯 Gestion des événements
| Method | Description | Example |
|---------|-------------|---------|
| `DOMTools.action(event, callback, { element: document } )` | Add an event listener | `DOMTools.action('click', () => console.log('Cliqué !'), { element: DOMTools.getQuery('#btn') } )` |
| `DOMTools.click(callback, { element: document })` | Shortcut for `document.addEventListerner('click', ...)` | `DOMTools.click(() => alert('Hello!'), { element: DOMTools.getQuery('#btn') } )` |
| `DOMTools.noaction(event, callback)` | Remove a listener | `DOMTools.noaction('click', monCallback, { element: DOMTools.getQuery('#btn') })` |

> 💡 **Tip** : Methods are **chainable** and only operate on `NodeList`s if you allow them to:
> ```javascript
> DOMToolsPrototype.add(NodeList, 'click'); // Allow the chained to NodeList
> DOMTTools.getQueries('.btn').click(() => console.log('All the buttons clicked!'));
> ```
> The methods that can be chained by default when importing the tools.min.js file: {Window, Document, HTMLElement, NodeList, Array}.action(), {Array}.random(), {NodeList, Array}.classList().

---

### 🎨 Working with classes
dom-tools.js extends `classList` to work on **`NodeList` and `Array`**:
```javascript
// Add a class to multiple elements
DOMTTools.getQueries('.items').classList.add('active');

// Delete a class
DOMTTools.getQueries('.items').classList.remove('old-class');
```

---

### 🎭 Animations and utilities
| Method | Description |
|---------|-------------|
| `DOMTools.scrollSmooth({ element = document, duration = 1000, stopDistance = 100 })` | Smooth scrolling to an element |
| `DOMTools.random({ max, min })` | Random number |
| `Array.random(count)` | Random element(s) in an array |

---
---

## 📚 Full documentation
For a **comprehensive list of methods**, **advanced examples** and **use cases**, see:
👉 **[Wiki](https://github.com/Sta-ces/dom-tools/wiki)**

---
---

## 🤝 Contribution
Contributions are welcome! Here’s how to get involved:

1. **Report a bug**:
   Open an [issue](https://github.com/Sta-ces/dom-tools/issues) with a clear description and a reproducible example.

2. **Suggest an improvement**:
   Start a [discussion](https://github.com/Sta-ces/dom-tools/discussions) to discuss this before you start coding.

3. **Submit code**:
   - Fork the repository.
   - Create a branch (`git checkout -b feature/my-feature`).
   - Commit your changes (`git commit -m ‘Added my feature’`).
   - Push to your fork (`git push origin feature/my-feature`).
   - Create a **Pull Request** to `main`.

> ⚠️ **Rules** :
> - Please adhere to the existing coding style.
> - Add **tests** where possible.
> - Update the documentation (README or Wiki).

---
---

## 📜 Licence
This project is licensed under the **MIT licence** – it is free to use, modify and distribute.

> © 2022–2026 [Cedric Staces](https://github.com/Sta-ces)
> See [LICENCE](https://github.com/Sta-ces/dom-tools/blob/main/LICENSE) for further details.

---
---

## 📬 Contact
If you have any questions or require support:
- **GitHub** : [@Sta-ces](https://github.com/Sta-ces)
- **Issues** : [dom-tools/issues](https://github.com/Sta-ces/dom-tools/issues)

---
---

## 🏷️ Changelog (v2.0)
### ✨ News
- **Performance improvements**: Optimisation of methods for `NodeList`.
- **New utility functions**: `Array.random()`, `numbersRandom()`, `Number.percentage()`.
- **Extended support**: Improved compatibility with modern browsers.

### 🔧 Corrections
- Fixed minor bugs in `filterSearch` and `scrollSmooth`.
- Improved error handling for invalid selectors.
