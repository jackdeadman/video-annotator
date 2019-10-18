// Basic init
const electron = require('electron')
const {app, BrowserWindow, dialog, Menu} = electron
const menu = require('./menu');
const path = require('path');

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)


// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
    BrowserWindow.addDevToolsExtension(
        // path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.0_0')
        path.join('./extensions/react-dev-tools')
    );

    mainWindow = new BrowserWindow({width: 800, height: 600})

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    Menu.setApplicationMenu(menu);

})
