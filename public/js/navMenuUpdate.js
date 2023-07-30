const collapseButtons = document.querySelectorAll(".collapse-button")
const leftColumn = document.querySelector(".col-left")
const isBelowBreak = () => window.matchMedia("(max-width:600px)").matches
let beganBelowBreak = isBelowBreak()

const getDocumentHeight = () => {
  return document.body.clientHeight - 80
}

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
    leftColumn.style.height = `${getDocumentHeight()}px`
  }

  collapseButtons.forEach((collapseButton) => {
    collapseButton.addEventListener("click", () => {
      collapseButton.classList.contains("active")
        ? collapseNav([collapseButton])
        : expandNav([collapseButton])
    })
  })

  setTimeout(() => {
    document.body.classList.remove("preload"), 1000
  })
}

window.addEventListener("resize", () => {
  if (beganBelowBreak && !isBelowBreak()) {
    beganBelowBreak = false
    expandNav(collapseButtons)
  } else if (!beganBelowBreak && isBelowBreak()) {
    beganBelowBreak = true
    collapseNav(collapseButtons)
  }

  if (!isBelowBreak()) {
    leftColumn.style.height = `${getDocumentHeight()}px`
  } else {
    leftColumn.style.height = `initial`
  }
})
