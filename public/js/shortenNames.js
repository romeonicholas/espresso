window.addEventListener("load", () => {
  let usernames = document.querySelectorAll(".username")
  usernames.forEach((username) => {
    console.log(username)
    if (username.textContent.length > 10) {
      console.log(username.textContent, " is too big")
      username.textContent = username.textContent.substring(0, 9) + "..."
    }
  })
})
