<script lang="ts">
	import Katex from 'svelte-katex';
	import type ExpressionElement from '../../models/expression';
	import type Solution from '../../models/solution';
	import SaisieMath from '../SaisieMath.svelte';
	import Solver from '../../api/solver';

	export let expression: ExpressionElement;
	export let variableName: string = 'x';
	export let inRangeSolutions: Solution[];

	const expressionChanged = (e: CustomEvent<any>) => {
		expression.Expression = e.detail;
	};

	// Tableau contenant les signes des solutions, par ordre des colonnes du tableau
	let signs: string[] = [];
	// A chaque fois que les solutions changent on recalcule les signes
	$: {
		expression; // Pour que ça soit trigger lorsque l'expression change aussi

		signs = [];
		// Le premier signe se trouve entre borneMin et la première solution
		signs.push(getSign(0));
		signs.push(
			...inRangeSolutions.map((solution, i) => {
				return getSign(i + 1);
			})
		);
	}

	/**
	 * Calcul le signe d'une cellule du tableau (d'index index)
	 * @param index L'index de la cellule
	 */
	function getSign(index: number) {
		let resultat = 0;

		if (inRangeSolutions.length === 0) {
			// signe constant
			resultat = Solver.formulaToInt(expression, variableName, 0);
		} else if (index === 0) {
			// entre borneMin et la premiere solution
			// (donc en gros juste avant la premiere solution)
			resultat = Solver.formulaToInt(
				expression,
				variableName,
				inRangeSolutions[0].integer - 0.0000001
			);
		} else {
			// entre la solution précédente et la suivante
			// (donc en gros juste apres la solution précédente)
			resultat = Solver.formulaToInt(
				expression,
				variableName,
				inRangeSolutions[index - 1].integer + 0.0000001
			);
		}

		return resultat < 0 ? '-' : '+';
	}
</script>

<div class="h-12 lg:h-16 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieMath
			value={expression.Expression}
			maxLength={999}
			placeholder={(' ' + expression.Expression).slice(1)}
			eventName="handleExpressionChanged"
			on:handleExpressionChanged={expressionChanged}
			classes="text-center w-full"
		/>
	</section>

	<div class={'w-full flex flex-row text-md lg:text-3xl font-bold'}>
		<div class="w-full select-none flex justify-center items-center">{signs[0]}</div>

		{#each inRangeSolutions as _, i}
			<div class="border-l-2 border-black w-full select-none flex justify-center items-center">
				{signs[i + 1]}
			</div>

			<!-- Met un trait, un double trait, ou un trait avec un 0 -->
		{/each}
	</div>
</div>
