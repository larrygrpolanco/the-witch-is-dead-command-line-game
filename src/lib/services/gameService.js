import { gameState } from '$lib/stores/gameStore';
import { get } from 'svelte/store';
import { rollDice } from '$lib/utils/dice';
import { ANIMALS, SPELLS, WITCH_HUNTERS, VILLAGES, TWISTS } from '$lib/utils/gameData';
import { aiService } from './aiService';

class GameService {
	constructor() {
		this.initialized = false;
		this.pendingTaskConfirmation = null;
	}

	async startGame(playerName) {
		// Clear any existing game state
		gameState.initialize();

		// Add intro text to history
		gameState.addToHistory("Welcome to 'The Witch is Dead'!", 'system');
		gameState.addToHistory(
			"Once upon a time, there was a kind and wise and beautiful witch who lived in the forest with her familiars, and her life was peaceful and happy. Until a FUCKING WITCH-HUNTER broke into her cottage and dragged her our and FUCKING MURDERED HER and now she's DEAD. But if you get revenge and kill him and bring his EYES to her corpse within a week she'll come back to life. Or so you've heard. Even if it doesn't work, at least he's dead. The Witch-Hunter has retreated to the village, the FUCKING COWARD. Get him.",
			'narration'
		);

		// Create character
		await this.createPlayer(playerName);

		// Generate witch hunter
		this.createWitchHunter();

		// Generate village
		this.createVillage();

		this.initialized = true;
		return true;
	}

	async createPlayer(name) {
		const animalRoll = rollDice(10);
		const animalResult = ANIMALS[animalRoll];
		const spellRoll = rollDice(10);

		gameState.setPlayerInfo(name, animalResult.name, animalResult.traits, SPELLS[spellRoll]);

		gameState.addToHistory(
			`You are a ${animalResult.name}. You have four traits:
    CLEVER: ${animalResult.traits.Clever} (understand/interact with humans)
    FIERCE: ${animalResult.traits.Fierce} (scare, drag, push, carry, bite, scratch)
    SLY: ${animalResult.traits.Sly} (sneak, steal, hide)
    QUICK: ${animalResult.traits.Quick} (outpace, climb, evade)`,
			'system'
		);

		gameState.addToHistory(`Your witch taught you one spell: ${SPELLS[spellRoll]}`, 'system');

		// Ask if they want to accept the character
		gameState.addToHistory(`Do you want to play as a ${animalResult.name}? (y/n)`, 'system');

		// The actual handling of this answer will be in processPlayerAction
		return animalResult.name;
	}

	createWitchHunter() {
		const roll = rollDice(10);
		const witchHunterDesc = WITCH_HUNTERS[roll];
		gameState.setGameWorld(witchHunterDesc, get(gameState).village, get(gameState).twist);
		gameState.addToHistory(`The Witch-Hunter is ${witchHunterDesc}`, 'narration');
	}

	createVillage() {
		const roll1 = rollDice(10);
		const roll2 = rollDice(10);
		const villageDesc = `${VILLAGES[roll1]} and ${VILLAGES[roll2]}`;

		const twistRoll = rollDice(10);
		const twist = TWISTS[twistRoll];

		gameState.setGameWorld(get(gameState).witchHunter, villageDesc, twist);
		gameState.addToHistory(`The village is ${villageDesc}`, 'narration');
		gameState.addToHistory('The twist is determined but kept secret by the GM.', 'system');
		gameState.addToHistory('What do you do next?', 'system');
	}

	async processPlayerAction(input) {
		if (!this.initialized) {
			gameState.addToHistory('Game not initialized yet!', 'system');
			return;
		}

		// Add player input to history
		gameState.addToHistory(input, 'player');

		// Handle character creation response
		if (get(gameState).player.animal && !get(gameState).witchHunter) {
			if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
				gameState.addToHistory(
					`I am sorry for your loss, ${get(gameState).player.name} the ${get(gameState).player.animal}...`,
					'narration'
				);
				this.createWitchHunter();
				return;
			} else if (input.toLowerCase() === 'n' || input.toLowerCase() === 'no') {
				// Reroll character
				gameState.addToHistory('Rerolling your animal...', 'system');
				const animalRoll = rollDice(10);
				const animalResult = ANIMALS[animalRoll];
				const spellRoll = rollDice(10);

				gameState.setPlayerInfo(
					get(gameState).player.name,
					animalResult.name,
					animalResult.traits,
					SPELLS[spellRoll]
				);

				gameState.addToHistory(
					`You are a ${animalResult.name}. You have four traits:
        CLEVER: ${animalResult.traits.Clever} (understand/interact with humans)
        FIERCE: ${animalResult.traits.Fierce} (scare, drag, push, carry, bite, scratch)
        SLY: ${animalResult.traits.Sly} (sneak, steal, hide)
        QUICK: ${animalResult.traits.Quick} (outpace, climb, evade)`,
					'system'
				);

				gameState.addToHistory(`Your witch taught you one spell: ${SPELLS[spellRoll]}`, 'system');
				gameState.addToHistory(`Do you want to play as a ${animalResult.name}? (y/n)`, 'system');
				return;
			}
		}

		// Handle task confirmation response
		if (this.pendingTaskConfirmation) {
			if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
				await this.performRoll(this.pendingTaskConfirmation);
				this.pendingTaskConfirmation = null;
				return;
			} else if (input.toLowerCase() === 'n' || input.toLowerCase() === 'no') {
				gameState.addToHistory('You chose not to roll the dice.', 'system');
				this.pendingTaskConfirmation = null;
				return;
			}
		}

		// Handle special commands
		if (input.toLowerCase() === 'info') {
			this.displayInfo();
			return;
		} else if (input.toLowerCase() === 'quit') {
			gameState.addToHistory('Thanks for playing!', 'system');
			gameState.addToHistory('Refresh the page to start a new game.', 'system');
			return;
		}

		// Analyze action to see if it requires a skill check
		try {
			const analysis = await aiService.analyzeAction(input, get(gameState).player);

			if (analysis.Task) {
				// This is a task that requires a skill check
				await this.handleTaskAction(input, analysis);
			} else {
				// Regular narrative response
				const response = await aiService.generateBasicResponse(input, get(gameState));
				gameState.addToHistory(response, 'narration');
			}
		} catch (error) {
			console.error('Error processing action:', error);
			gameState.addToHistory(
				'Something went wrong with the magical forces. Please try again.',
				'system'
			);
		}
	}

	async handleTaskAction(input, taskInfo) {
		const { Description, Trait, Difficulty, Danger } = taskInfo;
		const playerTraitValue = get(gameState).player.traits[Trait];

		const confirmMessage = `You are trying to ${Description} which will require you to roll a ${Difficulty} for ${Trait}
    ${Danger ? 'This is a dangerous task!' : ''}
    (You have ${playerTraitValue} and can add that to your roll). Roll dice? (y/n)`;

		gameState.addToHistory(confirmMessage, 'system');

		// Store task info for when user confirms
		this.pendingTaskConfirmation = taskInfo;
	}

	async performRoll(taskInfo) {
		const { Description, Trait, Difficulty, Danger } = taskInfo;
		const playerTraitValue = get(gameState).player.traits[Trait];

		const rollResult = rollDice(10);
		gameState.addToHistory(`Rolling the dice...`, 'system');
		gameState.addToHistory(`You rolled a ${rollResult} + ${playerTraitValue}.`, 'system');

		// Update danger if task is dangerous
		if (Danger) {
			const newDanger = get(gameState).player.danger + 1;
			gameState.updateDanger(newDanger);
			gameState.addToHistory(
				`You gained a point of danger. Your danger level is now ${newDanger}.`,
				'system'
			);
		}

		// Check for success/failure and serious trouble
		const totalRoll = rollResult + playerTraitValue;
		const inSeriousTrouble = rollResult <= get(gameState).player.danger;

		const taskResultData = {
			Description,
			Danger,
			Trait,
			Difficulty,
			Roll: rollResult,
			TraitValue: playerTraitValue,
			Success: totalRoll >= Difficulty,
			SeriousTrouble: inSeriousTrouble
		};

		const taskResponse = await aiService.generateTaskResponse(
			taskInfo,
			taskResultData,
			get(gameState)
		);
		gameState.addToHistory(taskResponse, 'narration');

		// Check for game over
		if (
			(taskResultData.Success && taskResultData.SeriousTrouble) ||
			(!taskResultData.Success && taskResultData.SeriousTrouble)
		) {
			// Game over logic
			gameState.addToHistory(
				'GAME OVER - You found yourself in a perilous situation - dead, trapped, lost, or captured. The story ends here.',
				'system'
			);
			gameState.addToHistory('Refresh the page to start a new game.', 'system');
			return true; // Game is over
		}

		return false; // Game continues
	}

	displayInfo() {
		const state = get(gameState);
		gameState.addToHistory('Game Information:', 'system');
		gameState.addToHistory(`Player Name: ${state.player.name}`, 'system');
		gameState.addToHistory(`Animal: ${state.player.animal}`, 'system');
		gameState.addToHistory(`Traits: ${JSON.stringify(state.player.traits)}`, 'system');
		gameState.addToHistory(`Spell: ${state.player.spell}`, 'system');
		gameState.addToHistory(`Danger Level: ${state.player.danger}`, 'system');
		gameState.addToHistory(`Witch-Hunter Description: ${state.witchHunter}`, 'system');
		gameState.addToHistory(`Village Description: ${state.village}`, 'system');
	}
}

export const gameService = new GameService();
