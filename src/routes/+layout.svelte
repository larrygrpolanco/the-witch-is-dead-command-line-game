<script>
  import { onMount } from 'svelte';
  import { initGame } from '../lib/services/gameService';
  import { gameState } from '../lib/stores/gameStore';
  import { uiState } from '../lib/stores/uiStore';
  
  // Initialize the game on mount
  onMount(() => {
    initGame();
    
    // Check for saved game state in localStorage
    const savedGameState = localStorage.getItem('witch-game-state');
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState);
        gameState.set(parsedState);
      } catch (error) {
        console.error('Error loading saved game state:', error);
      }
    }
    
    // Check for saved UI preferences
    const savedUIState = localStorage.getItem('witch-ui-state');
    if (savedUIState) {
      try {
        const parsedUIState = JSON.parse(savedUIState);
        uiState.set(parsedUIState);
      } catch (error) {
        console.error('Error loading saved UI state:', error);
      }
    }
    
    // Save game state when it changes
    const unsubscribeGame = gameState.subscribe(state => {
      if (state.currentLocation) { // Only save if the game is initialized
        localStorage.setItem('witch-game-state', JSON.stringify(state));
      }
    });
    
    // Save UI preferences when they change
    const unsubscribeUI = uiState.subscribe(state => {
      localStorage.setItem('witch-ui-state', JSON.stringify(state));
    });
    
    return () => {
      unsubscribeGame();
      unsubscribeUI();
    };
  });
  
  // Handle dark mode
  $: if ($uiState) {
    if ($uiState.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
</script>

<div class="app">
  <main>
    <slot />
  </main>
</div>

<svelte:head>
  <title>The Witch is Dead - Interactive Fiction Game</title>
</svelte:head>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', monospace;
    background-color: #f0f0f0;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
  }
  
  :global(body.dark-mode) {
    background-color: #111;
    color: #f0f0f0;
  }
  
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .app {
      padding: 2rem;
    }
  }
  
  /* Add a webfont if one exists */
  @font-face {
    font-family: 'HanddrawnFont';
    src: url('/fonts/handdrawn-font.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  :global(.handdrawn) {
    font-family: 'HanddrawnFont', cursive;
  }
</style>