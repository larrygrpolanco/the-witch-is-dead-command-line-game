<script>
	import { onMount } from 'svelte';
	import '../app.css'; // Import global styles (this is an alternative to static/global.css)

	// You can add any global state or initialization here
	let fontsLoaded = false;

	onMount(() => {
		// This ensures the "flash of unstyled content" is minimized
		// by only showing content when fonts are loaded
		document.fonts.ready.then(() => {
			fontsLoaded = true;
		});
	});
</script>

<svelte:head>
	<!-- Preload your hand-drawn font to improve performance -->
	<link
		rel="preload"
		href="/fonts/your-handdrawn-font.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>

	<!-- Meta tags for better mobile experience -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta
		name="description"
		content="The Witch is Dead - A revenge tale where you play as a woodland animal familiar seeking vengeance for your murdered witch."
	/>

	<!-- Favicon -->
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="app-container" class:fonts-loaded={fontsLoaded}>
	<!-- Main layout wrapper -->
	<main>
		<slot />
	</main>

	<!-- Optional footer if you want game credits, etc. -->
	<footer>
		<p class="credits">
			The Witch is Dead - a game by <a
				href="https://yourwebsite.com"
				target="_blank"
				rel="noopener noreferrer">Your Name</a
			>
		</p>
	</footer>
</div>

<style>
	/* These styles apply to all pages */
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.fonts-loaded {
		opacity: 1;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	footer {
		padding: 1rem;
		text-align: center;
		font-size: 0.8rem;
		color: #8a7d68;
		background-color: #f5f1e8;
		border-top: 1px solid #a89e8a;
	}

	.credits a {
		color: #5c4b31;
		text-decoration: none;
	}

	.credits a:hover {
		text-decoration: underline;
	}

	/* Hide footer on small screens when in game */
	@media (max-height: 600px) {
		footer {
			display: none;
		}
	}
</style>
