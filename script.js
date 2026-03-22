const form = document.querySelector('#item-form');
const todoInput = document.querySelector('#item-input');
const todoList = document.querySelector('#item-list');
const clearButton = document.querySelector('#clear');
const filterInput = document.querySelector('#filter');
const saveButton = document.querySelector('form > button');
const modalDialog = document.querySelector('dialog');

modalDialog
  .querySelector('#close-modal')
  .addEventListener('click', () => modalDialog.close());

let isInEditMode = false;
let todoBeingEdited = null;

const initApp = () => {
  const todos = getFromStorage('todos');

  todos.forEach((todo) => {
    const todoItem = createHtml(todo);
    todoList.appendChild(todoItem);
  });

  updateUI();
};

const handleAddTodo = (e) => {
  e.preventDefault();

  const todo = todoInput.value.trim();

  if (todo.length === 0) {
    showMessage('Du måste skriva en uppgift.');
    return;
  }

  const todos = Array.from(todoList.querySelectorAll('li'));
  const duplicateTodo = todos.find(
    (item) => item.firstChild.textContent.toLowerCase() === todo.toLowerCase(),
  );

  if (duplicateTodo && !isInEditMode) {
    showMessage(`"${todo}" finns redan i listan.`);
    return;
  }

  if (isInEditMode && todoBeingEdited) {
    const oldTodoText = todoBeingEdited.firstChild.textContent;

    todoBeingEdited.firstChild.textContent = todo;

    removeFromStorage(oldTodoText, 'todos');
    addToStorage(todo, 'todos');

    todoBeingEdited.classList.remove('edit-mode');
    todoBeingEdited = null;
    isInEditMode = false;

    saveButton.innerHTML =
      '<ion-icon name="add-circle-outline"></ion-icon> Lägg till uppgift';
    saveButton.classList.remove('btn-edit');
    saveButton.classList.add('btn');

    updateUI();
    return;
  }

  const todoItem = createHtml(todo);
  todoList.appendChild(todoItem);

  addToStorage(todo, 'todos');
  updateUI();
};

const clearTodoList = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }

  clearStorage('todos');
  updateUI();
};

const handleClickTodoItem = (e) => {
  const clickedElement = e.target;
  const deleteButton = clickedElement.closest('.btn-delete');
  const listItem = clickedElement.closest('li');

  if (!listItem) return;

  if (deleteButton) {
    const todoText = listItem.firstChild.textContent;

    listItem.remove();
    removeFromStorage(todoText, 'todos');

    if (todoList.children.length === 0) {
      clearStorage('todos');
    }

    updateUI();
    return;
  }

  if (!deleteButton) {
    listItem.classList.toggle('completed');
  }
};

const handleDoubleClickTodoItem = (e) => {
  const listItem = e.target.closest('li');

  if (!listItem) return;
  if (e.target.closest('.btn-delete')) return;

  isInEditMode = true;
  todoBeingEdited = listItem;

  todoList
    .querySelectorAll('li')
    .forEach((item) => item.classList.remove('edit-mode'));

  listItem.classList.add('edit-mode');
  todoInput.value = listItem.firstChild.textContent;
  todoInput.focus();

  saveButton.classList.add('btn-edit');
  saveButton.innerHTML =
    "<ion-icon name='create-outline'></ion-icon> Uppdatera uppgift";
};

const handleFilterTodos = (e) => {
  const todos = document.querySelectorAll('#item-list li');
  const filterValue = e.target.value.toLowerCase();

  todos.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(filterValue) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const updateUI = () => {
  todoInput.value = '';

  if (todoList.children.length === 0) {
    clearButton.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
  }
};

const showMessage = (message) => {
  modalDialog.querySelector('#message').textContent = message;
  modalDialog.showModal();
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleAddTodo);
clearButton.addEventListener('click', clearTodoList);
todoList.addEventListener('click', handleClickTodoItem);
todoList.addEventListener('dblclick', handleDoubleClickTodoItem);
filterInput.addEventListener('input', handleFilterTodos);