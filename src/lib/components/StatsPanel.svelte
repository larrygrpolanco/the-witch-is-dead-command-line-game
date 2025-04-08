<script>
  import { gameState } from '../stores/gameStore';
  
  let stats = {};
  
  // Subscribe to game state changes
  $: if ($gameState && $gameState.stats) {
    stats = $gameState.stats;
  }
</script>

<div class="stats-panel">
  <h3>Character Stats</h3>
  <div class="stats-grid">
    {#if stats.strength}
      <div class="stat">
        <span class="stat-name">Strength:</span>
        <span class="stat-value">{stats.strength}</span>
      </div>
    {/if}
    {#if stats.agility}
      <div class="stat">
        <span class="stat-name">Agility:</span>
        <span class="stat-value">{stats.agility}</span>
      </div>
    {/if}
    {#if stats.wits}
      <div class="stat">
        <span class="stat-name">Wits:</span>
        <span class="stat-value">{stats.wits}</span>
      </div>
    {/if}
    {#if stats.charm}
      <div class="stat">
        <span class="stat-name">Charm:</span>
        <span class="stat-value">{stats.charm}</span>
      </div>
    {/if}
  </div>
  
  {#if stats.health}
    <div class="health-bar">
      <span class="stat-name">Health:</span>
      <div class="bar-container">
        <div class="bar" style="width: {stats.health}%;"></div>
      </div>
      <span class="stat-value">{stats.health}%</span>
    </div>
  {/if}
  
  {#if stats.inventory && stats.inventory.length > 0}
    <div class="inventory">
      <h4>Inventory</h4>
      <ul>
        {#each stats.inventory as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .stats-panel {
    background-color: #2a2a2a;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 1rem;
    color: #f0f0f0;
  }
  
  h3 {
    margin-top: 0;
    border-bottom: 1px solid #444;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .stat {
    display: flex;
    justify-content: space-between;
  }
  
  .stat-name {
    font-weight: bold;
    color: #aaa;
  }
  
  .stat-value {
    font-family: 'Courier New', monospace;
  }
  
  .health-bar {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.5rem;
  }
  
  .bar-container {
    height: 0.75rem;
    background-color: #444;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .bar {
    height: 100%;
    background-color: #4ecdc4;
    transition: width 0.3s ease;
  }
  
  .inventory {
    margin-top: 1.5rem;
  }
  
  .inventory h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .inventory ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }
  
  .inventory li {
    padding: 0.25rem 0;
  }
</style>