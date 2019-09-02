//let TESTNET_ENDPOINT = "https://testnet-dex-asiapacific.binance.org";
let MAINNET_ENDPOINT = "https://dex.binance.org";

// https://testnet-dex.binance.org
var mnemonic = ""; // your mnemonic

const getBaseClient = () => {
    const client = new Binance.Binance(MAINNET_ENDPOINT);
    client.chooseNetwork("mainnet");
    return client;
};

const getClient = async (mnemonic, useAwaitSetPrivateKey = true, doNotSetPrivateKey = false) => {
    const client = new Binance.Binance(MAINNET_ENDPOINT);
    client.chooseNetwork("mainnet");
    await client.initChain("mainnet");
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
    };

    // Craeate private key
async function createKey() {
        const client = await getBaseClient();
        const pk = Binance.Binance.crypto.generatePrivateKey();
        const res = client.recoverAccountFromPrivateKey(pk);
    console.log(res)
}

// Create Mnemonic
async function getMnemonic() {
    const client = await getBaseClient();
    return client.createAccountWithMneomnic();
}

async function getAddressFromMnemonic(mnemonic) {
    let prvtKey = Binance.Binance.crypto.getPrivateKeyFromMnemonic(mnemonic);
    return Binance.Binance.crypto.getAddressFromPrivateKey(prvtKey, 'bnb');
}

async function getPrivateKeyFromMnemonic(mnemonic) {
    return Binance.Binance.crypto.getPrivateKeyFromMnemonic(mnemonic);
}

// Returns list of all tokens on address
async function getBalance(address) {
    const client = await getClient(false);
    return await client.getBalance(address);
}

// Create a simple tx
// to - address to
// sum - sum (1 is 1 BNB)
// symbol - token symbol
// message - additional message to transfer
// returns txHash
async function signTx(mnemonic, to, sum, symbol = "BNB", message = "Frontend Tx") {
    const client = await getClient(mnemonic, true);
    const addr = Binance.Binance.crypto.getAddressFromPrivateKey(client.privateKey, "bnb");

    const account = await client._httpClient.request("get", `/api/v1/account/${addr}`);
    const sequence = account.result && account.result.sequence;

    return client.transfer(addr, to, sum, symbol, message, sequence);
}
