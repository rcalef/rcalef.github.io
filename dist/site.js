document.querySelectorAll('#year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

function updateTypographyControls() {
  const selected = window.siteTypography?.selected() || 'modern';
  document.querySelectorAll('[data-choose-type]').forEach((button) => {
    const isSelected = button.dataset.chooseType === selected;
    button.setAttribute('aria-pressed', String(isSelected));
    button.textContent = isSelected ? 'Selected' : 'Apply to site';
  });
  const status = document.querySelector('#type-status');
  if (status) {
    const label = document.querySelector(`[data-choose-type="${selected}"]`)?.closest('.type-card')?.dataset.label;
    status.textContent = `${label || 'Modern sans'} is applied across the site.`;
  }
}

document.querySelectorAll('[data-choose-type]').forEach((button) => {
  button.addEventListener('click', () => {
    window.siteTypography?.apply(button.dataset.chooseType);
  });
});

window.addEventListener('typographychange', updateTypographyControls);
updateTypographyControls();
