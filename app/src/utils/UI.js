const electron = require('electron');

export const chooseFolder = async function() {
    return new Promise((resolve, reject) =>
        electron.remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (files) => resolve(files ? files[0] : null))
    );
};

export const chooseFiles = async function() {
    return new Promise((resolve, reject) => 
        electron.remote.dialog.showOpenDialog({
            properties: ['openDirectory', 'multiSelections']
        }, (files) => resolve(files || []))
    );
};