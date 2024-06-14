import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './components/App';
import './index.css';
import { Principal } from '@dfinity/principal';
import { AuthClient } from "@dfinity/auth-client";

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

let init = async ()=>{

  let authClient = await AuthClient.create();

  if(await authClient.isAuthenticated()){
    handleAuthenticated(authClient);
  }
  else{
    await authClient.login({
      identityProvider:"",
      onSuccess:()=>{
        handleAuthenticated(authClient);
      }
    });
  };

  async function handleAuthenticated(authClient){
    let identity = await authClient.getIdentity();
    let principal = identity._principal.toString();
    console.log(principal);
    ReactDOM.createRoot(document.body.querySelector(".root")).render(
      <App id={principal}></App>
    );
  }

}

init();







