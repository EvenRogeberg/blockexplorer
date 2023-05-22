import { Alchemy, Network, Utils } from 'alchemy-sdk';
import React, { useState } from 'react';

export const NFTsPage = () => {
    const settings = {
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };


const alchemy = new Alchemy(settings);

let [nftAttributes, setAttributes] = useState([]);
let [nftFloorPrice, setFloorPrice] = useState("");
let [contactAddress, setContactAddress] = useState("");
let [tokenId, setTokenId] = useState("");

async function getNft(address, id){
    try {
    
        const attributes = await alchemy.nft.getNftMetadata(address, id);
        setAttributes(attributes.rawMetadata.attributes);
        const floor = await alchemy.nft.getFloorPrice(address);
        setFloorPrice(floor.openSea.floorPrice.toString());
        console.log(setAttributes.length);
        
    } catch (error) {
        console.log(error)
        console.log("could not get the nft");
        
    }
}

return (
    <div className="nft">
      <label>
        Contract Address:
        <br></br>
        <input
          type="text"
          placeholder="0x..."
          onChange={(e) => {
            setContactAddress(e.target.value);
          }}
          
        />
      </label>
      <br></br>
      <label>
        Token ID:
        <br></br>
        <input
          type="text"
          placeholder="id..."
          onChange={(e) => {
            setTokenId(e.target.value);
          }}
        />
      </label>
      <br></br>
      <button
        onClick={() => {
          getNft(contactAddress, tokenId);
        }}
      >
        Get Nft
        </button>
      <br />
      {nftAttributes.length > 0 && (
        <div>
          <h3>NFT Attributes:</h3>
          <h6>NFT Floor Price: {nftFloorPrice} eth</h6>
          <ul>
            {nftAttributes.map((attribute, index) => (
              <li key={index}>
                {attribute.trait_type}: {attribute.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NFTsPage;