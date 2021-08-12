let add = document.querySelector(".add-circle");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let colorBoxes = document.querySelectorAll(".colorbar .box div");
let colorClasses = ["red", "orange", "yellow", "blue"];
let edit = true;
let modalVisible = false;
let uid = new ShortUniqueId();

/*--------------------------Load tasks----------------------*/
function loadTasks(passedColor) {
  let allTaskBoxes = document.querySelectorAll(".task-box");
  for (let t = 0; t < allTaskBoxes.length; t++) {
    allTaskBoxes[t].remove();
  }

  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < tasksArr.length; i++) {
    let id = tasksArr[i].id;
    let taskColor = tasksArr[i].color;
    let taskValue = tasksArr[i].task;
    let taskStatus = tasksArr[i].taskStatus;
    // let deadline = tasksArr[i].deadline;

    if (passedColor) {
      if (passedColor != taskColor) {
        continue;
      }
    }

    createTaskBox(id, taskColor, taskValue, taskStatus); //4th argument deadline
  }
}

/*--------------------------Create task box----------------------*/
function createTaskBox(id, color, task, taskStatus) {
  //4th argument deadline
  let taskBox = document.createElement("div");
  taskBox.classList.add("task-box");
  taskBox.innerHTML = `<div class="task-color ${color}">${id}</div>
        <div class = "edit-delete-container">
            <button class="edit"><i class="fa fa-pencil"></i></button>
            <button class="delete"><i class="fa fa-trash"></i></button>
        </div>
        <div class="task">${task}</div>
        <div class="task-status-container">
        <input type="checkbox" id="checkbox">
        <div class="task-status">${taskStatus}</div></div>`;

  // <div class="task-date">${deadline}</div>

  grid.appendChild(taskBox);

  let checkBox = taskBox.querySelector("#checkbox");
  if (taskStatus == "Completed") {
    checkBox.checked = true;
  }

  /*--------------------------Delete tasks----------------------*/
  let deleteBtn = taskBox.querySelector(".delete");
  deleteBtn.addEventListener("click", function () {
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));

    tasksArr = tasksArr.filter(function (ele) {
      return ele.id != id;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksArr));
    taskBox.remove();
  });

  let taskStatusDiv = taskBox.querySelector(".task-status");

  /*--------------------------Change task status----------------------*/
  checkBox.addEventListener("click", function () {
    if (taskStatus == "Pending") {
      taskStatus = "Completed";
    } else {
      taskStatus = "Pending";
    }
    taskStatusDiv.innerText = taskStatus;
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIndex = -1;
    for (let i = 0; i < tasksArr.length; i++) {
      if (tasksArr[i].id == id) {
        reqIndex = i;
        break;
      }
    }
    tasksArr[reqIndex].taskStatus = taskStatusDiv.innerText;
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
  });

  /*--------------------------Edit tasks----------------------*/
  let editBtn = taskBox.querySelector(".edit");
  editBtn.addEventListener("click", function () {
    if (edit) {
      console.log("edit is true");
      document.querySelector(".task").style.pointerEvents = "auto";
      document.querySelector(".task-color").style.pointerEvents = "auto";
      editBtn.classList.add("edit-click");
      /*--------------------------Edit task color----------------------*/
      let taskColorDiv = taskBox.querySelector(".task-color");
      taskColorDiv.addEventListener("click", function (e) {
        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
        let reqIndex = -1;
        for (let i = 0; i < tasksArr.length; i++) {
          if (tasksArr[i].id == id) {
            reqIndex = i;
            break;
          }
        }
        let currentColor = e.currentTarget.classList[1];
        let index = colorClasses.indexOf(currentColor);
        index++;
        index = index % 4;
        e.currentTarget.classList.remove(currentColor);
        e.currentTarget.classList.add(colorClasses[index]);
        tasksArr[reqIndex].color = colorClasses[index];

        localStorage.setItem("tasks", JSON.stringify(tasksArr));
      });

      /*--------------------------Edit task----------------------*/
      let taskArea = taskBox.querySelector(".task");
      taskArea.setAttribute("contenteditable", "true");
      taskArea.addEventListener("input", function (e) {
        console.log("edit task");
        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
        let reqIndex = -1;
        for (let i = 0; i < tasksArr.length; i++) {
          if (tasksArr[i].id == id) {
            reqIndex = i;
            break;
          }
        }
        tasksArr[reqIndex].task = e.currentTarget.innerText;
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
      });

      /*--------------------------Edit task date----------------------*/
      // let date = taskBox.querySelector(".task-date");
      // date.addEventListener("click", function(){
      //     date.remove();
      //     taskBox.innerHTML = `  <div class="task-color ${color}"> ${id}</div>
      //                             <div class = "date-container">
      //                             <input class="task-date" type="date"></div>
      //                             </div>
      //                             <div class="task">${task}</div>`
      // });

      edit = false;
    } else {
      console.log("edit is false");
      document.querySelector(".task").style.pointerEvents = "none";
      document.querySelector(".task-color").style.pointerEvents = "none";
      editBtn.classList.remove("edit-click");
      edit = true;
      return;
    }
  });
}

/*--------------------------Object initialization step----------------------*/
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

/*--------------------------Save tasks in local storage----------------------*/
function saveTasksInLocalStorage(id, color, task, taskStatus) {
  //4th argument deadline
  let requiredObj = { id, color, task, taskStatus }; //4th argument deadline
  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  tasksArr.push(requiredObj);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

/*--------------------------Get system date----------------------*/
// function currDate(){
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth()+1;
//     var yyyy = today.getFullYear();
//     if(dd<10){
//         dd='0'+dd;
//     }
//     if(mm<10){
//         mm='0'+mm;
//     }
//     var today = dd+'-'+mm+'-'+yyyy;
//     return today;
// }

// let today = currDate();

/*--------------------------Open modal----------------------*/
add.addEventListener("click", function () {
  if (modalVisible) return;
  modalVisible = true;

  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.setAttribute("click-first", true);
  modal.innerHTML = ` <div class="input-task" contenteditable>Enter your task here</div>
                        <div class="select-area">
                            <button class="close"><i class="fa fa-close"></i></button>
                             <div class="priority-container">
                                <div class="priority-color-box red"></div>
                                <div class="priority-color-box orange"></div>
                                <div class="priority-color-box yellow"></div>
                                <div class="priority-color-box blue active-modal-priority"></div>
                            </div>
                            <div id="submit">SUBMIT</div>
                        </div>`;

  body.appendChild(modal);

  /*--------------------------Close modal----------------------*/
  let close = modal.querySelector(".close");
  close.addEventListener("click", function () {
    modalVisible = false;
    modal.remove();
  });

  /*--------------------------Hint for input task----------------------*/
  let inputTask = modal.querySelector(".input-task");
  inputTask.addEventListener("click", function () {
    if (modal.getAttribute("click-first") == "true") {
      inputTask.innerHTML = "";
      inputTask.style.color = "black";
      modal.setAttribute("click-first", false);
    }
  });

  /*--------------------------Date Select----------------------*/
  // document.getElementById("datepicker").value = today;
  // let deadlineSelected = modal.querySelector("#datepicker");
  // deadlineSelected.addEventListener('input', function() {
  //     let current = this.value;
  //     if (current < today){
  //         document.getElementById('datepicker').value = today;
  //     }
  // });

  /*--------------------------Priority Select----------------------*/
  let allModalPriorities = modal.querySelectorAll(".priority-color-box");
  for (let i = 0; i < allModalPriorities.length; i++) {
    allModalPriorities[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalPriorities.length; j++) {
        allModalPriorities[j].classList.remove("active-modal-priority");
      }
      e.currentTarget.classList.add("active-modal-priority");
    });
  }

  /*--------------------------On clicking submit button----------------------*/
  let submit = modal.querySelector("#submit");
  submit.addEventListener("click", function () {
    // deadlineSelected.addEventListener('input', function() {
    //     var current = this.value;
    //     if (current < today){
    //         document.getElementById('datepicker').value = today;
    //     }
    // });

    /*--------------------------Correcting date format----------------------*/
    // let dateFormat = ""+deadline;
    // let dd = dateFormat.substr(8,10);
    // let yy = dateFormat.substr(0, 4);
    // let mm = ""+dateFormat.charAt(5)+dateFormat.charAt(6);

    /*--------------------------Values to be saved----------------------*/
    // let correctFormat = dd+"-"+mm+"-"+yy;
    let task = inputTask.innerText;
    let selectedPriority = document.querySelector(".active-modal-priority");
    let color = selectedPriority.classList[1];
    let id = uid();
    let taskStatus = "Pending";

    /*--------------------------Calling function to save tasks----------------------*/
    saveTasksInLocalStorage(id, color, task, taskStatus); //4th argument deadline

    /*--------------------------Calling function to create task box----------------------*/
    createTaskBox(id, color, task, taskStatus); //4th argument correctFormat
    modal.remove();
    modalVisible = false;
  });
});

loadTasks();

/*--------------------------Load tasks according to the priority color----------------------*/
for (let i = 0; i < colorBoxes.length; i++) {
  colorBoxes[i].addEventListener("click", function (e) {
    let colorBox = e.currentTarget.classList[1];
    loadTasks(colorBox);
  });
}
