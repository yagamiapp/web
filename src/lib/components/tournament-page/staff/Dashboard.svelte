<script lang="ts">
    import Default from '$lib/assets/icons/white.svg';

    export let tournament: db.FullyPopulatedTournament;
</script>

<div id="sidebar">
    <a href="/"><img src={Default} alt="" class="icon" /></a>
    <nav>
        <li><a href="/tournaments/{tournament.id}">Tournament Home</a></li>
    </nav>
</div>

<div class="content">
    <slot />
</div>

<style>
    #sidebar {
        float: left;
        width: 20%;
    }
    .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}
</style>