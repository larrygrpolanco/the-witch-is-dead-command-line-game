<script>
  import { slide } from 'svelte/transition';
  import { uiState } from '../stores/uiStore';
  import StatsPanel from './StatsPanel.svelte';
  import CharacterPortrait from './CharacterPortrait.svelte';
  
  let isOpen = true;
  
  function toggleSidebar() {
    isOpen = !isOpen;
    uiState.update(state => ({
      ...state,
      sidebarOpen: isOpen
    }));
  }
</script>

<div class="sidebar-container {isOpen ? 'open' : 'closed'}">
  <button class="toggle-button" on:click={toggleSidebar}>
    {isOpen ? '›' : '‹'}
  </button>
  
  {#if isOpen}
    <div class="sidebar-content" transition:slide={{ duration: 300, axis: 'x' }}>
      <CharacterPortrait />
      <StatsPanel />
    </div>
  {/if}
</div>

<style>
  .sidebar-container {
    position: relative;
    height: 100%;
    transition: width 0.3s;
  }
  
  .sidebar-container.open {
    width: 250px;
  }
  
  .sidebar-container.closed {
    width: 30px;
  }
  
  .toggle-button {
    position: absolute;
    top: 50%;
    right: -15px;
    transform: translateY(-50%);
    width: 30px;
    height: 60px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 0 4px 4px 0;
    color: #f0f0f0;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.2s;
  }
  
  .toggle-button:hover {
    background-color: #333;
  }
  
  .sidebar-content {
    height: 100%;
    background-color: #2a2a2a;
    border-right: 1px solid #444;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
</style>