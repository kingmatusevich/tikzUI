import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Main from "./Main";
import { channels } from "../shared/constants";

const ipcRenderer = window.ipcRenderer || {
  on: () => {},
  send: () => {},
  removeAllListeners: () => {},
};

const DEFAULT_FILE_CONTENT = {
  figures: [
    {
      name: "Figure 1",
    },
    {
      name: "Figure 2",
    },
    {
      name: "Figure 3",
    },
    {
      name: "Figure 4",
    },
  ],
  activeFigureIndex: null,
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: "",
      appVersion: "",
      updateChecking: false,
      updateAvailable: false,
      updateDownloaded: false,
      openFile: null,
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
      openFile,
    } = this.state;
    return (
      <div>
        <Main openFile={openFile} initialContent={DEFAULT_FILE_CONTENT} />
      </div>
    );
  }
}

export default App;
