<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Katex from 'svelte-katex';

	export let classes = '';
	export let value = '';
	export let placeholder = value;
	export let maxLength = 255;
	export let isDisabled = false;
	export let isEditing = false;

	let ref: HTMLInputElement;

	const dispatch = createEventDispatcher();

	/**
	 * Affiche la saisie en format Katex
	 * Vérifie si la saisie est vide; dans ce cas
	 * on laisse la saisie éditable pour avoir le placeholder
	 */
	const validateInput = () => {
		if (ref.value.length !== 0) {
			isEditing = false;
			dispatch('valueChanged', value);
		}
		// else : le placeholder est affiché vu qu'il n'y a pas de texte
		// dans l'input
	};
</script>

{#if isEditing}
	<input
		class={`"h-full flex-grow text-xl outline-none placeholder:text-opacity-50 ${classes} "`}
		type="text"
		spellcheck="false"
		bind:value
		maxlength={maxLength}
		disabled={isDisabled}
		{placeholder}
		on:mouseup={() => {
			// Permet d'auto focus l'input lorsqu'on clique sur la div Katex
			ref.focus();
		}}
		on:focusin={() => {
			// Permet de sélectionner le contenue l'input si elle ne contient
			// qu'une variable ou un nom de fonction
			if (maxLength <= 3) {
				ref.setSelectionRange(0, 1);
			}
		}}
		on:blur={() => {
			validateInput();
		}}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				validateInput();
			}
		}}
		bind:this={ref}
	/>
{:else}
	<div
		class={`pb-2 pt-2.5 select-none ${classes} ` +
			(isDisabled ? 'cursor-default' : 'cursor-text hover:font-bold hover:text-blue-700')}
		on:mousedown={() => {
			if (!isDisabled) {
				isEditing = true;
			}
		}}
		role="button"
		tabindex="0"
	>
		<Katex>{value}</Katex>
	</div>
{/if}
