import type { OnloadArgs } from "roamjs-components/types";

let extAPI: any;

export function setAppearance(mode: string) {
    console.log("Set Appearance: " + mode);

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

export function toggleAppearance() {
    let mode = extAPI.settings.get("css-appearance") as string;

    if (mode == "Auto") {
        extAPI.settings.set("css-appearance", "Dark");
    }
    else if (mode == "Dark") {
        extAPI.settings.set("css-appearance", "Light");
    }
    else {
        extAPI.settings.set("css-appearance", "Auto");
    }

    setAppearance(mode);
}

export function createToggle(extensionAPI: any) {
    const createIconButton = (icon: string) => {
        const popoverButton = document.createElement("span");
        popoverButton.className = "bp3-popover-wrapper";

        const popoverIcon = document.createElement("span");
        popoverIcon.className = `bp3-button bp3-minimal bp3-small bp3-icon-${icon} blueprint-dm-toggle blueprint-toggle-icon`;

        popoverButton.appendChild(popoverIcon);

        return popoverButton;
    };

    let iconName = "moon";
    let mode = extensionAPI.settings.get("css-appearance") as string;

    extAPI = extensionAPI;

    const nameToUse = "blueprintToggleDarkMode";

    switch (mode) {
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

    setAppearance(mode);
}

export function destroyToggle() {
    const toggles = document.querySelectorAll(".blueprint-dm-toggle");

    toggles.forEach((tog) => {
        tog.remove();
    });
}