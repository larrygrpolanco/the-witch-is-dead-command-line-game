<script>
	import { onMount } from 'svelte';
	import { gameState } from '$lib/stores/gameStore.js';
	import SlowText from '$lib/components/SlowText.svelte';
	import GameInput from '$lib/components/GameInput.svelte';
	import DiceRoller from '$lib/components/DiceRoller.svelte';
	import { gameService } from '$lib/services/gameService.js';

	let gameHistory = [];
	let isLoading = false;
	let showDiceRoller = false;
	let currentTask = null;
	let gameOutputElement;

	$: messages = $gameState.conversationHistory;
	$: if (messages.length > 0) {
		gameHistory = messages;
	}

	function handleUserInput(event) {
		const input = event.detail;
		if (!input || isLoading) return;

		isLoading = true;
		gameService
			.processPlayerAction(input)
			.then(() => {
				scrollToBottom();
				isLoading = false;
			})
			.catch((err) => {
				console.error('Error processing action:', err);
				isLoading = false;
			});
	}

	function handleTaskConfirmation(taskInfo) {
		currentTask = taskInfo;
		showDiceRoller = true;
	}

	function handleDiceResult(event) {
		const result = event.detail;
		showDiceRoller = false;

		if (currentTask) {
			gameService.performRoll({
				...currentTask,
				Roll: result.roll,
				Success: result.success
			});
			currentTask = null;
		}

		scrollToBottom();
	}

	function handleDiceCancel() {
		showDiceRoller = false;
		currentTask = null;

		gameState.addToHistory('You decided not to attempt the task.', 'system');
		scrollToBottom();
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (gameOutputElement) {
				gameOutputElement.scrollTop = gameOutputElement.scrollHeight;
			}
		}, 100);
	}

	onMount(() => {
		// Handle any subscription or event setup
	});
</script>

<div class="game-console">
	<div class="game-output" bind:this={gameOutputElement}>
		{#each gameHistory as message}
			<SlowText text={message.content} type={message.type} onTaskConfirm={handleTaskConfirmation} />
		{/each}

		{#if isLoading}
			<div class="loading">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
		{/if}
	</div>

	<GameInput on:submit={handleUserInput} disabled={isLoading || showDiceRoller} />

	<DiceRoller
		visible={showDiceRoller}
		trait={currentTask?.Trait || 'Clever'}
		traitValue={currentTask ? $gameState.player.traits[currentTask.Trait] : 0}
		difficulty={currentTask?.Difficulty || 7}
		dangerous={currentTask?.Danger || false}
		taskDescription={currentTask?.Description || ''}
		on:result={handleDiceResult}
		on:cancel={handleDiceCancel}
	/>
</div>

<style>
	.game-console {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-image: url('/images/parchment-bg.png');
		background-size: cover;
	}

	.game-output {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
		font-family: 'HanddrawnFont', monospace;
		scrollbar-width: thin;
		scrollbar-color: #a89e8a transparent;
	}

	.game-output::-webkit-scrollbar {
		width: 6px;
	}

	.game-output::-webkit-scrollbar-track {
		background: transparent;
	}

	.game-output::-webkit-scrollbar-thumb {
		background-color: #a89e8a;
		border-radius: 3px;
	}

	.loading {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}

	.dot {
		width: 8px;
		height: 8px;
		margin: 0 4px;
		background: #5c4b31;
		border-radius: 50%;
		display: inline-block;
		animation: dot-pulse 1.5s infinite ease-in-out;
	}

	.dot:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes dot-pulse {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1.2);
			opacity: 1;
		}
	}
</style>
