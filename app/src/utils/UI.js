const electron = require('electron');

export const chooseFolder = async function() {
    console.log(electron)
    return new Promise((resolve, reject) =>
        electron.remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (files) => resolve(files ? files[0] : null))
    );
};