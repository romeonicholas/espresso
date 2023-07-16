const quotes = [
  [
    "I&#8217;d rather take coffee than compliments just now.",
    "Louisa May Alcott",
    "Little Women",
  ],
  [
    "Even bad coffee is better than no coffee at all.",
    "David Lynch",
    "Attributed",
  ],
  [
    "I decide to turn to my old faithful solution to all that is wrong in life. Coffee.",
    "Lisa Renee Jones",
    "If I Were You",
  ],
  [
    "Coffee, the favorite drink of the civilized world.",
    "Thomas Jefferson",
    "Attributed",
  ],
  [
    "It&#8217;s amazing how the world begins to change through the eyes of a cup of coffee.",
    "Donna A. Favors",
    "Attributed",
  ],
]

const quoteIndex = Math.floor(Math.random() * (quotes.length - 1))
document.querySelector(".quote-text").innerHTML = quotes[quoteIndex][0]
document.querySelector(
  ".quote-author"
).innerHTML = `-${quotes[quoteIndex][1]}, <cite>${quotes[quoteIndex][2]}</cite>`
