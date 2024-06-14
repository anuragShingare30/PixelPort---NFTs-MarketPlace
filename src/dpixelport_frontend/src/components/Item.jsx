import React from "react";
import "../index.css";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import { Button } from "./Button";
import { dpixelport_backend, createActor, canisterId } from "../../../declarations/dpixelport_backend";
import CURRENT_USER_ID from "../main";
import { PriceLabel } from "./PriceLabel";
import TextField from '@mui/material/TextField';

const margin = { 
    margin: "3px",
    color:"white" 
};
let display = {
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap:"2px"
}
let style = {
    margin:"20px 20px"
}

function Item(props) {
    const [name, setName] = React.useState(null);
    const [owner, setOwner] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [priceInput, setPriceInput] = React.useState();
    const [btn, setBtn] = React.useState();
    const [loader, setLoader] = React.useState(true);
    const [sellStatus, setSellStatus] = React.useState("");
    const [priceLabel, setPriceLabel] = React.useState();
    const [shouldDisplay , setShouldDisplay] = React.useState(true);
    const [disabled, setDisabled] = React.useState(false)


    let NFTActor;
    React.useEffect(() => {
        
        async function loadNFT() {
            
            try {
                const id = props.id;
                const localHost = "http://localhost:8000" ;
                const agent = new HttpAgent({ host: localHost });
                // WHEN DEPLOYED ON LIVE ICP COMMENT THIS OUT.
                agent.fetchRootKey();

                NFTActor = Actor.createActor(idlFactory, {
                    agent,
                    canisterId: id
                }); 

                const cryptoName = await NFTActor.getName();
                setName(cryptoName);

                const nftId = await NFTActor.getOwner();
                setOwner(nftId.toText());

                const imageData = await NFTActor.getAssets();
                const imageContent = new Uint8Array(imageData);
                const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
                setImage(image);

                if(props.role == "collection"){
                    let nftIsListed = await dpixelport_backend.isListed(props.id);   
                    if(nftIsListed){
                        setOwner("PixelPort");  
                        setSellStatus("Listed");
                    }
                    else{
                        setBtn(<Button handleClick={handleSell} text={"Sell"}></Button>);
                    }
                    }else if (props.role == "discover"){
                        let originalOwner = await dpixelport_backend.getOriginalOwner(props.id);
                        if(originalOwner.toText() != CURRENT_USER_ID.toText()){
                            setBtn(<Button handleClick={handleBuy} text={"Buy"}></Button>);
                        }

                        let price = await dpixelport_backend.getListedNFTPrice(props.id);
                        setPriceLabel(<PriceLabel sellPrice={price.toString()}></PriceLabel>);
                    
                };
                
            } catch (error) {
                console.error("Failed to load NFT data:", error);
            }
        }

        loadNFT();
    }, [props.id]);

    let price;
    function handleSell(){
        console.log("Clicled");
        
        setPriceInput(
            <TextField 
                id="outlined-basic" 
                label="Price" 
                variant="outlined" 
                type="number" 
                className="input" 
                placeholder="Enter the Price for sell!" 
                value={price} 
                onChange={(e) => price = e.target.value}
                style={style}

                InputProps={{
                    sx: {
                      color: 'white', // Text color
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Border color
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Border color on hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Border color when focused
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: 'white', // Label color
                    },
                  }}
                />
        );
        setBtn(<Button text="Confirm" handleClick={sellItem}></Button>);
    }
    async function sellItem(){
        setLoader(false);
        let listingResult = await dpixelport_backend.listItem(props.id, Number(price)); 
        console.log("Listing: ", listingResult);
        if(listingResult == "Success"){
            let canisterId = await dpixelport_backend.getCanisterId();
            let transferResult = await NFTActor.transferOwnerShip(canisterId);
            console.log("Transfering: ", transferResult);
            if(transferResult == "Success"){
                setLoader(true);
                setBtn();
                setPriceInput();
                setOwner("PixelPort");  
                setSellStatus("Listed");
            }
        };
        
       
    };

    // BUYING FUNCTIONALITY.
    async function handleBuy(){
        console.log("Buy triggered");
        setLoader(false);
        // let dcurveActor = Actor.createActor(dcurveIdlFactory, {
        //     agent,
        //     canisterId: Principal.fromText("fvpkz-24aaa-aaaaa-qaazq-cai"),
        // });
       

        let sellerId = await dpixelport_backend.getOriginalOwner(props.id);
        let itemPrice = await dpixelport_backend.getListedNFTPrice(props.id);

        let result = await dpixelport_backend.transfer(sellerId, itemPrice);
        if(result == "Success"){
            let transferResult = await dpixelport_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
            console.log("Purchase: ", transferResult);
            setShouldDisplay(false)
            setDisabled(true)
            setBtn(<Button text="Purchased" handleClick={sellItem} disabled={disabled}></Button>);
        }
        setLoader(true);
        
    }; 



    return (
        <div className="itemBox" style={{display: shouldDisplay ? "inline-block" : "none"}}>
            <div className="item">
                <div className="nftImg">
                    {image ? <img src={image} width="200px" alt="itemImg" style={{borderRadius:"15px"}}/> : <p>Loading image...</p>}
                </div>
                
                <div className="nftContent">
                <img src="loader.svg" alt="loader" width="40px" hidden={loader}/>
                    <div style={display}>
                        {priceLabel}
                        <h3 style={{margin:"2px"}}>{name || "Loading name..."}</h3>
                        <h3 style={margin}>{sellStatus}</h3>
                        <p style={margin}>{owner || "Loading owner..."}</p>
                        {priceInput}
                        {btn}
                    </div>
                    
                </div>  
            </div>
        </div>
    );
}

export { Item };