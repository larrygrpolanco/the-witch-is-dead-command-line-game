<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { uiState } from '../stores/uiStore';
  
  export let text = '';
  export let speed = 30; // milliseconds per character
  export let instant = false;
  
  const dispatch = createEventDispatcher();
  let displayText = '';
  let intervalId;
  let currentIndex = 0;
  let isFastForward = false;
  
  $: if ($uiState && $uiState.textSpeed) {
    speed = $uiState.textSpeed;
  }
  
  onMount(() => {
    if (instant) {
      displayText = text;
      dispatch('complete');
    } else {
      startTyping();
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });
  
  function startTyping() {
    if (text.length === 0) return;
    currentIndex = 0;
    displayText = '';
    
    if (intervalId) clearInterval(intervalId);
    
    intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        displayText += text[currentIndex];
        currentIndex++;
      } else {
        clearInterval(intervalId);
        intervalId = null;
        dispatch('complete');
      }
    }, isFastForward ? 5 : speed);
  }
  
  function handleClick() {
    // Fast-forward or complete text on click
    if (intervalId) {
      if (!isFastForward) {
        // First click speeds up text
        isFastForward = true;
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          if (currentIndex < text.length) {
            displayText += text[currentIndex];
            currentIndex++;
          } else {
            clearInterval(intervalId);
            intervalId = null;
            dispatch('complete');
          }
        }, 5); // Much faster speed
      } else {
        // Second click shows all text immediately
        if (intervalId) clearInterval(intervalId);
        displayText = text;
        intervalId = null;
        dispatch('complete');
      }
    }
  }
</script>

<span class="slow-text" on:click={handleClick}>
  {#if displayText}
    {displayText}
  {:else}
    &nbsp;
  {/if}
  {#if currentIndex < text.length && !intervalId}
    <span class="cursor">_</span>
  {/if}
</span>

<style>
  .slow-text {
    cursor: pointer;
    position: relative;
    white-space: pre-wrap;
  }
  
  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: #4ecdc4;
  }
  
  @keyframes blink {
    from, to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>