const { Menu, app, BrowserWindow, ipcMain } = require('electron');
const path = require("path")
let mainWindow;
const { autoUpdater } = require('electron-updater');


function createWindow () {
  


  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Daylight Launcher",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: require('path').join('icon.png')
  })
  Menu.setApplicationMenu(null)

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/pages/home.html`)

  mainWindow.maximize()
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

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

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});