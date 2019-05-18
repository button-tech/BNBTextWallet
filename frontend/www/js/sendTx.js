let transactionData = {};
const backendURL = "https://discord.buttonwallet.tech";

(async function() {
    transactionData = await getTransactionData();
    await setTransactionData()
})();

function getShortlink() {
    const demand = ['tx'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.tx;
}

async function getTransactionData() {
    const shortlink = getShortlink();
    try {
        const queryURL = `${backendURL}/api/discord/transaction/${shortlink}`;
        const response = await req('GET', queryURL);

        if (response.error == null)
            return response.result;
        else {
            throw response.error;
        }
    } catch (e) {
        throw e;
    }
}

async function sendEth(){

    let errorField = document.getElementById("badPin");
    errorField.style.display = "none";
    let pin = document.getElementById("pincode").value;
    let ls =  new Storage.SecureLs({encodingType: 'aes',  encryptionSecret: pin});

    let data;
    try {

        data = ls.get("data");

        let pincode = document.getElementsByClassName("pincode-input-container")[0];

        pincode.style.display = "none";

        let createButton = document.getElementById("sendBtn");
        createButton.style.display = "none";

        let wallet = new ethers.Wallet(data.privateKey);

        let web3 = new Web3(Web3.givenProvider);

        let nonce = await web3.eth.getTransactionCount(wallet.address);

        let transaction = {
            nonce: nonce,
            gasLimit: 21000,
            gasPrice: ethers.utils.bigNumberify("2000000000"),
            to: transactionData.to,
            value: ethers.utils.parseEther(`${transactionData.value}`),
            data: "0x",
            chainId:ethers.utils.getNetwork('rinkeby').chainId
        };

        let signPromise = wallet.sign(transaction);

        signPromise.then((signedTransaction) => {
            const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io");
            provider.sendTransaction(signedTransaction).then((tx) => {
                console.log(tx);
                let txHash = document.getElementById("txHash");
                txHash.innerHTML = `<a href="https://rinkeby.etherscan.io/tx/${tx.hash}">TxHash</a>`
            });
        })

    }catch (e) {
        console.log(e);
        errorField.style.display = e;
    }
    console.log();
}
