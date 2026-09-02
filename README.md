[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CDN](https://img.shields.io/badge/CDN-jsDelivr-blue.svg)](https://cdn.jsdelivr.net/gh/Sta-ces/dom-tools/tools.min.js)
![GitHub file size in bytes](https://img.shields.io/github/size/Sta-ces/dom-tools/tools.min.js)

# dom-tools.js
**Version 2.0** – Une bibliothèque JavaScript légère et intuitive pour simplifier la manipulation du DOM et étendre les fonctionnalités natives avec des méthodes pratiques et performantes.

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
| `DOMTools.action(event, callback, { element: document } )` | Ajoute un écouteur d'événement | `DOMTools.action('click', () => console.log('Cliqué !'), { element: DOMTools.getQuery('#btn') } )` |
| `DOMTools.click(callback, { element: document })` | Raccourci pour `document.addEventListerner('click', ...)` | `DOMTools.click(() => alert('Hello!'), { element: DOMTools.getQuery('#btn') } )` |
| `DOMTools.noaction(event, callback)` | Supprime un écouteur | `DOMTools.noaction('click', monCallback, { element: DOMTools.getQuery('#btn') })` |

> 💡 **Astuce** : Les méthodes sont **chaînables** et fonctionnent sur les `NodeList` uniquement vous l'autorisez :
> ```javascript
> DOMToolsPrototype.add(NodeList, 'click');
> DOMTTools.getQueries('.btn').click(() => console.log('Tous les boutons cliqués !'));
> ```
> Les méthodes chaînables par défaut à l'importation du fichier tools.min.js : {Window, Document, HTMLElement, NodeList, Array}.action(), {Array}.random(), {NodeList, Array}.classList().

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
| Méthode | Description |
|---------|-------------|---------|
| `DOMTools.html(content)` | Définir le contenu HTML |
| `DOMTools.appendChild(element)` | Ajouter un enfant (sur `NodeList`) |
| `DOMTools.appendChildren([...elements])` | Ajouter plusieurs enfants |

---

### 🎭 Animations et utilitaires
| Méthode | Description |
|---------|-------------|---------|
| `DOMTools.scrollSmooth({ element = document, duration = 1000, stopDistance = 100 })` | Scroll fluide vers un élément |
| `DOMTools.random({ max, min })` | Nombre aléatoire |
| `Array.random(count)` | Élément(s) aléatoire(s) d'un tableau |

---

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

> © 2022–2026 [Cédric Staces](https://github.com/Sta-ces)
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

### 🔧 Corrections
- Fix des bugs mineurs dans `filterSearch` et `scrollSmooth`.
- Meilleure gestion des erreurs pour les sélecteurs invalides.

> 📌 **Voir le [CHANGELOG complet](https://github.com/Sta-ces/dom-tools/wiki/Changelog)**.
```
