let shortlink;

let transactionData = {};
let accountData;


window.onload = function() {
    $("#upload_link").on('click', uploadLink);
    $("#upload").on("change", addFiles);
    shortlink = getShortlink();
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
                    .then(txHash => {
                        console.log(txHash);
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
                    transactionData.from,
                    transactionData.to,
                    transactionData.value);
                loader.close();
            }
        })
        .catch(console.log)

};

function setTransactionData(currency, from, to, value) {
    document.getElementById('currency').innerText = currency;
    document.getElementById('from').innerText = from;
    document.getElementById('to').innerText = to;
    document.getElementById('value').innerText = Number(toFixed(String(value).replace("E", "e"))).toFixed(8);
}

function setTransactionHash(txHash) {
    addSuccess(`<a href="https://testnet-explorer.binance.org/tx/${txHash}">https://testnet-explorer.binance.org/tx/${txHash}</a>`);
}

function send(mnemonic, transactionData) {
    return signTx(mnemonic, transactionData.to, transactionData.value, transactionData.currency)
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
            .then(txHash => {
                setTransactionHash(txHash);
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
                if (res.error !== null || res.Message)
                    reject("Cant get transaction properties");
                else
                    resolve(res.result);
            })
            .catch(()=> {
                reject("Cant get transaction properties");
            });
    });

}

function getShortlink() {
    const url = window.location;
    const urlData = parseURL(url);
    return urlData.tx;
}
