import React from "react";
import Button from "../Button/Button";
import { useRef } from "react";
import "./TodoItem.css";

// компонент TodoItem: рендерит div с одной задачей, включающий в себя флажок (выполнена/не выполнена), текст задачи, кнопку редактирования/сохранения задачи и кнопку удаления задачи
const TodoItem = (props) => {
    const { checked, taskName, handleCheck, itemIndex, readOnly, autoFocus, editTask, changeTask, removeTask, keyDown, customClass } = props;

    const taskInputRef = useRef(null);

    return (
        <div className="item">
            <input                
                type="checkbox"
                className="item_checkbox"
                id={`${"checkbox" + itemIndex}`}
                defaultChecked={checked}
                title={`${checked ? "unmark" : "mark as finished"}`}
                onChange={() => handleCheck(taskName, checked, itemIndex)}
            />
            
            <label 
                htmlFor={`${"checkbox" + itemIndex}`} 
                className="checkbox_label"
            >
                <span className="checkbox_span" />                
            </label>

            <input 
                className={`item_text ${customClass ? customClass : ""}`}
                value={taskName}
                readOnly={readOnly}
                autoFocus={autoFocus}
                onChange={(e) => editTask(e, itemIndex)}
                onKeyDown={(e) => keyDown(e, itemIndex)}
                ref={taskInputRef}
            />

            <Button                
                name={readOnly ? "EDIT" : "SAVE"}                
                title={readOnly ? "edit task" : "save changes"}                
                onClick={() => (changeTask(taskName, readOnly, autoFocus, taskInputRef, itemIndex))}
                customClass={readOnly ? "edit_btn" : "save_btn"}                
            />            

            <Button
                name="REMOVE"                
                title="remove task"                
                onClick={() => removeTask(taskName)}
                customClass="remove_btn"                
            />            
        </div>                    
    );
};


export default TodoItem;