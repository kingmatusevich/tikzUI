const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");
autoUpdater.logger = require("electron-log");
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
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    console.log("Checking for updates");
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
});

autoUpdater.on(channels.UPDATE_AVAILABLE, () => {
  console.log("available");
  mainWindow.webContents.send(channels.UPDATE_AVAILABLE);
});
autoUpdater.on(channels.UPDATE_CHECKING, () => {
  mainWindow.webContents.send(channels.UPDATE_CHECKING);
});
autoUpdater.on(channels.UPDATE_NOT_AVAILABLE, () => {
  mainWindow.webContents.send(channels.UPDATE_NOT_AVAILABLE);
});
autoUpdater.on(channels.UPDATE_DOWNLOADED, () => {
  console.log("downloaded");
  mainWindow.webContents.send(channels.UPDATE_DOWNLOADED);
});
ipcMain.on(channels.RESTART_APP, () => {
  autoUpdater.quitAndInstall();
});
