import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createHtml } from '../js/dom.js';
import {
  STORAGE_KEY,
  isTodoListEmpty,
  isDuplicateTodo,
  showModalError,
  addTodoToUI,
  isDeleteButtonClicked,
  deleteTodoItem,
  clearTodoInput,
  updateClearButtonVisibility,
  updateUI,
} from '../js/script.js';
 
function buildDOM() {
  document.body.innerHTML = `
    <form>
      <input id="item-input" type="text" />
      <button type="submit">Lägg till</button>
    </form>
    <ul class="items"></ul>
    <button id="clear" hidden>Rensa lista</button>
    <dialog>
      <p id="message"></p>
      <button id="close-modal">Stäng</button>
    </dialog>
  `;
  const dialog = document.querySelector('dialog');
  dialog.showModal = vi.fn();
  dialog.close = vi.fn();
}
 
function addItemToDOM(text) {
  const li = createHtml(text);
  document.querySelector('.items').appendChild(li);
  return li;
}
 
describe('isTodoListEmpty', () => {
  beforeEach(buildDOM);
 
  it('returns true when the list has no children', () => {
    expect(isTodoListEmpty()).toBe(true);
  });
 
  it('returns false when the list has at least one item', () => {
    addItemToDOM('Något');
    expect(isTodoListEmpty()).toBe(false);
  });
});
 
describe('isDuplicateTodo', () => {
  beforeEach(() => {
    buildDOM();
    addItemToDOM('Köp mjölk');
  });
 
  it('returns true for an exact match', () => {
    expect(isDuplicateTodo('Köp mjölk')).toBe(true);
  });
 
  it('is case-insensitive', () => {
    expect(isDuplicateTodo('KÖP MJÖLK')).toBe(true);
    expect(isDuplicateTodo('köp mjölk')).toBe(true);
  });
 
  it('returns false when no match exists', () => {
    expect(isDuplicateTodo('Gå ut med hunden')).toBe(false);
  });
 
  it('returns false when the list is empty', () => {
    document.querySelector('.items').innerHTML = '';
    expect(isDuplicateTodo('Vad som helst')).toBe(false);
  });
});
 
describe('showModalError', () => {
  beforeEach(buildDOM);
  afterEach(() => vi.restoreAllMocks());
 
  it('sets #message innerHTML to the given string', () => {
    showModalError('Något gick fel');
    expect(document.querySelector('#message').innerHTML).toBe('Något gick fel');
  });
 
  it('calls dialog.showModal()', () => {
    showModalError('Test');
    expect(document.querySelector('dialog').showModal).toHaveBeenCalledTimes(1);
  });
 
  it('accepts HTML content in the message', () => {
    showModalError('<h1><i>Dubblett</i></h1>');
    expect(document.querySelector('#message h1')).not.toBeNull();
  });
});
 
describe('addTodoToUI', () => {
  beforeEach(buildDOM);
 
  it('appends one <li> to the list', () => {
    addTodoToUI('Mata katten');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(1);
  });
 
  it('the <li> text lives in firstChild.textContent', () => {
    addTodoToUI('Mata katten');
    expect(document.querySelector('.items li').firstChild.textContent).toBe('Mata katten');
  });
 
  it('stacks multiple items without replacing existing ones', () => {
    addTodoToUI('Första');
    addTodoToUI('Andra');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(2);
  });
});
 
describe('isDeleteButtonClicked', () => {
  it('returns true when target is the .btn-delete button', () => {
    const li = createHtml('Test');
    expect(isDeleteButtonClicked(li.querySelector('.btn-delete'))).toBe(true);
  });
 
  it('returns true when target is the ion-icon inside .btn-delete', () => {
    const li = createHtml('Test');
    expect(isDeleteButtonClicked(li.querySelector('ion-icon'))).toBe(true);
  });
 
  it('returns false when target is the <li> itself', () => {
    expect(isDeleteButtonClicked(createHtml('Test'))).toBe(false);
  });
 
  it('returns false for null', () => {
    expect(isDeleteButtonClicked(null)).toBe(false);
  });
 
  it('returns false for a plain text node', () => {
    expect(isDeleteButtonClicked(document.createTextNode('hello'))).toBe(false);
  });
});
 
describe('clearTodoInput', () => {
  beforeEach(buildDOM);
 
  it('resets the input value to an empty string', () => {
    document.querySelector('#item-input').value = 'skriven text';
    clearTodoInput();
    expect(document.querySelector('#item-input').value).toBe('');
  });
 
  it('does not throw when input is already empty', () => {
    expect(() => clearTodoInput()).not.toThrow();
  });
});
 
describe('updateClearButtonVisibility', () => {
  beforeEach(buildDOM);
 
  it('sets hidden=true when the list is empty', () => {
    updateClearButtonVisibility();
    expect(document.querySelector('#clear').hidden).toBe(true);
  });
 
  it('adds class "hidden" when the list is empty', () => {
    updateClearButtonVisibility();
    expect(document.querySelector('#clear').classList.contains('hidden')).toBe(true);
  });
 
  it('sets hidden=false when the list has items', () => {
    addItemToDOM('Item');
    updateClearButtonVisibility();
    expect(document.querySelector('#clear').hidden).toBe(false);
  });
 
  it('removes class "hidden" when the list has items', () => {
    addItemToDOM('Item');
    updateClearButtonVisibility();
    expect(document.querySelector('#clear').classList.contains('hidden')).toBe(false);
  });
});
 
describe('deleteTodoItem', () => {
  beforeEach(() => {
    buildDOM();
    localStorage.clear();
  });
 
  it('removes the <li> from the DOM', () => {
    const li = addItemToDOM('Ta bort mig');
    deleteTodoItem(li);
    expect(document.querySelector('.items').contains(li)).toBe(false);
  });
 
  it('removes the item from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Ta bort mig']));
    const li = addItemToDOM('Ta bort mig');
    deleteTodoItem(li);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).not.toContain('Ta bort mig');
  });
 
  it('clears localStorage when the list becomes empty', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Sista']));
    const li = addItemToDOM('Sista');
    deleteTodoItem(li);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
 
  it('does NOT clear localStorage when other items still remain', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Behåll', 'Ta bort']));
    addItemToDOM('Behåll');
    const li = addItemToDOM('Ta bort');
    deleteTodoItem(li);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });
 
  it('clears the input field after deletion via updateUI', () => {
    document.querySelector('#item-input').value = 'nåt';
    const li = addItemToDOM('Item');
    deleteTodoItem(li);
    expect(document.querySelector('#item-input').value).toBe('');
  });
});
 
describe('updateUI', () => {
  beforeEach(buildDOM);
 
  it('clears the input field', () => {
    document.querySelector('#item-input').value = 'test';
    updateUI();
    expect(document.querySelector('#item-input').value).toBe('');
  });
 
  it('hides the clear button when the list is empty', () => {
    updateUI();
    expect(document.querySelector('#clear').hidden).toBe(true);
  });
 
  it('shows the clear button when the list has items', () => {
    addItemToDOM('Item');
    updateUI();
    expect(document.querySelector('#clear').hidden).toBe(false);
  });
});
