const notes = [
  "Use 14-18 grams of coffee beans for a double, or 7-9 grams for a single.",
  "Use good water! Spring water is best, but distilled water works too.",
  "Distribute your grounds evenly in the filter basket, only lightly tap the portafilter.",
  "Lock the portafilter onto the brew head of your machine to create a tight seal.",
  "Espresso is ground smaller than for drip coffee, closer to table salt in size.",
  "Aim for about 30 pounds of pressure when tamping your grinds.",
  "Start with a 25 second extraction time, and lengthen or shorten from there.",
]

const noteIndex = Math.floor(Math.random() * notes.length)
document.querySelector(".note-text").innerHTML = notes[noteIndex]
