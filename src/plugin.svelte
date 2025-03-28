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

</script>

<Launcher {plugins}/>

<input type="hidden" name="package-name" value={name} />
<input type="hidden" name="package-version" value={version} />
