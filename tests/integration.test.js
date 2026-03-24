import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createHtml } from '../js/dom.js';
import {
  STORAGE_KEY,
  getFromStorage,
  addToStorage,
  handleAddTodo,
  handleClickTodoItem,
  clearTodoList,
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
 
describe('clearTodoList', () => {
  beforeEach(() => {
    buildDOM();
    localStorage.clear();
  });
 
  it('removes all <li> elements from the list', () => {
    ['A', 'B', 'C'].forEach(addItemToDOM);
    clearTodoList();
    expect(document.querySelector('.items').children.length).toBe(0);
  });
 
  it('clears localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['A', 'B']));
    addItemToDOM('A');
    clearTodoList();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
 
  it('does not throw when the list is already empty', () => {
    expect(() => clearTodoList()).not.toThrow();
  });
 
  it('hides the clear button after clearing', () => {
    addItemToDOM('Item');
    clearTodoList();
    expect(document.querySelector('#clear').hidden).toBe(true);
  });
});
 
describe('handleAddTodo', () => {
  beforeEach(() => {
    buildDOM();
    localStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());
 
  function submit(value) {
    document.querySelector('#item-input').value = value;
    handleAddTodo(new Event('submit', { bubbles: true, cancelable: true }));
  }
 
  it('adds a todo to the DOM on valid input', () => {
    submit('Köp äpplen');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(1);
  });
 
  it('does not add anything when input is empty', () => {
    submit('');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(0);
  });
 
  it('does not add a duplicate', () => {
    submit('Köp äpplen');
    submit('Köp äpplen');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(1);
  });
 
  it('duplicate check is case-insensitive', () => {
    submit('Köp äpplen');
    submit('KÖP ÄPPLEN');
    expect(document.querySelector('.items').querySelectorAll('li').length).toBe(1);
  });
 
  it('clears the input after a successful add', () => {
    submit('Skriv rapport');
    expect(document.querySelector('#item-input').value).toBe('');
  });
 
  it('saves the new todo to localStorage', () => {
    submit('Skriv rapport');
    expect(getFromStorage(STORAGE_KEY)).toContain('Skriv rapport');
  });
 
  it('shows the modal when input is empty', () => {
    submit('');
    expect(document.querySelector('dialog').showModal).toHaveBeenCalled();
  });
 
  it('shows the modal on a duplicate submission', () => {
    submit('Dubblett');
    submit('Dubblett');
    expect(document.querySelector('dialog').showModal).toHaveBeenCalledTimes(1);
  });
 
  it('calls e.preventDefault()', () => {
    document.querySelector('#item-input').value = 'Test';
    const e = new Event('submit', { bubbles: true, cancelable: true });
    const spy = vi.spyOn(e, 'preventDefault');
    handleAddTodo(e);
    expect(spy).toHaveBeenCalled();
  });
 
  it('shows the clear button after adding the first item', () => {
    submit('Första');
    expect(document.querySelector('#clear').hidden).toBe(false);
  });
});
 
describe('handleClickTodoItem', () => {
  beforeEach(() => {
    buildDOM();
    localStorage.clear();
  });
 
  function clickTarget(target) {
    const e = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(e, 'target', { value: target, configurable: true });
    handleClickTodoItem(e);
  }
 
  it('removes the todo when the delete button is clicked', () => {
    const li = addItemToDOM('Radera mig');
    clickTarget(li.querySelector('.btn-delete'));
    expect(document.querySelector('.items').contains(li)).toBe(false);
  });
 
  it('removes the todo when the ion-icon inside delete is clicked', () => {
    const li = addItemToDOM('Radera via ikon');
    clickTarget(li.querySelector('ion-icon'));
    expect(document.querySelector('.items').contains(li)).toBe(false);
  });
 
  it('does not remove a todo when clicking the <li> text area', () => {
    const li = addItemToDOM('Behåll mig');
    clickTarget(li);
    expect(document.querySelector('.items').contains(li)).toBe(true);
  });
 
  it('does nothing when the list is empty', () => {
    const e = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(e, 'target', {
      value: document.querySelector('.items'),
      configurable: true,
    });
    expect(() => handleClickTodoItem(e)).not.toThrow();
  });
 
  it('removes only the correct item when multiple todos exist', () => {
    const liA = addItemToDOM('Behåll A');
    const liB = addItemToDOM('Ta bort B');
    clickTarget(liB.querySelector('.btn-delete'));
    expect(document.querySelector('.items').contains(liA)).toBe(true);
    expect(document.querySelector('.items').contains(liB)).toBe(false);
  });
 
  it('removes the item from localStorage', () => {
    addToStorage('Radera mig', STORAGE_KEY);
    const li = addItemToDOM('Radera mig');
    clickTarget(li.querySelector('.btn-delete'));
    expect(getFromStorage(STORAGE_KEY)).not.toContain('Radera mig');
  });
 
  it('clears localStorage when the last item is deleted', () => {
    addToStorage('Sista', STORAGE_KEY);
    const li = addItemToDOM('Sista');
    clickTarget(li.querySelector('.btn-delete'));
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
