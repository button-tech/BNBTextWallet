const backendURL = "https://discord.buttonwallet.tech";
let info = document.getElementById("info");
let files = [];


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

async function importQrCode() {
    try {
        let data = JSON.parse(await getMnemonicFromQrCode());
        await Done(data);
    } catch (e) {
        addHint({hint:e.message || e || "Failed to get private keys"});
    }
}


async function getMnemonicFromQrCode() {
    const qrData = await loadImage() && await decodeQR();
    const decryptedData = decryptData(qrData, getPassword());
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

function addHint(errorObject, fieldId = "error") {
    document.getElementById(fieldId).innerHTML = ` 
    <div class="alert alert-danger col-12" id="Error_pop">
        <div class="row">
            <div class="col-10">
                <h2>Error</h2>
                <h5>${errorObject.hint}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(0)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
}

function CloseAlert() {
    document.getElementById("Error_pop").style.display = 'none';
}

window.onload = function() {
    $("#upload_link").on('click', uploadLink);
    $("#upload").on("change", addFiles);
};

function uploadLink(e) {
    e.preventDefault();
    $("#upload").trigger('click');
}


function deleteFile() {
    location.reload();
}

function showFile(file) {
    let name = file.name + ` <a href="#" class="btn btn-danger btn-sm" style="border-radius: 12px" onclick="deleteFile()">delete</a><br>`;
    $('#file-upload-file').html('<p id="imageName">' + name + '</p>');
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
                   style="background-color: black; color:white; font-weight: bold" id="import-qr-code">
                    Import
                </a>
                <br>
                <br>
                <br>
            </div>`;
    document.getElementById("import-qr-code").addEventListener("click", importQrCode, false);
    document.addEventListener('keypress',function(e) {
        if(e.which === 13) {
            importQrCode();
        }
    });
}

async function Done(data) {
    let bnbAddress = await getAddressFromMnemonic(data.mnemonic);
    // await req("PUT", `${backendURL}/api/discord/create/${getImportShortLink()}`,JSON.stringify({"BinanceAddress":bnbAddress}));
    document.getElementById("main").innerHTML = `<div id="container" class="text-center col-12">
                <div class="form-group" >
                <label>DONE!</label>
                    <br>
                       <label>Your address:</label>
                      <br>
                       ${bnbAddress}
            </div>`;
}


