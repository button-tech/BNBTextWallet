async function req(method, url, data) {
    const settings = {
        async: true,
        crossDomain: true,
        url: url,
        method: method,
        processData: false
    };

    if (data) {
        settings.data = data;
        settings.headers = {
            "Content-Type": "application/json"
        };
    }

    return await $.ajax(settings);
}
async function setTransactionData() {
    let {
        to,
        value,
        from,
    } = transactionData;

    document.getElementById('to').innerText = to;
    document.getElementById('from').innerText = from;
    document.getElementById('value').innerText = value;
}

async function setTransactionBnbData() {
    let {
        currency,
        to,
        value,
        from,
    } = transactionBnbData;

    document.getElementById('currency').innerText = currency;
    document.getElementById('to').innerText = to;
    document.getElementById('from').innerText = from;
    document.getElementById('value').innerText = value;
}


function parseURL(url) {
    try {
        const params = url.search.substring(1);
        return JSON.parse(
            '{"' +
            decodeURI(params)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
            '"}'
        );
    } catch (e) {
        throw e;
    }
}

async function getMnemonicFromQrCode() {
    const qrData = await loadImage() && await decodeQR();
    const decryptedData = decryptData(qrData, getPassword());
    debugger;
    localStorage.setItem("accountData", decryptedData);
    return decryptedData;
}

function loadImage() {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        if (!files[0]) {
            reject("you dont add QR");
        }

        reader.readAsDataURL(files[0]);
        reader.onload = function () {
            document.getElementById("qrImage").src = reader.result;
            document.getElementById("qrImage").onload = () => {
                resolve(true)
            };
        }
    });
}

function decodeQR() {
    return new Promise((resolve, reject) => {
        const img = document.getElementById("qrImage");
        const canvasElement = document.getElementById('canvas');
        const ctx = canvasElement.getContext("2d");
        ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const encodedData = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        encodedData ? resolve(encodedData.data) : reject("Failed to decode QR Code")
    });
}

function decryptData(cipher, password) {
    if (!password)
        throw "You don't enter password";

    try {
        const bytes = CryptoJS.AES.decrypt(cipher, password);
        const data = bytes.toString(CryptoJS.enc.Utf8);

        if(data && JSON.parse(data).mnemonic);
        return data;
    } catch (e) {
        throw "Bad QR";
    }
}

function getPassword() {
    return document.getElementById('password').value;
}



function showFile(file) {
    let name = file.name + ` <a href="#" class="btn btn-danger btn-sm" style="border-radius: 12px" onclick="deleteFile()">delete</a><br>`;
    $('#file-upload-file').html('<p id="imageName">' + name + '</p>');
}

function deleteFile() {
    location.reload();
}
