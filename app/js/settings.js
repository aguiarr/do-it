const { ipcRenderer, shell } = require('electron');

const $cbx_dark = document.getElementById('dark-mode');
const $gitLink = document.getElementById('git-link');
const $linkedinLink = document.getElementById('linkedin-link');
const body = document.querySelector('body');

var $config_data;

//get the config file content
window.addEventListener('DOMContentLoaded', () => {
    getConfig(ipcRenderer.sendSync('read-file', 'config'));
}, false);

//add a event to the darkmode button
$cbx_dark.addEventListener('click', () => {

    if($cbx_dark.checked){
        turnBlack();
    }else{
        turnWhite();
    }
});

//add the GitHub link
$gitLink.addEventListener('click', function () {
    shell.openExternal("https://github.com/aguiarr");
});

//add the Linkedin link
$linkedinLink.addEventListener('click', function () {
    shell.openExternal("https://www.linkedin.com/in/matheus-de-aguiar-sim%C3%B5es-42910275/");
});

//get the config data
function getConfig(data){
    $config_data = data;
    if($config_data.darkMode == true){
        $cbx_dark.checked = true;
        turnBlack();
    }
}

//save the JSON object
function saveJson(obj){
    ipcRenderer.sendSync('save-file', 'config', obj);
}

//turn to on the Dark Mode
function turnBlack(){
    body.classList.add("dark-mode");
    $config_data.darkMode = true;
    saveJson($config_data);
}

//turn to on the White Mode
function turnWhite(){
    body.classList.remove("dark-mode");
    $config_data.darkMode = false;
    saveJson($config_data);
}

