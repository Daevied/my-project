let tasks = [

];

const now = dayjs();

const formattedDate =now.format('dddd, MMMM D, YYYY');

const newDate = document.querySelector('.js-time-display');
newDate.textContent = formattedDate;

const input = document.querySelector('.js-collect-input');
const button = document.querySelector('.js-input-btn');

button.addEventListener("click", () => {
  const title = input.value.trim();

    if (title !== "") {
    addTask(title);        
    input.value = "";     
  }
});


function renderTasks(filter = "all") {
  const taskContainer = document.querySelector('.js-task-list');
  taskContainer.innerHTML = "";

  let filteredTasks = [];

  if (filter === "all") {
    filteredTasks = tasks; 
  } else if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

    if (filteredTasks.length === 0) {
    // ✅ Show message if no task matches the filter
    let message = "";
    if (filter === "active") message = "No active tasks available.";
    else if (filter === "completed") message = "No completed tasks available.";

    taskContainer.innerHTML = `<p class="empty-message">${message}</p>`;
    return;
  }

  filteredTasks.forEach(task => {
    taskContainer.innerHTML += `
      <div class="task-container" data-id="${task.id}">
        <div class="sub-task-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <p contenteditable="true" class="editP">${task.title}</p>
        </div>
        <button class="delete-btn" data-id="${task.id}"><img src="icon/trash-alt (2).png" alt=""></button>
      </div>
    `;
  });
};

let currentFilter = "all"

document.querySelector('.js-show-all').addEventListener("click", () => {
  currentFilter = "all"
   renderTasks(currentFilter);
   localStorage.setItem("filter", currentFilter);
});

document.querySelector('.js-show-active').addEventListener("click", () => {
  currentFilter = "active"
  renderTasks(currentFilter);
  localStorage.setItem("filter", currentFilter);
});
document.querySelector('.js-show-completed').addEventListener("click", () => {
  currentFilter = "completed"
  renderTasks(currentFilter);
  localStorage.setItem("filter", currentFilter);
  saveTasks();
});

document.querySelector('.js-task-list').addEventListener("keydown", (e) => {
  if (e.target.classList.contains("editP") && e.key === "Enter") {
    e.preventDefault(); 
    e.target.blur();  
  }
});

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    updateUI();
  }
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

function addTask(title) {
  const newTask = {
    id: Date.now(),
    title: title,
    completed: false
  };
  tasks.push(newTask);
  updateUI();
  saveTasks();
};

function toggleComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    updateUI();
    saveTasks();
  }
};


function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateUI();
  saveTasks();
};

const modal = document.querySelector(".deleteModal");
const confirmBtn = document.querySelector(".confirmDelete");
const cancelBtn = document.querySelector(".cancelDelete");

confirmBtn.addEventListener("click", () => {
  if (taskIdToDelete !== null) {
    deleteTask(taskIdToDelete);
    taskIdToDelete = null;
  }
// Hide modal
modal.classList.remove("show");
});

cancelBtn.addEventListener("click", () => {
  // Hide modal
modal.classList.remove("show");
  taskIdToDelete = null;
});

document.querySelector('.js-task-list').addEventListener("blur", (e) => {
  if (e.target.classList.contains("editP")) {
    const taskContainer = e.target.closest(".task-container");
    const id = Number(taskContainer.dataset.id);
    const task = tasks.find(t => t.id === id);

    if (task) {
      const newText = e.target.textContent.trim();
      if (newText) {
        task.title = newText;
        saveTasks();
      } else {
        e.target.textContent = task.title; // restore original title
      }
    }
  }
}, true); 


input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click(); // trigger add
  }
});






function updateUI() {
  renderTasks(currentFilter);
  /*const taskList = document.querySelector('.js-task-list');

  let html = "";
  tasks.forEach(task => {
    html += `
      <div class="task-container" data-id="${task.id}">
        <div class="sub-task-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <p contenteditable ="true" class="editP">${task.title}</p>
        </div>
        <button class="delete-btn" data-id="${task.id}"><img src="icon/trash-alt (2).png" alt=""></button>
      </div>
    `;
    
  });
  taskList.innerHTML = html;*/
};

let taskIdToDelete = null;

document.querySelector('.js-task-list').addEventListener('click', (e) => {
  const taskContainer = e.target.closest('.task-container');
  if (!taskContainer) return;

  const id = Number(taskContainer.dataset.id);

  // Open modal when delete button is clicked
    if (e.target.closest('button.delete-btn')) {
      taskIdToDelete = id;
      modal.classList.add("show"); // ✅ toggle class instead
      return;
    }


  if (e.target.matches('.task-checkbox')) {
    toggleComplete(id);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedFilter = localStorage.getItem("filter");
  if (savedFilter) currentFilter = savedFilter;
  loadTasks();
  renderTasks(currentFilter);
});


