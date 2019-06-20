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
    localStorage.setItem("accountData", decryptedData);
    return decryptedData;
}

function loadImage() {
    const file = document.querySelector("input[type=file]").files[0];
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        if (!file) {
            reject("you dont add QR");
        }

        reader.readAsDataURL(file);
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

function toFixed(x) {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10,e-1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
    }
    return x;
}

function addDoneView() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `#animCheck {
    width: 230px;
    height: 230px;
    position: relative;
    margin: 0 auto;
    border-radius: 50%
}

#animCheck .precheck:after {
    content: '';
    position: absolute;
    top: 45%;
    left: 0;
    width: 100%;
    height: 10%;
    box-sizing: border-box;
    background: black;
    animation: spin 2s ease-in forwards;
    transform: rotate(45deg)
}

#animCheck .check {
    height: 100%;
    transform: rotate(45deg);
    animation: poin .6s ease-in-out .3s
}

#animCheck .check:before {
    content: '';
    position: absolute;
    top: 69%;
    left: 22%;
    height: 15%;
    border-radius: 46px;
    background: black;
    animation: short .3s ease-in forwards
}

#animCheck .check:after {
    content: '';
    position: absolute;
    top: 84%;
    left: 52%;
    height: 15%;
    border-radius: 46px;
    background: black;
    transform: rotate(-90deg);
    transform-origin: 0 0;
    animation: long .3s ease-out .3s forwards
}

.icon-back {
    text-align: center;
    display: inline-block;
    vertical-align: middle
}

#arrow-left {
    display: inline-block;
    border-right: 5px solid black;
    border-bottom: 5px solid black;
    width: 20px; height: 20px;
    transform: rotate(-225deg);
}

.left {
    display: inline-block;
    width: 4em;
    height: 4em;
    border: .5em solid #333;
    border-radius: 50%;
    margin-right: 1.5em
}

.left:after {
    content: '';
    display: inline-block;
    margin-top: 1.05em;
    margin-left: .6em;
    width: 1.4em;
    height: 1.4em;
    border-top: .5em solid #333;
    border-right: .5em solid #333;
    -moz-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg)
}

@keyframes short {
    0% {
        width: 0
    }
    100% {
        width: 45%
    }
}

@keyframes long {
    0% {
        width: 0
    }
    100% {
        width: 75%
    }
}

@keyframes poin {
    0% {
        transform: rotate(45deg) scale(1)
    }
    50% {
        transform: rotate(50deg) scale(1.7)
    }
    100% {
        transform: rotate(45deg) scale(1)
    }
}

@keyframes spin {
    from {
        transform: rotate(0);
        opacity: 1
    }
    to {
        transform: rotate(720deg);
        opacity: 1
    }
}

body {
    padding: 50px;
    background-color: white
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 84px;
    height: 84px
}

.lds-ellipsis div {
    position: absolute;
    top: 27px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0)
}

.lds-ellipsis div:nth-child(1) {
    left: 6px;
    animation: lds-ellipsis1 .6s infinite
}

.lds-ellipsis div:nth-child(2) {
    left: 6px;
    animation: lds-ellipsis2 .6s infinite
}

.lds-ellipsis div:nth-child(3) {
    left: 26px;
    animation: lds-ellipsis2 .6s infinite
}

.lds-ellipsis div:nth-child(4) {
    left: 45px;
    animation: lds-ellipsis3 .6s infinite
}

@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0)
    }
    100% {
        transform: scale(1)
    }
}

@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1)
    }
    100% {
        transform: scale(0)
    }
}

@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0)
    }
    100% {
        transform: translate(19px, 0)
    }
}

.loader {
    width: 100px;
    margin: 0 auto
}

.flex-container {
    height: 100%;
    padding: 0;
    margin: 0;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center
}

.row {
    width: auto
}

@media only screen and (max-width:500px) {
    body {
        height: 300px !important
    }
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
    document.getElementById("done").style.display = 'block';
    setTimeout(()=>{
            window.close();
    }, 2000)
}

function addSuccess(successText) {
    document.getElementById('success').innerHTML = `
        <div class="alert alert-success col-12" id="Success_pop">
        <div class="row">
            <div class="col-10">
                <h2>Success</h2>
                <h5 style="word-wrap: break-word">${successText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(1)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
}