const quotes = [
  [
    "I'd rather take coffee than compliments just now.",
    "Louisa May Alcott,",
    "Little Women",
  ],
  ["Even bad coffee is better than no coffee at all.", "David Lynch", ""],
  [
    "I decide to turn to my old faithful solution to all that is wrong in life. Coffee.",
    "Lisa Renee Jones,",
    "If I Were You",
  ],
  [
    "Coffee, the favorite drink of the civilized world.",
    "Thomas Jefferson",
    "",
  ],
  [
    "It's amazing how the world begins to change through the eyes of a cup of coffee.",
    "Donna A. Favors",
    "",
  ],
  [
    "Once you wake up and smell the coffee, it's hard to go back to sleep.",
    "Fran Drescher",
    "",
  ],
  [
    "As long as there was coffee in the world, how bad could things be?",
    "Cassandra Clare",
    "City of Ashes",
  ],
  [
    "Ah coffee. The sweet balm by which we shall accomplish today's tasks.",
    "Holly Black",
    "Ironside",
  ],
  [
    "If it wasn't for coffee, I'd have no discernible personality at all.",
    "David Letterman",
    "",
  ],
]

window.addEventListener("load", () => {
  const quoteIndex = Math.floor(Math.random() * quotes.length)
  document.querySelector(
    ".quote-text"
  ).textContent = `"${quotes[quoteIndex][0]}"`
  document.querySelector(
    ".quote-author"
  ).innerHTML = `-${quotes[quoteIndex][1]} <cite>${quotes[quoteIndex][2]}</cite>`
})
