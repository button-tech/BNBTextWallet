new ClipboardJS('.mnemonic');
new ClipboardJS('.prvt');

function getCreateShortlink() {
    const demand = ['create'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.create;
}

async function createAcc(){
    let pin = document.getElementById("pincode").value;

    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret:pin});

    let randomWallet = ethers.Wallet.createRandom();

    let binanceObject = await getMnemonic();

    ls.set("data", {privateKey: randomWallet.privateKey, mnemonic:binanceObject.mnemonic});

    let privateText =  document.getElementById("prvt");
    let mnemonicText =  document.getElementById("mnemonic");

    let info = document.getElementById("info");
    info.innerText = "Copy private key and Binance Mnemonic!";

    console.log(randomWallet.address);

    privateText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word"><span id="prvt">${randomWallet.privateKey}</span><button data-clipboard-target="#prvt" class="prvt btn btn-success btn-sm">COPY</button></p><br>`;
    mnemonicText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word"><span id="mnemonic">${binanceObject.mnemonic}</span><button data-clipboard-target="#mnemonic" class="mnemonic btn btn-success btn-sm">COPY</button></p><br>`;

    let createButton = document.getElementById("createBtn");
    createButton.style.display = "none";

    let pincode = document.getElementsByClassName("pincode-input-container")[0];
    pincode.style.display = "none";

    let bnbAddress = await getAddressFromMnemonic(binanceObject.mnemonic);

    await req("PUT", `${backendURL}/api/discord/create/${getCreateShortlink()}`,JSON.stringify({"EthereumAddress":randomWallet.address,"BinanceAddress":bnbAddress}));
}
