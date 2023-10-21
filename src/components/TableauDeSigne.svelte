<script lang="ts">
	import Solver from '../api/solver';
	import Solution from '../models/solution';
	import Header from './tds/Header.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';

	export let borneMin: string = '-inf';
	export let borneMax: string = '+inf';

	// Calcul des solutions à chaque fois que la formule est modifiée
	$: solutions = Solver.solveEquation(formula, variableName);
	// Prend uniquement les solutions dans l'interval demandé
	$: inRangeSolutions = solutions.filter((solution) => {
		return (
			solution.integer >= Solver.toInteger(borneMin) &&
			solution.integer <= Solver.toInteger(borneMax)
		);
	});

	$: lignes = Solver.decortiquer(formula);
	$: console.log(lignes);
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="w-10/12">
		<Header
			{variableName}
			{borneMax}
			{borneMin}
			{inRangeSolutions}
			on:handleVariableNameChanged
			on:handleBorneMaxChanged
			on:handleBorneMinChanged
		/>
	</div>
</div>
