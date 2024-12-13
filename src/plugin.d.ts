
export type OpenSCDPlugin = {
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

export type ConfigurePluginDetail = {
	name: string;
	// The API describes only 'menu' and 'editor' kinds
	// but we still use the 'validator' too, so I just use the type PluginKind
	kind: PluginKind;
	config: OpenSCDPlugin | null;
};

export type PluginKind = "editor" | "menu" | "validator";
export const menuPosition = ["top", "middle", "bottom"] as const;
export type MenuPosition = (typeof menuPosition)[number];