import { App } from "astal/gtk3";
import Bar from "./src/widget/bar";
import Launcher from "./src/widget/launcher";
import NotificationPopups from "./src/widget/notifpopups";
import { togglePopupWindow } from "./src/widget/PopupWindow";

import { writeFile } from "astal/file";
import { exec } from "astal/process";

import barStyle from "inline:./scss/bar.scss";
import notifStyle from "inline:./scss/notif.scss";
import launcherStyle from "inline:./scss/launcher.scss";

import { HOME } from "./src/lib/constants";

const colorsPath = `${HOME}/.config/ags_res/colors.scss`;
const tmpscss = "/tmp/style.scss";
const target = "/tmp/style.css";

writeFile(
  tmpscss,
  `
  * {
    font-family: rubik;
    &:not(menu):not(menuitem):not(separator):not(tooltip) {
      all: unset;
    }
  }

  @import "${colorsPath}";
  ${barStyle}
  ${notifStyle}
  ${launcherStyle}
`,
);

exec(`sass ${tmpscss} ${target}`);

App.start({
  requestHandler(req, res) {
    const [cmd, ...args] = req.split(" ");
    if (cmd == "toggle-popup") {
      togglePopupWindow(args[0]);
      res("");
    }
  },
  css: target,
  main() {
    Bar();
    Launcher();
    NotificationPopups();
  },
});