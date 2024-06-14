import React from "react";
import "../index.css";
import {useForm} from "react-hook-form";
import {dpixelport_backend} from "../../../declarations/dpixelport_backend";
import TextField from '@mui/material/TextField';
import {Principal} from "@dfinity/principal";
import { Item } from "./Item";
 
function Minter() {

  let {register, handleSubmit} = useForm();  
  let [nftPrincipal, setNFTPrincipal] = React.useState("");
  let [loader, setLoader] = React.useState(true)

  async function onSubmit(data){
    setLoader(false);
    let name = data.name; 
    // BY THIS METHOD WE CAN STORE A NAT8 NUMBER IN AN ARRAYBUFFER.
    let image = await data.image[0];
    let imageByteData = [...new Uint8Array(await image.arrayBuffer())];
    // CALLING THE FUNCTION 'main.mo'
    let newNFTId = await dpixelport_backend.mint(imageByteData, name);
    setNFTPrincipal(newNFTId.toText());
    setLoader(true);
  };

  if(nftPrincipal == ""){
    return (
      <div className="minter"> 
        
        <div className="mintContent">
        <img src="loader.svg" alt="loader" width="80px" hidden={loader}/>
        <h1>Create NFT</h1>

        <div className="form">


          <div className="formPart1">
            <form noValidate="" autoComplete="off">
          <h3>Upload Image :</h3>
          <input
                {...register("image", {required:true})}
                className="upload"
                type="file"
                accept="image/x-png,image/jpeg,image/gif,image/svg,image/webp"
          />
           </form>
          </div>


          <div className="formPart2">
          <TextField 
            id="standard-basic" 
            label="Collection  Name:" 
            variant="standard" 
            {...register("name", {required:true})}
            placeholder="e.g. CryptoDunks"
            type="text"
            autoComplete="off"
            sx={{
              input: {
                color: 'white',
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'white',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
              
            }}
          />
          </div>
         
          
        </div>
        <input type="button" value="Mint NFT" className="mintBtn" onClick={handleSubmit(onSubmit)}/>
        </div>
        
        
      </div>
    );
  } 
  else{
    return (
      <div className="minted">
        <h1>Minted!!!!!!</h1>
        <Item id={nftPrincipal}></Item>
      </div>
    )
  }
}

export {Minter};



//--------------------------------------------------------------------------------//
// THIS IS THE FORMAT TO USE THE REACT 'useForm' TO HANDLE AND STORE THE DATA ENTER BY THE USER IN THE TEXT FIELD.

//   let {register, handleSubmit} = useForm();
//   async function onSubmit(data){
//     console.log(data.name);
//   }

// <input
//       {...register("name", {required:true})}
//       placeholder="e.g. CryptoDunks"
//       type="text"
//  />

// <input type="button" value="Mint NFT" className="mintBtn" onClick={handleSubmit(onSubmit)}/>   