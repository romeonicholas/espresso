const ratings = new Set(
  Array.from(document.getElementsByClassName("rating-radio-button")).map(
    (element) => element.name
  )
)

ratings.forEach((rating) => {
  document.getElementsByName(rating).forEach((element) => {
    if (
      element.value == document.currentScript.getAttribute(`data-${rating}`)
    ) {
      element.checked = true
    }
  })
})
