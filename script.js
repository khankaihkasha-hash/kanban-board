const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");

const todo = document.getElementById("todo");
const doing = document.getElementById("doing");
const doneCol = document.getElementById("doneCol");

const todoP = document.getElementById("todoPercent");
const doingP = document.getElementById("doingPercent");
const doneP = document.getElementById("donePercent");

let tasks = [];

/* Force empty board first time */
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}
tasks = JSON.parse(localStorage.getItem("tasks"));

render();

addBtn.onclick = () => {
  if (taskInput.value.trim() === "") return;

  tasks.push({
    text: taskInput.value,
    priority: priority.value,
    status: "todo"
  });

  taskInput.value = "";
  save();
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function render() {
  clearTasks(todo);
  clearTasks(doing);
  clearTasks(doneCol);

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task " + task.priority;
    div.draggable = true;
    div.dataset.index = index;

    div.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="removeTask(${index})">🗑</button>
      </div>
    `;

    div.ondragstart = () => div.classList.add("dragging");
    div.ondragend = () => div.classList.remove("dragging");

    if (task.status === "todo") todo.appendChild(div);
    if (task.status === "doing") doing.appendChild(div);
    if (task.status === "done") doneCol.appendChild(div);
  });

  updatePercent();
  updateStats();
}

/* Keeps headings intact */
function clearTasks(column) {
  const tasks = column.querySelectorAll(".task");
  tasks.forEach(t => t.remove());
}

function removeTask(index) {
  tasks.splice(index, 1);
  save();
}

function updatePercent() {
  const total = tasks.length;
  const todoCount = tasks.filter(t => t.status === "todo").length;
  const doingCount = tasks.filter(t => t.status === "doing").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  todoP.innerText = "Todo: " + (total ? Math.round(todoCount / total * 100) : 0) + "%";
  doingP.innerText = "Doing: " + (total ? Math.round(doingCount / total * 100) : 0) + "%";
  doneP.innerText = "Done: " + (total ? Math.round(doneCount / total * 100) : 0) + "%";
}

/* Drag & Drop */
[todo, doing, doneCol].forEach(column => {
  column.ondragover = e => e.preventDefault();
  column.ondrop = () => {
    const dragged = document.querySelector(".dragging");
    if (!dragged) return;

    const index = dragged.dataset.index;
    if (column === todo) tasks[index].status = "todo";
    if (column === doing) tasks[index].status = "doing";
    if (column === doneCol) tasks[index].status = "done";

    save();
  };
});

/* Search */
search.onkeyup = () => {
  const val = search.value.toLowerCase();
  document.querySelectorAll(".task").forEach(task => {
    task.style.display = task.innerText.toLowerCase().includes(val) ? "flex" : "none";
  });
};

/* Theme Toggle */
document.getElementById("themeToggle").onchange = e => {
  document.body.classList.toggle("dark", e.target.checked);
};
function updateStats() {
  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === "done").length;
  const pendingCount = totalCount - doneCount;

  document.getElementById("total").innerText = "Total: " + totalCount;
  document.getElementById("done").innerText = "Done: " + doneCount;
  document.getElementById("pending").innerText = "Pending: " + pendingCount;
}
