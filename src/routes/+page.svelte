<script>
  import { onMount } from 'svelte';
  import GameConsole from '../lib/components/GameConsole.svelte';
  import GameInput from '../lib/components/GameInput.svelte';
  import Sidebar from '../lib/components/Sidebar.svelte';
  import DiceRoll from '../lib/components/DiceRoll.svelte';
  import { gameState } from '../lib/stores/gameStore';
  import { uiState } from '../lib/stores/uiStore';
  
  let showDiceRoll = false;
  let rollOptions = {
    sides: 6,
    modifier: 0,
    threshold: 4,
    label: 'Test Roll'
  };
  
  function handleCommand(event) {
    const command = event.detail;
    console.log('Command received:', command);
    // The actual command processing happens in GameInput.svelte
  }
  
  function handleDiceResult(event) {
    const result = event.detail;
    console.log('Dice roll result:', result);
    showDiceRoll = false;
  }
</script>

<div class="game-container">
  <Sidebar />
  
  <div class="game-main">
    <header class="game-header">
      <h1>The Witch is Dead</h1>
      <div class="controls">
        <button on:click={() => uiState.update(state => ({ ...state, darkMode: !state.darkMode }))}>
          {$uiState.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button on:click={() => uiState.update(state => ({ ...state, textSpeed: state.textSpeed === 30 ? 10 : 30 }))}>
          {$uiState.textSpeed === 30 ? '⚡ Fast Text' : '🐢 Normal Text'}
        </button>
      </div>
    </header>
    
    <div class="game-content">
      <GameConsole />
      
      {#if showDiceRoll}
        <div class="dice-container">
          <DiceRoll 
            sides={rollOptions.sides}
            modifier={rollOptions.modifier}
            threshold={rollOptions.threshold}
            label={rollOptions.label}
            autoRoll={false}
            on:result={handleDiceResult}
          />
        </div>
      {/if}
      
      <GameInput on:command={handleCommand} />
    </div>
  </div>
</div>

<style>
  .game-container {
    display: flex;
    gap: 1rem;
    height: calc(100vh - 4rem);
  }
  
  .game-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .game-header {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h1 {
    font-family: 'HanddrawnFont', cursive, fantasy;
    margin: 0;
    font-size: 2rem;
    color: #4ecdc4;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .controls {
    display: flex;
    gap: 0.5rem;
  }
  
  .controls button {
    padding: 0.5rem 0.75rem;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .controls button:hover {
    background-color: #333;
  }
  
  .game-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .dice-container {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
  
  @media (max-width: 768px) {
    .game-container {
      flex-direction: column;
      height: auto;
    }
    
    .game-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .game-content {
      min-height: 70vh;
    }
  }
</style>