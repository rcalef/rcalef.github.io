# Academic profile site

A small, buildless website. The published files are in `dist/`; there is no framework or install step.

## Local preview

Run `python3 preview.py` from this folder, then open `http://127.0.0.1:8765/` in your browser. Save changes to any file in `dist/` and the browser refreshes automatically within about a second. Enable your editor's autosave if you want to preview as you type.

The preview is available only on this computer and does not publish changes. Its refresh script is injected while serving pages; it is not added to your HTML or the hosted website. Stop the server with Ctrl+C. To use a different port, run `python3 preview.py --port 8766`.

## Compare typography

Open `dist/typography.html` to compare five styles side by side. The buttons apply a style to all pages in the current browser using local storage. Modern sans is the default for visitors without a saved selection. All five options remain available.

The font variables and comparison specimens are in `dist/styles.css`. The preference loader and reusable `window.siteTypography` API live in `dist/typography.js`; `dist/site.js` connects the comparison buttons. Add an option to the `choices` array, define its CSS variables, and add a corresponding comparison card to extend the selector.

## Personalize

1. Edit your bio in `dist/index.html` and replace the remaining role, institution, and research placeholders.
2. Add a portrait as `dist/portrait.jpg`. Replace the `portrait-placeholder` element in `dist/index.html` with `<img class="portrait-image" src="/portrait.jpg" alt="Portrait of Robert Calef">`. The shared CSS handles the crop.
3. Replace the clearly labeled sample updates, publications, and CV entries in the three HTML files.
4. Turn publication resource labels into links, for example `<a href="https://arxiv.org/abs/...">arXiv ↗</a>`, and change the email placeholder to a `mailto:` link.

## Add another page

Copy `dist/cv.html` to a new file such as `dist/books.html`; keep the header and footer, replace the main content, and add the new link to the `<nav>` in each page. The shared stylesheet is `dist/styles.css`.
