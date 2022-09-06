export * from "@pixi/constants";
export * from "@pixi/math";
export * from "@pixi/runner";
export * from "@pixi/settings";
export * from "@pixi/ticker";
import * as utils from "@pixi/utils";
export { utils };
export * from "@pixi/core";
export * from "@pixi/compressed-textures";
export * from "@pixi/sprite";
export * from "@pixi/app";
export * from "@pixi/interaction";

// Renderer plugins
import { extensions } from "@pixi/extensions";

import { BatchRenderer } from "@pixi/core";
extensions.add(BatchRenderer);

import { InteractionManager } from "@pixi/interaction";
extensions.add(InteractionManager);

import { TickerPlugin } from "@pixi/ticker";
extensions.add(TickerPlugin);
