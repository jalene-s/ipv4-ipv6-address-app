# GRP6_BR7.1 — IP Intelligence Console

A refactored, browser-only public IP lookup dashboard. The original single HTML file was reorganized into separated HTML, CSS, and JavaScript modules while preserving its core interface and functions.

## Run the project

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. For best ES-module compatibility, run it through a local static server, for example VS Code Live Server.
4. Enter a public IPv4 or IPv6 address, or select **Scan My IP**.

## Folder structure

```text
GRP6_BR7.1/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── app.js
        ├── api.js
        ├── config.js
        ├── storage.js
        ├── ui.js
        └── validation.js
```

## Module responsibilities

- `index.html`: Semantic page structure and accessible controls.
- `assets/css/styles.css`: Design tokens, layout, responsive styling, reduced-motion support, and light theme variables.
- `assets/js/config.js`: API endpoints, optional IPinfo token, and application settings.
- `assets/js/api.js`: Remote API requests, errors, and normalized IP lookup data.
- `assets/js/validation.js`: IPv4 and IPv6 input validation.
- `assets/js/storage.js`: Scan-history persistence using `localStorage`.
- `assets/js/ui.js`: DOM updates, notifications, history display, and theme controls.
- `assets/js/app.js`: Event binding and application workflow.

## Improvements included

- Separation of concerns through ES modules.
- Class-based light/dark theme instead of setting each CSS variable from JavaScript.
- Saved theme choice and saved scan history through `localStorage`.
- Better accessibility: labels, ARIA live regions, button types, visible keyboard focus, and reduced-motion support.
- Network-failure handling with clearer user feedback.
- Safer DOM updates for history content, retaining HTML escaping for API-derived values.
- Configuration centralized in `config.js`. Add an IPinfo token there only if your API plan requires it. Do not commit private tokens to a public repository.

## Privacy note

This interface queries third-party services (`api64.ipify.org` and `ipinfo.io`) from the user’s browser. Use it only for public IP addresses and ensure your deployment explains this data flow to users.
