const { ipcRenderer } = require('electron');

const $task_fixed_list = document.querySelector('.task-fixed-list');
const $task_today_list = document.querySelector('.task-today-list');
const $body = document.querySelector('body');

const $btn_new_fixed = document.getElementById('new-fixed');
const $btn_new_today = document.getElementById('new-today');
const $btn_settings = document.getElementById('settings');

var $fixed_array = [];
var $config_data;

//open de settings frame
$btn_settings.addEventListener('click', () => {
    ipcRenderer.send('open-settings');
});

//get the content of data and config files
window.addEventListener('DOMContentLoaded', () =>{
    getConfig(ipcRenderer.sendSync('read-file', 'config'));
    getData(ipcRenderer.sendSync('read-file', 'data').tasks);
}, false);

//veriify if it is on darkmode
window.setInterval(() =>{
    getConfig(ipcRenderer.sendSync('read-file', 'config'));
}, 500);
    
//get data content
function getData(tasks) {
    tasks.forEach(task => {
        $fixed_array.push(task);
        var elemet = createElement(task.id, task.Name);
        $task_fixed_list.appendChild(elemet);

    });
}

//get config content
function getConfig(data){
    $config_data = data;

    let $input = document.querySelectorAll('.task-name');

    if($config_data.darkMode == true){
        turnBlack($input);
    }else{
        turnWhite($input);
    }
}

window.addEventListener("click", (event) => {
    var element = event.target;

    var element_id = element.getAttribute("id");

    //remove the task
    if (element.className == "remove-task") {

        let id = element_id.split("")[element_id.length - 1];
        remove_task(event, id);
    }

    if (element.getAttribute("type") == "checkbox") {

        let id = getElementId(element_id);

        let today_prefix = element_id.split("_")[1];

        var $checkbox_element = document.getElementById(element_id);
        var $taskName_element;

        if (today_prefix == "td") {
            $taskName_element = document.getElementById('text_td_' + id);
        } else {
            $taskName_element = document.getElementById('text_' + id);
        }

        //checked the task
        if ($checkbox_element.checked) {
            $taskName_element.style.textDecoration = "line-through";
            $taskName_element.style.color = "#737373";
            
            //generate a notification on OS
            new Notification('Task Completed',{
                body: `${$taskName_element.value}`,
                icon: ''
            });
        } else {
            $taskName_element.style.textDecoration = "none";
            if($config_data.darkMode == true){
                $taskName_element.style.color = "white";
            }else{
                $taskName_element.style.color = "black";
            }
        }
    }

    //edit the task name
    if (element.getAttribute("type") == "text") {
        console.log(element);
        let id = getElementId(element_id);
        element.addEventListener("keyup", () => {
            console.log(element.value)
            let taskName = element.value;
            $fixed_array.forEach(element => {
                if (element.id == id){
                    element.Name = taskName;
                }
            });
            saveJson($fixed_array);
        })
    }
})

//add event for add a new fixed task
$btn_new_fixed.addEventListener("click", (event) => {
    add_new_task(event);
});
//add event for add a new today task
$btn_new_today.addEventListener("click", (event) => {
    add_new_task(event);
});

var i = 0;
//add new task function
function add_new_task(event) {
    i++;
    let btn = event.target;

    if (btn.getAttribute("id") == "new-fixed") {
        
        let id = lastId($fixed_array);
        let task_li = createElement(id, "Task Name");
        $task_fixed_list.appendChild(task_li);
        addJson(id, "Task Name");
        saveJson($fixed_array);
        console.log($fixed_array);
    }
    if (btn.getAttribute("id") == "new-today") {

        let task_li = createElement('td_' + i, "Task Name");
        $task_today_list.appendChild(task_li);
    }

}

//remove task function
function remove_task(event, id) {
    let element = event.target;
    let task_li;
    $fixed_array = removeJson(id);
    saveJson($fixed_array);
    if (element.id == "remove_td_" + id) {
        task_li = document.getElementById("li_td_" + id);
        $task_today_list.removeChild(task_li);
        return;

    } else if (element.id == "remove_" + id) {
        task_li = document.getElementById("li_" + id);
        $task_fixed_list.removeChild(task_li);
        return;
    }

}

//create HTML elements function
function createElement(id, taskName) {

    var task_li = document.createElement("li");
    task_li.setAttribute("id", "li_" + id);
    task_li.className = "task";

    var task_div = document.createElement("div");
    task_div.className = "inputs";


    var task_cbx = document.createElement("input");
    task_cbx.setAttribute("type", "checkbox");
    task_cbx.setAttribute("id", "cbx_" + id);
    task_cbx.className = "checkbox-input";

    var task_text = document.createElement("input");
    task_text.setAttribute("type", "text");
    task_text.setAttribute("id", "text_" + id);
    task_text.className = "task-name";
    task_text.value = taskName;
    if($config_data && $config_data.darkMode == true){
        task_text.classList.add("dark-mode");
    }

    var task_remove = document.createElement("span");
    task_remove.setAttribute("id", "remove_" + id);
    task_remove.className = "remove-task";
    task_remove.innerHTML = "&#x2715;";

    task_div.appendChild(task_text);
    task_div.appendChild(task_cbx);
    task_div.appendChild(task_remove);
    task_li.appendChild(task_div);

    return task_li;
}

//filter the element id
function getElementId(element_id){
    let id;
    if (element_id.split("")[element_id.length - 2] == '_') {
        id = element_id.split("")[element_id.length - 1];
    } else {
        id = element_id.split("")[element_id.length - 2];
        id += element_id.split("")[element_id.length - 1];
    }
    return id;
}

//get last id function
function lastId(array) {
    let lastItem = array[array.length -1];
    if(lastItem == null){
        return 1;
    }else{
        console.log(lastItem.id)
        let last = lastItem.id+ 1;
        console.log(last);
        return last;
    }

}

//remove element from JSON object
function removeJson(id) {
    let new_array = [];
    $fixed_array.forEach(element => {
        if (element.id != id) {
            new_array.push(element);
        }
    });
    return new_array;
}

//save the JSON object data
function saveJson(array) {
    let json = {"tasks":array};
    ipcRenderer.sendSync('save-file', 'data', json);
}

//add an element to the JSON data
function addJson(id, taskname) {
    $fixed_array.push({ id: id, Name: taskname });
}

//turn to the Dark Mode
function turnBlack(inputs){
    $body.classList.add("dark-mode");
    inputs.forEach(element => {
        element.classList.add("dark-mode");
    });
}

//turn to the White Mode
function turnWhite(inputs){
    $body.classList.remove("dark-mode");
    inputs.forEach(element => {
        element.classList.remove("dark-mode");
    });
}
