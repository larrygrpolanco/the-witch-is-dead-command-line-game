<script>
	import { onMount } from 'svelte';
	import { gameState } from '$lib/stores/gameStore.js';
	import { uiState } from '$lib/stores/uiStore.js';

	import GameConsole from '$lib/components/GameConsole.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import CharacterPortrait from '$lib/components/CharacterPortrait.svelte';
	import { gameService } from '$lib/services/gameService.js';

	let gameStarted = false;
	let playerName = '';
	let isMobile = false;

	function handleResize() {
		isMobile = window.innerWidth < 768;
		if (isMobile && $uiState.sidebarOpen) {
			$uiState.toggleSidebar();
		}
	}

	async function startGame() {
		if (playerName.trim()) {
			await gameService.startGame(playerName);
			gameStarted = true;
		}
	}

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>The Witch is Dead</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="game-container">
	{#if !gameStarted}
		<div class="intro-screen">
			<h1>The Witch is Dead</h1>
			<div class="scroll-container">
				<p class="intro-text">
					Once upon a time, there was a kind and wise and beautiful witch who lived in the forest
					with her familiars, and her life was peaceful and happy. Until a @&#$?& WITCH-HUNTER broke
					into her cottage and dragged her out and &#%!@?! MURDERED HER and now she's DEAD.
				</p>
				<p class="intro-text">
					But if you get revenge and kill him and bring his EYES to her corpse within a week she'll
					come back to life. Or so you've heard. Even if it doesn't work, at least he's dead.
				</p>
				<p class="intro-text">
					The Witch-Hunter has retreated to the village, the @#$%&! COWARD. Get him.
				</p>
			</div>
			<form on:submit|preventDefault={startGame}>
				<input type="text" placeholder="Enter your name" bind:value={playerName} required />
				<button type="submit">Begin Your Revenge</button>
			</form>
		</div>
	{:else}
		<div class="game-layout" class:mobile={isMobile}>
			{#if isMobile}
				<button class="toggle-stats" on:click={$uiState.toggleSidebar}>
					{$uiState.sidebarOpen ? '✕' : '☰'}
				</button>
			{/if}

			<div class="main-console">
				<GameConsole />
			</div>

			{#if $uiState.sidebarOpen || !isMobile}
				<div class="side-panel" class:mobile-panel={isMobile && $uiState.sidebarOpen}>
					<CharacterPortrait animal={$gameState.player.animal} />
					<StatsPanel compact={isMobile} />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		font-family: 'HanddrawnFont', sans-serif;
		background-color: #e9e2d0;
	}

	.game-container {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.intro-screen {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	h1 {
		font-size: 3rem;
		color: #5c4b31;
		margin-bottom: 2rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.scroll-container {
		background-image: url('/images/scroll-bg.png');
		background-size: 100% 100%;
		padding: 3rem;
		margin-bottom: 2rem;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	.intro-text {
		font-size: 1.2rem;
		line-height: 1.6;
		text-align: left;
		color: #3a3a3a;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
		margin: 0 auto;
	}

	input {
		padding: 0.75rem;
		font-size: 1.1rem;
		border: 2px solid #5c4b31;
		border-radius: 6px;
		background-color: #f5f1e8;
		font-family: 'HanddrawnFont', sans-serif;
	}

	button {
		padding: 1rem;
		font-size: 1.2rem;
		background-color: #5c4b31;
		color: #f5f1e8;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-family: 'HanddrawnFont', sans-serif;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	button:hover {
		background-color: #7d6641;
		transform: translateY(-2px);
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
	}

	.game-layout {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.main-console {
		flex-grow: 1;
		height: 100%;
		overflow: hidden;
	}

	.side-panel {
		width: 300px;
		height: 100%;
		background-color: #f5f1e8;
		border-left: 2px solid #a89e8a;
		overflow-y: auto;
		z-index: 20;
	}

	.mobile-panel {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 80%;
		max-width: 300px;
		box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
	}

	.toggle-stats {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 30;
		background: #5c4b31;
		color: #e9e2d0;
		border: none;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 767px) {
		.intro-screen {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
			margin-bottom: 1rem;
		}

		.scroll-container {
			padding: 2rem 1.5rem;
		}

		.intro-text {
			font-size: 1rem;
		}
	}
</style>
