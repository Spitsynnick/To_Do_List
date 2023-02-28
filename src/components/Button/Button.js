import React from "react";
import "./Button.css";

// компонент Button: рендерит кнопки добавления новой задачи, удаления задачи и очистки ToDo list 
const Button = ( {name, title, onClick, customClass} ) => {
    return (
        <button
            className={`btn ${customClass ? customClass : ""}`}
            title={title}
            onClick={onClick} 
        >
            {name}
        </button>                    
    );
};


export default Button;