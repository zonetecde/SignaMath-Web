<script lang="ts">
	import Solver from '../api/Solver';
	import Solution from '../models/solution';

	export let functionName: string;
	export let variableName: string;
	export let formula: string;

	$: solutions = Solver.solveEquation(formula, variableName);
</script>
