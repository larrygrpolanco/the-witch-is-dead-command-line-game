const readline = require('readline');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const slowPrint = async (text, delay = 50) => {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  console.log();
};

const slowInput = async (prompt, delay = 20) => {
  await slowPrint(prompt, delay);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question('', (answer) => {
      rl.close();
      resolve(answer);
    })
  );
};

const rollDice = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
};

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

class Game {
  constructor() {
    this.gm = new ChatGPTGameMaster(this);
    this.player = null;
    this.witchHunter = null;
    this.village = null;
    this.twist = null;
  }

  async startGame() {
    console.clear();
    await slowPrint("Welcome to 'The Witch is Dead'!");
    await slowPrint("\nOnce upon a time, \nthere was a kind and wise and beautiful witch who lived in the forest with her familiars, \nand her life was peaceful and happy. \nUntil a FUCKING WITCH-HUNTER broke into her cottage and dragged her out and FUCKING MURDERED HER and now she’s DEAD. \nBut if you get revenge and kill him and bring his EYES to her corpse within a week she’ll come back to life. \nOr so you’ve heard. \nEven if it doesn’t work, at least he’s dead. \nThe Witch-Hunter has retreated to the village, the FUCKING COWARD. \nGet him.", 10);
    await this.createPlayer();
    await this.createWitchHunter();
    await this.createVillage();
    await this.mainGameLoop();
  }

  async createPlayer() {
    const name = await slowInput("Enter your name: ");
    await this.determineAnimal(name);
  }

  async determineAnimal(name) {
    await slowPrint("You are a cute woodland animal. Let's find out which one.");
    await slowPrint("Rolling the dice");
    await slowPrint("...", 500);
    const animalRoll = rollDice(10);
    this.player = new Player(name, animalRoll);
    await slowPrint(`You are a ${this.player.animal}. \nYou have four traits:\n CLEVER: ${this.player.traits.Clever} (understand/interact with humans)\n FIERCE: ${this.player.traits.Fierce} (scare, drag, push, carry, bite, scratch)\n SLY: ${this.player.traits.Sly} (sneak, steal, hide)\n QUICK: ${this.player.traits.Quick} (outpace, climb, evade)`, 20);
    await slowPrint(`Your witch taught you one spell: ${this.player.spell}`);
    const acceptCharacter = await slowInput(`Do you want to play as a ${this.player.animal}? (y/n): `);
    if (acceptCharacter.trim().toLowerCase() === 'n') {
      await slowPrint("Rerolling your animal.");
      await slowPrint("...", 500);
      await this.determineAnimal(name);
    } else {
      await slowPrint(`I am sorry for your loss, ${this.player.name} the ${this.player.animal}...`, 30);
    }
    // Update Game states
    this.gm.updateGameState("player_name", this.player.name);
    this.gm.updateGameState("player_animal", this.player.animal);
    this.gm.updateGameState("player_traits", this.player.traits);
    this.gm.updateGameState("player_spell", this.player.spell);
    this.gm.updateGameState("player_danger", this.player.danger);
  }

  async createWitchHunter() {
    const roll = rollDice(10);
    this.witchHunter = new WitchHunter(roll);
    await slowPrint(`The Witch-Hunter is ${this.witchHunter.description}`);
    this.gm.updateGameState("witch_hunter", this.witchHunter.description);
  }

  async createVillage() {
    const rolls = [rollDice(10), rollDice(10)];
    this.village = new Village(rolls);
    await slowPrint(`The village is ${this.village.description}`);
    const twistRoll = rollDice(10);
    this.twist = getTwist(twistRoll);
    await slowPrint("The twist is determined but kept secret by the GM.");
    this.gm.updateGameState("village", this.village.description);
    this.gm.updateGameState("twist", this.twist);
  }

  async restartGame() {
    const choice = await slowInput("Do you want to play again? (y/n): ");
    if (choice.trim().toLowerCase() === 'y') {
      this.__init__();
      await this.startGame();
    } else {
      await slowPrint("Thanks for playing!");
      process.exit();
    }
  }

  async mainGameLoop() {
    while (true) {
      console.log();
      const command = await slowInput("What do you do next?: ");
      if (command.trim().toLowerCase() === 'quit') {
        await slowPrint("Thanks for playing!");
        break;
      } else if (command.trim().toLowerCase() === 'info') {
        await slowPrint("Game Information:");
        await slowPrint(`Player Name: ${this.player.name}`);
        await slowPrint(`Animal: ${this.player.animal}`);
        await slowPrint(`Traits: ${JSON.stringify(this.player.traits)}`);
        await slowPrint(`Spell: ${this.player.spell}`);
        await slowPrint(`Danger Level: ${this.player.danger}`);
        await slowPrint(`Witch-Hunter Description: ${this.witchHunter.description}`);
        await slowPrint(`Village Description: ${this.village.description}`);
        await slowPrint(`Twist: ${this.twist}`);
      } else if (command.trim().toLowerCase() === 'context') {
        await slowPrint(this.gm.stateManager.getContext());
      } else {
        const actionResult = await this.gm.determinePlayerAction(command);
        if (actionResult.Task) {
          const taskTrait = actionResult.Trait;
          const difficulty = actionResult.Difficulty;
          const dangerous = actionResult.Danger;
          const playerTraitValue = this.player.traits[taskTrait];
          const warning = dangerous ? "This is a dangerous task!" : "";
          const task = actionResult.Description;
          const rollConfirm = await slowInput(`You are trying to ${task} which will require you to roll a ${difficulty} for ${taskTrait}\n ${warning}\n(You have ${playerTraitValue} and can add that to your roll). \n Roll dice? (y/n): `);
          if (rollConfirm.trim().toLowerCase() === 'y') {
            const rollResult = rollDice(10);
            await slowPrint("Rolling the dice");
            await slowPrint("...", 500);
            await slowPrint(`You rolled a ${rollResult} + ${playerTraitValue}.`);
            const taskInfo = {
              Description: task,
              Danger: dangerous,
              Trait: taskTrait,
              Difficulty: difficulty,
              Roll: rollResult,
              TraitValue: playerTraitValue,
            };
            const taskResult = await this.gm.generateTaskResponse(command, taskInfo);
            await slowPrint(taskResult);
            continue;
          } else {
            await slowPrint("You chose not to roll the dice.");
            continue;
          }
        } else {
          const response = await this.gm.generateBasicResponse(command);
          await slowPrint(response);
        }
      }
    }
  }
}

class Player {
  constructor(name, animalRoll) {
    this.name = name;
    const { animal, traits } = this.getAnimal(animalRoll);
    this.animal = animal;
    this.traits = traits;
    this.spell = this.getSpell(rollDice(10));
    this.danger = 0;
  }

  getAnimal(roll) {
    const animals = {
      1: ["Fox", { Clever: 2, Fierce: 2, Sly: 1, Quick: 1 }],
      2: ["Cat", { Clever: 0, Fierce: 1, Sly: 3,