const collapseButtons = document.querySelectorAll(".collapse-button")
let belowNarrowestBreakpoint = window.matchMedia("(max-width:720px)").matches

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

const deactivateNav = (collapseButtons) => {
  collapseButtons.forEach((collapseButton) => {
    collapseButton.classList.remove("active")

    let collapsibleContent = collapseButton.nextElementSibling
    collapsibleContent.style.maxHeight = null

    let arrow = collapseButton.childNodes[1]
    arrow.innerText = `⇣`
  })
}

const activateNav = (collapseButtons) => {
  collapseButtons.forEach((collapseButton) => {
    collapseButton.classList.add("active")

    let collapsibleContent = collapseButton.nextElementSibling
    collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`

    let arrow = collapseButton.childNodes[1]
    arrow.innerText = `⇡`
  })
}

if (window.matchMedia("(min-width:720px)").matches) {
  activateNav(collapseButtons)
}

window.addEventListener("resize", () => {
  if (
    belowNarrowestBreakpoint &&
    window.matchMedia("(min-width:720px)").matches
  ) {
    belowNarrowestBreakpoint = false
    activateNav(collapseButtons)
  } else if (
    !belowNarrowestBreakpoint &&
    window.matchMedia("(max-width:719px)").matches
  ) {
    belowNarrowestBreakpoint = true
    deactivateNav(collapseButtons)
  }
})
