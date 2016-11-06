  function Model(controller) {
    this.getTodosData = function () {
      let todos = [];
      const todosInStorage = localStorage.getItem('todos');
      if (todosInStorage != null) {
        todos = JSON.parse(todosInStorage);
      }
      return todos;
    };


    this.addNewTodo = function (addTodoForm, e) {
      e.preventDefault();


      const todos = this.getTodosData();
      const newTodo = {
        title: addTodoForm.elements.title.value,
        text: addTodoForm.elements.text.value,
        id: (todos.length || 0),
        tags: !addTodoForm.tags.title && !addTodoForm.tags.text ? null : addTodoForm.tags,
      };
      if (addTodoForm.editing) {
        const replaceIndex = todos.findIndex(todo => todo.id == addTodoForm.editingId);

        newTodo.id = addTodoForm.editingId;
        todos[replaceIndex] = newTodo;
      } else {
        todos.push(newTodo);
      }
      localStorage.setItem('todos', JSON.stringify(todos));

      addTodoForm.elements.title.value = '';
      addTodoForm.elements.text.value = '';
      addTodoForm.tags = null;
      addTodoForm.editing = false;

      const inputEvent = new Event('input', { bubbles: true });
      addTodoForm.elements[0].dispatchEvent(inputEvent);
      addTodoForm.querySelector('button[type="submit"]').innerHTML = 'add todo';
      controller.renderTodos();
    };


    this.removeTodo = function (event) {
      const todoID = event.currentTarget.parentElement.getAttribute('id');
      const todos = this.getTodosData().filter(todo => !(todo.id == todoID));

      localStorage.setItem('todos', JSON.stringify(todos));

      controller.renderTodos();
    };


    this.createTagsFromInput = function (tagContainer, e) {
      const regex = /#[\S]+/g;
      const form = e.currentTarget;
      const inputName = e.target.name;
      form.tags = form.tags || {};
      form.tags[inputName] = e.target.value.match(regex);
      tagContainer.innerHTML = '';

      for (const key in form.tags) {
        if (form.tags[key]) {
          form.tags[key].forEach((tagName) => {
            const tag = document.createElement('span');
            tag.classList.add('tag');
            const tagText = document.createElement('span');
            tagText.classList.add('tag__text');
            tagText.innerHTML = tagName;
            tag.appendChild(tagText);
            tagContainer.appendChild(tag);
          });
        }
      }
    };


    this.filterByTag = function (e) {
      // проверяем, кликнули ли по тэгу
      let clickedTag = e.target;
      let clickedTagName;

      while (clickedTag !== this && clickedTag.parentElement !== null) {
        if (clickedTag.classList.contains('tag')) {
          clickedTagName = clickedTag.firstElementChild.innerHTML;
          break;
        }
        clickedTag = clickedTag.parentElement;
      }

      this.activeTags = this.activeTags || [];

      // если кликнули по тэгу - обновляем активные тэги
      if (clickedTagName) {
        if (!this.activeTags.includes(clickedTagName)) {
          this.activeTags.push(clickedTagName);
        } else if (this.activeTags.length === 1) {
          this.activeTags = this.activeTags.filter(activeTag => activeTag !== clickedTagName);
        } else {
          this.activeTags = [clickedTagName];
        }

        // присваиваем классы todo в зависимости от активных тэгов
        if (!this.activeTags.length) {
          Array.prototype.forEach.call(controller.getTaggedTodos(), (todo) => {
            todo.classList.remove('todo-item_unfiltered');
          });
        } else {
          Array.prototype.forEach.call(controller.getTaggedTodos(), (todo) => {
            const todoTag = todo.querySelector('.tag__text')
              ? todo.querySelector('.tag__text').innerHTML
              : null;
            this.activeTags.includes(todoTag)
              ? todo.classList.remove('todo-item_unfiltered')
              : todo.classList.add('todo-item_unfiltered');
          });
        }
      }
    };


    this.switchToEditMode = (addTodoForm, event) => {
      if (controller.getTodosInEditMode()) {
        controller.getTodosInEditMode().classList.remove('editing-mode');
      }

      // идем по цепочке родителей пока не найдем todo
      let oldTodo = event.target.parentElement;
      while (!oldTodo.classList.contains('todo-item')) {
        oldTodo = oldTodo.parentElement;
      }
      oldTodo.classList.add('editing-mode');
      addTodoForm.querySelector('button[type="submit"]').innerHTML = 'update todo';

      // заполняем поля ввода данным редактируемой todo
      Array.prototype.forEach.call(addTodoForm.querySelectorAll('.todo-form__input'), (inputField) => {
        inputField.value = oldTodo.querySelector(`.todo-item__${inputField.name}`).innerHTML;
      });

      // сообщаем форме, что находимся в режиме редактирования и передаем ID todo
      addTodoForm.editing = true;
      addTodoForm.editingId = oldTodo.getAttribute('id');
      const inputEvent = new Event('input', { bubbles: true });
      addTodoForm.elements[0].dispatchEvent(inputEvent);
      addTodoForm.elements[0].focus();
    };
  }

  export default Model;
