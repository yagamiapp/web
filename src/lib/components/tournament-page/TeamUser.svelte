<script>
	export let user;
</script>

<div class="user">
	<img src={`https://s.ppy.sh/a/${user.id}`} alt="" class="pfp" />
	<div class="name">
		<img
			src={`https://osu.ppy.sh/images/flags/${user.country_code}.png`}
			alt=""
			class="country"
		/>{user.username}
	</div>
	<div>
		#{user.pp_rank.toLocaleString()}
	</div>
</div>

<style>
	.user {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 0.85em;
		min-width: 25%;
		margin: 20px 0px;
	}
	.pfp {
		width: 75px;
		height: 75px;
		border-radius: 15px;
	}

	.country {
		width: 15px;
		margin-right: 5px;
	}
</style>
