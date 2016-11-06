function View() {
  this.getAddTodoButton = () => document.querySelector('.todo-form__add-btn');

  this.getAddTodoForm = () => document.forms[0];

  this.getInputFields = () => document.getElementsByTagName('input');

  this.getTagContainer = () => document.querySelector('.todo-form__tag-container');

  this.getTaggedTodos = () => document.querySelectorAll('.todo-item');

  this.getTodosList = () => document.querySelector('.todo-app__list');

  this.getTodosInEditMode = () => document.querySelector('.editing-mode');

  this.getRemoveTodoButtons = () => document.querySelectorAll('.todo-item__remove-todo-wrapper');

  this.getEditTodoButtons = () => document.querySelectorAll('.todo-item__edit-todo-wrapper');

  this.getTags = () => document.querySelectorAll('.tag');

  this.renderTodos = (todos) => {
    const templateSource = document.getElementById('todo-template').innerHTML;
    const compiledSource = Handlebars.compile(templateSource);
    let HTMLstring = '';

    todos.forEach((todo) => {
      HTMLstring += compiledSource(todo);
    });
    document.querySelector('.todo-app__list').innerHTML = HTMLstring;
  };
}

export default View;
