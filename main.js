const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
require('update-electron-app')()

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/pages/home.html`)
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools()

  
  // autoUpdater.setFeedURL("https://github.com/hydrogen-studio/Daylight.git")
  // autoUpdater.checkForUpdates().then(r => {
  //   console.log(r)
  // })
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});