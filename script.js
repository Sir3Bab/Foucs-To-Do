const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const remainingTasksEl = document.getElementById("remainingTasks");

// تحميل المهام المحفوظة من localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// حفظ المهام في localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// عرض المهام في الصفحة
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.text} (${new Date(task.datetime).toLocaleString("ar-SA")})`;

    if (task.completed) li.classList.add("completed");

    // عند الضغط على المهمة يتم تفعيل أو إلغاء الإكمال
    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // زر الحذف الفردي
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = (e) => {
      e.stopPropagation(); // منع التفعيل عند الضغط على الزر
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);

    // تنبيه عند انتهاء وقت المهمة
    if (!task.completed && new Date(task.datetime) <= new Date()) {
      notifyUser(`انتهى وقت المهمة: ${task.text}`);
    }
  });

  // تحديث الإحصائيات
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  remainingTasksEl.textContent = remaining;
}

// إرسال إشعارات
function notifyUser(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message);
  }
}

// طلب الإذن بالإشعارات
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// إضافة مهمة جديدة
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

// حفظ المهام عند إغلاق أو تحديث الصفحة
window.addEventListener("beforeunload", () => {
  saveTasks();
});

// عند تحميل الصفحة
window.addEventListener("load", () => {
  renderTasks();
});

// زر "مسح جميع المهام"
const clearBtn = document.getElementById("clearAllBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("هل أنت متأكد من مسح جميع المهام؟")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });
}
