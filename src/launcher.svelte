<script lang="ts">
import Theme from "./theme/theme.svelte";
import Button from "@smui/button"
import Textfield from "@smui/textfield";

type PluginKind = "editor" | "menu" | "validator";
const menuPosition = ["top", "middle", "bottom"] as const;
type MenuPosition = (typeof menuPosition)[number];

export const pluginIcons: Record<PluginKind | MenuPosition, string> = {
	editor: 'tab',
	menu: 'play_circle',
	validator: 'rule_folder',
	top: 'play_circle',
	middle: 'play_circle',
	bottom: 'play_circle',
}

type Plugin = {
	name: string;
	author?: string;
	src: string;
	icon?: string;
	kind: PluginKind;
	requireDoc?: boolean;
	position?: MenuPosition;
	installed: boolean;
	official?: boolean;
};

function storedPlugins(): Plugin[] {
	return JSON.parse(localStorage.getItem("plugins") ?? "[]", (key, value) => value) as Plugin[];
}

let searchFilter = $state("");

function filterSearchResults(plugin: Plugin, filter: string): boolean {
	const search = filter.toLowerCase();

	const foundName = plugin.name.toLowerCase().includes(search);
	let foundAuthor = false;

	if (plugin.author) {
		foundAuthor = plugin.author.toLowerCase().includes(search);
	}

	return foundName || foundAuthor;
}

// Prevent Plugin Store itself from showing up in search results.
function filterSelf(plugin: Plugin): boolean {
	return plugin.name !== "Launcher" && plugin.name !== "Plugin Launcher";
}

let plugins = $state(storedPlugins());
let filteredPlugins = $derived(plugins
	.filter((plugin) => filterSearchResults(plugin, searchFilter))
	.filter((plugin) => filterSelf(plugin)))

function getPluginIcon(plugin: Plugin) {
    return plugin.icon || pluginIcons[plugin.kind];
}
</script>

<Theme>
    <launcher>
        <launcher-toolbar>
            <Textfield
                label={"Search"}
                variant={"outlined"}
                bind:value={searchFilter}
            />
        </launcher-toolbar>
        <launcher-grid>
            {#each filteredPlugins as plugin}
                <plugin-item>
                    <Button variant="raised" class="plugin-item--button">
                        <mwc-icon class="plugin-item--icon">{getPluginIcon(plugin)}</mwc-icon> 
                    </Button>
                    {plugin.name}
                </plugin-item>
            {/each}
        </launcher-grid>
    </launcher>
</Theme>

<style>
    launcher {
        display: flex;
        justify-content: center;
        padding: 2em;
    }

    launcher-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 12em);
        gap: 1em;
        row-gap: 1.5em;
        width: 100%;
        justify-content: center;
    }

    plugin-item {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 11em;

        text-align: center;
    }

    .plugin-item--icon {
        transform: scale(125%);
    }

    :global(.mdc-button--raised.mdc-ripple-upgraded.plugin-item--button) {
        height: 5em;
    }
</style>