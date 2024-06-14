import React from "react";
import "../index.css";


function Button(props){
    return (
        <div className="sellBtn">
            <input 
            type="button" 
            value={props.text} 
            // style={style} 
            onClick={props.handleClick}
            disabled={props.disabled}
            className="sellButton"
            />
        </div>
    );
}

export {Button}