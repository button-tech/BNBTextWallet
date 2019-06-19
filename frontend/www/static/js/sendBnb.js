let transactionBnbData = {};
const backendURL = "https://discord.buttonwallet.tech";
let files = [];
let accountData;

(async function() {
    // transactionBnbData = await getTransactionBnbData();
    // await setTransactionBnbData();
    let data = localStorage.getItem("accountData");
    if(!data){
        document.getElementById("main").style.display = "block";
        document.getElementById("container").style.display = "block";
        accountData = JSON.parse(data);
    }else{
        send();
    }
})();

window.onload = function() {
    $("#upload_link").on('click', uploadLink);
    $("#upload").on("change", addFiles);
};

function uploadLink(e) {
    e.preventDefault();
    $("#upload").trigger('click');
}

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

async function getAccountDataFromQR(){
    let one = await  JSON.parse(await getMnemonicFromQrCode());
    console.log(one);
}


async function send() {
    try {
        let data;
        if(!accountData){
            debugger
            data = JSON.parse(await getAccountDataFromQR());
        }else {
            debugger
            data = accountData;
        }

        debugger;

        mnemonic = data.mnemonic;

        txHash = await SignTx(transactionBnbData.to, transactionBnbData.value, transactionBnbData.currency);

        let info = document.getElementById("data");

        info.innerHTML =  txHash.innerHTML = `<a href="https://testnet-explorer.binance.org/tx/${txHash}">TxHash</a>`;

    }catch (e) {
        console.log(e);
    }
}

function addFiles() {
    const file = document.querySelector("input[type=file]").files[0];
    files[0] = file;
    showFile(file);
    document.getElementById("drop-area").innerHTML += `<div id="qr-pass" class="text-center col-12">
                <div class="form-group">
                    <label for="Password">
                        <h2">Enter your password</h2>
                    </label>
                    <br><br>
                    <input type="password" class="form-control" style="width: 200px;margin: 0 auto;" id="password" placeholder="Password">
                </div>
               
                <a class="btn btn-primary btn-lg btn-round"
                   style="background-color: black; color:white; font-weight: bold" id="send_btn">
                    SEND
                </a>
                <br>
                <br>
                <br>
            </div>`;
    document.getElementById("send_btn").addEventListener("click", send, false);
    document.addEventListener('keypress',function(e) {
        if(e.which === 13) {
            send();
        }
    });
}
