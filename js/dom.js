export const createHtml = (todoName) => {
  const li = document.createElement('li');
  li.textContent = todoName;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn-delete');

  const icon = document.createElement('ion-icon');
  icon.setAttribute('name', 'trash-bin-outline');

  deleteButton.appendChild(icon);

  li.appendChild(deleteButton);

  return li;
};

if (typeof window !== 'undefined') {
  window.createHtml = createHtml;
}
