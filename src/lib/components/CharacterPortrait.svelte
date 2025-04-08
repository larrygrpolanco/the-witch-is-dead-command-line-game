<script>
	export let animal = '';

	// Map animal types to portrait image paths
	const portraitMap = {
		Fox: '/images/portraits/fox.png',
		Cat: '/images/portraits/cat.png',
		Toad: '/images/portraits/toad.png',
		Spider: '/images/portraits/spider.png',
		Owl: '/images/portraits/owl.png',
		Hare: '/images/portraits/hare.png',
		Magpie: '/images/portraits/magpie.png',
		Crow: '/images/portraits/crow.png',
		Dog: '/images/portraits/dog.png',
		Rat: '/images/portraits/rat.png',
		default: '/images/portraits/default.png'
	};

	$: portraitSrc = animal ? portraitMap[animal] || portraitMap.default : portraitMap.default;
</script>

<div class="portrait-container">
	<img src={portraitSrc} alt="{animal} portrait" class="character-portrait" />
	{#if animal}
		<h3 class="animal-name">{animal}</h3>
	{/if}
</div>

<style>
	.portrait-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	.character-portrait {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: 3px solid #5c4b31;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.animal-name {
		margin-top: 0.5rem;
		font-family: 'HanddrawnFont', cursive;
		color: #3a3a3a;
	}
</style>
