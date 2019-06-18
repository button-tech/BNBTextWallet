let transactionBnbData = {};
const backendURL = "https://discord.buttonwallet.tech";

(async function() {
    transactionBnbData = await getTransactionBnbData();
    await setTransactionBnbData()
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

async function getTransactionBnbData() {
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

async function send() {

    try {

        let mnemonicFromStorage = localStorage.getItem("mnemonic");

        let createButton = document.getElementById("sendBtn");

        createButton.style.display = "none";

        mnemonic = mnemonicFromStorage;

        txHash = await SignTx(transactionBnbData.to, transactionBnbData.value, transactionBnbData.currency);

        let info = document.getElementById("data");
        info.innerHTML =  txHash.innerHTML = `<a href="https://testnet-explorer.binance.org/tx/${txHash}">TxHash</a>`;

    }catch (e) {
        console.log(e);
    }
}
