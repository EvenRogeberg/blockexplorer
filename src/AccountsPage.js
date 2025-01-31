import { Alchemy, Network, Utils } from 'alchemy-sdk';
import React, { useState } from 'react';

export const AccountsPage = () => {
    const settings = {
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };


const alchemy = new Alchemy(settings);

let [balance, setBalance] = useState(null);
let [userAddress, setUserAddress] = useState("");
let [showBalance, setShowBalance] = useState(false);

async function getBalance(address) {
  try {
    let response = await alchemy.core.getBalance(address, "latest");
    setBalance(Utils.formatEther(parseInt(response._hex).toString()));
    if (showBalance === true) return;
    else setShowBalance(!showBalance);
  } catch {
    alert("Error. This wallet probably doesn't exist.");
    setShowBalance(false);
  }
}
return (
    <div className="accounts">
      <label>
        ETH Address:
        <br></br>
        <input
          type="text"
          placeholder="0x..."
          onChange={(e) => {
            setUserAddress(e.target.value);
          }}
        />
      </label>
      <button
        onClick={() => {
          getBalance(userAddress);
        }}
      >
        Get Balance
      </button>
      <br></br>
      {showBalance ? (
        "This account got "+balance+" eth"
      ) : (
        <div></div>
      )}
      <br></br>
    </div>
  );
};

export default AccountsPage;