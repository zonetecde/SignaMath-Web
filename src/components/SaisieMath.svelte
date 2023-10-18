<script lang="ts">
	import Katex from 'svelte-katex';

	export let classes = '';
	export let defaultValue = '';
	export let maxLength = 255;
	export let isDisabled = false;
	export let isEditing = false;
</script>

{#if isEditing}
	<input
		class={`"h-full text-xl outline-none bg-white ${classes} "`}
		type="text"
		spellcheck="false"
		bind:value={defaultValue}
		maxlength={maxLength}
		disabled={isDisabled}
		on:blur={() => {
			isEditing = false;
		}}
	/>
{:else}
	<div
		class={`bg-white h-full pt-2.5 ${classes} ` +
			(isDisabled ? 'cursor-default' : 'cursor-text hover:font-bold hover:text-blue-700')}
		on:mousedown={() => {
			isEditing = true;
		}}
		role="button"
		tabindex="0"
	>
		<Katex>{defaultValue}</Katex>
	</div>
{/if}
