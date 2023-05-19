import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import AccountsPage from "./AccountsPage";

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState("");
  const [curBlock, setBlock] = useState();
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      try {
        setBlockNumber(await alchemy.core.getBlockNumber());
      } catch {
        console.log("Error, not able to get the latest block");
      }
    }

    async function getBlockInfo() {
      try {
        const block = await alchemy.core.getBlockWithTransactions(blockNumber);
        setBlock(block);
        console.log(block);
      } catch {
        console.log("Error, not able to get block with transactions from block number ", blockNumber);
      }
    }

    getBlockNumber();
    getBlockInfo();
  }, [blockNumber]);

  async function handleTransactionClick(transaction) {
    try {
      const receipt = await alchemy.core.getTransactionReceipt(transaction.hash);
      console.log(receipt);
      setSelectedTransaction({ transaction, receipt });
    } catch {
      console.log("Error, not able to get transaction receipt for transaction ", transaction.hash);
    }
  }

  async function handleShowAccountClick() {
    setShowAccount(!showAccount);
  }

  return (
    <div className="App">
      <div>
        <h1>My Ethereum BlockExplorer</h1>
      </div>
      <div className="intro">
        <div>
          Block Number: {curBlock === undefined ? "Pending..." : blockNumber}
        </div>
        <div className='showTransactions'>
          <button
            onClick={() => {
              setShowTransactions(!showTransactions);
            }}
          >
            {showTransactions ? "Hide Transactions" : "Show Transactions"}
          </button>

          {showTransactions && curBlock && (
            <ul>
              {curBlock.transactions.map((transaction, index) => (
                <li key={index} onClick={() => handleTransactionClick(transaction)}>
                  <span>{transaction.hash}</span>
                  {selectedTransaction?.transaction.hash === transaction.hash && (
                    <ul>
                      <li>To: {selectedTransaction.receipt.to}</li>
                      <li>From: {selectedTransaction.receipt.from}</li>
                      <li>Gas used: {selectedTransaction.receipt.gasUsed.toString()}</li>
                      <li>Transaction hash: {selectedTransaction.receipt.transactionHash}</li>
                      <li>Status: {selectedTransaction.receipt.status ? "Success" : "Fail"}</li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleShowAccountClick}>
          {showAccount ? 'Hide Accounts' : 'Show Accounts'}
        </button>

        {showAccount && <AccountsPage />}
      

      </div>
    </div>
  );
}

export default App;