import React from "react";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import "../index.css";
import { Minter } from "./Minter";
import { Gallery } from "./Gallery";
import { Transfer } from "./Transfer";
import { dpixelport_backend } from "../../../declarations/dpixelport_backend";
import CURRENT_USER_ID from "../main";

// Inline styles for links
const style = {
  textDecoration: "none",
  color: "inherit"
};

function Head(props) { 
  var [userOwnedGallery, setOwnedGallery] = React.useState([]);
  var [listingGallery, setListingGallery] = React.useState();
  var [loading, setLoading] = React.useState(true); // Add loading state

  async function getNFTs() {
    try {
      let userNFTsId = await dpixelport_backend.getOwnedNFTs(CURRENT_USER_ID); 
      console.log("Fetched NFTs: ", userNFTsId);
      setOwnedGallery(userNFTsId);
      let listedNFTIds = await dpixelport_backend.getListedNFTs();
      console.log("Listed NFTs: ", listedNFTIds);
      setListingGallery(<Gallery ids={listedNFTIds} text="Discover" role="discover"></Gallery>);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
    } finally {
      setLoading(false); // Update loading state
    }
  };

  React.useEffect(() => {
    getNFTs();
  }, []);

  return (
    <BrowserRouter>  
      <div className="header">
        <Link to="/">
          <img src="title.svg" alt="title" className="titleImg"/>
        </Link>
        <div className="navList">
          <ul>
            <Link style={style} to="/discover">
              <li>Discover</li>
            </Link>
            <Link style={style} to="/minter">
              <li>Minter</li>
            </Link>
            <Link style={style} to="/gallery">
              <li>My NFTs</li>
            </Link>
            <Link style={style} to="/transfer">
              <li>Transfer</li>
            </Link>
          </ul>
        </div> 
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="homeImg">
              <img src="homeTitle.svg" alt="homeImg" className="homeTitle"/>
              <h1 style={{margin:"0px"}}>A NFTs MarketPlace Where You Can Mint, Sell And Buy The NFTs</h1>
            </div>
          }
        />
        <Route
          path="/discover"
          element={listingGallery} // Add loading fallback
        />
        <Route path="/minter" element={<Minter />} />
        <Route path="/gallery" element={<Gallery ids={userOwnedGallery} text="My NFTs" role="collection"/>} />
        <Route path="/transfer" element={<Transfer id={props.id}></Transfer>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export { Head };
