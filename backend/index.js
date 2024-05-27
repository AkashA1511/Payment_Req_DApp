const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

app.get("/getNameAndBalance", async (req, res) => {

    const {userAddress} = req.query;

    const response = await Moralis.EvmApi.utils.runContractFunction({
        chain: "0x13881",
        address: "0x80C756A8Be0335CFa4D9cE9c7C87bDB8cd8b4cC8",
        abi: ABI,
        functionName: "getMyName",
        params: {_user:userAddress},
    });
    
    return res.status(200).json({});
});


Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  }).then(() => {
    app.listen(port, () => {
      console.log(`Listening for API Calls`);
    });
  });