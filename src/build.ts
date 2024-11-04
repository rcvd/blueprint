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
    case "css-theme":
    case "css-appearance":
      setToggleIcon();
  }
}

function toggleDarkMode() {
  console.log("Dark mode toggled: " + settings["css-appearance"]);

  if (settings["css-appearance"] == "Auto") {
    let btn = document.getElementsByClassName(
      "bp3-icon-clean blueprint-dm-toggle"
    )[0];

    btn.classList.remove("bp3-icon-clean");
    btn.classList.add("bp3-icon-flash");
    settings["css-appearance"] = "Light";
    extAPI.settings.set("css-appearance", "Light");

    if (document.documentElement.classList.contains('bp3-dark')) {
      document.documentElement.classList.remove('bp3-dark');
    }

    document.documentElement.classList.add('bp3-light');

    changeSettings("css-theme");
  } else if (settings["css-appearance"] == "Light") {
    let btn = document.getElementsByClassName(
      "bp3-icon-flash blueprint-dm-toggle"
    )[0];

    btn.classList.remove("bp3-icon-flash");
    btn.classList.add("bp3-icon-moon");
    settings["css-appearance"] = "Dark";
    extAPI.settings.set("css-appearance", "Dark");

    if (document.documentElement.classList.contains('bp3-light')) {
      document.documentElement.classList.remove('bp3-light');
    }

    document.documentElement.classList.add('bp3-dark');
    changeSettings("css-theme");
  } else {
    let btn = document.getElementsByClassName(
      "bp3-icon-moon blueprint-dm-toggle"
    )[0];

    btn.classList.remove("bp3-icon-moon");
    btn.classList.add("bp3-icon-clean");
    settings["css-appearance"] = "Auto";
    extAPI.settings.set("css-appearance", "Auto");

    if (document.documentElement.classList.contains('bp3-dark')) {
      document.documentElement.classList.remove('bp3-dark');
    }

    if (document.documentElement.classList.contains('bp3-light')) {
      document.documentElement.classList.remove('bp3-light');
    }

    changeSettings("css-theme");
  }
}

function setToggleIcon() {
  console.log("Set toggle icon: " + settings["css-appearance"]);

  let btn = document.getElementsByClassName(
    "bp3-button blueprint-dm-toggle"
  )[0];

  if (btn.classList.contains("bp3-icon-clean")) {
    btn.classList.remove("bp3-icon-clean");
  }
  if (btn.classList.contains("bp3-icon-flash")) {
    btn.classList.remove("bp3-icon-flash");
  }
  if (btn.classList.contains("bp3-icon-moon")) {
    btn.classList.remove("bp3-icon-moon");
  }

  if (settings["css-appearance"] == "Auto") {
    btn.classList.add("bp3-icon-clean");
  } else if (settings["css-appearance"] == "Light") {
    btn.classList.add("bp3-icon-flash");
  } else {
    btn.classList.add("bp3-icon-moon");
  }
}

function createToggle() {
  const createIconButton = (icon: string) => {
    const popoverButton = document.createElement("span");
    popoverButton.className = "";
    popoverButton.tabIndex = 0;

    const popoverIcon = document.createElement("span");
    popoverIcon.className = `bp3-button bp3-minimal bp3-small bp3-icon-${icon} blueprint-dm-toggle`;

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
    mainButton.addEventListener("click", toggleDarkMode);
  }
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

  createToggle();

  for (const item in settings) {
    settings[item] = setSettingDefault(extensionAPI, item, settings[item]);
    console.log("Setting: " + item);
  }

  setToggleIcon();

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
