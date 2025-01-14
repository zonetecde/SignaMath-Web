<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Katex from 'svelte-katex';
	import { parse } from 'mathjs';
	import { toast } from 'svelte-sonner';
	import { functionNameHook, variableNameHook } from '$lib';

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
	// Valeur interdite
	export let forbidden: string[] = [];
	// Uniquement les lettres sont autorisées ?
	export let onlyAllowLetter: boolean = false;

	// Est-ce que l'utilisateur est en train d'éditer la formule ? (bring focus when added)
	let isEditing: boolean;

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
		if (
			forbidden.includes(value.trim()) === false &&
			((onlyAllowLetter && /^[a-zA-Z']+$/.test(value)) || !onlyAllowLetter)
		) {
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
		//dispatch(eventName, value.trim()); TODO: remettre si ça ne marche pas
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
				dispatch(
					eventName,
					value
						.replaceAll('()', '')
						.replaceAll('Cos', 'cos')
						.replaceAll('Sin', 'sin')
						.replaceAll('Tan', 'tan')
				);
			}
		} else if (forbidden.includes(value.trim())) {
			switch (value.trim()) {
				case 'i':
					toast.error("Le nom de variable 'i' est réservé à l'imaginaire");
					break;
				case 'e':
					toast.error("Le nom de variable 'e' est réservé à l'exponentielle");
					break;
				default:
					toast.error("Le nom de variable saisi n'est pas autorisé.");
					break;
			}
		} else if (onlyAllowLetter && /^[a-zA-Z']+$/.test(value)) {
			toast.error('Uniquement les lettres sont autorisées.');
		} else {
			// else : le placeholder est affiché vu qu'il n'y a pas de texte
			// dans l'input
			toast.error('Veuillez saisir une formule valide.');
		}
	};

	function handleUserClickOnFormula(
		event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
	) {
		if (event.button === 0) {
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
		} else if (event.button === 2) {
			event.preventDefault();

			const clipboard = navigator.clipboard;
			clipboard.writeText($functionNameHook + '(' + $variableNameHook + ') = ' + katexFormula);

			toast.success('Formule LaTex copiée dans le presse-papier');
		}
	}
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
		on:mousedown={handleUserClickOnFormula}
		role="button"
		tabindex="0"
	>
		<Katex>{katexFormula}</Katex>
	</div>
{/if}
