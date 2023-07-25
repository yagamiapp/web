<script lang="ts">
	import Default from '$lib/assets/icons/white.svg';

    export let title: string;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="centre_narrow">
    <section id="home" />
    <div class="wrap">
        <div class="top">
            <a href="/"><img src={Default} alt="" class="icon" /></a>
            <slot name="top" />
        </div>
        
        <slot />
    </div>
</div>

<style>
    .centre_narrow {
        width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
    }

    #home {
		position: absolute;
		top: 0;
		left: 0;
	}
	.wrap {
		margin-top: 50px;
		width: 95%;
		max-width: 1000px;
		background-color: var(--bg2);
	}

	.top {
		position: relative;
		height: 60px;
	}
	.lightmode .top .icon {
		opacity: 1;
	}
	.top .icon {
		height: 60%;
		padding: 1.125%;
		opacity: 0.25;
	}

    .top > :global(div) {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
    }

	.wrap :global(section) {
        /* Relative positioning allows absolute positioning of child elements */
        position: relative;
        padding: 20px;
        z-index: 1;
    }
    .wrap :global(section:nth-child(2n)) {
        background-color: var(--bg2);
    }
    .wrap :global(section:nth-child(2n+1)) {
        background-color: var(--bg3);
    }

	@media screen and (max-width: 600px) {
		.wrap {
			margin-top: 0px;
			width: 100%;
			font-size: 0.7em;
		}
		.top .icon {
			height: 60%;
			padding: 3%;
			opacity: 0.25;
		}
	}
</style>
