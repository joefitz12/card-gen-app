<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { UICardTemplate } from '$lib/utils/uiCardTemplate';
	import { CardTemplate } from '$lib/models/CardTemplate';
	import { activeView, cardTemplates, menuExpanded } from '$lib/store';
	import { cardTemplate } from '$lib/api/cardTemplate';
	import { goto } from '$app/navigation';

	// convert to pixels
	let cardContainer: HTMLDivElement;
	let relativeUnit: number;

	function setRelativeUnit(cardContainer: HTMLDivElement) {
		if (!cardContainer) {
			return;
		}
		let maxCardHeight = cardContainer.clientHeight - 2 * 48;
		let maxCardWidth = cardContainer.clientWidth - 2 * 16;

		if (relativeUnit * 2.44 > maxCardWidth) {
			relativeUnit = Math.floor(maxCardWidth / 2.44);
		} else {
			relativeUnit = Math.floor(maxCardHeight / 3.43);
		}
	}

	afterUpdate(() => {
		setRelativeUnit(cardContainer);
	});

	$: {
		setRelativeUnit(cardContainer);
	}

	const card = new UICardTemplate({ ...new CardTemplate(), id: '' });

	function addNewCard() {
		cardTemplate
			.add()
			.then((id) => {
				activeView.set('template');
				goto(`/template/${id}`);
			})
			.then(() => cardTemplate.getAll())
			.then(($cardTemplates) => cardTemplates.set($cardTemplates))
			.catch((error) => console.error(error));
	}
</script>

<svelte:window on:resize={() => setRelativeUnit(cardContainer)} />

{#if card}
	<div class="flex column template-container">
		<div class="flex card-container" bind:this={cardContainer}>
			<div
				class="outer-card"
				style="--card-border-top-left-radius: {(card.border.radius.topLeft || 0) *
					relativeUnit}px;  
					--card-border-top-right-radius: {(card.border.radius.topRight || 0) * relativeUnit}px; 
					--card-border-bottom-right-radius: {(card.border.radius.bottomRight || 0) * relativeUnit}px;  
					--card-border-bottom-left-radius: {(card.border.radius.bottomLeft || 0) * relativeUnit}px; "
			>
				<div
					class="card"
					style="--card-height: {card.height * relativeUnit}px; 
					--card-width: {card.width * relativeUnit}px; 
					--card-border-color: {card.border.color}; 
					--card-border-top-width: {(card.border.width.top || 5) * relativeUnit}px; 
					--card-border-right-width: {(card.border.width.right || 5) * relativeUnit}px; 
					--card-border-bottom-width: {(card.border.width.bottom || 5) * relativeUnit}px; 
					--card-border-left-width: {(card.border.width.left || 5) * relativeUnit}px; 
					
					--card-background-color: {card.backgroundColor}; 
					--card-top-padding: {(card.padding.top || 0) * relativeUnit}px;
					--card-right-padding: {(card.padding.right || 0) * relativeUnit}px;
					--card-bottom-padding: {(card.padding.bottom || 0) * card.relativeUnit}px;
					--card-left-padding: {(card.padding.left || 0) * relativeUnit}px;
					--base-font-size: {0.22 * relativeUnit}px;
					"
				>
					<div class="flex title">
						<span data-content="card">card</span>
						<span data-content="2">2</span>
						<span data-content="table">table</span>
					</div>
					<span class="type">a Svelte application</span>
					<div class="button-container flex">
						<button type="button" on:click={addNewCard}>New card template</button>
						<button type="button" on:click={() => menuExpanded.set(true)}>Open card template</button
						>
					</div>
				</div>
				<div class="shadow" />
			</div>
		</div>
	</div>
{/if}

<style>
	.template-container {
		height: 100%;
	}

	.card-container {
		flex-grow: 1;
	}

	.outer-card {
		margin: auto auto 3rem;
		position: relative;
		border-top-left-radius: var(--card-border-top-left-radius);
		border-top-right-radius: var(--card-border-top-right-radius);
		border-bottom-right-radius: var(--card-border-bottom-right-radius);
		border-bottom-left-radius: var(--card-border-bottom-left-radius);
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		height: var(--card-height);
		width: var(--card-width);
		border-top-left-radius: var(--card-border-top-left-radius);
		border-top-right-radius: var(--card-border-top-right-radius);
		border-bottom-right-radius: var(--card-border-bottom-right-radius);
		border-bottom-left-radius: var(--card-border-bottom-left-radius);
		background-color: var(--card-background-color);
		transform-origin: top left;
		overflow: hidden;
		padding: calc(var(--base-font-size) / 4) calc(var(--base-font-size) / 2);
		box-sizing: border-box;
		z-index: 3;
	}

	.shadow {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: inherit;
		background-color: #18206f;
		background-image: linear-gradient(to right, pink 1px, transparent 2px),
			linear-gradient(to bottom, pink 2px, transparent 2px);
		/* background-image: radial-gradient(circle, pink 1px, rgba(0, 0, 0, 0) 1px); */
		background-size: 10% 10%;
		transform: rotate3d(1, 0, 0, 78deg) skew(8deg);
		transform-origin: bottom;
		z-index: 2;
	}

	.title {
		gap: 0;
		font-size: calc(var(--base-font-size) * 1.5);
		color: pink;
	}

	.type {
		font-style: italic;
		font-size: calc(var(--base-font-size) / 2);
		color: var(--color);
	}

	.button-container {
		padding-top: calc(var(--card-height) / 12);
		justify-content: space-around;
	}

	button {
		height: calc(var(--card-height) / 4);
		width: calc(var(--card-height) / 4);
		background: transparent;
		border-radius: 0.5rem;
		border: 5px solid pink;
		font-size: calc(var(--base-font-size) / 2);
		transition: transform 150ms ease-in-out;
	}

	button:hover {
		transform: scale(0.99);
		transform-origin: bottom;
	}
</style>