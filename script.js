const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasksBtn = document.getElementById("clearTasksBtn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} - ${task.date || "بدون موعد"}`;
    if (task.completed) li.classList.add("completed");
    li.addEventListener("click", () => toggleTask(index));
    taskList.appendChild(li);
  });
  updateStats();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  if (text === "") return alert("أدخل مهمة أولاً!");
  tasks.push({ text, date, completed: false });
  taskInput.value = "";
  taskDate.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function clearTasks() {
  if (confirm("هل أنت متأكد من مسح جميع المهام؟")) {
    tasks = [];
    renderTasks();
  }
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  remainingTasks.textContent = total - completed;
}

addTaskBtn.addEventListener("click", addTask);
clearTasksBtn.addEventListener("click", clearTasks);
renderTasks();
