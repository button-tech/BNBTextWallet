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
        currency,
        to,
        nickname,
        value,
        from,
        valueInUsd
    } = transactionData;

    document.getElementById('currency').innerText = currency;
    document.getElementById('to').innerText = to;
    document.getElementById('from').innerText = from;
    document.getElementById('nickname').innerText = nickname;
    document.getElementById('value').innerText = value;
    document.getElementById('usd-value').innerText = valueInUsd + ' $';
}

async function setTransactionBnbData() {
    let {
        currency,
        to,
        nickname,
        value,
        from,
    } = transactionBnbData;

    document.getElementById('currency').innerText = currency;
    document.getElementById('to').innerText = to;
    document.getElementById('from').innerText = from;
    document.getElementById('nickname').innerText = nickname;
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



