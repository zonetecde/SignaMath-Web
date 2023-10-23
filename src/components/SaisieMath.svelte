<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Katex from 'svelte-katex';
	import { parse } from 'mathjs';

	// Style
	export let classes = '';
	export let classesInput = '';
	// Valeur par défaut de l'input (txt et katex)
	export let value = '';
	// Placeholder de la zone de saisie (valeur par défaut)
	export let placeholder = value;
	// Longueur maximale de la zone de saisie
	export let maxLength = 255;
	// Est-ce que l'utilisateur peut changer la formule ?
	export let isDisabled = false;
	// Le nom de l'event associé à l'envoie de la nouvelle formule
	export let eventName = '';
	// Nom de la variable
	export let variableName = 'x';
	// Est-ce que on rentre une formule ici ? (influence la validité)
	export let isFormula = false;
	// Valeur interdite
	export let forbidden = '';

	// Est-ce que l'utilisateur est en train d'éditer la formule ?
	let isEditing = false;

	// Prevent de trigger l'event associé à l'envoie de la nouvelle
	// saisie de l'utilisateur.
	let hasFormulaInputChanged = false;

	// La formule saisie par l'utilisateur mais au format Katex
	let katexFormula: string = value;

	// Est-ce que la formule saisie par l'utilisateur est valide ?
	let isFormulaValid: boolean = true;

	// Ref de la textarea faisant office de saisie pour la formule
	let ref: HTMLTextAreaElement;

	// A chaque fois que l'utilisateur entre une nouvelle saisie,
	// on vérifie si elle est valide en la transformant en Katex.
	// Si non, alors le texte est mis en rouge.
	$: try {
		// Converti la saisie en format Katex
		katexFormula = !isDisabled ? parse(value).toTex({ parenthesis: 'auto' }) : value;
		// Vérifie que la variable est présente
		if ((value.includes(variableName) || !isFormula) && value !== forbidden) {
			isFormulaValid = true;
		} else {
			isFormulaValid = false;
		}
	} catch {
		// La formule entrée est incorrecte
		isFormulaValid = false;
	}

	/**
	 * Envoie une première fois la formule
	 * Afin de dresser le tableau de signe de la formule
	 * mis par défaut
	 */
	onMount(() => {
		dispatch(eventName, value);
	});

	/**
	 * Affiche la saisie Katex après validation
	 * Vérifie si la saisie est vide et que la formule entrée est correcte; le
	 * cas échéant on laisse la saisie éditable pour avoir le placeholder
	 */
	const dispatch = createEventDispatcher();
	const validateInput = (e: FocusEvent | KeyboardEvent) => {
		// Permet de ne pas faire de saut de ligne
		e.preventDefault();

		// Si la saisie n'est pas vide et que la formule entrée est correcte
		if (ref.value.trim().length !== 0 && isFormulaValid) {
			isEditing = false;

			// Pas la peine d'envoyer la même saisie deux fois
			if (hasFormulaInputChanged) {
				dispatch(eventName, value);
			}
		}
		// else : le placeholder est affiché vu qu'il n'y a pas de texte
		// dans l'input
	};
</script>

{#if isEditing}
	<textarea
		class={`bg-transparent text-xs md:text-xs lg:text-lg mt-7 outline-none placeholder:text-opacity-50 resize-none ${classes} ${classesInput} ${
			!isFormulaValid ? 'text-red-500' : ''
		}`}
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
			// Permet de sélectionner le contenu de l'input si elle ne contient
			// qu'une variable ou un nom de fonction
			if (maxLength <= 3) {
				ref.setSelectionRange(0, 1);
			}
		}}
		on:blur={(e) => {
			validateInput(e);
		}}
		on:keydown={(e) => {
			// Valide l'entrée de l'utilisateur
			if (e.key === 'Enter') {
				validateInput(e);
			}
			// Indique que l'utilisateur a changé la formule
			else {
				hasFormulaInputChanged = true;
			}
		}}
		bind:this={ref}
	/>
{:else}
	<div
		class={`pb-2 pt-2.5 select-none text-xs md:text-xs lg:text-lg ${classes} ` +
			(isDisabled ? 'cursor-default ' : 'cursor-text hover:font-bold hover:text-blue-700 ')}
		on:mousedown={() => {
			if (!isDisabled) {
				isEditing = true;
				// reset la variable hasFormulaInputChanged
				// dès qu'elle passera en true ça voudrait dire que
				// l'utilisateur a changé la formule
				hasFormulaInputChanged = false;

				// Attend 20ms le temps que l'input se créé, puis lui bring le focus
				setTimeout(() => {
					if (ref) ref.focus();
				}, 20);
			}
		}}
		role="button"
		tabindex="0"
	>
		<Katex>{katexFormula}</Katex>
	</div>
{/if}
