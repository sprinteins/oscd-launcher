import Plugin from './plugin.svelte'
import { mount } from "svelte";
import { name } from "../package.json"

export default class NewOSCDPlugin extends HTMLElement {

	private plugin?: Plugin
	
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.plugin = mount(Plugin, {
        	target: this.shadowRoot!,
        });

		const style = document.createElement('style')
		style.innerHTML = globalThis.pluginStyle[name]
		this.shadowRoot.appendChild(style)
	}

	public run() {
		return this.plugin.run();
	}
}

