<script>
	import { createEventDispatcher } from 'svelte';

	export let disabled = false;

	let inputValue = '';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (inputValue.trim() && !disabled) {
			dispatch('submit', inputValue);
			inputValue = '';
		}
	}
</script>

<div class="input-container">
	<form on:submit|preventDefault={handleSubmit}>
		<span class="prompt">></span>
		<input
			type="text"
			bind:value={inputValue}
			placeholder="What do you do next?"
			{disabled}
			autocomplete="off"
		/>
		<button type="submit" disabled={disabled || !inputValue.trim()}>Enter</button>
	</form>
</div>

<style>
	.input-container {
		padding: 1rem;
		border-top: 2px solid #a89e8a;
		background: #f5f1e8;
	}

	form {
		display: flex;
		align-items: center;
	}

	.prompt {
		font-family: 'HanddrawnFont', monospace;
		font-weight: bold;
		margin-right: 0.5rem;
		font-size: 1.2rem;
	}

	input {
		flex-grow: 1;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid #a89e8a;
		font-family: 'HanddrawnFont', monospace;
		font-size: 1rem;
	}

	button {
		background: #5c4b31;
		color: #f5f1e8;
		border: none;
		padding: 0.5rem 1rem;
		margin-left: 0.5rem;
		cursor: pointer;
		font-family: 'HanddrawnFont', sans-serif;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
