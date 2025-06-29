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

  filteredTasks.forEach(task => {
    taskContainer.innerHTML += `
      <div class="task-container" data-id="${task.id}">
        <div class="sub-task-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <p>${task.title}</p>
        </div>
        <button><img src="icon/trash-alt (2).png" alt=""></button>
      </div>
    `;
  });
};

document.querySelector('.js-show-all').addEventListener("click", () => {
   renderTasks("all");
});

document.querySelector('.js-show-active').addEventListener("click", () => {
  renderTasks("active");
});
document.querySelector('.js-show-completed').addEventListener("click", () => {
  renderTasks("completed");
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

  console.log(tasks);
};

function toggleComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    updateUI();
  }
};


function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateUI();
};


function updateUI() {
  const taskList = document.querySelector('.js-task-list');

  let html = "";
  tasks.forEach(task => {
    html += `
      <div class="task-container" data-id="${task.id}">
        <div class="sub-task-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <p>${task.title}</p>
        </div>
        <button><img src="icon/trash-alt (2).png" alt=""></button>
      </div>
    `;
    
  });
  taskList.innerHTML = html;
};

document.querySelector('.js-task-list').addEventListener('click', (e) => {
    const taskContainer = e.target.closest('.task-container');
    if (!taskContainer) return;
    
    const id = Number(taskContainer.dataset.id);
    
    if(e.target.closest('button')) {
      deleteTask(id);
    };

    if (e.target.matches('.task-checkbox')) {
    toggleComplete(id);
  }
})


