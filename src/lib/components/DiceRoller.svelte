<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let visible = false;
	export let trait = 'Clever';
	export let traitValue = 0;
	export let difficulty = 7;
	export let dangerous = false;
	export let taskDescription = '';

	let rolling = false;
	let diceValue = null;
	let rotateValue = 0;

	const dispatch = createEventDispatcher();

	function rollDice() {
		rolling = true;

		// Animate rolling effect
		let rolls = 0;
		const maxRolls = 10;
		const interval = setInterval(() => {
			diceValue = Math.floor(Math.random() * 10) + 1;
			rotateValue = Math.random() * 360;
			rolls++;

			if (rolls >= maxRolls) {
				clearInterval(interval);
				rolling = false;

				// Send the final result
				dispatch('result', {
					roll: diceValue,
					total: diceValue + traitValue,
					success: diceValue + traitValue >= difficulty
				});
			}
		}, 150);
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

{#if visible}
	<div class="dice-overlay" transition:fly={{ y: 200, duration: 300 }}>
		<div class="dice-container">
			<h3>Roll Challenge</h3>
			<p class="task-description">{taskDescription}</p>

			<div class="dice-info">
				<div class="trait-info">
					<span>Using <strong>{trait}</strong>: +{traitValue}</span>
				</div>
				<div class="difficulty-info">
					<span>Difficulty: <strong>{difficulty}</strong></span>
				</div>
				{#if dangerous}
					<div class="danger-warning">
						<span>⚠️ This is dangerous!</span>
					</div>
				{/if}
			</div>

			<div class="dice-display">
				{#if diceValue !== null}
					<div class="dice" style="transform: rotate({rotateValue}deg)" class:rolling>
						{diceValue}
					</div>
					<div class="result-display">
						<span>{diceValue} + {traitValue} = {diceValue + traitValue}</span>
						{#if !rolling}
							<span
								class="result-text {diceValue + traitValue >= difficulty ? 'success' : 'failure'}"
							>
								{diceValue + traitValue >= difficulty ? 'SUCCESS!' : 'FAILURE!'}
							</span>
						{/if}
					</div>
				{:else}
					<div class="empty-dice"></div>
				{/if}
			</div>

			<div class="dice-actions">
				<button class="roll-button" on:click={rollDice} disabled={rolling || diceValue !== null}>
					Roll Dice
				</button>
				<button class="cancel-button" on:click={cancel}>
					{diceValue === null ? 'Cancel' : 'Continue'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.dice-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.dice-container {
		background-color: #f5f1e8;
		border: 3px solid #5c4b31;
		border-radius: 12px;
		padding: 1.5rem;
		width: 90%;
		max-width: 400px;
		font-family: 'HanddrawnFont', cursive;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
	}

	h3 {
		text-align: center;
		margin-top: 0;
		font-size: 1.5rem;
		color: #5c4b31;
	}

	.task-description {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.dice-info {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.danger-warning {
		grid-column: span 2;
		text-align: center;
		color: #c33;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.dice-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.dice,
	.empty-dice {
		width: 80px;
		height: 80px;
		background-color: #fff;
		border: 2px solid #5c4b31;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
	}

	.rolling {
		animation: shake 0.5s infinite;
	}

	.result-display {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.result-text {
		font-size: 1.2rem;
		font-weight: bold;
		margin-top: 0.5rem;
	}

	.success {
		color: #2c7;
	}

	.failure {
		color: #c33;
	}

	.dice-actions {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-family: 'HanddrawnFont', cursive;
		font-size: 1rem;
		cursor: pointer;
		flex: 1;
	}

	.roll-button {
		background-color: #5c4b31;
		color: #f5f1e8;
	}

	.roll-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cancel-button {
		background-color: #a89e8a;
		color: #fff;
	}

	@keyframes shake {
		0% {
			transform: translate(1px, 1px) rotate(0deg);
		}
		10% {
			transform: translate(-1px, -2px) rotate(-1deg);
		}
		20% {
			transform: translate(-3px, 0px) rotate(1deg);
		}
		30% {
			transform: translate(3px, 2px) rotate(0deg);
		}
		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}
		50% {
			transform: translate(-1px, 2px) rotate(-1deg);
		}
		60% {
			transform: translate(-3px, 1px) rotate(0deg);
		}
		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}
		80% {
			transform: translate(-1px, -1px) rotate(1deg);
		}
		90% {
			transform: translate(1px, 2px) rotate(0deg);
		}
		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
</style>
