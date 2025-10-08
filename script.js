const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const clearAll = document.getElementById('clearAll');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateStats() {
  totalTasks.textContent = tasks.length;
  const done = tasks.filter(t => t.done).length;
  completedTasks.textContent = done;
  pendingTasks.textContent = tasks.length - done;
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = task.done ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text} ${task.date ? '📅 ' + task.date : ''}</span>
      <div>
        <button onclick="toggleTask(${i})">✔</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  if (!text) return alert('اكتب مهمة أولاً!');
  tasks.push({ text, date, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskDate.value = '';
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

clearAll.onclick = () => {
  if (confirm('هل أنت متأكد من مسح جميع المهام؟')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
};

addTaskBtn.onclick = addTask;
window.onload = renderTasks;
