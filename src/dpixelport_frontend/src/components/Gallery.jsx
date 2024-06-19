import React from "react"; 
import "../index.css";
import { Item } from "./Item";
import { Principal } from "@dfinity/principal";

function Gallery(props) {  
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    console.log("Gallery received ids: ", props.ids);
    if (props.ids && Array.isArray(props.ids) && props.ids.length > 0) {
      setItems(props.ids.map((NFTId, index) => (
        <Item key={index} id={NFTId} role={props.role}/>
      )));
    } else { 
      setItems([<h1 key="no-nft">No NFT Minted</h1>]);
    }
  }, [props.ids]); 

  return (
    <div className="nftGallery">
      <div className="head1"><h1>{props.text}</h1></div>
      <div className="nftItems">
        {items}
      </div>
      
    </div>
  );
}

export { Gallery };
