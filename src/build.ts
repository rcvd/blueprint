import type { OnloadArgs } from "roamjs-components/types";
import { createToggle, destroyToggle } from "./components/dm-toggle";

let css: { [key: string]: string } = {
    blueprint: ""
}

function loadSystem() {
  console.log("Loading Blueprint");

  if (document.getElementById("blueprint-css")) {
    document.getElementById("blueprint-css").remove();
  }

  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.id = "blueprint-css";
  style.textContent = css["blueprint"];
  head.appendChild(style);
}

function setSettingDefault(extensionAPI: any, settingId: any, settingDefault: any) {
  let storedSetting = extensionAPI.settings.get(settingId);
  if (null == storedSetting)
    extensionAPI.settings.set(settingId, settingDefault);
  return storedSetting || settingDefault;
}

function onload({ extensionAPI }: OnloadArgs) {

  console.log("Initializing CSS Themes");

  initCSSTheme();
  loadSystem();

  setSettingDefault(extensionAPI, "bp-appearance", "auto");

  createToggle(extensionAPI);

  console.log("Finished loading modules");
  console.log("Loaded Blueprint");
}

function onunload() {
  console.log("Unloading Blueprint");

  if (document.getElementById("blueprint-css")) {
    console.log("Removing Blueprint");
    document.getElementById("blueprint-css").remove();
  }

  destroyToggle();

  console.log("Unloaded Blueprint");
}

export default {
  onload: onload,
  onunload: onunload,
};

