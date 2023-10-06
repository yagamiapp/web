<a href="/auth/login/osu">Login</a>

<style>
	a {
		position: relative;
		margin: 5px;
		width: 250px;
		height: 60px;
		margin: 20px;
		display: grid;
		place-items: center;
		font-size: 2em;
		border-radius: 20px;
		transition: 0.3s ease;
		overflow: hidden;
		z-index: 1;
		cursor: pointer;
		animation: scroll 3s ease infinite;
	}

	a:hover {
		width: 300px;
		height: 70px;
		margin: 15px;
	}

	@keyframes scroll {
		0% {
			background: #f34e87;
		}
		50% {
			background: #ffab74;
		}
		100% {
			background: #f34e87;
		}
	}
</style>
