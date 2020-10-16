const { app, BrowserWindow, ipcMain, Menu, autoUpdater, dialog } = require('electron');
if(require('electron-squirrel-startup')) return;
let mainWindow;
if(require('electron-squirrel-startup') == true ) app.quit();

require('update-electron-app')({
  repo: 'userdaylightinc/Daylight-Beta',
  updateInterval: '5 minutes',
  logger: require('electron-log')
})




function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile(`${__dirname}/pages/home.html`)
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  mainWindow.webContents.openDevTools()


  Menu.setApplicationMenu(null)
  
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
  event.sender.send('app_version', { version: require(__dirname + "/package.json").version });
});

