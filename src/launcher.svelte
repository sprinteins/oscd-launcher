
<Theme>
    <launcher bind:this={launcher}>
        <launcher-toolbar>
            <Textfield
                label={"Search"}
                variant={"outlined"}
                bind:value={searchFilter}
            />
        </launcher-toolbar>
		<plugin-content>
			<div class="mdc-typography--headline6">Editor</div>
			<plugin-grid>
				{#each editorPlugins as plugin}
				<plugin-item>
					<Button variant="raised" class="plugin-item--button" onclick={() => switchToEditorPlugin(plugin)}>
						<mwc-icon class="plugin-item--icon">{getPluginIcon(plugin)}</mwc-icon> 
					</Button>
					{plugin.name}
				</plugin-item>
				{/each}
				{#if editorPlugins.length === 0}
					<plugin-grid-text>No plugins found.</plugin-grid-text>
				{/if}
			</plugin-grid>
		</plugin-content>
		<plugin-content>
			<div class="mdc-typography--headline6">Menu</div>
			<plugin-grid>
				{#each menuPlugins as plugin}
				<plugin-item>
					<Button variant="raised" class="plugin-item--button" onclick={() => runMenuPlugin(plugin)}>
						<mwc-icon class="plugin-item--icon">{getPluginIcon(plugin)}</mwc-icon> 
					</Button>
					{plugin.name}
				</plugin-item>
				{/each}
				{#if menuPlugins.length === 0}
					<plugin-grid-text>No plugins found.</plugin-grid-text>
				{/if}
			</plugin-grid>
		</plugin-content>
    </launcher>
</Theme>


<script lang="ts">

import Theme from "./theme/theme.svelte";
import Button from "@smui/button"
import Textfield from "@smui/textfield";
import type { Optional } from "./util";
import type { PluginKind, MenuPosition, ConfigurePluginDetail, OpenSCDPlugin } from "./plugin";

type Props = {
	plugins: Optional<OpenSCDPlugin[]>
}
const {plugins: pluginsLoaded}: Props = $props()

// #region Plugin



export const pluginIcons: Record<PluginKind | MenuPosition, string> = {
	editor: 'tab',
	menu: 'play_circle',
	validator: 'rule_folder',
	top: 'play_circle',
	middle: 'play_circle',
	bottom: 'play_circle',
}


function storedPlugins(): OpenSCDPlugin[] {
	return pluginsLoaded ?? [];
	return JSON.parse(localStorage.getItem("plugins") ?? "[]", (key, value) => value) as OpenSCDPlugin[];
}

async function fetchExternalPlugins() {
    const url = "https://sprinteins.github.io/oscd-plugin-store/plugins.json";
    const response = await fetch(url);
    const data = await response.json();
    externalPlugins = data.plugins;
}

let externalPlugins: OpenSCDPlugin[] = $state([]);

fetchExternalPlugins();

function dispatchConfigurePlugin(plugin: OpenSCDPlugin, shouldDelete = false) {
	const event = new CustomEvent<ConfigurePluginDetail>(
		"oscd-configure-plugin",
		{
			bubbles: true,
			composed: true,
			detail: {
				name: plugin.name,
				kind: plugin.kind,
				config: shouldDelete ? null : plugin,
			},
		},
	);

	launcher.dispatchEvent(event);
}

function enablePlugin(plugin: OpenSCDPlugin) {
	// const {name, src} = plugin;

	// const currentPlugins = storedPlugins();
	// const wantedPlugin = currentPlugins.find((p) => p.name === name && p.src === src); 
	// if (wantedPlugin) {
	// 	wantedPlugin.installed = true;
	// }

	// plugins = combineAllPlugins(currentPlugins, externalPlugins);
	plugin.installed = true;

	dispatchConfigurePlugin(plugin);
	console.log("Enabled plugin:", plugin.name);
}

function switchToEditorPlugin(plugin: OpenSCDPlugin){
	enablePlugin(plugin); // ensure plugin is enabled
	dispatchActivateEditorTab(plugin.name, plugin.src);
}

function dispatchActivateEditorTab(name: string, src: string){
	const event = new CustomEvent("oscd-activate-editor", {
		bubbles: true,
		composed: true,
		detail: {name, src}
	});

	launcher.dispatchEvent(event);
}

function runMenuPlugin(plugin: OpenSCDPlugin){
	enablePlugin(plugin); // ensure plugin is enabled
	dispatchRunMenu(plugin.name);
}


function dispatchRunMenu(name: string){
	const event = new CustomEvent("oscd-run-menu", {
		bubbles: true,
		composed: true,
		detail: {name}
	});

	launcher.dispatchEvent(event);
}



function combineAllPlugins(local: OpenSCDPlugin[], external: OpenSCDPlugin[]): OpenSCDPlugin[] {
	const plugins = [...local];

    for (const plugin of external) {
        if (!localPlugins.some((it) => it.name === plugin.name)) {
            plugins.push(plugin);
        }
    }

	plugins.sort((a, b) => {
		if (a.author && b.author && a.author !== b.author) {
			return a.author?.localeCompare(b.author);
		}

		return a.name.localeCompare(b.name);
	});

	return plugins;
}

// #endregion Plugin

// #region UI

let launcher: Element;

let searchFilter = $state("");

function filterSearchResults(plugin: OpenSCDPlugin, filter: string): boolean {
	const search = filter.toLowerCase();

	const foundName = plugin.name.toLowerCase().includes(search);
	let foundAuthor = false;

	if (plugin.author) {
		foundAuthor = plugin.author.toLowerCase().includes(search);
	}

	return foundName || foundAuthor;
}

// Prevent Plugin Store itself from showing up in search results.
function filterSelf(plugin: OpenSCDPlugin): boolean {
	return plugin.name !== "Launcher" && plugin.name !== "Plugin Launcher";
}

let localPlugins = $state(storedPlugins());
let plugins = $derived(combineAllPlugins(localPlugins, externalPlugins))
let filteredPlugins = $derived(plugins
	.filter((plugin) => filterSearchResults(plugin, searchFilter))
	.filter((plugin) => filterSelf(plugin)))
	
let editorPlugins = $derived(filteredPlugins.filter((it) => it.kind === "editor"));
let menuPlugins = $derived(filteredPlugins.filter((it) => it.kind === "menu"));

function getPluginIcon(plugin: OpenSCDPlugin) {
    return plugin.icon || pluginIcons[plugin.kind];
}

//#endregion UI
</script>


<style>
    launcher {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2em 6em;
        gap: 3em;
    }

    launcher-toolbar {
        width: 100%; 
    }

	plugin-content {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

    plugin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(11em, 1fr));
        gap: 1em;
        row-gap: 1.5em;
    }

	plugin-grid-text {
		opacity: 60%;
	}

    plugin-item {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;

        text-align: center;
    }

    .plugin-item--icon {
        transform: scale(125%);
    }

    :global(.mdc-button--raised.mdc-ripple-upgraded.plugin-item--button) {
        height: 5em;
    }

    
</style>