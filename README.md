# dom-tools.js

`dom-tools.js` is a lightweight JavaScript library designed to simplify DOM manipulation and enhance native JavaScript functionality with intuitive methods.

## 📦 Installation

### Option 1: Download
1. Download the `tools.min.js` file from the repository.
2. Place it in your project structure.

### Option 2: Use via CDN
Add this link to your HTML file:
```html
<script src="https://cdn.jsdelivr.net/gh/Sta-ces/dom-tools/tools.min.js"></script>
```

Place it in the `<head>` tag before all other scripts.

## 🚀 Getting Started

1. **Integration in Your Project**
   Once the file is properly added, you can use the tools in your JavaScript files.

   Example:
   ```javascript
   // Select an element with 'getQuery'
   let paragraph = getQuery('.classname > p');

   // Add a click event with 'action'
   paragraph.action('click', () => {
       console.log('Paragraph clicked!');
   });
   ```

2. **Automatic Inheritance**
   All methods are added to the native prototypes of objects like `HTMLElement`, `NodeList`, and `Window`. This makes them directly accessible from DOM objects.

## 📚 Documentation

Check out the [Wiki](https://github.com/Sta-ces/dom-tools/wiki) for full documentation, including:
- **Getting Started**
- **Reference**: List of methods with examples

## 🛠️ Key Features

- **Simplified DOM Manipulation**:
  - `getQuery` and `getQueries` to select elements.
  - `action` and `click` to easily add events.

- **Useful Extensions**:
  - Adds methods to native prototypes (`HTMLElement`, `NodeList`, `String`, etc.).
  - Methods like `scrollSmooth` for smooth scrolling animations.

- **Class List Management**:
  - Advanced management with `classList` on `NodeList`.

- **Global Utilities**:
  - Methods like `random` to generate random numbers.

## ✨ Quick Example

```javascript
// Add smooth scrolling to a link
getQuery('a[href="#section"]').scrollSmooth(1000, 50);

// Filter a list based on user input
getQuery('#search-input').filterSearch({
    models: getElId('list-container'),
    msg: 'No results found.'
});

// Add a class to multiple elements
getQueries('.items').classList.add('highlight');
```

## 🧑‍💻 Contributing
Contributions are welcome! To report issues or propose improvements:
1. Open an issue on [GitHub](https://github.com/Sta-ces/dom-tools/issues).
2. Create a pull request with your changes.

## 📄 License
This project is licensed under the [MIT](LICENSE).
