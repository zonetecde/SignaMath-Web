<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import MathsExt from '../extensions/mathsExt';
	import Choix from '../models/choix';
	import SaisieFonction from './SaisieFormule.svelte';
	import TableauDeSigne from './Tableau.svelte';
	//@ts-ignore
	import DomToImage from 'dom-to-image';

	const dispatch = createEventDispatcher();

	let formula: string = 'x^2 - 4x';
	let functionName: string = 'f';
	let variableName: string = 'x';

	let borneMin: string = '-inf';
	let borneMax: string = '+inf';

	let toggleConfigVisibility: boolean = true;

	let scale: number;

	onMount(() => {
		if (window.innerWidth < 768) {
			scale = 1.5; // Sur mobile
		} else {
			scale = 1;
		}
	});

	const variableNameChanged = (e: CustomEvent<any>) => {
		formula = formula.replaceAll(variableName, e.detail);

		variableName = e.detail;
	};

	const functionChanged = (e: CustomEvent<any>) => {
		formula = e.detail;
	};

	const functionNameChanged = (e: CustomEvent<any>) => {
		functionName = e.detail;
	};

	const borneMaxChanged = (e: CustomEvent<any>) => {
		borneMax = e.detail;
	};

	const borneMinChanged = (e: CustomEvent<any>) => {
		borneMin = e.detail;
	};

	let choix: Choix = Choix.Variation;

	// La formule utilisé dans le tableau,
	// Si on veut étudier des variations, on dérive la formule de base
	// Cette formule est utilisé partout sauf dans le tableau de variation pour calculer les solutions
	$: formuleTableau = choix === Choix.Tableau ? formula : MathsExt.Deriver(formula, variableName);

	/**
	 * Télécharge le tableau
	 */
	function downloadTab() {
		var node = document.getElementById('tableau-de-signe')!;

		var scale = 2;

		DomToImage.toPng(node, {
			width: node.clientWidth * scale,
			height: node.clientHeight * scale,
			style: {
				transform: 'scale(' + scale + ')',
				transformOrigin: 'top left'
			}
		})
			.then(function (dataUrl: string) {
				// Create an anchor element for downloading the image
				var a = document.createElement('a');
				a.href = dataUrl;
				a.download = 'tableau.png'; // Set the download attribute and specify the file name
				a.style.display = 'none';

				// Append the anchor element to the document body
				document.body.appendChild(a);

				// Trigger a click event on the anchor to initiate the download
				a.click();

				// Remove the anchor element from the document
				document.body.removeChild(a);
			})
			.catch(function (error: any) {
				console.error('Oops, something went wrong!', error);
			});
	}
</script>

<div class="flex flex-col md:flex-row h-full w-full">
	<div
		class={'md:w-2/12 md:min-w-[300px] bg-[#c3aac5cb] md:h-full flex justify-center flex-col relative ' +
			(toggleConfigVisibility ? 'visible' : 'hidden')}
	>
		<form class=" p-3 flex flex-col">
			<fieldset id="group">
				<div>
					<div>
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

					<SaisieFonction
						on:handleFunctionNameChanged={functionNameChanged}
						on:handleVariableNameChanged={variableNameChanged}
						on:handleFunctionChanged={functionChanged}
						{variableName}
						{functionName}
						{formula}
					/>

					{#if formula !== MathsExt.Simplifier(formula)}
						<div class="mt-2 w-full flex justify-end">
							<button
								class=" px-3 text-base py-1 rounded-xl bg-purple-300 border-2 border-purple-500"
								on:click={() => {
									formula = MathsExt.Simplifier(formula);
								}}>Simplifier</button
							>
						</div>
					{/if}
					{#if choix === Choix.Variation}
						<div class="opacity-70 mt-3">
							<p class="italic -mb-3 cursor-default">Dérivée de f(x)</p>
							<SaisieFonction
								{variableName}
								functionName={functionName + "'"}
								formula={formuleTableau}
								isDisabled={true}
							/>
						</div>
					{/if}
				</div>
			</fieldset>
		</form>

		<label class="mx-5 mt-0 md:mt-3 mb-1 md:mb-2" for="scale"> Taille du tableau </label>

		<input type="range" class="mx-5" bind:value={scale} min="1" max="3" step="0.05" id="scale" />

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
				<SaisieFonction
					on:handleFunctionNameChanged={functionNameChanged}
					on:handleVariableNameChanged={variableNameChanged}
					on:handleFunctionChanged={functionChanged}
					{variableName}
					{functionName}
					{formula}
				/>
			</div>
		{/if}
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
	</div>
</div>
