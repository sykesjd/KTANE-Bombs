<slot />

<style>
	:root {
		--gap: 5px;
		--background: lightgray;
		--foreground: white;
		--text-color: black;
		--light-text-color: rgb(100, 100, 100);
		--link-text-color: currentColor;
		--link-visited-text-color: currentColor;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--background: rgb(50, 50, 50);
			--foreground: rgb(30, 30, 30);
			--text-color: white;
			--light-text-color: rgb(150, 150, 150);
			--link-text-color: rgb(200, 200, 200);
			--link-visited-text-color: rgb(130, 130, 130);
		}
	}

	:global(html) {
		height: 100%;
	}

	:global(body) {
		height: 100%;
		margin: 0;
		font-family: sans-serif;
		color: var(--text-color);
		background: var(--background);
	}

	:global(#svelte) {
		height: 100%;
	}

	:global(a:link) {
		color: var(--link-text-color);
	}

	:global(a:visited) {
		color: var(--link-visited-text-color);
	}

	:global(.foreground) {
		background-color: var(--foreground);
	}

	:global(.padding) {
		padding: var(--gap);
	}

	:global(.margin) {
		margin: var(--gap);
	}
</style>
