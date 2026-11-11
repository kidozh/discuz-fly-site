// Gatsby embeds this function in the HTML head before the first paint.
function initializeTheme() {
  const root = document.documentElement
  if (root.dataset.themeReady === 'true') return

  let saved
  try {
    saved = window.localStorage.getItem('theme')
  } catch {}

  const preference = saved === 'light' || saved === 'dark' ? saved : 'system'
  const dark = preference === 'dark' ||
    (preference === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true)

  root.classList.toggle('dark', dark)
  root.dataset.themePreference = preference
  root.dataset.themeReady = 'true'
}

module.exports = { initializeTheme }
