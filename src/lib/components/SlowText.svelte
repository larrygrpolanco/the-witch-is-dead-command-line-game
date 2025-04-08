<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { uiState } from '$lib/stores/uiStore.js';

	export let text = '';
	export let type = 'narration'; // narration, player, system
	export let onTaskConfirm = null; // Function to handle task confirmation

	let displayedText = '';
	let index = 0;
	let intervalId;
	let isFullyDisplayed = false;

	const dispatch = createEventDispatcher();

	// Extract task information if this message contains a task check prompt
	$: taskInfo = extractTaskInfo(text);

	$: typingSpeed = $uiState.textSpeed;

	function animateText() {
		if (index < text.length) {
			displayedText += text[index];
			index++;
		} else {
			clearInterval(intervalId);
			isFullyDisplayed = true;
		}
	}

	function skipAnimation() {
		clearInterval(intervalId);
		displayedText = text;
		isFullyDisplayed = true;
	}

	function extractTaskInfo(text) {
		// Parse task information from text if it contains a task check
		// Example pattern: "You are trying to {action} which will require you to roll a {difficulty} for {trait}"
		const taskPattern = /You are trying to (.*?) which will require you to roll a (\d+) for (\w+)/;
		const match = text.match(taskPattern);

		if (match && type === 'system') {
			const description = match[1];
			const difficulty = parseInt(match[2]);
			const trait = match[3];

			// Check if dangerous
			const isDangerous = text.includes('This is a dangerous task!');

			return {
				Description: description,
				Difficulty: difficulty,
				Trait: trait,
				Danger: isDangerous
			};
		}

		return null;
	}

	function confirmRoll() {
		if (onTaskConfirm && taskInfo) {
			onTaskConfirm(taskInfo);
		}
	}

	function handleClick() {
		if (!isFullyDisplayed) {
			skipAnimation();
		} else if (taskInfo) {
			confirmRoll();
		}
	}

	onMount(() => {
		intervalId = setInterval(animateText, typingSpeed);
		return () => clearInterval(intervalId);
	});
</script>

<div class="text-container {type}" on:click={handleClick}>
	<p>{@html displayedText}</p>

	{#if isFullyDisplayed && taskInfo && type === 'system'}
		<div class="roll-prompt">
			<button class="roll-button" on:click={confirmRoll}> Roll Dice </button>
			<button class="cancel-button" on:click={() => dispatch('cancel')}> Cancel </button>
		</div>
	{/if}
</div>

<style>
	.text-container {
		margin-bottom: 1rem;
		line-height: 1.6;
		position: relative;
	}

	p {
		margin: 0.5rem 0;
		word-break: break-word;
	}

	.narration {
		color: #3a3a3a;
	}

	.player {
		color: #2d5e8c;
		font-style: italic;
		margin-left: 1rem;
	}

	.system {
		color: #8c2d2d;
		font-weight: bold;
		background-color: rgba(245, 241, 232, 0.6);
		padding: 0.5rem;
		border-radius: 4px;
	}

	.roll-prompt {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		font-family: 'HanddrawnFont', cursive;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.roll-button {
		background-color: #5c4b31;
		color: #f5f1e8;
	}

	.cancel-button {
		background-color: #a89e8a;
		color: #fff;
	}
</style>
