import React from "react";
import "../index.css";

function Input(props){
    return (
        <div className="priceInput">
            <input 
            type="number" 
            className="input" 
            placeholder="Enter the Price for sell!" 
            value={props.price} 
            onChange={(e) => price = e.target.value}/>
        </div>
    );
};

export {Input} 