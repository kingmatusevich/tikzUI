const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");
var temp = require("temp"),
  fs = require("fs"),
  util = require("util"),
  exec = require("child_process").exec;

// Automatically track and cleanup files at exit
temp.track();

const log = require("electron-log");
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
const { channels } = require("../src/shared/constants");
let mainWindow;
function createWindow() {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow = new BrowserWindow({
    width: 1260,
    height: 600,
    backgroundColor: "lightgrey",
    webPreferences: {
      plugins: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    log.info("Checking for updates");
    autoUpdater.checkForUpdatesAndNotify();
  });
}
app.on("ready", createWindow);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(channels.APP_INFO, (event) => {
  event.sender.send(channels.APP_INFO, {
    appName: app.getName(),
    appVersion: app.getVersion(),
  });
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on(channels.UPDATE_AVAILABLE, () => {
  log.info("available");
  mainWindow.webContents.send(channels.UPDATE_AVAILABLE);
});
autoUpdater.on(channels.UPDATE_CHECKING, () => {
  log.info("checking");
  mainWindow.webContents.send(channels.UPDATE_CHECKING);
});
autoUpdater.on(channels.UPDATE_NOT_AVAILABLE, () => {
  log.info("n/a");
  mainWindow.webContents.send(channels.UPDATE_NOT_AVAILABLE);
});
autoUpdater.on(channels.UPDATE_DOWNLOADED, () => {
  log.info("downloaded");
  mainWindow.webContents.send(channels.UPDATE_DOWNLOADED);
});
ipcMain.on(channels.RESTART_APP, () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on(channels.RENDER_FIGURE, (event, data) => {
  log.info(data);
  var tempName = temp.path({ suffix: ".tex" });
  fs.writeFile(tempName, data, function (err) {
    if (err) return info.error(err);
    log.info("preparing");
    process.chdir(path.dirname(tempName));
    exec(
      "/Library/TeX/texbin/pdflatex -halt-on-error '" +
        tempName +
        "' -interaction=nonstopmode",
      {
        env: {},
      },
      function (error, stderr, stdout) {
        if (error) {
          log.error(`error: ${error.message}`);
        }
        if (stderr) {
          log.error(`stderr: ${stderr}`);
        }
        log.info(`stdout: ${stdout}`);
        event.sender.send(
          channels.RENDER_FIGURE_COMPLETED,
          `${tempName.replace(".tex", "")}.pdf`
        );
      }
    );
  });
});
