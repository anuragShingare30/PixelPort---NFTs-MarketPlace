import React from "react";
import "../index.css";

let display = {
  display:"flex",
  flexDirection:"column",
  alignItems:"start"
}

const Popup = ({onClose }) => {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <span className="close-btn" onClick={onClose}>&times;</span>
          <img src="alert.svg" alt="alert" width="50px"/>
          <h2>Alert  : Minting NFTs on PixelPort</h2>

          <ul style={display}>
          <li><h3>Sufficient Cycles Required : Do not use the web app for minting if you do not have enough cycles.</h3></li>
          <li><h3>Minting : Minting will fail if enough cycles is not present.</h3></li>
            <li><h3>Real Cycle Charges : Minting will incur real charges in cycles.</h3></li>
            <li><h3>Transaction Final : Double-check all details; transactions cannot be done if enough cycles is not there.</h3></li>
            <li><h3>Security : Keep your wallet information secure.</h3></li>
          </ul>
          <h2>Proceeding confirms your acceptance of these terms.</h2>
        </div>
      </div>
    );
  };
  
export {Popup};
  