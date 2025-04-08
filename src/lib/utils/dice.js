/**
 * Simulates rolling a die with the specified number of sides
 * @param {number} sides - Number of sides on the die (default: 6)
 * @returns {number} - The result of the die roll (1 to sides)
 */
export function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Simulates rolling multiple dice and returning the sum
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides on each die
 * @returns {number} - The sum of all dice rolls
 */
export function rollMultipleDice(count, sides = 6) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollDice(sides);
  }
  return total;
}

/**
 * Simulates a dice roll check against a target difficulty
 * @param {number} sides - Number of sides on the die
 * @param {number} difficulty - Target number to meet or exceed
 * @param {number} modifier - Bonus or penalty to add to the roll
 * @returns {object} - Result object containing success flag and roll details
 */
export function rollCheck(sides = 6, difficulty = 4, modifier = 0) {
  const roll = rollDice(sides);
  const totalValue = roll + modifier;
  const success = totalValue >= difficulty;
  
  return {
    roll,        // The natural die roll
    totalValue,  // Die roll plus modifier
    modifier,    // The modifier applied
    difficulty,  // The target difficulty
    success      // Whether the check succeeded
  };
}

/**
 * Returns an array of all results from multiple dice rolls
 * Useful for games that need to track individual dice results
 * @param {number} count - Number of dice to roll
 * @param {number} sides - Number of sides on each die
 * @returns {Array<number>} - Array of individual die results
 */
export function getRollResults(count, sides = 6) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDice(sides));
  }
  return results;
}
