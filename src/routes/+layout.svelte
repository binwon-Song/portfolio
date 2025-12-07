<script>
	import Navbar from '$lib/components/Navigation.svelte';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	let { children } = $props();
</script>

<Navbar></Navbar>
{@render children()}
