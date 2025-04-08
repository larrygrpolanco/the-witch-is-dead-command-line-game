<script>
	import { gameState } from '$lib/stores/gameStore.js';
	import { fly } from 'svelte/transition';

	export let compact = false; // For mobile view

	$: player = $gameState.player;
	$: witchHunter = $gameState.witchHunter;
	$: village = $gameState.village;
</script>

<div class="stats-panel" class:compact transition:fly={{ x: compact ? -100 : 0 }}>
	<div class="character-info">
		<h3>{player.name} the {player.animal}</h3>
		<div class="traits">
			<h4>Traits:</h4>
			<ul>
				{#each Object.entries(player.traits) as [trait, value]}
					<li><span>{trait}:</span> {value}</li>
				{/each}
			</ul>
		</div>
		<div class="spell">
			<h4>Spell:</h4>
			<p>{player.spell}</p>
		</div>
		<div class="danger">
			<h4>Danger Level:</h4>
			<p class="danger-level">{player.danger}</p>
		</div>
	</div>

	<div class="game-info">
		<h4>Witch Hunter:</h4>
		<p>{witchHunter}</p>

		<h4>Village:</h4>
		<p>{village}</p>
	</div>
</div>

<style>
	.stats-panel {
		background: #f5f1e8;
		padding: 1rem;
		border-left: 2px solid #a89e8a;
		font-family: 'HanddrawnFont', cursive;
		width: 300px;
	}

	.compact {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
		width: 85%;
		max-width: 300px;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
	}

	.danger-level {
		font-size: 1.5rem;
		font-weight: bold;
		color: crimson;
	}

	/* Additional styling */
</style>
