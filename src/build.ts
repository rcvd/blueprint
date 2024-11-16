import type { OnloadArgs } from "roamjs-components/types";

let settings: { [key: string]: any } = {
  "css-theme": "blueprint",
  "css-appearance": "Auto",
},
  css: { [key: string]: string } = {
    blueprint: "",
  },
  extAPI: OnloadArgs["extensionAPI"];

function changeSettings(setting: string) {
  console.log("Changing setting: " + setting);

  switch (setting) {
  }
}

function setAppearance(mode: string) {
  console.log("Set Appearance: " + mode);

  settings["css-appearance"] = mode;
  extAPI.settings.set("css-appearance", mode);

  let btn = document.getElementsByClassName(
      "blueprint-toggle-icon"
  )[0];

  if (mode == "Auto") {
    if (document.documentElement.classList.contains('bp3-light')) {
      document.documentElement.classList.remove('bp3-light');
    }
    btn.classList.remove("bp3-icon-flash");
    btn.classList.add("bp3-icon-clean");
  }
  else if (mode == "Dark") {
    btn.classList.remove("bp3-icon-flash");
    btn.classList.add("bp3-icon-moon");
    document.documentElement.classList.add('bp3-dark');
  }
  else {
    btn.classList.remove("bp3-icon-moon");
    btn.classList.add("bp3-icon-flash");
    if (document.documentElement.classList.contains('bp3-dark')) {
      document.documentElement.classList.remove('bp3-dark');
    }
    document.documentElement.classList.add('bp3-light');
  }
}

function toggleAppearance() {
  let mode = settings["css-appearance"];

  if (mode == "Auto") {
    setAppearance("Dark");
  }
  else if (mode == "Dark") {
    setAppearance("Light");
  }
  else {
    setAppearance("Auto");
  }
}

function createToggle() {
  const createIconButton = (icon: string) => {
    const popoverButton = document.createElement("span");
    popoverButton.className = "bp3-popover-wrapper";

    const popoverIcon = document.createElement("span");
    popoverIcon.className = `bp3-button bp3-minimal bp3-small bp3-icon-${icon} blueprint-dm-toggle blueprint-toggle-icon`;

    popoverButton.appendChild(popoverIcon);

    return popoverButton;
  };

  let iconName = "moon";
  const nameToUse = "blueprintToggleDarkMode";

  switch (settings["css-appearance"]) {
    case "Auto":
      iconName = "clean";
      break;
    case "Dark":
      iconName = "moon";
      break;
    case "Light":
      iconName = "flash";
      break;
  }

  console.log("iconName: " + iconName);

  const checkForButton = document.getElementById(`${nameToUse}-flex-space`);
  if (!checkForButton) {
    const mainButton = createIconButton(iconName);
    const roamTopbar = document.getElementsByClassName("rm-topbar");

    const nextIconButton = roamTopbar[0].lastElementChild;
    const flexDiv = document.createElement("div");
    flexDiv.className = "rm-topbar__spacer-sm blueprint-dm-toggle";
    flexDiv.id = nameToUse + "-flex-space";

    const flexDivAfter = document.createElement("div");
    flexDivAfter.className = "rm-topbar__spacer-sm blueprint-dm-toggle";
    flexDivAfter.id = nameToUse + "-flex-space-after";

    nextIconButton.insertAdjacentElement("afterend", mainButton);
    mainButton.insertAdjacentElement("beforebegin", flexDiv);
    mainButton.insertAdjacentElement("afterend", flexDivAfter);
    mainButton.addEventListener("click", toggleAppearance);
  }

  setAppearance(settings["css-appearance"]);
}

function destroyToggle() {
  const toggles = document.querySelectorAll(".blueprint-dm-toggle");

  toggles.forEach((tog) => {
    tog.remove();
  });
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
  extAPI = extensionAPI;

  console.log("Initializing CSS Themes");
  initCSSTheme();

  loadSystem();

  for (const item in settings) {
    settings[item] = setSettingDefault(extensionAPI, item, settings[item]);
    console.log("Setting: " + item);
  }

  createToggle();

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
  onunload: onunload
};
