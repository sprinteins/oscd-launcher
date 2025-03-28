import Plugin from './plugin.svelte'
import { mount, unmount } from "svelte";
import { name } from "../package.json"
import type { OpenSCDPlugin } from './plugin';

export default class NewOSCDPlugin extends HTMLElement {

	private plugin?: Plugin
	private props = $state<{plugins: OpenSCDPlugin[]}>({ plugins: [],});
	
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.plugin = mount(
			Plugin, 
			{ 
				target: this.shadowRoot!,
				props: this.props,
			}
			
		);

		const style = document.createElement('style')
		style.innerHTML = globalThis.pluginStyle[name]
		this.shadowRoot.appendChild(style)
		
	}

	disconnectedCallback() {
		if (this.plugin) {
			unmount(this.plugin);
		}
	}

	private _plugins?: OpenSCDPlugin[] = []
	public set plugins(newPlugins: OpenSCDPlugin[]){
		this.props.plugins = newPlugins
	}

	public set locale(newLocale: string){
	}
	
	public set doc(newDoc: string){
	}

}


