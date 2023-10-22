<script lang="ts">
	import MathsExt from '../extensions/mathsExt';
	import Choix from '../models/choix';
	import SaisieFonction from './SaisieFormule.svelte';
	import TableauDeSigne from './Tableau.svelte';
	import html2canvas from 'html2canvas';

	let formula: string = 'x^2 - 4x';
	let functionName: string = 'f';
	let variableName: string = 'x';

	let borneMin: string = '-inf';
	let borneMax: string = '+inf';

	let toggleConfigVisibility: boolean = true;

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
		// Get a reference to the Svelte component's root element
		const componentElement = document.getElementById('tableau-de-signe')!;

		// Create a new HTML5 Canvas
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set the canvas dimensions to match the component's dimensions
		canvas.width = componentElement.offsetWidth;
		canvas.height = componentElement.offsetHeight;

		// Draw the component's content on the canvas
		html2canvas(componentElement, { scale: 1 }).then(function (canvas) {
			// Convert the canvas to a data URL
			const dataURL = canvas.toDataURL('image/png');

			// Create a download link
			const a = document.createElement('a');
			a.href = dataURL;
			a.download = 'tableau.png'; // Set the desired file name

			// Trigger a click event to prompt the user to download the image
			a.click();
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
							class="text-md md:text-xl"
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

		<p class="mx-5 mt-5 md:visible md:text-sm text-[0px] collapse">
			Pour ajuster la taille du tableau, maintenez la touche CTRL enfoncée sur votre clavier tout en
			faisant défiler avec votre sourie
		</p>

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
			class="self-center w-10/12 -mt-5 md:mt-3 text-sm md:text-lg mb-2 md:mb-5 bg-violet-200 px-8 py-1 md:py-3 border-2 border-violet-600 rounded-xl hover:scale-105 duration-100 hover:bg-violet-400"
			on:click={downloadTab}>Enregistrer en tant qu'image</button
		>
	</div>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="absolute right-1 top-11 visible md:hidden cursor-pointer"
		on:mousedown={() => (toggleConfigVisibility = !toggleConfigVisibility)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="purple"
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
	</div>

	<div class="pt-5 w-full h-full overflow-y-auto overflow-x-hidden mb-5 flex flex-col">
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
</div>
