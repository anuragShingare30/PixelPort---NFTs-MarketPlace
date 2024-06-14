import React from "react";
import { dpixelport_backend } from "../../../declarations/dpixelport_backend";
import { Principal } from "@dfinity/principal";
import {TextField} from "@mui/material";    
import "../index.css";

let header = {
  backgroundColor:"#171718",
  padding:"5px",
  display:"flex",
  justifyContent:"center",
  borderTopRightRadius:"20px",
  borderTopLeftRadius:"20px", 
   borderBottom:"1px solid white"
};
let content = {
  backgroundColor:"#1b1b1b",
  borderBottomRightRadius:"20px",
  borderBottomLeftRadius:"20px",
  padding:"25px",
  display:"flex",
  justifyContent:"center",
  flexDirection:"column",
  gap:"20px",
  border:"2px solid rgba(255, 255, 255, 0.12)"
}


function Checkbalance() {
  const [id, setId] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [hidden, setHidden] = React.useState(true);

  async function handleClick() {
    try {
      const principle = Principal.fromText(id);
      const result = await dpixelport_backend.balanceOf(principle);   
      setBalance(result.toString());
      const tokenSymbol = await dpixelport_backend.symbol();
      setSymbol(tokenSymbol);
      setHidden(false);
    } catch (error) {
      console.error("Error fetching balance: ", error);
      setHidden(true);
    }
  }

  return (
    <div className="check">
      <div style={header}><h3>Check account token balance:</h3></div>
      <div style={content}>
          <TextField
            id="outlined-basic" 
            label="Enter Principal ID"
            variant="outlined"
            name="principleId"
            color="primary"
            className="input"
            placeholder="Enter Principal ID"
            onChange={(e) => setId(e.target.value)}
            autoComplete="off"
            sx={{
              input: { color: 'white' }, // Change the text input color
              '& .MuiInputLabel-root': { color: 'white' }, // Change the label color
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#2081e2', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when focused
                },
              },
            }}
          />

          <button className="btn1" onClick={handleClick}>
            Check Balance
          </button>
          <h3 hidden={hidden}>
            This account has a balance of {balance} {symbol} tokens.
          </h3>
      </div>
      
    </div>
  );
}

export { Checkbalance };
