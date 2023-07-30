const darkModeElementsByClass = [
  ".header",
  ".footer",
  ".aside",
  ".aside-quote",
  ".aside-header",
  ".goat-link",
  ".menu",
  ".main",
  ".collapse-button",
  ".subheader",
  ".link",
  ".collapse-content",
  ".text-input",
  ".submit-button",
  ".landing-quote-figure",
  ".landing-photo",
  ".dashboard-table",
  ".shots-body",
  ".new-shot-link",
  ".section-underline",
  ".shots-table-head",
  ".ratings-info",
  ".table-brand-spacer",
  ".rating-radio-button",
  ".scores",
  ".col-left",
  ".spillover",
  ".nav-icon",
]

window.addEventListener("load", () => {
  if (localStorage.prefersDarkMode == "true") {
    document.querySelectorAll(darkModeElementsByClass).forEach((element) => {
      element.classList.toggle("dark-theme")
    })

    document.querySelector(".check").checked = true
  }

  const darkModeButton = document.querySelector(".slider")

  darkModeButton.addEventListener("click", () => {
    document.querySelectorAll(darkModeElementsByClass).forEach((element) => {
      element.classList.toggle("dark-theme")
    })

    localStorage.prefersDarkMode =
      localStorage.prefersDarkMode == "true" ? "false" : "true"
  })
})
