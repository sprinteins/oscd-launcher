import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		cssInjectedByJsPlugin({
			styleId: process.env.npm_package_name,
            injectCodeFunction: function injectCodeCustomRunTimeFunction(
                cssCode: string, options: any) {
                if (!globalThis.pluginStyle) {
                    globalThis.pluginStyle = {}
                }
                globalThis.pluginStyle[options.styleId] = cssCode
            }
		})	
	],
	server: {
		port: 54187,
	},
	build: {
		lib: {
			entry:   "src/plugin.svelte.ts",
			fileName: "index",
			formats: ["es"],
		},
	},
})
