const { contextBridge, ipcRenderer } = require("electron");
const petListeners = new Map();
contextBridge.exposeInMainWorld("qbitPC", Object.freeze({
  isDesktop: true,
  startConnector: () => ipcRenderer.invoke("qbit:connector-start"),
  stopConnector: () => ipcRenderer.invoke("qbit:connector-stop"),
  getConnectorStatus: () => ipcRenderer.invoke("qbit:connector-status"),
  openExtensionFolder: () => ipcRenderer.invoke("qbit:connector-open-folder"),
  openChromeExtensions: () => ipcRenderer.invoke("qbit:connector-open-chrome"),
  askBrowserAI: message => ipcRenderer.invoke("qbit:connector-ask", String(message).slice(0,12000)),
  openUrl: url => ipcRenderer.invoke("qbit:open-url", url),
  getStatus: () => ipcRenderer.invoke("qbit:status"),
  openApp: name => ipcRenderer.invoke("qbit:open-app", name),
  openFolder: name => ipcRenderer.invoke("qbit:open-folder", name),
  openAnything: query => ipcRenderer.invoke("qbit:open-anything", String(query).slice(0, 180)),
  volume: (action, level) => ipcRenderer.invoke("qbit:volume", action, level),
  runAutomation: name => ipcRenderer.invoke("qbit:automation", name),
  openSettings: page => ipcRenderer.invoke("qbit:open-settings", page),
  lockPC: () => ipcRenderer.invoke("qbit:lock-pc"),
  getBatteryInfo: () => ipcRenderer.invoke("qbit:battery-info"),
  getNetworkInfo: () => ipcRenderer.invoke("qbit:network-info"),
  mediaControl: action => ipcRenderer.invoke("qbit:media-control", action),
  createFolder: (base, relativePath) => ipcRenderer.invoke("qbit:create-folder", base, relativePath),
  createFile: (base, relativePath, content) => ipcRenderer.invoke("qbit:create-file", base, relativePath, content),
  searchFiles: query => ipcRenderer.invoke("qbit:search-files", query),
  getDisplayInfo: () => ipcRenderer.invoke("qbit:display-info"),
  getBrightnessInfo: () => ipcRenderer.invoke("qbit:brightness-info"),
  setBrightness: level => ipcRenderer.invoke("qbit:brightness-set", level),
  adjustBrightness: delta => ipcRenderer.invoke("qbit:brightness-adjust", delta),
  writeClipboard: text => ipcRenderer.invoke("qbit:clipboard-write", text),
  checkForUpdates: () => ipcRenderer.invoke("qbit:update-check"),
  getAppVersion: () => ipcRenderer.invoke("qbit:app-version"),
  onUpdateState: callback => { if (typeof callback === "function") ipcRenderer.on("qbit:update-state", (_event, state) => callback(state)); },
  onPetMessage: callback => { if (typeof callback === "function") ipcRenderer.on("qbit:pet-message", (_event, message) => callback(message)); },
  sendPetReply: message => ipcRenderer.send("qbit:pet-reply", String(message).slice(0, 2000)),
  getPetSettings: () => ipcRenderer.invoke("qbit:pet-settings-get"),
  setPetSettings: settings => ipcRenderer.invoke("qbit:pet-settings-set", settings),
  resetPetPosition: () => ipcRenderer.invoke("qbit:pet-position-reset")
}));
contextBridge.exposeInMainWorld("qbitPet", Object.freeze({
  resizePet: expanded => ipcRenderer.invoke("qbit:pet-resize", Boolean(expanded)),
  getPosition: () => ipcRenderer.invoke("qbit:pet-position"),
  moveTo: (x, y) => ipcRenderer.invoke("qbit:pet-move", Number(x), Number(y)),
  showMainWindow: () => ipcRenderer.invoke("qbit:pet-show-main"),
  sendMessage: message => ipcRenderer.invoke("qbit:pet-send-message", String(message).slice(0, 500)),
  onPetReply: callback => { if (typeof callback === "function") ipcRenderer.on("qbit:pet-reply", (_event, message) => callback(message)); },
  hidePet: () => ipcRenderer.invoke("qbit:pet-hide"),
  onPetToggle: callback => {
    if (typeof callback !== "function") return;
    const listener = () => callback();
    ipcRenderer.on("qbit:pet-toggle", listener);
    petListeners.set(callback, ["qbit:pet-toggle", listener]);
  },
  getSettings: () => ipcRenderer.invoke("qbit:pet-settings-get"),
  onPetSettings: callback => {
    if (typeof callback !== "function") return;
    const listener = (_event, settings) => callback(settings);
    ipcRenderer.on("qbit:pet-settings", listener);
    petListeners.set(callback, ["qbit:pet-settings", listener]);
  },
  onPetState: callback => {
    if (typeof callback !== "function") return;
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("qbit:pet-state", listener);
    petListeners.set(callback, ["qbit:pet-state", listener]);
  },
  removeListener: callback => {
    const item = petListeners.get(callback);
    if (item) {
      ipcRenderer.removeListener(item[0], item[1]);
      petListeners.delete(callback);
    }
  }
}));
