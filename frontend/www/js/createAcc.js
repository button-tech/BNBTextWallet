new ClipboardJS('.mnemonic');
new ClipboardJS('.prvt');

async function createAcc(){
    let pin = document.getElementById("pincode").value;

    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret:pin});

    let randomWallet = ethers.Wallet.createRandom();

    let binanceObject = await getMnemonic();

    console.log(binanceObject.mnemonic);

    ls.set("data", {privateKey: randomWallet.privateKey, mnenonic:binanceObject.mnemonic});

    let privateText =  document.getElementById("prvt");
    let mnemonicText =  document.getElementById("mnemonic");

    let info = document.getElementById("info");
    info.innerText = "Copy private key and Binance Mnemonic!";

    privateText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word"><span id="prvt">${randomWallet.privateKey}</span><button data-clipboard-target="#prvt" class="prvt btn btn-success btn-sm">COPY</button></p><br>`;
    mnemonicText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word"><span id="mnemonic">${binanceObject.mnemonic}</span><button data-clipboard-target="#mnemonic" class="mnemonic btn btn-success btn-sm">COPY</button></p><br>`;

    let createButton = document.getElementById("createBtn");
    createButton.style.display = "none";

    let pincode = document.getElementsByClassName("pincode-input-container")[0];
    pincode.style.display = "none";


}
