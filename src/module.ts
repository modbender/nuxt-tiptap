import { defineNuxtModule, addImports, addComponent } from "@nuxt/kit";

import { name, version } from "../package.json";

import * as allImports from "./imports";

// Module options TypeScript interface definition

export interface ModuleOptions {
  /**
   * Prefix for imported elements
   *
   * @default 'Tiptap'
   */
  prefix: string;
  /**
   * Determine if lowlight should be enabled
   *
   * @default false
   */
  lowlight?:
    | boolean
    | {
        /**
         * Languages to be loaded for highlighting
         *
         */
        // languages: string[];
      };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "tiptap",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    prefix: "Tiptap",
    lowlight: false,
  },
  async setup(options, nuxt) {
    // const { resolve } = createResolver(import.meta.url);

    const transpileModules = new Set<string>([]);

    let optionalImports: { [key: string]: any }[] = [];
    let optionalComponents: { [key: string]: any }[] = [];

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    for (const obj of allImports.defaultComposables) {
      addImports({
        as: obj.name,
        name: obj.name,
        from: obj.path,
        // _internal_install: obj.path,
      });
      transpileModules.add(obj.path);
    }

    for (const obj of allImports.defaultImports) {
      addImports({
        as: `${options.prefix}${obj.name}`,
        name: obj.name,
        from: obj.path,
        // _internal_install: obj.path,
      });
      transpileModules.add(obj.path);
    }

    for (const obj of allImports.defaultComponents) {
      addComponent({
        mode: "client",
        name: `${options.prefix}${obj.name}`,
        export: obj.name,
        filePath: obj.path,
        // _internal_install: obj.path,
      });
      transpileModules.add(obj.path);
    }

    if (!!options.lowlight && options.lowlight !== false) {
      optionalImports = [...optionalImports, ...allImports.lowlightImports];
    }

    optionalComponents = [...optionalComponents];

    for (const obj of optionalImports) {
      addImports({
        as: `${options.prefix}${obj.name}`,
        name: obj.name,
        from: obj.path,
        // _internal_install: obj.path,
      });
      transpileModules.add(obj.path);
    }

    nuxt.options.build.transpile = [
      ...nuxt.options.build.transpile,
      ...transpileModules,
    ];

    console.log("Tiptap Editor initialized")
  },
});
