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

async function importQrCode() {
    try {
        let data = JSON.parse(await getMnemonicFromQrCode());
        await Done(data);
    } catch (e) {
        addHint({hint:e.message || e || "Failed to get private keys"});
    }
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


function addFiles() {
    const file = document.querySelector("input[type=file]").files[0];
    console.log(file)
    showFile(file);
    document.getElementById("drop-area").innerHTML = `<div id="qr-pass" class="text-center col-12">
                <div class="form-group">
                    <label for="Password">
                        <h2">Enter your password</h2>
                    </label>
                    <br><br>
                    <input type="password" class="form-control" style="width: 200px;margin: 0 auto;" id="password" placeholder="Password">
                </div>
               
                <button class="btn orange-button btn-round" id="import-qr-code">Import</button>
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
    await req("PUT", `${backendURL}/api/discord/create/${getImportShortLink()}`,JSON.stringify({"BinanceAddress":bnbAddress}));
    document.getElementById("main").innerHTML = `<div id="container" class="text-center col-12">
                <div class="form-group" >
                <label>DONE!</label>
                    <br>
                       <label>Your address:</label>
                      <br>
                       ${bnbAddress}
            </div>`;
}


