import React from "react";
import { Claimfaucet } from "./Faucet";
import { Checkbalance } from "./Balance";
import { Transfertoken } from "./TransferToken";
import "../index.css";


function Transfer(props){
    return (
        <div className="transfer">
            <h1>Transfer Tokens</h1>
            <div  className="transferContent">
            <Claimfaucet id={props.id}></Claimfaucet>
            <Checkbalance></Checkbalance>
            <Transfertoken></Transfertoken>
        </div>
        </div>
        
    );
};

export {Transfer};