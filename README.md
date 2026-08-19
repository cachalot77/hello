# Hello World — Live Update

Open `index.html` in a browser to see the page. The page includes a "LAST UPDATE" panel that reads from `updates.json`, which is safe for GitHub Pages because it uses same-origin static data instead of calling the GitHub API in the browser.

Before publishing, refresh the timestamps with:

```bash
python3 generate_updates.py
```

To run locally, from the project folder you can simply double-click `index.html` or serve it with a static server:

```bash
# Python 3 built-in server
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```
