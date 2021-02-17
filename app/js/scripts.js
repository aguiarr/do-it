const { ipcRenderer } = require('electron');

const $task_list = document.querySelector('.task-today-list');
const $body = document.querySelector('body');

const $cbx_dark = document.getElementById('dark-mode');
const $btn_new = document.getElementById('new-task');
const $btn_settings = document.getElementById('settings');

window.addEventListener('DOMContentLoaded', () => {
    let $input = document.querySelectorAll('.task-name');
    if (ipcRenderer.sendSync('dark-mode') === true) {
        turnBlack($input);
        $cbx_dark.checked = true;
    } else {
        turnWhite($input);
    }
}, false)

$cbx_dark.addEventListener('click', () => {
    let $input = document.querySelectorAll('.task-name');
    if ($cbx_dark.checked) {
         turnBlack($input);
         ipcRenderer.send('change-theme', true)

    } else { 
        turnWhite($input);
        ipcRenderer.send('change-theme', false)
    }
    
});

//open de settings frame
$btn_settings.addEventListener('click', () => {
    ipcRenderer.send('open-settings');
});

window.addEventListener("click", (event) => {
    var element = event.target;
    var elmt_id = element.getAttribute("id");

    //remove the task
    if (element.className == "remove-task") remove_task(event, elmt_id);


    if (element.getAttribute("type") == "checkbox") {

        let id = elmt_id.split("")[elmt_id.length - 1];

        let $cbx_element = document.getElementById(elmt_id);
        let $text_element = document.getElementById('text_' + id);

        if ($cbx_element.checked) {
            if ($cbx_element.getAttribute("id") == 'dark-mode') return;

            lineThrough(true, $text_element)
            OSnotification('Task Completed', $text_element.value);
        } else {
            lineThrough(false, $text_element)
        }
    }
})

//add event for add a new task
$btn_new.addEventListener("click", (event) => {
    add_new_task(event);
});

var i = 0;
//add new task function
function add_new_task(event) {
    i++;
    let btn = event.target;

    if (btn.getAttribute("id") == "new-task") {

        let task_li = createElement(i, "Task Name");
        $task_list.appendChild(task_li);
    }

}

//remove task function
function remove_task(event, elmt_id) {

    let id = elmt_id.split("")[elmt_id.length - 1];

    let element = event.target;
    let task_li;
    if (element.id == "remove_" + id) {
        task_li = document.getElementById("li_" + id);
        $task_list.removeChild(task_li);
        return;
    }

}

//create HTML elements function
function createElement(id) {

    let li = document.createElement("li");
    li.setAttribute("id", "li_" + id);
    li.className = "task";

    let div = document.createElement("div");
    div.className = "inputs";

    let darkMode = false;
    if ($cbx_dark.checked) darkMode = true;

    div.appendChild(createInputText(id, darkMode));
    div.appendChild(createCbxBtn(id));
    div.appendChild(createRemoveBtn(id));
    li.appendChild(div);

    return li;
}

//create a text input element
function createInputText(id, mode) {

    let element = document.createElement("input");

    element.setAttribute("type", "text");
    element.setAttribute("id", "text_" + id);
    element.className = "task-name";
    if (mode == true) element.classList.add('dark-mode');
    element.value = "Task Name";

    return element;
}

//create a checkbox element
function createCbxBtn(id) {

    let element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.setAttribute("id", "cbx_" + id);
    element.className = "checkbox-input";

    return element;

}

//create a span element
function createRemoveBtn(id) {

    let element = document.createElement("span");
    element.setAttribute("id", "remove_" + id);
    element.className = "remove-task";
    element.innerHTML = "&#x2715;";

    return element;
}

// Through the text on input
function lineThrough(boll, element) {
    if (!element) return;
    let color;
    $cbx_dark.checked ? color = "white" : color = "black";

    if (boll == true) {
        element.style.textDecoration = "line-through";
        element.style.color = "#737373";
    } else {
        element.style.textDecoration = "none";
        element.style.color = color;
    }
}

//generate a notification on OS
function OSnotification(name, body) {
    new Notification(name, {
        body: body,
        icon: '../icons/do-it.png'
    });
}

//turn to the Dark Mode
function turnBlack(inputs) {
    $body.classList.add("dark-mode");
    inputs.forEach(element => {
        element.style.backgroundColor = "#333333";

        if(element.style.textDecoration === "line-through"){
            element.style.color = "#737373";
        }else{
            element.style.color = "white";
        }
        element.style.transition = "background .5s";
    });
}

//turn to the White Mode
function turnWhite(inputs) {
    $body.classList.remove("dark-mode");
    inputs.forEach(element => {
        element.style.backgroundColor = "white";

        if(element.style.textDecoration === "line-through"){
            element.style.color = "#737373";
        }else{
            element.style.color = "#333333";
        }
        element.style.transition = "background .5s";
    });
}
