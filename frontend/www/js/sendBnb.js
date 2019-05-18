let transactionBnbData = {};

(async function() {
    transactionBnbData = await getTransactionBnbData();
    await setTransactionBnbData()
})();

async function getTransactionBnbData() {
    const shortlink = getShortlink();
    try {
        const queryURL = `${backendURL}/api/blockchain/bnb/${shortlink}`;
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

async function sendBnb() {
    let errorField = document.getElementById("badPin");
    errorField.style.display = "none";
    let pin = document.getElementById("pincode").value;
    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret: pin});

    let data;
    try {

        data = ls.get("data");

        console.log(data);

        let pincode = document.getElementsByClassName("pincode-input-container")[0];

        pincode.style.display = "none";

        let createButton = document.getElementById("sendBtn");

        createButton.style.display = "none";

        mnemonic = data.mnemonic;

        console.log(transactionBnbData.to);
        console.log(transactionBnbData.amount);
        console.log(transactionBnbData.currency);

        txHash = await SignTx(transactionBnbData.to, transactionBnbData.amount, transactionBnbData.currency);

        console.log(txHash);

        }catch (e) {
            console.log(e);
            errorField.style.display = e;
        }
}
