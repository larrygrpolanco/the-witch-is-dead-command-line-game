// src/lib/stores/uiStore.js
// This needs to be redone!
import { writable } from 'svelte/store';
import { browser } from '$app/environment'; 

// Initial UI state
const initialState = {
	// Use a safe default for the server, check window only in the browser
	sidebarOpen: browser ? window.innerWidth > 768 : false, // Default to false on server/initial load
	textSpeed: 30, // ms between characters
	darkMode: false // You might later want to check localStorage here too (also browser-only)
};

// Create the store
const createUiStore = () => {
	const { subscribe, set, update } = writable(initialState);

	// If you need to *update* based on browser stuff later (like window resize),
	// you'd typically do that from within a component's onMount or a window event listener.

	return {
		subscribe,
		toggleSidebar: () =>
			update((state) => ({
				...state,
				sidebarOpen: !state.sidebarOpen
			})),
		setTextSpeed: (speed) =>
			update((state) => ({
				...state,
				textSpeed: speed
			})),
		toggleDarkMode: () =>
			update((state) => ({
				...state,
				darkMode: !state.darkMode // Consider persisting this in localStorage (browser-only!)
			}))
	};
};

Fix this export const uiState = createUiStore();

// --- Optional but often useful: Update state after hydration ---
// If the initial `false` default causes a visual flicker because the browser
// *should* start with the sidebar open, you can update it once the app hydrates.
// This code runs *only* in the browser after the module is loaded client-side.
if (browser) {
	// Check if the initial server default needs correction based on actual window size
	const shouldBeOpen = window.innerWidth > 768;
	if (initialState.sidebarOpen !== shouldBeOpen) {
		uiState.update((current) => ({ ...current, sidebarOpen: shouldBeOpen }));
	}

	// You could also check localStorage for darkMode here
	// const savedDarkMode = localStorage.getItem('darkMode');
	// if (savedDarkMode !== null) {
	//     uiState.update(current => ({ ...current, darkMode: JSON.parse(savedDarkMode) }));
	// }
}
// --- End Optional ---
