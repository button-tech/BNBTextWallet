new ClipboardJS('.addr');
new ClipboardJS('.prvt');

function createAcc(){
    let pin = document.getElementById("pincode").value;

    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret:pin});

    let randomWallet = ethers.Wallet.createRandom();

    ls.set("data", {privateKey: randomWallet.privateKey});

    let privateText =  document.getElementById("prvt");
    let addressText =  document.getElementById("addr");

    addressText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word">Adress: \n<span id="addr">${randomWallet.address}</span><button data-clipboard-target="#addr" class="addr btn btn-success btn-sm">COPY</button></p><br>`;
    privateText.innerHTML = `<p style="font-size: 22px; word-wrap: break-word">PrivateKey: \n<span id="prvt">${randomWallet.privateKey}</span><button data-clipboard-target="#prvt" class="prvt btn btn-success btn-sm">COPY</button></p><br>`;

    let createButton = document.getElementById("createBtn");
    createButton.style.display = "none";
    // let pincode = document.getElementById("pincode");
}
