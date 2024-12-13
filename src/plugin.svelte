<script lang="ts">
	import { name, version } from "../package.json";
	import "./app.css"
    import Launcher from "./launcher.svelte";
    import type { Optional } from "./util";
	import type { OpenSCDPlugin } from "./plugin.d";

	type Props = {
		plugins: Optional<OpenSCDPlugin[]>
	}
	const {plugins}: Props = $props()

	$effect( () => console.log("Launcher", {plugins:plugins?.map(p => ({name:p.name, src:p.src}) )}) )

</script>

<Launcher {plugins}/>

<input type="hidden" name="package-name" value={name} />
<input type="hidden" name="package-version" value={version} />
