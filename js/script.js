const form = document.querySelector('form');
const todoInput = document.querySelector('#item-input');
const todoList = document.querySelector('.items');
const clearButton = document.querySelector('#clear');
const modalDialog = document.querySelector('dialog');

modalDialog
  .querySelector('#close-modal')
  .addEventListener('click', () => modalDialog.close());

const initApp = () => {
  const todos = getFromStorage('todos');
  todos.forEach((todo) => todoList.appendChild(createHtml(todo)));
  updateUI();
};

const handleAddTodo = (e) => {
  e.preventDefault();
  const todo = todoInput.value.trim();

  if (todo.length === 0) {
    modalDialog.querySelector('#message').textContent = 'Lägg in vad ska du göra!';
    modalDialog.showModal();
    return;
  }

  const todos = Array.from(todoList.querySelectorAll('li'));
    if (
      todos.find(
        (item) =>
          item.innerText.toLowerCase() === todoInput.value.toLowerCase(),
      )
    ) 
    {
      modalDialog.querySelector('#message').innerHTML =
        `<h1><i>${todoInput.value} finns redan i listan.</i></h1>`;
      modalDialog.showModal();
      updateUI();
      return;
    }

  todoList.appendChild(createHtml(todo));
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
  if (todoList.children.length === 0) {
    return;
  }

  if (e.target.parentElement.classList.contains('btn-delete')) {
    e.target.parentElement.parentElement.remove();

    removeFromStorage(
      e.target.parentElement.parentElement.innerText,
      'todos',
    );

    if (todoList.children.length === 0) {
      clearStorage('todos');
      updateUI();
    }
  } else {}
};

const updateUI = () => {
  todoInput.value = '';

  clearButton.style.display =
  todoList.children.length === 0 ? 'none' : 'block';
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleAddTodo);
clearButton.addEventListener('click', clearTodoList);
todoList.addEventListener('click', handleClickTodoItem);
