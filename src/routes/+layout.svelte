<script lang="ts">
	import '../app.css';
	import Icon from '$lib/assets/icon.png';
	import GitHub from '$lib/assets/github.svg';
	import { toast } from 'svelte-sonner';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	function handleError(event: any) {
		toast.error('Une erreur est survenue, désolé !');
	}

	onMount(() => {
		// Vérifie si le localStorage contient la clé needWebsiteVisible
		if (localStorage.getItem('needWebsiteVisible')) {
			// Récupère la date stockée
			const date = parseInt(localStorage.getItem('needWebsiteVisible') as string);

			// Vérifie si la date est inférieure à 24h
			if (new Date().getTime() - date < 86400000) {
				// Si oui, on cache le message
				needWebsiteVisible = false;
			}
		} else {
			// Si non, on affiche le message
			needWebsiteVisible = true;
		}
	});

	let needWebsiteVisible = false;
</script>

<svelte:window on:error={handleError} />

<div class="h-screen w-screen">
	<nav
		class="bg-[#7a647c] h-12 md:h-20 flex flex-row relative items-center px-5 border-b border-gray-900 outline-b"
	>
		<div
			class="absolute left-0 right-0 px-10 py-1 h-full flex flex-row items-center justify-center gap-4 bg-gradient-to-r from-[#c3adc500] via-[#c3adc5] to-[#c3adc500]"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={Icon}
				alt="Logo du site"
				class="h-full object-contain cursor-pointer"
				on:click={() => window.location.reload()}
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<p
				class="text-black md:font-bold text-2xl md:text-3xl select-none cursor-pointer"
				on:click={() => window.location.reload()}
			>
				SignaMath
			</p>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src="palestine.jpg"
				alt="Palestine"
				class="h-3/5 object-contain cursor-pointer hover:scale-125 duration-150"
				on:click={() => {
					window.open('https://pcrf1.app.neoncrm.com/forms/general', '_blank');
				}}
			/>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={GitHub}
				alt="GitHub logo"
				class="absolute opacity-60 right-2 md:right-5 w-8 md:w-12 cursor-pointer"
				on:click={() => window.open('https://github.com/zonetecde/signamath-web')}
			/>
		</div>
	</nav>

	<div class="h-full -mt-12 pt-12 md:-mt-20 md:pt-20">
		<slot />
	</div>
</div>

{#if needWebsiteVisible}
	<div class="bg-[#21633e] bg-opacity-75 border-[#235f48] border-t-2 w-full h-16 absolute bottom-0">
		<div class="flex items-center justify-center h-full w-full relative">
			<p>
				Besoin <b>d'un site internet professionnel</b> pour votre activité et <b>à petit prix</b> ?
				Retrouvez-moi sur
				<a href="https://rayanestaszewski.fr" target="_blank" class="text-blue-950"
					>rayanestaszewski.fr</a
				> !
			</p>
		</div>

		<button
			class="top-1 right-1 absolute"
			on:click={() => {
				needWebsiteVisible = false;

				// Store pendant 24h dans le localStorage
				localStorage.setItem('needWebsiteVisible', new Date().getTime().toString());
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="black"
				class="size-6 bg-white bg-opacity-30 rounded-full border border-black"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}
