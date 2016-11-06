
  function Controller() {
    this.init = function (view, model) {
      // получаем от вью статичные дом-элементы приложения
      const addTodoForm = view.getAddTodoForm();
      const tagContainer = view.getTagContainer();
      const todoList = view.getTodosList();

      // получаем от модели обработчики, связываем их со статичными дом-элементами
      const addTodoHandler = model.addNewTodo.bind(model, addTodoForm);
      const inputChangeHandler = model.createTagsFromInput.bind(null, tagContainer);
      const editTodoHandler = model.switchToEditMode.bind(null, addTodoForm);
      const removeTodoHandler = model.removeTodo.bind(model);
      const filterByTagHandler = model.filterByTag;

      // навешиваем обработчики на статичные дом-элементы
      addTodoForm.addEventListener('submit', addTodoHandler);
      addTodoForm.addEventListener('focus', inputChangeHandler);
      addTodoForm.addEventListener('input', inputChangeHandler);
      todoList.addEventListener('click', filterByTagHandler);

      // даем доступ к объектам и обработчикам, которые потребуются после инициализации контроллера
      this.model = model;
      this.view = view;
      this.removeTodoHandler = removeTodoHandler;
      this.editTodoHandler = editTodoHandler;

      this.renderTodos();
    };

    // навешиваем обработчики при каждом рендере приложения
    this.bindHandlers = function () {
      const removeTodoHandler = this.removeTodoHandler;
      const editTodoHandler = this.editTodoHandler;

      Array.prototype.forEach.call(this.view.getRemoveTodoButtons(), (button) => {
        button.addEventListener('click', removeTodoHandler, true);
      });

      Array.prototype.forEach.call(this.view.getEditTodoButtons(), (button) => {
        button.addEventListener('click', editTodoHandler, true);
      });
    };

    this.renderTodos = function () {
      const todos = this.model.getTodosData();
      this.view.renderTodos(todos);
      this.bindHandlers(todos);
    };

    this.getTaggedTodos = function () {
      return this.view.getTaggedTodos();
    };

    this.getTodosInEditMode = function () {
      return this.view.getTodosInEditMode();
    };
  }

  export default Controller;
