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


async function getLinkLivetime() {
    const guid = getShortlink();
    try {
        const response = await req('GET', `${backendURL}/api/blockchain/validator/${guid}`);
        if (response.error){
            return response.error;
        }
        else
            return new Date(response.result).getTime();
    } catch (e) {
        throw new Error('Can not get livetime of link');
    }
}

async function setTransactionDataAndStartTimer() {
    const deleteDate = await getLinkLivetime();
    const now = Date.now();
    const difference = Number(deleteDate) - now;
    if (difference <= 0) {
        throw new Error('Can not get livetime of link');
    }
    const differenceInMinute = difference / 1000 / 60;
    const minutes = 60 * differenceInMinute,
        display = document.querySelector('#time');

    let {
        currency,
        // from,
        to,
        nickname,
        value,
        valueInUsd
    } = transactionData;

    document.getElementById('currency').innerText = currency;
    // document.getElementById('from').innerText = from;
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



