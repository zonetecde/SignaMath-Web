<script lang="ts">
	// @ts-nocheck
	import { Toaster } from 'svelte-sonner';

	import Designer from '../components/Designer.svelte';
	import Icon from '$lib/assets/icon.png';
	import CommentForm from '../components/about/CommentForm.svelte';
	import { onMount } from 'svelte';

	let isInfoShown = false;

	onMount(() => {
		const visited = window.localStorage.getItem('visited') !== null;

		if (!visited) {
			// first visite : on montre le panneau d'informations
			isInfoShown = true;
		}

		window.localStorage.setItem('visited', true);
	});

	/**
	 * Toggle the visibility of the infos
	 */
	function toggleShowInfo() {
		isInfoShown = !isInfoShown;
	}
</script>

<Toaster />

<div class="w-screen h-full bg-[#f6effa] overflow-hidden">
	<Designer on:showInfo={toggleShowInfo} {isInfoShown} />

	<div
		class={'absolute top-0 left-0 w-full h-full bg-black duration-200 ' +
			(isInfoShown ? 'scale-100  bg-opacity-60' : 'scale-0  bg-opacity-0')}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="flex justify-center items-center h-full"
			id="bg"
			on:click={(e) => {
				if (e.target.id === 'bg') toggleShowInfo();
			}}
		>
			<div
				class="text-sm md:text-base lg:text-lg max-h-[80%] overflow-y-auto w-11/12 md:w-8/12 bg-white p-3 md:p-10 rounded-2xl border-2 border-gray-700 shadow-2xl shadow-black relative"
			>
				<div class="text-3xl font-bold text-center flex flex-row items-center justify-center -mt-2">
					<img src={Icon} class="w-14 mb-2" alt="Logo du site" /><span class="ml-3 mr-7"
						>SignaMath</span
					>
				</div>
				<h2 class="text-lg text-center mt-2">Le générateur de tableaux incontournable</h2>

				<p class="mt-10 leading-6">
					SignaMath est un site internet permettant de dresser des tableaux de signes et de
					variations afin d'étudier les signes ou les variations d'une fonction.<br />
					Entrez une formule dans la zone de saisie prévue à cet effet pour qu'elle soit automatiquement
					dérivée et que son tableau de variations ou de signes soit dressé.<br /> Pour passer du
					tableau de variations au tableau de signes, il faut appuyer sur le bouton radio prévu à
					cet effet.<br />
					Le site étant gratuit,
					<a href="https://www.buymeacoffee.com/zonetecde" target="_blank" class="italic underline"
						>un petit café</a
					>
					ne serait pas de refus...
					<br />
					Si vous avez besoin de vous servir de SignaMath sans connexion internet, vous pouvez soit cloner
					<a href="https://github.com/zonetecde/signamath-web" target="_blank" class="underline"
						>le repo GitHub</a
					>, soit télécharger
					<a
						href="https://github.com/zonetecde/signamath"
						target="_blank"
						download
						class="underline"
						>la version logicielle
					</a>
					(dépréciée) du site.
					<!-- <br />Pour tout commentaire ou suggestion, merci de vous référer au bouton
					<i>"Envoyer un commentaire"</i>
					ci-dessous. -->
					<br /><br />
				</p>

				<div class="w-full flex mt-2 mb-5 justify-center gap-5">
					<button
						on:click={toggleShowInfo}
						class=" w-64 py-1 bg-blue-300 hover:bg-blue-400 duration-75 rounded-lg shadow-lg border-2 border-slate-600 shadow-gray-500"
					>
						Accéder au site
					</button>
				</div>

				<p class="text-center font-bold">SignaMath 2025 - Rayane Staszewski</p>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="black"
					class="w-8 h-8 absolute top-2 right-2 cursor-pointer"
					on:click={toggleShowInfo}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
		</div>
	</div>
</div>
