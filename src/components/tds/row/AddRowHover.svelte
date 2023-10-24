<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let index: number;
	export let isTop: boolean;

	const dispatcher = createEventDispatcher();

	function handleCreateNewRow() {
		console.log(index);
		dispatcher('createNewRow', { index: index, isForbidden: true });
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="w-full h-8 bg-white flex items-center cursor-pointer" on:mousedown={handleCreateNewRow}>
	<!-- <svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6 ml-2"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg> -->
	<div class={'flex flex-row border-black ' + (isTop ? 'border-b' : 'border-t')}>
		<button class="px-3 py-1 bg-green-200">Ajouter une ligne</button>
		<button class="px-3 py-1 bg-red-200 border-r border-black"
			>Ajouter une ligne de valeur interdite</button
		>
	</div>
</div>
