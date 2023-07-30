const goats = [
  [
    "Tim Wendelboe",
    "Oslo, Norway",
    "https://www.instagram.com/timwendelboe",
    "@timwendelboe",
  ],
  [
    "Morgon",
    "Gothenburg, Sweden",
    "https://www.instagram.com/morgoncoffeeroasters/",
    "@morgoncoffeeroasters",
  ],
  [
    "Tim Wendelboe",
    "Galway, Ireland",
    "https://www.instagram.com/calendar.coffee",
    "@calendar.coffee",
  ],
  [
    "Koppi",
    "Helsingborg, Sweden",
    "https://www.instagram.com/koppi_roasters",
    "@koppi_roasters",
  ],
  [
    "Passenger Coffee",
    "Lancaster, Pennsylvania",
    "https://www.instagram.com/passengercoffee",
    "@passengercoffee",
  ],
  [
    "Sey Coffee",
    "Brooklyn, New York",
    "https://www.instagram.com/seycoffee",
    "@seycoffee",
  ],
  [
    "Weekenders Coffee",
    "Kyoto, Japan",
    "https://www.instagram.com/weekenders_coffee",
    "@weekenders_coffee",
  ],
  [
    "La Cabra",
    "Copenhagen, Denmark",
    "https://www.instagram.com/lacabracoffee",
    "@lacabracoffee",
  ],
  [
    "Artificer",
    "Surry Hills, Australia",
    "https://www.instagram.com/artificercoffee",
    "@artificercoffee",
  ],
  [
    "Bonanza",
    "Berlin, Germany",
    "https://www.instagram.com/bonanzacoffee",
    "@bonanzacoffee",
  ],
]

const goatIndex = Math.floor(Math.random() * goats.length)
document.querySelector(
  ".goat-text"
).innerHTML = `${goats[goatIndex][0]} (${goats[goatIndex][1]})`
document.querySelector(
  ".goat-link"
).innerHTML = `<a href="${goats[goatIndex][2]}" class="aside-link">${goats[goatIndex][3]}</a>`
