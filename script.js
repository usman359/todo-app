const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const categorySelect = document.getElementById("category-select");
const navLinks = document.querySelectorAll(".nav-link");
const html = document.documentElement;

// Key used to store tasks in the browser's localStorage
const STORAGE_KEY = "todo-tasks";

// Array of task objects: { text, category, completed }
let tasks = [];

// Theme toggle
themeToggle.addEventListener("click", function () {
  const isDark = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  themeToggle.textContent = isDark ? "Dark Mode" : "Light Mode";
});

// Page navigation
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const targetPage = link.getAttribute("data-page");

    navLinks.forEach(function (l) { l.classList.remove("active"); });
    link.classList.add("active");

    document.querySelectorAll(".page").forEach(function (page) {
      page.classList.add("hidden");
    });
    document.getElementById("page-" + targetPage).classList.remove("hidden");
  });
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Save the tasks array to localStorage as JSON text
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage and show them on the page
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  tasks = JSON.parse(saved);

  tasks.forEach(function (task) {
    renderTask(task);
  });
}

// Build one task row on the page from a task object
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  if (task.completed) {
    li.classList.add("completed");
  }

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.className = "complete-btn";
  completeBtn.setAttribute("aria-label", "Mark task as complete");

  if (task.completed) {
    completeBtn.disabled = true;
  }

  completeBtn.addEventListener("click", function () {
    task.completed = true;
    li.classList.add("completed");
    completeBtn.disabled = true;
    saveTasks();
  });

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = task.text;

  const badge = document.createElement("span");
  badge.className = "category-badge category-" + task.category;
  badge.textContent =
    task.category.charAt(0).toUpperCase() + task.category.slice(1);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("aria-label", "Delete task");
  deleteBtn.addEventListener("click", function () {
    deleteTask(task, li);
  });

  li.appendChild(completeBtn);
  li.appendChild(taskText);
  li.appendChild(badge);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Remove a task from the list and save the change
function deleteTask(task, li) {
  const index = tasks.indexOf(task);

  if (index > -1) {
    tasks.splice(index, 1);
  }

  li.remove();
  saveTasks();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    return;
  }

  const category = categorySelect.value;

  const task = {
    text: text,
    category: category,
    completed: false,
  };

  tasks.push(task);
  renderTask(task);
  saveTasks();

  taskInput.value = "";
  taskInput.focus();
}

// Load saved tasks when the app starts
loadTasks();
