<script>
	export let match;
</script>

<div>
	{match.id}: {match.teams[0]?.data?.name} | {match.teams[0]?.score} - {match
		.teams[1]?.score}
	| {match.teams[1]?.data?.name}
</div>
