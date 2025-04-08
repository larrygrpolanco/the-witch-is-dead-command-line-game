<script>
  import { createEventDispatcher } from 'svelte';
  import { gameState } from '../stores/gameStore';
  import { uiState } from '../stores/uiStore';
  import { processCommand } from '../services/gameService';
  
  const dispatch = createEventDispatcher();
  
  let inputValue = '';
  let inputPlaceholder = 'Enter your command...';
  let isDisabled = false;
  
  // Update UI state when game state changes
  $: if ($gameState) {
    isDisabled = $gameState.waitingForInput === false;
    if ($gameState.inputPlaceholder) {
      inputPlaceholder = $gameState.inputPlaceholder;
    }
  }
  
  function handleSubmit() {
    if (inputValue.trim() === '' || isDisabled) return;
    
    dispatch('command', inputValue);
    processCommand(inputValue);
    inputValue = '';
    
    // Disable input temporarily while processing the command
    isDisabled = true;
    setTimeout(() => {
      if ($gameState.waitingForInput !== false) {
        isDisabled = false;
      }
    }, 500);
  }
</script>

<div class="game-input">
  <form on:submit|preventDefault={handleSubmit}>
    <input
      type="text"
      bind:value={inputValue}
      placeholder={inputPlaceholder}
      disabled={isDisabled}
      autocomplete="off"
    />
    <button type="submit" disabled={isDisabled || inputValue.trim() === ''}>
      Enter
    </button>
  </form>
</div>

<style>
  .game-input {
    margin-top: 1rem;
  }
  
  form {
    display: flex;
    gap: 0.5rem;
  }
  
  input {
    flex: 1;
    padding: 0.75rem;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    color: #f0f0f0;
    font-family: 'Courier New', monospace;
  }
  
  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  button {
    padding: 0.75rem 1.25rem;
    background-color: #4ecdc4;
    border: none;
    border-radius: 4px;
    color: #1a1a1a;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #33b8b8;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>