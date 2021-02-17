const { app, BrowserWindow, ipcMain, nativeTheme} = require('electron');
const config = require(__dirname + '/config/config');
var theme = null;

if(nativeTheme.themeSource == 'system' ||nativeTheme.themeSource == 'dark' ){
  theme = 0; 
}else{
  theme = 1;
}


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
  win.removeMenu();
  win.loadURL(`file://${__dirname}/app/index.html`);
}


app.whenReady().then(createWindow);

ipcMain.on('dark-mode', (event, arg) => {
  theme == 0 ? event.returnValue = true : event.returnValue = false;
});

ipcMain.on('change-theme', (event, arg) => {
  if(arg == true){
    theme = 0;
  }else{
    theme = 1;
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
            width: 400,
            height: 350,
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
