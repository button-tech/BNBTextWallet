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

function checkAllAndImportMnemonic() {
    checkFlag = true;
    checkPassword();
    checkRepeatPassword();
    if (checkFlag === true && document.getElementById("mnemonic").value.length > 0) {
        importMnemonic();
    }
}

function buildQrPage(qrId) {
    const mainDiv = document.createElement("div");
    const h1 = document.createElement("h1");
    const h5 = document.createElement("h5");
    const img = document.createElement("img");
    const saveButton = document.createElement("p");
    const form = document.createElement("form");
    const input = document.createElement("input");

    mainDiv.className = "container text-center";
    h1.setAttribute("id", "save-qr");
    h1.innerText = "This is your QR code";
    h5.innerText = "Don't lose it";
    img.setAttribute("id", qrId);
    form.setAttribute("id", "myAwesomeForm");
    form.setAttribute("method", "post");
    form.style.display = "none";
    input.setAttribute("type", "text");
    input.setAttribute("id", "filename");
    input.setAttribute("name", "BUTTONWallet.com");
    saveButton.setAttribute("id", "save-qr-code");

    form.appendChild(input);
    mainDiv.appendChild(h1);
    mainDiv.appendChild(h5);
    mainDiv.appendChild(img);
    mainDiv.appendChild(saveButton);
    mainDiv.appendChild(form);

    return mainDiv;
}

function showQrPage(qrId) {
    const qrPage = buildQrPage(qrId);
    document.getElementById('container').replaceChild(qrPage, document.getElementById("main"));
}

$('#password').on('input', checkPassword);
$('#password-again').on('input', checkRepeatPassword);

async function importMnemonic(){

    let binanceObject = {};

    let mnemonic = document.getElementById("mnemonic").value;

    try {
        binanceObject.address = await getAddressFromMnemonic(mnemonic);
        binanceObject.privateKey = await getPrivateKeyFromMnemonic(mnemonic);
        binanceObject.mnemonic = mnemonic;

    } catch (e) {
       console.log(e);
       return
    }

    localStorage.setItem("accountData", JSON.stringify(binanceObject));

    const encrypted = encryptAccount(binanceObject, document.getElementById("password").value);

    const qrId = "qr";

    try {
         let bnbAddress = await getAddressFromMnemonic(binanceObject.mnemonic);
         await req("PUT", `${backendURL}/api/discord/create/${getImportShortLink()}`,JSON.stringify({"BinanceAddress":bnbAddress}));
    } catch (e) {
        console.log(e);
        return
    }

    showQrPage(qrId);
    await createQRCode(qrId, encrypted);
    await addSaveButton(qrId);
}



