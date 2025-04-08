import { writable } from 'svelte/store';

// Initial UI state
const initialState = {
  darkMode: true,
  textSpeed: 30,
  sidebarOpen: true,
  soundEnabled: true,
  volume: 0.5
};

// Create the writable store
export const uiState = writable(initialState);

// Helper functions for UI state management
export function toggleDarkMode() {
  uiState.update(state => ({
    ...state,
    darkMode: !state.darkMode
  }));
}

export function setTextSpeed(speed) {
  uiState.update(state => ({
    ...state,
    textSpeed: speed
  }));
}

export function toggleSidebar() {
  uiState.update(state => ({
    ...state,
    sidebarOpen: !state.sidebarOpen
  }));
}

export function toggleSound() {
  uiState.update(state => ({
    ...state,
    soundEnabled: !state.soundEnabled
  }));
}

export function setVolume(volume) {
  uiState.update(state => ({
    ...state,
    volume: Math.max(0, Math.min(1, volume))
  }));
}
