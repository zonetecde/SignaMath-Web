<script lang="ts">
	import type ExpressionElement from '../../../models/expression';
	import SaisieMath from '../../saisie/SaisieMath.svelte';

	export let expression: ExpressionElement;
</script>

<!-- TODO: Problème en vue mobile (clique sur une row, barre verticale non complète) -->
<section
	class="w-2/12 overflow-x-auto overflow-y-hidden -my-2.5 border-r border-black flex items-center justify-center text-lg lg:text-xl"
>
	<SaisieMath
		value={expression.Expression}
		maxLength={999}
		placeholder={(' ' + expression.Expression).slice(1)}
		eventName="handleExpressionChanged"
		on:handleExpressionChanged
		classes="text-center w-full"
	/>
</section>
