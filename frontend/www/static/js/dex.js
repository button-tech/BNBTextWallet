let urlData = {};

let deparam = (function(d,x,params,pair,i) {
    return function (qs) {
        params = {};
        qs = qs.substring(qs.indexOf('?')+1).replace(x,' ').split('&');
        for (i = qs.length; i > 0;) {
            pair = qs[--i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }

        return params;
    };
})(decodeURIComponent, /\+/g);

(async function() {
    let params = deparam(window.location.href);
    urlData = params;
    console.log(urlData);

    document.getElementById('amount').innerText = params.amount;
    document.getElementById('price').innerText = params.price;
    document.getElementById('operation').innerText = params.operation.toUpperCase();
})();

async function dex() {

    let errorField = document.getElementById("badPin");

    errorField.style.display = "none";

    let pin = document.getElementById("pincode").value;

    let ls = new Storage.SecureLs({encodingType: 'aes', encryptionSecret: pin});

    try {

        let data = ls.get("data");

        let pincode = document.getElementsByClassName("pincode-input-container")[0];

        pincode.style.display = "none";

        let createButton = document.getElementById("sendBtn");

        createButton.style.display = "none";

        mnemonic = data.mnemonic;

        let response = await CreateOrder("000-EF6_BNB", urlData.operation, urlData.amount, urlData.price);

        let info = document.getElementById("data");
        info.innerHTML =  `${response.result[0].data}`;
        console.log(response);

    }catch (e) {
        errorField.display = "block";
        console.log(e);
    }
}
