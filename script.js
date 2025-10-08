const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const remainingTasksEl = document.getElementById("remainingTasks");
const clearBtn = document.getElementById("clearAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} (${new Date(task.datetime).toLocaleString("ar-SA")})`;
    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  remainingTasksEl.textContent = remaining;
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const datetime = taskTime.value;

  if (!text || !datetime) {
    alert("يرجى إدخال نص المهمة ووقتها.");
    return;
  }

  tasks.push({ text, datetime, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskTime.value = "";
});

clearBtn.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من مسح جميع المهام؟")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

window.addEventListener("load", () => {
  renderTasks();
});
