<script lang="ts">
	import MatchCard from '$lib/components/common/cards/Match.svelte';
	import type { Match } from '@prisma/client';

	export let matches: (Match & {
		Teams: db.TeamInMatchWithMaps[];
	})[] = [];
	export let teamInMatches: db.TeamInMatchWithMatch[] = [];

	if (teamInMatches) {
		for (const teamInMatch of teamInMatches) {
			matches.push(teamInMatch.Match);
		}
	}
</script>

<div class="maps">
	{#each matches as match}
		<MatchCard {match} />
	{/each}
</div>

<style>
	.maps {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
