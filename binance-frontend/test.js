const TESTNET_ENDPOINT = "https://testnet-dex-asiapacific.binance.org";
var mnemonic = ""; // your mnemonic

const getClient = async (useAwaitSetPrivateKey = true, doNotSetPrivateKey = false) => {
    const client = new Binance.Binance(TESTNET_ENDPOINT);
    await client.initChain();
    const privateKey = Binance.Binance.crypto.getPrivateKeyFromMnemonic(mnemonic);
    if (!doNotSetPrivateKey) {
        if (useAwaitSetPrivateKey) {
            await client.setPrivateKey(privateKey)
        } else {
            client.setPrivateKey(privateKey) // test without `await`
        }
    }
    // use default delegates (signing, broadcast)
    client.useDefaultSigningDelegate();
    client.useDefaultBroadcastDelegate();
    return client
}

// Craeate private key
async function CreateKey() {
    const client = await getClient(false);
    const pk = Binance.Binance.crypto.generatePrivateKey();
    const res = client.recoverAccountFromPrivateKey(pk);
    console.log(res)
}

// Create Mnemonic 
async function CreateMnemonic() {
    const client = await getClient(false)
    const res = client.createAccountWithMneomnic()
    console.log(res)
}

// Returns list of all tokens on address
async function GetBalance(address) {
    const client = await getClient(false);
    const res = await client.getBalance(address);
    console.log(res);
}

// Create a simple tx
// to - address to
// sum - sum (1 is 1 BNB)
// symbol - token symbol
// message - additional message to transfer
// returns txHash
async function SignTx(to, sum, symbol = "BNB", message = "Frontend Tx") {
    const client = await getClient(true);
    const addr = Binance.Binance.crypto.getAddressFromPrivateKey(client.privateKey);

    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`);
    const sequence = account.result && account.result.sequence;

    res = await client.transfer(addr, to, sum, symbol, message, sequence);
    console.log(res.result[0].hash)
}

// CreateOrder
// symbol - exchange symbol (like 000-EF6_BNB)
// type - sell or buy
// amount - 1 is 1 BNB
// price = price :)
async function CreateOrder(symbol, type, amount, price) {
    var final = 0;
    if (type === "sell") {
        final = 2;
    } else if (type === "buy") {
        final = 1
    }
    const client = await getClient(true);
    const addr = Binance.Binance.crypto.getAddressFromPrivateKey(client.privateKey);
    const accCode = Binance.Binance.crypto.decodeAddress(addr);
    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`);
    const sequence = account.result && account.result.sequence;
    const res1 = await client.placeOrder(addr, symbol, final, price, amount, sequence)
}

async function Markets() {
    const client = await getClient(true);
    res = await client.getMarkets(150);
    console.log(res)
}
