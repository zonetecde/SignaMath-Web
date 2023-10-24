<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import MathsExt from '../extensions/mathsExt';
	import Choix from '../models/choix';
	import SaisieFormule from './saisie/SaisieFormule.svelte';
	import TableauDeSigne from './tds/Tableau.svelte';
	//@ts-ignore
	import DomToImage from 'dom-to-image';

	const dispatch = createEventDispatcher();

	// Formule du tableau (non dérivé)
	let formula: string = 'x ^ 2 - 4 * x';
	// Nom de la fonction
	let functionName: string = 'f';
	// Nom de la variable
	let variableName: string = 'x';

	// L'intervalle de définition de la fonction
	let borneMin: string = '-inf';
	let borneMax: string = '+inf';

	// Visibilité du panneau de configuration (sur mobile)
	let toggleConfigVisibility: boolean = true;

	// Taille du tableau
	let scale: number = 1;

	// Utile pour cacher certaines icones
	export let isInfoShown: boolean = false;

	/**
	 * Trigger lorsque la taille de la fenêtre change
	 * Permet de montrer la zone de configuration après être passé sur une fenêtre plus
	 * grande pour qu'elle ne soit pas caché à jamais
	 */
	function handleResize() {
		if (window.innerWidth < 768) {
			toggleConfigVisibility = false;
		} else {
			toggleConfigVisibility = true;
		}
	}

	/**
	 * Trigger lorsque le site est initialisé
	 */
	onMount(() => {
		// Set la taille du tableau en fonction de la taille de la fenêtre
		if (window.innerWidth < 768) {
			scale = 1.5;
		} else {
			scale = 1;
		}

		handleResize(); // Appel l'event initialement
		window.addEventListener('resize', handleResize); // Event : redimension de la fenêtre
	});

	/**
	 * L'utilisateur a entré un nouveau nom pour la variable
	 * @param e Nouveau nom
	 */
	const variableNameChanged = (e: CustomEvent<any>) => {
		// Remplace dans la formule l'ancien nom de la variable par le nouveau nom
		formula = formula.replaceAll(variableName, e.detail);
		// Remplace le nom de la variable par la nouvelle
		variableName = e.detail;
	};

	/**
	 * L'utilisateur a entré une nouvelle formule
	 * @param e La nouvelle formule
	 */
	const functionChanged = (e: CustomEvent<any>) => {
		// Remplace la formule par la nouvelle
		formula = e.detail;
	};

	/**
	 * L'utilisateur a entré un nouveau nom pour la fonction
	 * @param e Nouveau nom
	 */
	const functionNameChanged = (e: CustomEvent<any>) => {
		// Remplace l'ancien nom de la fonction par le nouveau nom
		functionName = e.detail;
	};

	/**
	 * L'utilisateur a entré un nouvel intervalle (maximum)
	 * @param e Nouvel intervalle
	 */
	const borneMaxChanged = (e: CustomEvent<any>) => {
		// Remplace l'ancien intervalle par le nouveau
		borneMax = e.detail;
	};

	/**
	 * L'utilisateur a entré un nouvel intervalle (minimum)
	 * @param e Nouvel intervalle
	 */
	const borneMinChanged = (e: CustomEvent<any>) => {
		// Remplace l'ancien intervalle par le nouveau
		borneMin = e.detail;
	};

	// Le choix de l'utilisateur entre étudier les variations d'une fonction
	// ou les signes d'une fonction
	let choix: Choix = Choix.Variation;

	// Désigne la formule utilisé dans le tableau (tout sauf le tableau de variation),
	// Si on veut étudier des variations, on dérive la formule de base
	$: formuleTableau = choix === Choix.Tableau ? formula : MathsExt.Deriver(formula, variableName);
	$: formuleTableauLaTex = MathsExt.toTex(formuleTableau);

	/**
	 * Télécharge le tableau en format image
	 */
	function downloadTab() {
		// L'élément à transformer en image
		var node = document.getElementById('tableau-de-signe')!;

		// Qualité de l'image
		var scale = 2;

		// Utilisation de DomToImage pour transformer la div en image
		DomToImage.toPng(node, {
			width: node.clientWidth * scale,
			height: node.clientHeight * scale,
			style: {
				// Set de la qualité
				transform: 'scale(' + scale + ')',
				transformOrigin: 'top left'
			}
		})
			.then(function (dataUrl: string) {
				var a = document.createElement('a');
				a.href = dataUrl;
				// Nom de l'image
				a.download = 'tableau de ' + choix + '.png';
				a.style.display = 'none';
				document.body.appendChild(a);
				// Téléchargement automatique
				a.click();
				document.body.removeChild(a);
			})
			.catch(function (error: any) {
				window.alert('Désolé ! Un problème est survenu\n\n' + error.message);
			});
	}
</script>

<div class="flex flex-col md:flex-row h-full w-full">
	<div
		class={'md:w-2/12 md:min-w-[300px] bg-[#c3aac5cb] md:h-full flex justify-center flex-col relative md:overflow-y-auto md:pt-5 ' +
			(toggleConfigVisibility ? 'visible' : 'hidden')}
	>
		<form class="px-3 flex flex-col w-full">
			<fieldset id="group" class="w-full">
				<div class="w-full">
					<div class="mt-3">
						<input
							type="radio"
							id="variations"
							name="group"
							checked
							on:change={() => (choix = Choix.Variation)}
						/>
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<label
							for="variations"
							class="text-md md:text-xl pr-10"
							on:mousedown={() => {
								document.getElementById('variations')?.click();
							}}>Étude des variations d'une fonction</label
						>

						<br />
						<input
							class="mt-5"
							type="radio"
							id="tableau"
							name="group"
							on:change={() => (choix = Choix.Tableau)}
						/>
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<label
							for="tableau"
							class="text-md md:text-xl"
							on:mousedown={() => {
								document.getElementById('tableau')?.click();
							}}>Tableau de signe d'une fonction</label
						>
					</div>

					<div class="md:max-w-[270px]">
						<SaisieFormule
							on:handleFunctionNameChanged={functionNameChanged}
							on:handleVariableNameChanged={variableNameChanged}
							on:handleFunctionChanged={functionChanged}
							{variableName}
							{functionName}
							{formula}
						/>
					</div>

					{#if formula !== MathsExt.Simplifier(formula)}
						<div class="mt-2 w-full flex justify-end">
							<button
								class="px-3 text-base py-1 rounded-xl bg-purple-300 border-2 border-purple-500"
								on:click={() => {
									formula = MathsExt.Simplifier(formula);
								}}>Simplifier</button
							>
						</div>
					{/if}
					{#if choix === Choix.Variation}
						<div class="opacity-70 mt-3 md:max-w-[280px]">
							<p class="italic -mb-3 cursor-default">Dérivée de f(x)</p>
							<SaisieFormule
								{variableName}
								functionName={functionName + "'"}
								formula={formuleTableauLaTex}
								isDisabled={true}
							/>
						</div>
					{/if}
				</div>
			</fieldset>
		</form>

		<label class="mx-5 mt-3 mb-1 md:mb-2" for="scale"> Taille du tableau </label>

		<input type="range" class="mx-5" bind:value={scale} min="0.5" max="3" step="0.05" id="scale" />

		<section id="credits" class="w-full hidden md:block mt-auto text-center">
			<a
				href="https://www.buymeacoffee.com/zonetecde"
				class="mt-auto self-center flex w-full justify-center"
				target="_blank"
				><img
					src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png"
					alt="Buy Me A Coffee"
					style="height: 40px !important;width: 150px !important;"
				/></a
			>

			<p class="text-gray-700 self-center underline-offset-2 mt-2">
				<a href="https://www.rayanestaszewski.fr" target="_blank" class="underline"
					>Rayane Staszewski</a
				>
				-
				<a target="_blank" href="https://github.com/zonetecde" class="underline">GitHub</a>
			</p>
		</section>
		<button
			class="self-center w-10/12 mt-2 md:mt-3 text-sm md:text-lg mb-2 md:mb-5 bg-violet-200 px-8 py-1 md:py-3 border-2 border-violet-600 rounded-xl hover:scale-105 duration-100 hover:bg-violet-400"
			on:click={downloadTab}>Enregistrer en tant qu'image</button
		>
	</div>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- Bouton pour toggle la visibilité de la configuration -->

	{#if !isInfoShown}
		<div
			class="absolute right-1 mt-1 visible md:hidden cursor-pointer opacity-60 z-50 flex flex-col items-center justify-center"
			on:mousedown={() => {
				toggleConfigVisibility = !toggleConfigVisibility;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="black"
				class="w-8 h-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d={toggleConfigVisibility
						? 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'}
				/>
			</svg>
			<p class="-mt-1 text-sm">{toggleConfigVisibility ? 'hide' : 'show'}</p>
		</div>
	{/if}
	<div
		class="pt-5 w-full h-full overflow-y-auto overflow-x-hidden mb-5 flex flex-col justify-center items-center relative"
	>
		<div
			class={'h-full '}
			style={`width: ${Math.abs(scale) * 100}%;  transform: scale(${1 / scale})`}
		>
			<TableauDeSigne
				{functionName}
				{variableName}
				formula={formuleTableau}
				{borneMin}
				{borneMax}
				{choix}
				formulaBase={formula}
				on:handleVariableNameChanged={variableNameChanged}
				on:handleBorneMaxChanged={borneMaxChanged}
				on:handleBorneMinChanged={borneMinChanged}
				on:handleFunctionNameChanged={functionNameChanged}
			/>
		</div>

		{#if toggleConfigVisibility === false}
			<div class="w-8/12 absolute -top-1.5 self-center">
				<SaisieFormule
					on:handleFunctionNameChanged={functionNameChanged}
					on:handleVariableNameChanged={variableNameChanged}
					on:handleFunctionChanged={functionChanged}
					{variableName}
					{functionName}
					{formula}
				/>
			</div>
		{/if}

		{#if !isInfoShown}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="darkblue"
				class={'w-8 h-8 absolute top-1.5 mt-1 left-2 md:left-auto md:right-2 opacity-50 cursor-pointer z-50 '}
				on:click={() => {
					dispatch('showInfo');
				}}
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
				/>
			</svg>
		{/if}
	</div>
</div>
