const collapseButtons = document.querySelectorAll(".collapse-button")
const isBelowBreak = () => window.matchMedia("(max-width:720px)").matches
let beganBelowBreak = isBelowBreak()

const collapseNav = (collapseButtons) => {
  collapseButtons.forEach((collapseButton) => {
    collapseButton.classList.remove("active")

    let content = collapseButton.nextElementSibling
    content.style.maxHeight = null
    collapseButton.childNodes[1].innerText = `⇣`
  })
}

const expandNav = (collapseButtons) => {
  collapseButtons.forEach((collapseButton) => {
    collapseButton.classList.add("active")

    let content = collapseButton.nextElementSibling
    content.style.maxHeight = `${content.scrollHeight}px`
    collapseButton.childNodes[1].innerText = `⇡`
  })
}

window.onload = () => {
  if (!isBelowBreak()) {
    expandNav(collapseButtons)
  }

  collapseButtons.forEach((collapseButton) => {
    collapseButton.addEventListener("click", () => {
      collapseButton.classList.contains("active")
        ? collapseNav([collapseButton])
        : expandNav([collapseButton])
    })
  })
  
  setTimeout(() => { document.body.classList.remove("preload"), 1000 })
}

window.addEventListener("resize", () => {
  if (beganBelowBreak && !isBelowBreak()) {
    beganBelowBreak = false
    expandNav(collapseButtons)
  } else if (!beganBelowBreak && isBelowBreak()) {
    beganBelowBreak = true
    collapseNav(collapseButtons)
  }
})
