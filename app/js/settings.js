const { ipcRenderer, shell } = require('electron');
const $gitLink = document.getElementById('git-link');
const $linkedinLink = document.getElementById('linkedin-link');
const body = document.querySelector('body');

window.addEventListener('DOMContentLoaded', () => {
    if (ipcRenderer.sendSync('dark-mode') === true) {
        turnBlack();
        $cbx_dark.checked = true;
    } else {
        turnWhite();
    }
}, false)

//add the GitHub link
$gitLink.addEventListener('click', function () {
    shell.openExternal("https://github.com/aguiarr");
});

//add the Linkedin link
$linkedinLink.addEventListener('click', function () {
    shell.openExternal("https://www.linkedin.com/in/matheus-de-aguiar-sim%C3%B5es-42910275/");
});

//turn to on the Dark Mode
function turnBlack(){
    body.classList.add("dark-mode");
}

//turn to on the White Mode
function turnWhite(){
    body.classList.remove("dark-mode");
}

