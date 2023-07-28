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

if (window.matchMedia("(min-width:720px)").matches) {
  collapseButtons.forEach((collapseButton) => {
    collapseButton.classList.add("active")

    let collapsibleContent = collapseButton.nextElementSibling
    collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`

    let arrow = collapseButton.childNodes[1]
    arrow.innerText = `⇡`
  })
}

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width:720px)").matches) {
    collapseButtons.forEach((collapseButton) => {
      collapseButton.classList.add("active")

      let collapsibleContent = collapseButton.nextElementSibling
      collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`

      let arrow = collapseButton.childNodes[1]
      arrow.innerText = `⇡`
    })
  }

  if (window.matchMedia("(max-width:719px)").matches) {
    collapseButtons.forEach((collapseButton) => {
      collapseButton.classList.remove("active")

      let collapsibleContent = collapseButton.nextElementSibling
      collapsibleContent.style.maxHeight = null

      let arrow = collapseButton.childNodes[1]
      arrow.innerText = `⇣`
    })
  }
})
