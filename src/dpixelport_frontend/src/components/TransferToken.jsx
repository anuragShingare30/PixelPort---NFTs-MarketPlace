import React from "react";
import { AuthClient } from "@dfinity/auth-client"
import { Principal } from "@dfinity/principal";
import { TextField } from "@mui/material";
import "../index.css";
import { dpixelport_backend, canisterId, createActor } from "../../../declarations/dpixelport_backend";

let head = {
    backgroundColor: "#171718",
    color: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopRightRadius: "20px",
    borderTopLeftRadius: "20px",
    borderBottom: "1px solid white"
};
let transfer = {
    backgroundColor: "#1b1b1b",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    borderBottomRightRadius: "20px",
    borderBottomLeftRadius: "20px",
    border:"2px solid rgba(255, 255, 255, 0.12)"
}
let center = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    padding: "10px",
    gap: "10px"
}

function Transfertoken() {
    let [address, setAddress] = React.useState("");
    let [amount, setAmount] = React.useState("");
    let [transferbtn, setTransferbtn] = React.useState("Transfer");
    let [disabled, setDisabled] = React.useState(false)

    function handleAddress(event) {
        let toAddress = Principal.fromText(event.target.value);
        setAddress(toAddress);
    };
    function handleAmount(event) {
        let amountSend = Number(event.target.value);
        setAmount(amountSend);
    };
    async function handleClick() {
        setDisabled(true);

        var authClient = await AuthClient.create();
        var identity = authClient.getIdentity();

        var authenticatedCanister = createActor(canisterId, {
            agentOptions: {
                identity,
            },
        });

        let result = await authenticatedCanister.transfer(address, amount);
        setTransferbtn(result);
        setDisabled(false);
        setTimeout(() => {
            setTransferbtn("Transfer");
        }, 3000);

    };

    return (
        <div className="transferToken">
            <div style={head} className="head1">
                <h2>Transfer</h2>
            </div>
            <div className="transferInfo" style={transfer}>
                <div style={center} className="transferContent">
                    <TextField
                        id="outlined-basic"
                        label="To Address :"
                        variant="outlined"
                        name="principleId"
                        color="primary"
                        className="input"
                        placeholder="Enter The Address :"
                        onChange={handleAddress}
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
                    <span className="img"><img src="transfer.svg" width="30px" /></span>
                    <TextField
                        color="warning"
                        id="outlined"
                        label="Amount :"
                        type="number"
                        placeholder="Enter Amount :"
                        onChange={handleAmount}
                        sx={{
                            input: { color: 'white' }, // Change the text input color
                            '& .MuiInputLabel-root': { color: 'white' }, // Change the label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: '#1763fd', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // Border color when focused
                                },
                            },
                        }}
                    />
                </div>
                <button className="btn1" onClick={handleClick} disabled={disabled} style={disabled ? { backgroundColor: "grey", border: "1px solid grey" } : null}>{transferbtn}</button>

            </div>
        </div>
    );
};

export { Transfertoken };