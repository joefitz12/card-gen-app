

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/collection/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.fedb2f99.js","_app/immutable/chunks/index.3ce593a5.js"];
export const stylesheets = ["_app/immutable/assets/list.1835859b.css"];
export const fonts = [];
