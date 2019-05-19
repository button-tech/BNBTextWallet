const backendURL = "https://discord.buttonwallet.tech";
let info = document.getElementById("info");

function getImportShortLink() {
    const demand = ['import'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.import;
}

async function importAcc() {
    try {
        let pin = document.getElementById("pincode").value;

        let ethPrvt = document.getElementById("eth");
        let bnbPrvt = document.getElementById("bnb");

        let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret: pin});

        ls.set("data", {privateKey: ethPrvt.value, mnemonic: bnbPrvt.value});


        info.innerText = "Nice!";

        let createButton = document.getElementById("createBtn");
        createButton.style.display = "none";

        let pincode = document.getElementsByClassName("pincode-input-container")[0];
        pincode.style.display = "none";

        let bnbAddress = await getAddressFromMnemonic(bnbPrvt.value);
        let wallet = new ethers.Wallet(ethPrvt.value);

        console.log(wallet.address);
        console.log(bnbAddress);
        console.log(getImportShortLink());

        // await req("PUT", `${backendURL}/api/discord/import/${getImportShortLink()}`, JSON.stringify({
        //     "EthereumAddress": wallet.address,
        //     "BinanceAddress": bnbAddress
        // }));

        ethPrvt.style.display = "none";
        bnbPrvt.style.display = "none";

        let one = document.getElementById("1");
        let two = document.getElementById("2");
        let three = document.getElementById("3");

        one.style.display = "none";
        two.style.display = "none";
        three.style.display = "none";

    }catch (e) {
        console.log(e);
        info.innerText = "Error!"
    }
}
