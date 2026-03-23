import { createHtml } from './dom.js';

export const STORAGE_KEY = 'todos';

const getRefs = () => ({
  form: document.querySelector('form'),
  todoInput: document.querySelector('#item-input'),
  todoList: document.querySelector('.items'),
  clearButton: document.querySelector('#clear'),
  modalDialog: document.querySelector('dialog'),
});

export const getFromStorage = (key) =>
  JSON.parse(localStorage.getItem(key) ?? '[]');

export const addToStorage = (todo, key) => {
  const todos = getFromStorage(key);
  localStorage.setItem(key, JSON.stringify([...todos, todo]));
};

export const removeFromStorage = (todo, key) => {
  const todos = getFromStorage(key).filter((item) => item !== todo);
  localStorage.setItem(key, JSON.stringify(todos));
};

export const clearStorage = (key) => localStorage.removeItem(key);

export const isTodoListEmpty = () => getRefs().todoList.children.length === 0;

export const showModalError = (message) => {
  const { modalDialog } = getRefs();
  modalDialog.querySelector('#message').innerHTML = message;
  modalDialog.showModal();
};

export const isValidTodo = (todo) => {
  if (todo.length === 0) {
    showModalError('Lägg in vad ska du göra!');
    return false;
  }

  return true;
};

export const isDuplicateTodo = (todo) => {
  const { todoList } = getRefs();
  const normalizedTodo = todo.toLowerCase();
  const todos = Array.from(todoList.querySelectorAll('li'));

  return todos.some(
    (item) => item.firstChild.textContent.toLowerCase() === normalizedTodo,
  );
};

export const addTodoToUI = (todo) => getRefs().todoList.appendChild(createHtml(todo));

export const clearTodoInput = () => { getRefs().todoInput.value = ''; };

export const updateClearButtonVisibility = () => {
  const { clearButton } = getRefs();
  const hasItems = !isTodoListEmpty();
  clearButton.hidden = !hasItems;
  clearButton.classList.toggle('hidden', !hasItems);
};

export const isDeleteButtonClicked = (target) =>
  target instanceof Element && Boolean(target.closest('.btn-delete'));
export const deleteTodoItem = (todoItem) => {
  const todoText = todoItem.firstChild.textContent;

  todoItem.remove();
  removeFromStorage(todoText, STORAGE_KEY);

  if (isTodoListEmpty()) {
    clearStorage(STORAGE_KEY);
  }

  updateUI();
};

const initApp = () => {
  const todos = getFromStorage(STORAGE_KEY);
  todos.forEach((todo) => addTodoToUI(todo));
  updateUI();
};

export const handleAddTodo = (e) => {
  const { todoInput } = getRefs();
  e.preventDefault();
  const todo = todoInput.value.trim();

  if (!isValidTodo(todo)) {
    return;
  }

  if (isDuplicateTodo(todo)) {
    showModalError(`<h1><i>${todo} finns redan i listan.</i></h1>`);
    updateUI();
    return;
  }

  addTodoToUI(todo);
  addToStorage(todo, STORAGE_KEY);
  updateUI();
};

export const clearTodoList = () => {
  const { todoList } = getRefs();

  if (isTodoListEmpty()) {
    return;
  }

  todoList.replaceChildren();
  clearStorage(STORAGE_KEY);
  updateUI();
};

export const handleClickTodoItem = (e) => {
  if (isTodoListEmpty()) {
    return;
  }

  if (!isDeleteButtonClicked(e.target)) {
    return;
  }

  const deleteButton = e.target.closest('.btn-delete');
  const todoItem = deleteButton?.closest('li');

  if (!todoItem) {
    return;
  }

  deleteTodoItem(todoItem);
};

export const updateUI = () => {
  clearTodoInput();
  updateClearButtonVisibility();
};

const registerListeners = () => {
  const { form, clearButton, todoList, modalDialog } = getRefs();

  modalDialog
    .querySelector('#close-modal')
    .addEventListener('click', () => modalDialog.close());

  form.addEventListener('submit', handleAddTodo);
  clearButton.addEventListener('click', clearTodoList);
  todoList.addEventListener('click', handleClickTodoItem);
};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    registerListeners();
    initApp();
  });
}
