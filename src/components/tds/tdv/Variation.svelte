<script lang="ts">
	import VariationCalculatedValue from './VariationCalculatedValue.svelte';

	import Solver from '../../../api/solver';
	import MathsExt from '../../../extensions/mathsExt';
	import ExpressionElement from '../../../models/expression';
	import type Solution from '../../../models/solution';
	import SaisieFonction from '../../SaisieFonction.svelte';
	import ArrowDown from '../assets/arrow_down.png';
	import ArrowUp from '../assets/arrow_up.png';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';

	export let inRangeSolutions: Solution[];
	export let signs: string[] = [];

	export let borneMax: string = '+inf';
	export let borneMin: string = '-inf';

	interface Cellule {
		value: number;
		sign: string;
		position: 'borneMax' | 'borneMin' | 'centre';
	}

	// Contient les résultats des calculs de la
	// formule entrée par l'utilisateur en remplçant x par les solutions (= valeurs du tableau de variations
	// aux extrermités des flèches)
	// {[valeur de x, resultat]}
	let values: Record<string, number> = {};
	$: {
		if (inRangeSolutions) {
			values = {};
			for (let i = -1; i < inRangeSolutions.length + 1; i++) {
				// Pour i = -1, borneMin
				// pour i > -1 et < nbre de solutions, la solution
				// pour i > nbre de solutions, borneMax
				let result;

				switch (i) {
					case -1:
						result = borneMin;
						break;
					case inRangeSolutions.length:
						result = borneMax;
						break;
					default:
						result = inRangeSolutions[i].value;
						break;
				}

				if (result !== '-inf' && result !== '+inf') {
					// Remplace x par 'result', calcul
					// et met le résultat dans le dictionnaire
					values[result] = MathsExt.roundNumber(
						Solver.formulaToInt(
							new ExpressionElement(true, false, formula, ''),
							variableName,
							result
						)
					);
				}
			}
		}
	}
</script>

<div class="h-20 lg:h-52 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieFonction
			on:handleFunctionNameChanged
			on:handleVariableNameChanged
			{functionName}
			{variableName}
		/>
	</section>

	<div class={'w-full flex flex-row text-md lg:text-3xl relative'}>
		<div class="w-full select-none flex justify-center items-center">
			<img
				src={signs[0].replace('|', '') === '+' ? ArrowUp : ArrowDown}
				alt={'Flèche vers le ' + signs[0]}
				class="w-full transform h-full object-fill"
			/>
		</div>

		<!-- Si la borneMin !== -inf, alors on calcul sa solution -->
		{#if borneMin !== '-inf'}
			<VariationCalculatedValue
				sign={signs[0] === '+' ? '-' : '+'}
				value={values[borneMin]}
				position="borneMin"
			/>
		{/if}

		{#each inRangeSolutions as solution, i}
			<!-- On cache la flèche là si la dernière flèche est du même signe, et que ce n'est pas
                une valeur interdite (flèche continue)-->
			<div class="w-full h-full relative">
				<div class="h-full select-none flex justify-center items-center relative">
					<img
						src={signs[i + 1].includes('+') ? ArrowUp : ArrowDown}
						alt={'Flèche vers le ' + signs[i + 1]}
						class="w-full transform h-full object-fill"
					/>

					<!-- Calcul la valeur de la solution -->
					{#if signs[i + 1].includes('|') === false}
						<VariationCalculatedValue sign={signs[i]} value={values[solution.value]} />
					{/if}

					<!-- Bordure de valeur interdite -->
					{#if signs[i + 1].includes('|')}
						<div class="absolute left-0 w-32 h-full border-l border-black" />
						<div class="absolute -left-1 w-32 h-full border-l border-black" />
					{/if}

					<!-- Si la borneMax !== +inf, alors on calcul sa solution -->
					{#if borneMax !== '+inf' && i === inRangeSolutions.length - 1}
						<VariationCalculatedValue
							sign={signs[signs.length - 1]}
							value={values[borneMax]}
							position="borneMax"
						/>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>