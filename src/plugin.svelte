<script lang="ts">
	import { name, version } from "../package.json";
	import "./app.css"
    import Launcher from "./launcher.svelte";

	export async function run() {

	}
</script>

<Launcher/>

<input type="hidden" name="package-name" value={name} />
<input type="hidden" name="package-version" value={version} />
