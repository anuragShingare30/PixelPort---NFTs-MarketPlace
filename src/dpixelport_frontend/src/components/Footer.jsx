import React from "react";
import "../index.css";

function Footer(){
    let date = new Date();
    let currentdate = date.getFullYear();
    return (
        <div className="foot">
            <h4>© {currentdate} / PixelPort</h4>
            <p className="footPara">Non-fungible tokens (NFTs) are unique digital assets authenticated using blockchain technology. They represent ownership of distinct items like art, music, and virtual real estate, and cannot be replicated or exchanged on a one-to-one basis like cryptocurrencies</p>
        </div>
    );
}

export {Footer}