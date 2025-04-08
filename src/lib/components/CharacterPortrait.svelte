<script>
  import { gameState } from '../stores/gameStore';
  
  export let character = null;
  
  let portraitSrc = '';
  let characterName = '';
  
  $: if (character) {
    portraitSrc = `/images/portraits/${character.id}.png`;
    characterName = character.name;
  } else if ($gameState && $gameState.currentCharacter) {
    portraitSrc = `/images/portraits/${$gameState.currentCharacter.id}.png`;
    characterName = $gameState.currentCharacter.name;
  }
</script>

{#if portraitSrc}
  <div class="portrait-container">
    <div class="portrait">
      <img src={portraitSrc} alt={characterName} />
    </div>
    {#if characterName}
      <div class="character-name">{characterName}</div>
    {/if}
  </div>
{/if}

<style>
  .portrait-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .portrait {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #4ecdc4;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .character-name {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #f0f0f0;
    text-align: center;
  }
</style>