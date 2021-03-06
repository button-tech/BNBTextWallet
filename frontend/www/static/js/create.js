// Validation password
let checkFlag = true;

document.getElementById("create-button").addEventListener("click", checkAllAndGeneratePicture);
document.addEventListener('keypress',function(e) {
    if(e.which === 13) {
        checkAllAndGeneratePicture();
    }
});

function checkAllAndGeneratePicture() {
    checkFlag = true;
    checkPassword();
    checkRepeatPassword();
    if (checkFlag === true) {
        create();
    }
}

$('#password').on('input', checkPassword);
$('#password-again').on('input', checkRepeatPassword);

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


async function addSaveButton(tag) {
    const image = document.getElementById(tag);
    if (navigator.platform.toLowerCase() === "iphone" || navigator.platform.toLowerCase() === "ipad") {
        document.getElementById('save-qr').innerHTML = "<b>Press</b>  to Save";
        document.getElementById("container").innerHTML = `<img src="${image.src}" style="opacity: 0; position: absolute; width: 100%; height: 100%;">`+document.getElementById("container").innerHTML
    } else {
        document.getElementById('save-qr-code').innerHTML = `<br><a href="${image.src}" download="BUTTONWallet.png"><button class="btn orange-button" style="border-radius: 40px;background-color: black">Download</button></a>`;
    }
}

async function create(){

    let binanceObject = await getMnemonic();

    localStorage.setItem("accountData", JSON.stringify(binanceObject));

    let createButton = document.getElementById("create-button");

    createButton.style.display = "none";

    const encrypted = encryptAccount(binanceObject, document.getElementById("password").value);
    const qrId = "qr";

    showQrPage(qrId);
    await createQRCode(qrId, encrypted);
    await addSaveButton(qrId);

    let bnbAddress = await getAddressFromMnemonic(binanceObject.mnemonic);
    await req("PUT", `${backendURL}/api/discord/create/${getCreateShortlink()}`,JSON.stringify({"BinanceAddress":bnbAddress}));
}

function showQrPage(qrId) {
    const qrPage = buildQrPage(qrId);
    document.getElementById('container').replaceChild(qrPage, document.getElementById("main"));
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
