const { app, BrowserWindow, ipcMain, Menu, autoUpdater } = require('electron');
if(require('electron-squirrel-startup')) return;
let mainWindow;
let firstrun = false
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}
console.log(firstrun)
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
  if(firstrun == false){
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10000)
  }
  
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

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }


const ChildProcess = require('child_process');
const path = require('path');

const appFolder = path.resolve(process.execPath, '..');
const rootAtomFolder = path.resolve(appFolder, '..');
const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
const exeName = path.basename(process.execPath);

const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
        spawnedProcess = ChildProcess.spawn(command, args, {
            detached: true
        });
    } catch (error) {}

    return spawnedProcess;
};

const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
};

const squirrelEvent = process.argv[1];
switch (squirrelEvent) {
    case '--squirrel-firstrun':
      firstrun = true
    case '--squirrel-install':
    case '--squirrel-updated':
        // Optionally do things such as:
        // - Add your .exe to the PATH
        // - Write to the registry for things like file associations and
        //   explorer context menus

        // Install desktop and start menu shortcuts
        spawnUpdate(['--createShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

    case '--squirrel-uninstall':
        // Undo anything you did in the --squirrel-install and
        // --squirrel-updated handlers

        // Remove desktop and start menu shortcuts
        spawnUpdate(['--removeShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

    case '--squirrel-obsolete':
        // This is called on the outgoing version of your app before
        // we update to the new version - it's the opposite of
        // --squirrel-updated

        application.quit();
        return true;
}
};