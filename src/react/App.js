import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { channels } from "../shared/constants";
const { ipcRenderer } = window;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: "",
      appVersion: "",
      updateChecking: false,
      updateAvailable: false,
      updateDownloaded: false,
    };
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
    ipcRenderer.on(channels.UPDATE_DOWNLOADED, () => {
      ipcRenderer.removeAllListeners(channels.UPDATE_DOWNLOADED);
      this.setState({ updateDownloaded: true });
      let updateNow = window.confirm("Update now?");
      if (updateNow) {
        ipcRenderer.send("restart_app");
      }
    });
    ipcRenderer.on(channels.UPDATE_AVAILABLE, () => {
      console.log("av");
      this.setState({ updateAvailable: true, updateChecking: false });
    });
    ipcRenderer.on(channels.UPDATE_CHECKING, () => {
      console.log("ch");
      this.setState({ updateChecking: true });
    });
    ipcRenderer.on(channels.UPDATE_NOT_AVAILABLE, () => {
      console.log("na");
      this.setState({ updateChecking: false, updateAvailable: false });
    });
  }

  render() {
    const {
      appName,
      appVersion,
      updateAvailable,
      updateChecking,
      updateDownloaded,
    } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {appName} version {appVersion}
          </p>
          <p>
            {updateAvailable && !updateDownloaded
              ? "Update being downloaded"
              : null}
            {updateAvailable && updateDownloaded ? "Update ready" : null}
            {updateChecking ? "Checking for updates..." : null}
          </p>
          <p>_+__+_</p>
        </header>
      </div>
    );
  }
}

export default App;
