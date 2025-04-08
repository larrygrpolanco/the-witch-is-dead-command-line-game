<script>
  import { onMount } from 'svelte';
  import { gameState } from '../stores/gameStore';
  import SlowText from './SlowText.svelte';

  let consoleElement;
  let messages = [];

  // Subscribe to game state changes
  onMount(() => {
    const unsubscribe = gameState.subscribe(state => {
      if (state.messages && state.messages.length > 0) {
        messages = state.messages;
        scrollToBottom();
      }
    });

    return unsubscribe;
  });

  function scrollToBottom() {
    setTimeout(() => {
      if (consoleElement) {
        consoleElement.scrollTop = consoleElement.scrollHeight;
      }
    }, 100);
  }
</script>

<div class="game-console" bind:this={consoleElement}>
  {#each messages as message}
    <div class="message {message.type || 'narration'}">
      <SlowText text={message.text} speed={message.speed || 30} />
    </div>
  {/each}
</div>

<style>
  .game-console {
    height: 70vh;
    overflow-y: auto;
    padding: 1rem;
    background-color: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    color: #f0f0f0;
    font-family: 'Courier New', monospace;
    line-height: 1.5;
  }

  .message {
    margin-bottom: 1rem;
  }

  .narration {
    color: #f0f0f0;
  }

  .system {
    color: #ff6b6b;
    font-style: italic;
  }

  .character {
    color: #4ecdc4;
  }
</style>