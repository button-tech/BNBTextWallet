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
async function setTransactionDataAndStartTimer() {
    let {
        currency,
        to,
        nickname,
        value,
        valueInUsd
    } = transactionData;

    document.getElementById('currency').innerText = currency;
    document.getElementById('to').innerText = to;
    document.getElementById('nickname').innerText = nickname;
    document.getElementById('value').innerText = value;
    document.getElementById('usd-value').innerText = valueInUsd + ' $';
}

function getShortlink() {
    const demand = ['tx'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.tx;
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



