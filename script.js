const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const remainingTasksEl = document.getElementById("remainingTasks");
const clearAllBtn = document.getElementById("clearAll");

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
    delBtn.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = tasks.filter(t => t.completed).length;
  remainingTasksEl.textContent = tasks.filter(t => !t.completed).length;
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const datetime = taskTime.value;
  if (!text || !datetime) {
    alert("يرجى إدخال نص المهمة ووقتها.");
    return;
  }
  tasks.push({ text, datetime, completed: false });
  taskInput.value = "";
  taskTime.value = "";
  saveTasks();
  renderTasks();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من حذف جميع المهام؟")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
