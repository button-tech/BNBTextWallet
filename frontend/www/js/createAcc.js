function createAcc(){

    let pin = document.getElementById("pincode").value;

    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret:pin});

    let randomWallet = ethers.Wallet.createRandom();

    ls.set("data", {privateKey: randomWallet.privateKey});

    let privateText =  document.getElementById("prvt");
    let addressText =  document.getElementById("addr");

    privateText.innerText = `Your private key: ${randomWallet.privateKey}`;
    addressText.innerText = `Your address : ${randomWallet.address}`
}