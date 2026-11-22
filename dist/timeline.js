(() => {
  const storageKey = "academic-profile-timeline";
  const defaultTimeline = "present";
  const portraits = new Map([
    ["1500s", "/assets/timelines/1500s/headshot.jpg"],
    ["1940s", "/assets/timelines/1940s/headshot.jpg"],
  ]);

  function readTimeline(current = defaultTimeline) {
    try {
      const saved = localStorage.getItem(storageKey);
      return portraits.has(saved) ? saved : defaultTimeline;
    } catch {
      return current;
    }
  }

  // Apply the saved typography before the stylesheet loads.
  const root = document.documentElement;
  root.dataset.timeline = readTimeline();

  document.addEventListener("DOMContentLoaded", () => {
    const actions = document.querySelector(".timeline-actions");
    const randomButton = actions?.querySelector("[data-random-timeline]");
    const returnButton = actions?.querySelector("[data-return-to-present]");
    const status = actions?.querySelector('[role="status"]');
    const portrait = document.querySelector(".portrait-image");
    const defaultPortrait = portrait?.getAttribute("src");

    function showTimeline(choice) {
      root.dataset.timeline = choice;
      if (returnButton) returnButton.hidden = choice === defaultTimeline;

      const source = portraits.get(choice) ?? defaultPortrait;
      if (portrait && portrait.getAttribute("src") !== source) {
        portrait.src = source;
      }
    }

    function chooseTimeline(choice) {
      showTimeline(choice);
      status.textContent =
        choice === defaultTimeline ? "Present day" : `${choice} timeline`;
      try {
        localStorage.setItem(storageKey, choice);
      } catch {
        /* Keep the choice for this page when storage is unavailable. */
      }
    }

    portrait?.addEventListener("error", () => {
      if (portrait.getAttribute("src") !== defaultPortrait) {
        portrait.src = defaultPortrait;
      }
    });

    randomButton?.addEventListener("click", () => {
      const choices = [...portraits.keys()].filter(
        (choice) => choice !== root.dataset.timeline,
      );
      chooseTimeline(choices[Math.floor(Math.random() * choices.length)]);
    });

    returnButton?.addEventListener("click", () => {
      chooseTimeline(defaultTimeline);
      randomButton.focus();
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) showTimeline(readTimeline(root.dataset.timeline));
    });

    showTimeline(root.dataset.timeline);
    if (actions) actions.hidden = false;
  });
})();
