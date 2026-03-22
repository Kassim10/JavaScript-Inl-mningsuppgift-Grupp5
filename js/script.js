const form = document.querySelector('form');
const todoInput = document.querySelector('#item-input');
const todoList = document.querySelector('.items');
const clearButton = document.querySelector('#clear');
const filterInput = document.querySelector('#filter');
const saveButton = document.querySelector('form > button');
const modalDialog = document.querySelector('dialog');

modalDialog
  .querySelector('#close-modal')
  .addEventListener('click', () => modalDialog.close());

let isInEditMode = false;

const initApp = () => {
  const todos = getFromStorage('todos');
  todos.forEach((todo) => todoList.appendChild(createHtml(todo)));
  updateUI();
};

const handleAddTodo = (e) => {
  e.preventDefault();
  const todo = todoInput.value;

  if (todo.length === 0) {
    modalDialog.querySelector('#message').textContent = 'Lägg in vad ska du göra!';
    modalDialog.showModal();
    return;
  }

  if (todo.length > 0) {
    if (isInEditMode) {
      const todoToUpdate = todoList.querySelector('.edit-mode');
      todoToUpdate.classList.remove('.edit-mode');
      todoToUpdate.remove();

      removeFromStorage(todoToUpdate.innerText, 'todos');

      isInEditMode = false;
    }

    if (todoList.querySelector('li') !== null) {
      const todos = Array.from(todoList.querySelectorAll('li'));

      if (
        todos.find(
          (item) =>
            item.innerText.toLowerCase() === todoInput.value.toLowerCase(),
        )
      ) {
        modalDialog.querySelector('#message').innerHTML =
          `<h1><i>${todoInput.value} finns redan i listan.</i></h1>`;
        modalDialog.showModal();
        updateUI();
        return;
      }
    }

    todoList.appendChild(createHtml(todo));

    saveButton.innerHTML =
      '<ion-icon name="add-circle-outline"></ion-icon> Lägg till';
    saveButton.classList.remove('btn-edit');
    saveButton.classList.add('btn');

    addToStorage(todoInput.value, 'todos');
    updateUI();
  }
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
  } else {
    isInEditMode = true;

    todoList
      .querySelectorAll('li')
      .forEach((item) => item.classList.remove('edit-mode'));

    todoInput.value = e.target.textContent;

    e.target.classList.add('edit-mode');

    saveButton.classList.add('btn-edit');
    saveButton.innerHTML =
      "<ion-icon name='create-outline'></ion-icon> Uppdatera";
  }
};

const handleFilterTodos = (e) => {
  const groceries = document.querySelectorAll('li');
  const filterValue = e.target.value.toLowerCase();
  groceries.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(filterValue) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const updateUI = () => {
  todoInput.value = '';
  todoList.children.length === 0
    ? (clearButton.style.display = 'none')
    : (clearButton.style.display = 'block');
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleAddTodo);
clearButton.addEventListener('click', clearTodoList);
todoList.addEventListener('click', handleClickTodoItem);
filterInput.addEventListener('input', handleFilterTodos);
