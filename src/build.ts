/**
 * Blueprint — Roam Research theme extension entry point.
 *
 * This is the **template** source file. During the build pipeline,
 * `add_css.sh` copies it to `index.ts` and appends `initCSSTheme()`,
 * which injects the compiled CSS as a `<style>` element.
 *
 * Exports `{ onload, onunload }` as a default module (Roam Depot convention).
 */
import type { OnloadArgs } from "roamjs-components/types";
import { createToggle, destroyToggle } from "./components/dm-toggle";
import { SETTING_APPEARANCE, STYLE_ELEMENT_ID, APPEARANCE_AUTO } from "./constants";
import type { ExtensionAPI } from "./types";

/** Holds the inlined Blueprint CSS, populated by the generated `initCSSTheme()`. */
const css: { [key: string]: string } = {
  blueprint: "",
};

/**
 * Injects the Blueprint CSS into the document.
 * Removes any previously injected style element first.
 */
function loadSystem() {
  const blueprintCss = document.getElementById(STYLE_ELEMENT_ID);
  if (blueprintCss) {
    blueprintCss.remove();
  }

  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = css["blueprint"];
  head.appendChild(style);
}

/**
 * Reads a Roam setting, setting a default value if it doesn't exist.
 * Returns the stored or default value.
 */
function setSettingDefault(
  extensionAPI: ExtensionAPI,
  settingId: string,
  settingDefault: string,
): string {
  const storedSetting = extensionAPI.settings.get(settingId);
  if (null == storedSetting)
    extensionAPI.settings.set(settingId, settingDefault);
  return storedSetting ?? settingDefault;
}

/**
 * Roam Depot onload hook.
 * Injects the theme CSS, initialises the appearance setting,
 * and mounts the dark/light mode toggle in the top bar.
 */
function onload({ extensionAPI }: OnloadArgs) {
  initCSSTheme();
  loadSystem();

  setSettingDefault(extensionAPI as ExtensionAPI, SETTING_APPEARANCE, APPEARANCE_AUTO);

  createToggle(extensionAPI as ExtensionAPI);
}

/**
 * Roam Depot onunload hook.
 * Removes the injected CSS and the dark/light mode toggle from the DOM.
 */
function onunload() {
  const blueprintCss = document.getElementById(STYLE_ELEMENT_ID);
  if (blueprintCss) {
    blueprintCss.remove();
  }

  destroyToggle();
}

export default {
  onload: onload,
  onunload: onunload,
};