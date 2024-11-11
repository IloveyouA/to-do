const list = document.getElementById('taskList');
const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const message = document.getElementById('message');

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const showMessage = (text, isError = false) => {
  message.textContent = text;
  message.style.color = isError ? 'red' : 'green';
  setTimeout(() => (message.textContent = ''), 2000);
};

const loadTasks = async () => {
  try {
    const response = await fetch(`${API_URL}?_limit=5`);
    const tasks = await response.json();
    tasks.forEach(task => addTaskToDOM(task.title, task.id, task.completed));
  } catch {
    showMessage("Error loading tasks", true);
  }
};

const addTask = async (taskText) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskText, completed: false })
    });
    const task = await response.json();
    addTaskToDOM(task.title, task.id, task.completed);
    showMessage("Task added");
  } catch {
    showMessage("Error adding task", true);
  }
};

const toggleTaskCompletion = async (taskId, taskTextNode) => {
  try {
    await fetch(`${API_URL}/${taskId}`, { method: 'PUT', body: JSON.stringify({ completed: !taskTextNode.classList.contains('task-done') }) });
    taskTextNode.classList.toggle('task-done');
    showMessage("Task updated");
  } catch {
    showMessage("Error updating task", true);
  }
};

const deleteTask = async (taskId, listItem) => {
  try {
    await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
    list.removeChild(listItem);
    showMessage("Task deleted");
  } catch {
    showMessage("Error deleting task", true);
  }
};
const addTaskToDOM = (taskText, taskId, isCompleted = false) => {
  const listItem = document.createElement('li');
  const taskTextNode = document.createElement('span');
  taskTextNode.textContent = taskText;
  if (isCompleted) taskTextNode.classList.add('task-done');
  taskTextNode.addEventListener('click', () => toggleTaskCompletion(taskId, taskTextNode));

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'edit-button';
  editButton.addEventListener('click', () => {
    const newText = prompt("Edit your task:", taskTextNode.textContent);
    if (newText) taskTextNode.textContent = newText;
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', () => deleteTask(taskId, listItem));

  listItem.appendChild(taskTextNode);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  list.appendChild(listItem);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return showMessage("Enter a task", true);
  addTask(taskText);
  input.value = '';
});

window.addEventListener('load', loadTasks);
