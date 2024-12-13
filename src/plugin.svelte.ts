import Plugin from './plugin.svelte'
import { mount } from "svelte";
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

	private _plugins?: OpenSCDPlugin[] = []
	public set plugins(newPlugins: OpenSCDPlugin[]){
		console.log('set plugins', {newPlugins})
		this.props.plugins = newPlugins
	}

	public set locale(newLocale: string){
		console.log('set locale', newLocale)
	}
	
	public set doc(newDoc: string){
		console.log('set doc', newDoc)
	}

}


