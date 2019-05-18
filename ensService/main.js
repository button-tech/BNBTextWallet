const ethers = require("ethers");
const express = require("express");

const app = express();
const provider = new ethers.providers.InfuraProvider("homestead", "authcointop");

app.get("/:ens",async (req,res)=>{
    console.log(req.params.ens);
    let address = await provider.resolveName(req.params.ens);
    if(address!==null){
        res.send(JSON.stringify({"resp":address}));
        return
    }
    res.send(JSON.stringify({"error":"ERROR!!!"}))
});

app.listen(3000);
