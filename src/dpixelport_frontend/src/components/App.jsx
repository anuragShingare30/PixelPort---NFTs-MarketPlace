import React from "react";
import "../index.css";
import { Head } from "./Header";
import { Item } from "./Item";
import { Minter } from "./Minter";
import { Footer } from "./Footer";
import { Popup } from "./Popup";

function App(props){

  const [showPopup, setShowPopup] = React.useState(true);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  React.useEffect(() => {
    setShowPopup(true); // Show popup on page load or reload
  }, []);

  let NFTId = "2vxsx-fae"; 
  return ( 
    <div className="main">
      <Head id={props.id}></Head>
      {showPopup && (
        <Popup
          onClose={handleClosePopup} />
      )}
      {/* <Item id={NFTId}></Item> */}
      {/* <Minter></Minter> */}
      <Footer></Footer>
    </div>
  );
}

export {App};