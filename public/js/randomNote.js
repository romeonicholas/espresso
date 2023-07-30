const notes = [
  "Use ~14-18 grams of coffee beans for a doble. Use ~7-9 grams for a single.",
  "Use good water! The best is spring water, but distilled water works too.",
  "Distribute your grounds evenly in the filter basket. Only lightly tap the portafilter.",
  "Make sure to lock the portafilter onto the brew head of your machine to create a tight seal.",
  "The grind size for espresso is smaller than for drip coffee, closer to table salt in size.",
  "Aim for about 30 pounds of pressure when tamping yoru grinds.",
  "Aim for a 25 seconds extraction time to start, and lengthen or shorten from there.",
]

const noteIndex = Math.floor(Math.random() * notes.length)
document.querySelector(".note-text").innerHTML = notes[noteIndex]
