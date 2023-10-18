<script lang="ts">
	import SaisieMath from './SaisieMath.svelte';

	let equ = `x = \\frac{5}{x} `;
</script>

<div class="md:w-2/12 md:min-w-[200px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
	<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>

	<div class="h-10 mt-3 flex flex-row">
		<SaisieMath classes="text-center w-4 pl-2 rounded-l-lg" defaultValue={'f'} maxLength={1} />
		<SaisieMath classes="w-3 pl-1" defaultValue={'('} maxLength={1} isDisabled />
		<SaisieMath classes="w-4 pl-0.5" defaultValue={'x'} maxLength={1} />
		<SaisieMath classes="w-7 " defaultValue={') = '} maxLength={1} isDisabled />
		<SaisieMath classes="w-full  pl-1 rounded-r-lg" defaultValue={'x^2 - 4x'} maxLength={999} />
	</div>
</div>
