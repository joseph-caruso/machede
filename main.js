const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const electron = require('electron');

// Prevent main window from being garbage-collected
let mainWindow;
let windows;

function createWindow () {
  const {width, height} = electron.screen.getAllDisplays()[0].workAreaSize;
  mainWindow = new BrowserWindow({width, height, frame: false, show: false, type: 'desktop',
    backgroundColor: '#000000'});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.show();

  mainWindow.on('closed', function () {
    // Allow window to be garbage-collected
    mainWindow = null;
  });

  mainWindow.setBounds({x:0, y:0, width:width, height:height});
}

app.on('ready', createWindow);

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

ipcMain.on('app-launch', (event, name) => {
  let appPath = 'file:///paper/apps/'+name+'.asar/static/index.html';
  if (fs.existsSync(appPath)) {
    let win = new BrowserWindow({width: 1, height: 1, frame: false});
    win.loadURL(appPath);
    let wid = windows.length;
    windows.push(win);
    win.show();
    event.sender.send('app-launch-reply', wid);
  } else {
    event.sender.send('app-launch-reply', -1);
  }
});

ipcMain.on('window-create', (event, bounds) => {
  let win = new BrowserWindow({width: 1, height: 1, frame: false});
  let wid = windows.length;
  windows.push(win);
  win.setBounds(bounds);
  win.show();
  event.sender.send('window-create-reply', wid);
});

ipcMain.on('window-set-bounds', (event, wid, bounds) => {
  let win = windows[wid];
  if (win !== undefined) {
    win.setBounds(bounds);
    event.sender.send('window-set-bounds-reply', true);
  } else {
    event.sender.send('window-set-bounds-reply', false);
  }
});
