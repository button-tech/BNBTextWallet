const shortlink = getShortlink();

let transactionData = {};
let accountData;


window.onload = function() {
    $("#upload_link").on('click', uploadLink);
    $("#upload").on("change", addFiles);
    getTransactionData()
        .then(data => {
            transactionData = data;
            return data;
        })
        .then(transactionData => {
            let privateData = localStorage.getItem("accountData");
            if (privateData) {
                accountData = JSON.parse(privateData);
                send(accountData.mnemonic, transactionData)
                    .then(async txHash => {
                        console.log(txHash);
                        await sendTxHash(txHash);
                        loader.close();
                        document.getElementById("container").style.display = "none";
                        addDoneView();
                    })
                    .catch(e => {
                        console.log(e);
                        console.log("Failed to send transaction")
                    })
            } else {
                setTransactionData(transactionData.currency,
                    transactionData.addressFrom,
                    transactionData.addressTo,
                    transactionData.amount);
                loader.close();
            }
        })
        .catch(console.log)

};

function sendTxHash(txHash) {
    const queryURL = `${backendURL}/api/discord/transaction/${shortlink}`;
    return req('POST', queryURL, JSON.stringify({"txHash": txHash}));
}

function setTransactionData(currency, from, to, value) {
    document.getElementById('currency').innerText = currency;
    document.getElementById('from').innerText = from;
    document.getElementById('to').innerText = to;
    document.getElementById('value').innerText = Number(toFixed(String(value).replace("E", "e"))).toFixed(8);
}

function setTransactionHash(txHash) {
    addSuccess(`<a href="https://explorer.binance.org/tx/${txHash}">https://explorer.binance.org/tx/${txHash}</a>`);
}

function send(mnemonic, transactionData) {
    return signTx(mnemonic, transactionData.addressTo, transactionData.amount)
        .then(res => {
            console.log(res);
            return res.result[0].hash;
        })
}

function uploadLink(e) {
    e.preventDefault();
    $("#upload").trigger('click');
}

function addFiles() {
    const file = document.querySelector("input[type=file]").files[0];
    showFile(file);
    document.getElementById("drop-area").innerHTML = `<div id="qr-pass" class="text-center col-12">
                <div class="form-group">
                    <label for="Password">
                        <h2">Enter your password</h2>
                    </label>
                    <br><br>
                    <input type="password" class="form-control" style="width: 200px;margin: 0 auto;" id="password" placeholder="Password">
                </div>
               <button class="btn orange-button btn-round" id="send_btn">Send</button>
                <br>
                <br>
                <br>
            </div>`;

    const sendAction = function () {
        loader.open();
        return getMnemonicFromQrCode()
            .then(data => {
                return send(JSON.parse(data).mnemonic, transactionData)
            })
            .then(async txHash => {
                setTransactionHash(txHash);
                await sendTxHash(txHash);
                loader.close();
            })
            .catch(e => {
                console.log(e);
            });
    };

    document.getElementById("send_btn").addEventListener("click", sendAction, false);
    document.addEventListener('keypress',function(e) {
        if(e.which === 13) {sendAction()}
    });
}

function getTransactionData() {
    const queryURL = `${backendURL}/api/discord/transaction/${shortlink}`;
    return new Promise((resolve, reject) => {
        req('GET', queryURL)
            .then(res => {
                if (res.error !== undefined)
                    reject("Cant get transaction properties");
                else
                    resolve(res);
            })
            .catch(()=> {
                reject("Cant get transaction properties");
            });
    });

}

function getShortlink() {
    const url = window.location;
    const urlData = parseURL(url);
    return urlData.send;
}
