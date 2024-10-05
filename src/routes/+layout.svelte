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
		// Vérifie si le localStorage contient la clé signamathdonation
		if (localStorage.getItem('signamathdonation')) {
			// Récupère la date stockée
			const date = parseInt(localStorage.getItem('signamathdonation') as string);

			// Vérifie si la date est inférieure à 24h
			if (new Date().getTime() - date < 86400000) {
				// Si oui, on cache le message
				signamathdonation = false;
			}
		} else {
			// Si non, on affiche le message
			signamathdonation = true;
		}
	});

	let signamathdonation = false;
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
				class="text-black md:font-bold text-2xl md:text-3xl select-none cursor-pointer text-center leading-5"
				on:click={() => window.location.reload()}
			>
				SignaMath
			</p>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- <img
				src="palestine.jpg"
				alt="Palestine"
				class="h-3/5 object-contain cursor-pointer hover:scale-125 duration-150"
				on:click={() => {
					window.open('https://pcrf1.app.neoncrm.com/forms/general', '_blank');
				}}
			/> -->

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

{#if signamathdonation}
	<div
		class="bg-[#c9aa9f] bg-opacity-90 border-[#5f4523] border-y-2 py-20 w-full h-16 absolute bottom-1/2"
	>
		<div class="flex items-center justify-center h-full w-full relative text-center">
			<p>
				<strong>SignaMath risque de bientôt fermer !</strong><br />Développer ce site internet et
				payer l'hébergement devient compliqué pour moi, qui ne suis qu'un étudiant. Pour permettre à
				SignaMath de continuer à exister, faites un don sur
				<a href="https://ko-fi.com/I2I6ZLAM3" class="text-blue-800 underline">Ko-fi</a> !
			</p>
		</div>

		<button
			class="top-1 right-1 absolute"
			on:click={() => {
				signamathdonation = false;

				// Store pendant 24h dans le localStorage
				localStorage.setItem('signamathdonation', new Date().getTime().toString());
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
