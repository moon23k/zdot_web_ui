import { writeFileSync } from "node:fs";
import { sections } from "../src/renderer/registry";
import { templateHome } from "../src/templates";

const manifest = { kinds: Object.keys(sections).sort(), home: templateHome() };

writeFileSync(new URL("../manifest.json", import.meta.url), JSON.stringify(manifest, null, 2) + "\n");
