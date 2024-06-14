import React from "react";
import "../index.css";
let margin = {
    margin:"4px"
}

function PriceLabel(props){

    return (
        <div className="priceLabel">
            <h3 style={margin}>{props.sellPrice} DAN</h3>
        </div>
    );
};

export {PriceLabel};