Voici une proposition de **README.md** pour **dom-tools.js v2.0**, structurée pour mettre en valeur les fonctionnalités, l'usage et les bonnes pratiques, tout en restant claire et professionnelle.

---

# dom-tools.js 🚀

**Version 2.0** – Une bibliothèque JavaScript légère et intuitive pour simplifier la manipulation du DOM et étendre les fonctionnalités natives avec des méthodes pratiques et performantes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CDN](https://img.shields.io/badge/CDN-jsDelivr-blue.svg)](https://cdn.jsdelivr.net/gh/Sta-ces/dom-tools/tools.min.js)
[![Size](https://img.shields.io/badge/Size-~20KB-minified-green.svg)](https://github.com/Sta-ces/dom-tools/blob/main/tools.min.js)
![GitHub file size in bytes](https://img.shields.io/github/size/Sta-ces/dom-tools/tools.min.js)

---

---

## 📦 Installation

### Téléchargement local
1. Téléchargez [`tools.min.js`](https://github.com/Sta-ces/dom-tools/blob/main/tools.min.js) depuis le dépôt.
2. Importez le module dans votre script JavaScript :
   ```javascript
   import { DOMTools, DOMToolsPrototype } from './dom-tools/tools.js'
   ```
> ⚠️ **Note** : La bibliothèque est conçue pour être utilisée directement dans le navigateur. Si vous utilisez un bundler (Webpack, Vite, etc.), assurez-vous que les extensions de prototypes sont compatibles avec votre environnement.

---

---

## ⚡ Fonctionnalités clés

dom-tools.js **étend les prototypes natifs** (`HTMLElement`, `NodeList`, `Window`, `Array`, `Number`, etc.) pour offrir une API fluide et intuitive.

### 🔍 Sélection d'éléments
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `DOMTools.getQuery(selector)` | Équivalent à `document.querySelector()` | `DOMTools.getQuery('.ma-classe')` |
| `DOMTTools.getQueries(selector)` | Équivalent à `document.querySelectorAll()` | `DOMTTools.getQueries('.items')` |
| `DOMTools.getElId(id)` | Équivalent à `document.getElementById()` | `DOMTools.getElId('mon-id')` |

> ✨ **Bonus** : Ces méthodes sont disponibles sur **tous les éléments DOM** (pas seulement `document`).
> Exemple : `DOMTools.getQuery('#parent').DOMTools.getQuery('.enfant')`

---

### 🎯 Gestion des événements
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `.action(event, callback)` | Ajoute un écouteur d'événement | `DOMTools.getQuery('#btn').action('click', () => console.log('Cliqué !'))` |
| `.click(callback)` | Racourci pour `action('click', ...)` | `DOMTools.getQuery('#btn').click(() => alert('Hello!'))` |
| `.noaction(event, callback)` | Supprime un écouteur | `DOMTools.getQuery('#btn').noaction('click', monCallback)` |
| `.load(callback)` | Écouteur pour l'événement `load` (sur `window`) | `window.load(() => console.log('Page chargée'))` |

> 💡 **Astuce** : Les méthodes sont **chaînables** et fonctionnent sur les `NodeList` :
> ```javascript
> DOMTTools.getQueries('.btn').click(() => console.log('Tous les boutons cliqués !'));
> ```

---

### 🎨 Manipulation des classes
dom-tools.js étend `classList` pour fonctionner sur **les `NodeList` et `Array`** :
```javascript
// Ajouter une classe à plusieurs éléments
DOMTTools.getQueries('.items').classList.add('active');

// Supprimer une classe
DOMTTools.getQueries('.items').classList.remove('old-class');

// Basculer une classe
DOMTools.getQuery('#toggle-btn').classList.toggle('is-open');
```

---

### 📜 Manipulation du contenu
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `.html(content)` | Définir le contenu HTML | `DOMTools.getQuery('#div').html('<p>Nouveau contenu</p>')` |
| `.appendChild(element)` | Ajouter un enfant (sur `NodeList`) | `DOMTTools.getQueries('.containers').appendChild('<div>Ajouté</div>')` |
| `.appendChildren([...elements])` | Ajouter plusieurs enfants | `DOMTools.getQuery('#parent').appendChildren([el1, el2])` |

---

### 🔄 Clonage d'éléments
```javascript
// Cloner un élément dans un conteneur
DOMTools.getQuery('#template').clone('#container');

// Cloner avant ou après (par défaut : "after")
DOMTools.getQuery('#template').clone('#container', 'before');
```

---

### 🎭 Animations et utilitaires
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `.scrollSmooth(duration, stopDistance)` | Scroll fluide vers un élément | `DOMTools.getQuery('a[href="#section"]').scrollSmooth(1000, 50)` |
| `random(max, min)` | Nombre aléatoire | `random(10, 1)` → `7` |
| `numbersRandom(count, max, min)` | Tableau de nombres aléatoires | `numbersRandom(5, 100, 1)` → `[42, 17, 89, 5, 33]` |
| `Array.random(count)` | Élément(s) aléatoire(s) d'un tableau | `[1, 2, 3].random(2)` → `[2, 1]` |

---
---

### 🔍 Filtrage dynamique
La méthode `filterSearch` permet de filtrer une liste en temps réel :
```javascript
DOMTools.getQuery('#search-input').filterSearch({
    models: DOMTools.getQuery('#list-container'),  // Conteneur à filtrer
    classfilter: 'filter-search',         // Classe des éléments à analyser (par défaut)
    msg: 'Aucun résultat trouvé.',        // Message si vide
    action: 'keyup',                      // Événement (par défaut)
    symbols: true,                        // Supprimer les accents/diacritiques (par défaut)
    tag: 'li'                             // Balise du message (par défaut)
});
```
> 📌 **Exemple complet** :
> [Voir la démo dans la Wiki](https://github.com/Sta-ces/dom-tools/wiki/Filtrage-d'une-liste).

---

### 🔢 Extensions pour les nombres
| Méthode | Description | Exemple |
|---------|-------------|---------|
| `Number.between(a, b)` | Limite une valeur entre `a` et `b` | `15.between(10, 20)` → `15` |
| `Number.isbetween(a, b)` | Vérifie si le nombre est entre `a` et `b` | `15.isbetween(10, 20)` → `true` |
| `Number.percentage({...})` | Convertit une valeur en pourcentage ou inversement | `50.percentage({excute: 'percentage', max: 100})` → `50` |

---
---

## 🛠️ Exemples pratiques

### 1️⃣ Menu déroulant animé
```javascript
// Ouvrir/fermer un menu avec un bouton
DOMTools.getQuery('#menu-toggle').click(() => {
    DOMTools.getQuery('#menu').classList.toggle('is-open');
});

// Scroll fluide pour les liens du menu
DOMTTools.getQueries('#menu a[href^="#"]').scrollSmooth(800, 20);
```

### 2️⃣ Liste filtrée en temps réel
```javascript
DOMTools.getQuery('#search').filterSearch({
    models: DOMTools.getQuery('#results'),
    msg: 'Aucun résultat...',
    symbols: true
});
```

### 3️⃣ Gestion dynamique de contenu
```javascript
// Ajouter des éléments à une liste
const newItems = ['Item 1', 'Item 2', 'Item 3'].map(text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
});
DOMTools.getQuery('#list').appendChildren(newItems);

// Cloner un template
DOMTools.getQuery('#item-template').clone('#list');
```

### 4️⃣ Événements sur des collections
```javascript
// Appliquer un clic à tous les boutons ".delete"
DOMTTools.getQueries('.delete').click((e) => {
    e.target.parentElement.remove();
});
```

---
---

## 📚 Documentation complète
Pour une **liste exhaustive des méthodes**, des **exemples avancés** et des **cas d'usage**, consultez :
👉 **[Wiki officielle](https://github.com/Sta-ces/dom-tools/wiki)**

---
---

## 🤝 Contribution
Les contributions sont les bienvenues ! Voici comment participer :

1. **Signaler un bug** :
   Ouvrez une [issue](https://github.com/Sta-ces/dom-tools/issues) avec une description claire et un exemple reproductible.

2. **Proposer une amélioration** :
   Ouvrez une [discussion](https://github.com/Sta-ces/dom-tools/discussions) pour en discuter avant de coder.

3. **Soumettre du code** :
   - Forkez le dépôt.
   - Créez une branche (`git checkout -b feature/ma-fonctionnalite`).
   - Commitez vos changements (`git commit -m "Ajout de ma fonctionnalite"`).
   - Poussez vers votre fork (`git push origin feature/ma-fonctionnalite`).
   - Ouvrez une **Pull Request** vers `main`.

> ⚠️ **Règles** :
> - Respectez le style de code existant.
> - Ajoutez des **tests** si possible.
> - Mettez à jour la documentation (README ou Wiki).

---
---

## 📜 Licence
Ce projet est sous **licence MIT** – libre d'utilisation, de modification et de distribution.

> © 2022–2024 [Cédric Staces](https://github.com/Sta-ces)
> Voir [LICENSE](https://github.com/Sta-ces/dom-tools/blob/main/LICENSE) pour plus de détails.

---
---

## 📬 Contact
Pour toute question ou support :
- **GitHub** : [@Sta-ces](https://github.com/Sta-ces)
- **Issues** : [dom-tools/issues](https://github.com/Sta-ces/dom-tools/issues)

---
---

## 🏷️ Changelog (v2.0)
### ✨ Nouveautés
- **Amélioration des performances** : Optimisation des méthodes pour les `NodeList`.
- **Nouveaux utilitaires** : `Array.random()`, `numbersRandom()`, `Number.percentage()`.
- **Support étendu** : Compatibilité améliorée avec les navigateurs modernes.
- **Documentation** : Wiki mise à jour avec des exemples détaillés.

### 🔧 Corrections
- Fix des bugs mineurs dans `filterSearch` et `scrollSmooth`.
- Meilleure gestion des erreurs pour les sélecteurs invalides.

> 📌 **Voir le [CHANGELOG complet](https://github.com/Sta-ces/dom-tools/wiki/Changelog)**.
```

---
---
**Prêt à l'emploi ?** Copiez-collez ce README dans votre dépôt, et n'hésitez pas à l'adapter selon vos besoins ! 😊