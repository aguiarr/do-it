const { app, BrowserWindow, ipcMain } = require('electron')
const config = require(__dirname + '/config/config')
const data = require(__dirname + '/data');



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    icon: "icons/do-it.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  win.loadURL(`file://${__dirname}/app/index.html`);
}


config.init();
data.init();
app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('read-file', (event, arg) =>{
  if(arg == 'config'){
    config.get().then( a => {  
      event.returnValue = a;
    })
  }else{
    data.get().then( a => {  
      event.returnValue = a;
    })
  }

});

ipcMain.on('save-file', (event, type, arg) =>{
  
  if(type == 'config'){
    config.save(arg);
    event.returnValue = true;
    
  }else{
    data.save(arg);
    event.returnValue = true;
  }

});

let settings = null;
ipcMain.on('open-settings', () => {
    if (settings == null) {
        settings = new BrowserWindow({
            width: 500,
            height: 480,
            alwaysOnTop: true,
            frame: true,
            resizable: false,
            webPreferences: {
              nodeIntegration: true
            }
        });
        settings.on('closed', () => {
            settings = null;
        });

        settings.removeMenu();
    }
    settings.loadURL(`file://${__dirname}/app/settings.html`);
});
ipcMain.on('close-settings', () => {
  settings.close();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})