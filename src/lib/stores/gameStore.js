import { writable } from 'svelte/store';

// Initial game state
const initialState = {
  currentLocation: null,
  inventory: [],
  stats: {
    strength: 0,
    agility: 0,
    wits: 0,
    charm: 0,
    health: 100,
    inventory: []
  },
  currentCharacter: null,
  messages: [],
  waitingForInput: false,
  inputPlaceholder: 'Enter your command...'
};

// Create the writable store
export const gameState = writable(initialState);

// Helper functions for game state management can be added here
export function resetGameState() {
  gameState.set(initialState);
}

export function addToInventory(item) {
  gameState.update(state => ({
    ...state,
    stats: {
      ...state.stats,
      inventory: [...state.stats.inventory, item]
    }
  }));
}

export function removeFromInventory(item) {
  gameState.update(state => ({
    ...state,
    stats: {
      ...state.stats,
      inventory: state.stats.inventory.filter(i => i !== item)
    }
  }));
}

export function updateStat(statName, value) {
  gameState.update(state => ({
    ...state,
    stats: {
      ...state.stats,
      [statName]: value
    }
  }));
}

export function changeLocation(locationId) {
  gameState.update(state => ({
    ...state,
    currentLocation: locationId
  }));
}

export function addMessage(text, type = 'narration', speed = 30) {
  gameState.update(state => ({
    ...state,
    messages: [...state.messages, { text, type, speed }]
  }));
}
