import { writable, derived } from 'svelte/store';

// Initial game state
const initialState = {
	initialized: false,
	player: {
		name: '',
		animal: '',
		traits: {},
		spell: '',
		danger: 0
	},
	witchHunter: '',
	village: '',
	twist: '',
	conversationHistory: []
};

// Create the store
const createGameStore = () => {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		initialize: () => set(initialState),
		setPlayerInfo: (name, animal, traits, spell) =>
			update((state) => ({
				...state,
				player: {
					...state.player,
					name,
					animal,
					traits,
					spell
				}
			})),
		setGameWorld: (witchHunter, village, twist) =>
			update((state) => ({
				...state,
				witchHunter,
				village,
				twist
			})),
		updateDanger: (newDanger) =>
			update((state) => ({
				...state,
				player: {
					...state.player,
					danger: newDanger
				}
			})),
		addToHistory: (message, type) =>
			update((state) => ({
				...state,
				conversationHistory: [...state.conversationHistory, { content: message, type }]
			}))
		// More methods as needed
	};
};

export const gameState = createGameStore();

// Derived store for concise game context (for AI)
export const gameContext = derived(gameState, ($state) => {
	// Format game state into context for AI
	return {
		player: $state.player,
		witchHunter: $state.witchHunter,
		village: $state.village,
		twist: $state.twist,
		// Last few conversation entries
		recentHistory: $state.conversationHistory.slice(-10)
	};
});
