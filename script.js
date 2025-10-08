const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const remainingTasksEl = document.getElementById("remainingTasks");

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
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);

    if (!task.completed && new Date(task.datetime) <= new Date()) {
      notifyUser(`انتهى وقت المهمة: ${task.text}`);
    }
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  remainingTasksEl.textContent = remaining;
}

function notifyUser(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
  }
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const datetime = taskTime.value;

  if (text === "" || datetime === "") {
    alert("يرجى إدخال نص المهمة ووقتها.");
    return;
  }

  tasks.push({ text, datetime, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskTime.value = "";
});

renderTasks();
