const { app, BrowserWindow, ipcMain, Menu, autoUpdater } = require('electron');
if(require('electron-squirrel-startup')) return;
let mainWindow;

const server = 'https://update.electronjs.org'
const feed = `${server}/userdaylightinc/Daylight-Main/${process.platform}-${process.arch}/${app.getVersion()}`
console.log(feed)
autoUpdater.setFeedURL(feed)



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
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10000)
  
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

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});