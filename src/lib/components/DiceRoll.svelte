<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { rollDice } from '../utils/dice';
  
  export let sides = 6;
  export let modifier = 0;
  export let threshold = null;
  export let autoRoll = false;
  export let label = '';
  
  const dispatch = createEventDispatcher();
  
  let result = null;
  let rolling = false;
  let success = null;
  let animationFrames = [];
  let currentFrame = 0;
  
  onMount(() => {
    // Generate animation frames (random numbers)
    for (let i = 0; i < 10; i++) {
      animationFrames.push(Math.floor(Math.random() * sides) + 1);
    }
    
    if (autoRoll) {
      roll();
    }
  });
  
  function roll() {
    if (rolling) return;
    
    rolling = true;
    result = null;
    success = null;
    currentFrame = 0;
    
    // Animate the dice roll
    const animationInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % animationFrames.length;
    }, 50);
    
    // After animation completes, show the actual result
    setTimeout(() => {
      clearInterval(animationInterval);
      const rollResult = rollDice(sides);
      result = rollResult;
      
      // Check if the roll meets the threshold (if provided)
      if (threshold !== null) {
        const finalResult = result + modifier;
        success = finalResult >= threshold;
      }
      
      rolling = false;
      
      // Dispatch the result
      dispatch('result', {
        value: result,
        withModifier: result + modifier,
        success
      });
    }, 600);
  }
</script>

<div class="dice-roll">
  {#if label}
    <div class="roll-label">{label}</div>
  {/if}
  
  <button class="dice" on:click={roll} disabled={rolling}>
    {#if result !== null}
      <span class="result {success === true ? 'success' : success === false ? 'failure' : ''}">
        {result}
        {#if modifier !== 0}
          <span class="modifier">{modifier > 0 ? `+${modifier}` : modifier}</span>
        {/if}
      </span>
    {:else if rolling}
      <span class="rolling">{animationFrames[currentFrame]}</span>
    {:else}
      <span class="d-text">d{sides}</span>
    {/if}
  </button>
  
  {#if threshold !== null && result !== null}
    <div class="threshold">
      {result + modifier} {success ? '≥' : '<'} {threshold}
      <span class="result-text">{success ? 'Success!' : 'Failed!'}</span>
    </div>
  {/if}
</div>

<style>
  .dice-roll {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
  }
  
  .roll-label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #aaa;
  }
  
  .dice {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
    border: 2px solid #4ecdc4;
    border-radius: 8px;
    color: #f0f0f0;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  
  .dice:hover:not(:disabled) {
    background-color: #444;
    transform: scale(1.05);
  }
  
  .dice:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .rolling {
    animation: shake 0.5s infinite;
  }
  
  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .success {
    color: #4ecdc4;
  }
  
  .failure {
    color: #ff6b6b;
  }
  
  .modifier {
    font-size: 0.8rem;
    margin-top: -0.25rem;
  }
  
  .threshold {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: #aaa;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .result-text {
    font-weight: bold;
    margin-top: 0.25rem;
    color: var(--result-color, #f0f0f0);
  }
  
  .threshold .result-text:global(.success) {
    --result-color: #4ecdc4;
  }
  
  .threshold .result-text:global(.failure) {
    --result-color: #ff6b6b;
  }
  
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    50% { transform: translateX(0); }
    75% { transform: translateX(3px); }
    100% { transform: translateX(0); }
  }
</style>