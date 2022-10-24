<script>
	import { browser } from "$app/environment";

	if (browser) {
		document.body.style.backgroundColor = "transparent";
	}
</script>

<slot />
