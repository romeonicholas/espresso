const darkModeElementsByClass = [
  ".header",
  ".footer",
  ".aside",
  ".aside-quote",
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
]

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

const collapseButtons = document.querySelectorAll(".collapse-button")

collapseButtons.forEach((collapseButton) => {
  collapseButton.addEventListener("click", () => {
    collapseButton.classList.toggle("active")

    let collapsibleContent = collapseButton.nextElementSibling
    let arrow = collapseButton.childNodes[1]

    if (collapsibleContent.style.maxHeight) {
      collapsibleContent.style.maxHeight = null
      arrow.innerText = `⇣`
    } else {
      collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`
      arrow.innerText = `⇡`
    }
  })
})
