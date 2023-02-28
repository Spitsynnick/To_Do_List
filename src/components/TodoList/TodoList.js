import React from "react";
import Button from "../Button/Button";
import TodoItem from "../TodoItem/TodoItem";
import "./TodoList.css";

// компонент TodoList: рендерит основные части приложения: header, main, footer
class TodoList extends React.Component {
  constructor() {
    super();
    
    this.state = { 
      todoList: [], 
      inputValue: "", 
      isHintVisible: false,       
      changeLog: [], 
      count: 0 
    };

    this.addInputRef = React.createRef();
  };

  // метод жизненного цикла: после монтирования компонента, если в localtorage имеются свойства состояния компонента, сохраненные в предыдущую сессию, - извлечь их и обновить состояние; также назначить обработчик события покидания пользователем страницы
  componentDidMount() {
    window.addEventListener("unload", this.handleWindowClose);
    
    const storageTodoList = localStorage.getItem("todoList");    
    const storageInputValue = localStorage.getItem("inputValue");        
    const storageChangeLog = localStorage.getItem("changeLog");    
    const storageCount = localStorage.getItem("count");
       
    this.setState({ 
      todoList: storageTodoList ? JSON.parse(storageTodoList) : [],     
      inputValue: storageInputValue ? storageInputValue : "", 
      isHintVisible: false,    
      changeLog: storageChangeLog ? JSON.parse(storageChangeLog) : [],
      count: storageCount ? storageCount : 0
    });      
  };

  // метод жизненного цикла: перед размонтированием компонента удалить обработчик события покидания пользователем страницы, назначенный в componentDidMount
  componentWillUnmount() {
    window.removeEventListener("unload", this.handleWindowClose);
  }

  // обработчик события покидания пользователем страницы: записать в localtorage свойства состояния компонента
  handleWindowClose = () => {    
    const { todoList, inputValue, changeLog, count } = this.state;

    localStorage.setItem("todoList", JSON.stringify(todoList));
    localStorage.setItem("inputValue", inputValue);    
    localStorage.setItem("changeLog", JSON.stringify(changeLog));
    localStorage.setItem("count", count);
  };

  // обработчик ввода значения в input для добавления новой задачи
  onChangeInput = (e) => {    
    this.setState({
      inputValue: e.target.value,
      isHintVisible: false 
    })
  };

  // обработчик нажатия кнопки добавления новой задачи
  onAddTask = () => {
    const { inputValue, todoList } = this.state; 
    
    if (!inputValue || /^\s+$/.test(inputValue)) {
      this.addInputRef.current.focus();

      this.setState({        
        isHintVisible: true     
      });

      return;
    };

    this.setState({
      todoList: [...todoList, { name: inputValue, checked: false, readonly: true, autofocus: false }],
      inputValue: "",
      changeLog: this.onRecordTaskChange("add", inputValue)           
    });
  };

  // обработчик изменения флажка задачи (выполнена/не выполнена); также изменяет в состоянии счетчик количества выполненных задач
  onChangeCheckbox = (taskName, checked, itemIndex) => { 
    let taskCounter = 0;
    
    const newTodoList = this.state.todoList.map((item, index) => 
      index === itemIndex ? {...item, checked: !checked} : item,      
    );
    
    newTodoList.forEach(item => item.checked && taskCounter++);    
    
    const todoItem = newTodoList.find((item, index) => index === itemIndex);
    const action = todoItem.checked ? "finish" : "reject";

    this.setState({ 
        todoList: newTodoList,
        isHintVisible: false,
        changeLog: this.onRecordTaskChange(action, taskName),
        count: taskCounter
    });    
  };

  // метод для создания записи об изменении статуса задачи (добавлена/выполнена/отклонена/удалена) и времени изменения 
  onRecordTaskChange = (action, taskName) => {
    const { changeLog } = this.state;    

    const time = new Date().toLocaleString([], {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"});
    const message = `${time}: Task "${taskName}" was ${action}ed `;        
    
    const newChangeLog = [...changeLog, message];
    return newChangeLog;
  };  

  // обработчик нажатия кнопки "Edit/Save" для изменения текста задачи
  onChangeTask = (taskName, readonly, autofocus, taskInputRef, itemIndex) => {    
    const newTodoList = this.state.todoList.map((item, index) => 
      index === itemIndex ? { ...item, readonly: !readonly, autofocus: !autofocus } : item,      
    );       
    
    this.setState({ 
      todoList: newTodoList,
      isHintVisible: false                
    });
    
    if (readonly) {
      taskInputRef.current.focus();
    };
    
    if (!readonly) {
      this.setState({         
        changeLog: this.onRecordTaskChange("chang", taskName)        
    });
    };
  };

  // обработчик изменения текста задачи
  onEditTask = (e, itemIndex) => {
    const newTodoList = this.state.todoList.map((item, index) => 
      index === itemIndex ? {...item, name: e.target.value} : item,      
    );       
    
    this.setState({ 
        todoList: newTodoList,
        isHintVisible: false               
    });
  };

  // обработчик нажатия кнопки удаления задачи
  onRemoveTask = (taskName) => {
    const { todoList } = this.state;
    let taskCounter = 0;

    const todoIndex = todoList.findIndex((item) => item.name === taskName);
    const newTodoList = [...todoList.slice(0, todoIndex), ...todoList.slice(todoIndex + 1)];
        
    newTodoList.forEach(item => item.checked && taskCounter++);

    this.setState({
      todoList: newTodoList,
      isHintVisible: false,
      changeLog: this.onRecordTaskChange("remov", taskName),
      count: taskCounter         
    });
  };

  // обработчик нажатия клавиши "Enter" в input для добавления новой задачи / изменения существующей задачи
  onPressEnter = (e, itemIndex) => {           
    if (e.code === "Enter") {
      e.target.className === "todo_input" ? this.onAddTask() : this.onChangeTask(e.target.value, false, true, "", itemIndex);
    };
  };

  // обработчик нажатия кнопки очистки списка задач и журнала изменения задач; также очищает localStorage
  onClearLog = () => {
    this.setState({
      todoList: [],
      isHintVisible: false,
      changeLog: [],
      count: 0
    });

    localStorage.clear();
  };

  
  render() {
    const { todoList, inputValue, isHintVisible, changeLog, count } = this.state;    

    return (
      <>
        <header className="header">
          <h1 className="header_title">ToDo List 2023</h1>
          <p className="header_paragraph">Enter new task and click "Add task" or press "Enter" to add it in ToDo List.</p>
        </header>

        <main className="main">
          <section className="todo_list">
            <div className="todo_left">

              <div className="add_container">
                <input
                  type="text"
                  className="todo_input"
                  placeholder="enter new task"                  
                  value={inputValue}
                  style={{outline: isHintVisible && "1px solid #e00c16"}}
                  onChange={this.onChangeInput} 
                  onKeyDown={(e) => this.onPressEnter(e)}
                  ref={this.addInputRef}
                  autoFocus   
                />
                <Button 
                  name="Add task"
                  title="add new task"
                  customClass="add_btn"
                  onClick={this.onAddTask}                
                />
              </div>

              <div className="hint" style={{opacity: isHintVisible && "1"}}>
                <p>Please, enter new task!</p>
              </div>

              <div className="todo_container">
                <h2 className="todo_heading">Tasks:</h2>
                {todoList.map((item, index) => {
                  return (
                    <TodoItem
                      key={`${"item" + index}`}
                      checked={item.checked}                
                      taskName={item.name}
                      handleCheck = {this.onChangeCheckbox}
                      itemIndex={index}
                      readOnly = {item.readonly}
                      autoFocus = {item.autofocus}
                      editTask = {this.onEditTask}
                      changeTask = {this.onChangeTask}
                      removeTask={this.onRemoveTask}
                      keyDown={this.onPressEnter}
                      customClass={`${"item" + index}`}                        
                    />      
                  )           
                })}                
              </div>

            </div>

            <div className="todo_right">

              <div className="control_container">
                <p className="task_counter">Finished tasks: {count}</p>              
                <Button 
                  name="CLEAR TODO LIST"
                  title="remove all tasks"
                  onClick={this.onClearLog}
                  customClass="clear_btn"
                />
              </div> 

              <div className="log_container">
                <h2 className="todo_heading">Task change log:</h2>
                <ul className="log_list">
                  {changeLog.map((item, index) => {
                    return (
                      <li 
                        key={`${"record" + index}`}
                        className="log_record"
                      >
                        {item}
                      </li>
                    )                    
                  })}
                </ul>
              </div>

            </div>
          </section>
        </main>

        <footer className="footer">
          <a
            className="footer_link"
            href="https://spitsynnick.github.io/Portfolio/"
            title="Nikolai Spitsyn personal portfolio website"
            target="_blank"
            rel="noreferrer"            
          >
            Nikolai Spitsyn, 2023 
          </a>
        </footer>        
      </>    
    );
  };
};


export default TodoList;
