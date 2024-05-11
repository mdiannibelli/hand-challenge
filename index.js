const MIN_VALUE = 0
const MAX_VALUE = 255

const clamp = (value) => {
  if (value > MAX_VALUE) return MIN_VALUE
  if (value < MIN_VALUE) return MAX_VALUE
  return value
}

const getNextFistIndex = (index, instruction) => {
  let fist = 1
  // index => fist
  // index + 1 => next emote
  for (let i = index + 1; i < instruction.length; i++) {
    if (instruction[i] === '🤜') fist++
    if (instruction[i] === '🤛') fist--
    if (fist === 0) return i
  }
}

const getPreviousFistIndex = (index, instruction) => {
  let fist = 1
  for (let i = index - 1; i >= 0; i--) {
    if (instruction[i] === '🤛') fist++
    if (instruction[i] === '🤜') fist--
    if (fist === 0) return i
  }
}

function translate (string) {
  const memory = [0]

  let pointer = 0 // memory pointer => pointer of the array
  let index = 0
  let output = ''

  const arrayInstructions = Array.from(string) // Emotes array

  const steps = {
    '👉': () => {
      pointer++
      memory[pointer] ??= 0 // memory is initialized to 0
    },
    '👈': () => {
      pointer--
      memory[pointer] ??= 0
    },
    '👆': () => {
      memory[pointer] = clamp(memory[pointer] + 1)
    },
    '👇': () => {
      memory[pointer] = clamp(memory[pointer] - 1)
    },
    '🤜': () => {
      if (memory[pointer] === 0) {
        index = getNextFistIndex(index, arrayInstructions)
      }
    },
    '🤛': () => {
      if (memory[pointer] !== 0) {
        index = getPreviousFistIndex(index, arrayInstructions)
      }
    },
    '👊': () => {
      output += String.fromCharCode(memory[pointer]) // Create chain
    }
  }

  while (index < string.length) {
    const emoji = arrayInstructions[index]
    steps[emoji]() // execute step in emoji position
    console.log({ emoji, index, output })
    index++
  }

  return output
}

/* console.log(
  translate('👇🤜👇👇👇👇👇👇👇👉👆👈🤛👉👇👊👇🤜👇👉👆👆👆👆👆👈🤛👉👆👆👊👆👆👆👆👆👆👆👊👊👆👆👆👊')
)

console.log(
  translate('👉👆👆👆👆👆👆👆👆🤜👇👈👆👆👆👆👆👆👆👆👆👉🤛👈👊👉👉👆👉👇🤜👆🤛👆👆👉👆👆👉👆👆👆🤜👉🤜👇👉👆👆👆👈👈👆👆👆👉🤛👈👈🤛👉👇👇👇👇👇👊👉👇👉👆👆👆👊👊👆👆👆👊👉👇👊👈👈👆🤜👉🤜👆👉👆🤛👉👉🤛👈👇👇👇👇👇👇👇👇👇👇👇👇👇👇👊👉👉👊👆👆👆👊👇👇👇👇👇👇👊👇👇👇👇👇👇👇👇👊👉👆👊👉👆👊')
) */

module.exports = translate
