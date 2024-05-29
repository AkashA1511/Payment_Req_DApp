const express = require("express");
const { Web3 } = require("web3");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));

function convertArrayToObjects(arr) {
  if (!Array.isArray(arr)) {
    console.error("convertArrayToObjects error: Input is not an array", arr);
    return [];
  }

  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(-4)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
}

app.get("/getNameAndBalance", async (req, res) => {
  try {
    const { userAddress } = req.query;
    const contract = new web3.eth.Contract(ABI, "0x80C756A8Be0335CFa4D9cE9c7C87bDB8cd8b4cC8");

    const nameResponse = await contract.methods.getMyName(userAddress).call();
    const name = nameResponse;

    const balance = await web3.eth.getBalance(userAddress);
    const balanceInEth = web3.utils.fromWei(balance, "ether");

    const history = await getMyHistory(userAddress);
    const requests = await getMyRequests(userAddress);

    const jsonResponse = {
      name,
      balance: balanceInEth,
      history,
      requests,
    };

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getMyHistory(userAddress) {
  try {
    const contract = new web3.eth.Contract(ABI, "0x80C756A8Be0335CFa4D9cE9c7C87bDB8cd8b4cC8");
    const history = await contract.methods.getMyHistory(userAddress).call();
    console.log("Raw history data------>:", history); 
    return convertArrayToObjects(history);
  } catch (error) {
    console.error("Error fetching history----->:", error);
    throw new Error("Failed to fetch history");
  }
}

async function getMyRequests(userAddress) {
  try {
    const contract = new web3.eth.Contract(ABI, "0x80C756A8Be0335CFa4D9cE9c7C87bDB8cd8b4cC8");
    const requests = await contract.methods.getMyRequests(userAddress).call();
    console.log("Raw requests data:", requests); 
    return convertArrayToObjects(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch requests");
  }
}

app.listen(port, () => {
  console.log(`Listening for API Calls on port ${port}`);
});
