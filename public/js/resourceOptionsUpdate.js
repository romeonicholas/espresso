const primarySelector = document.querySelector(".primary-selector")
const secondarySelector = document.querySelector(".secondary-selector")

primarySelector.addEventListener("change", (e) => {
  const resourceVarieties =
    e.target.options[e.target.selectedIndex].dataset.varieties.split(",")

  while (secondarySelector.options.length > 0) {
    secondarySelector.remove(0)
  }

  const newOptions = []
  for (let i = 0; i < resourceVarieties.length; i += 2) {
    newOptions.push(new Option(resourceVarieties[i], resourceVarieties[i + 1]))
  }

  newOptions.sort((a, b) => {
    return a.text < b.text ? -1 : 1
  })

  newOptions.forEach((option) => {
    secondarySelector.add(option)
  })
})
