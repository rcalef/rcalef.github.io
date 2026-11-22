// Loaded before the stylesheet so a saved choice is visible from the first paint.
(() => {
  const storageKey = 'academic-profile-typography';
  const defaultType = 'modern';
  const choices = Object.freeze(['editorial', 'classic', 'bookish', 'modern', 'journal']);
  let savedType;
  try { savedType = localStorage.getItem(storageKey); } catch { /* Use the site default. */ }
  document.documentElement.dataset.type = choices.includes(savedType) ? savedType : defaultType;

  window.siteTypography = {
    defaultType,
    choices,
    selected() { return document.documentElement.dataset.type; },
    apply(choice) {
      if (!choices.includes(choice)) return false;
      document.documentElement.dataset.type = choice;
      try { localStorage.setItem(storageKey, choice); } catch { /* Keep the current page's choice. */ }
      window.dispatchEvent(new Event('typographychange'));
      return true;
    }
  };
})();
