function depositMTX(privateKey, amount) {
  const DEFAULT_AMOUNT = '1000000000000000000'; // amount in wei
  amount = amount || DEFAULT_AMOUNT;

  privateKey = privateKey || "0x807BABA1E3243457A5AACF323AAC201709A46692D28C8806EFB111E31639A111";

  const Web3 = require('web3');
  const rpcURL = "https://ropsten.infura.io/v3/f3b38f25c98e44aebb3f047a9c66d3d6";
  const web3 = new Web3(rpcURL);
  
  const account =  web3.eth.accounts.privateKeyToAccount(privateKey);
  const fromAddress = account.address;

  const Matic = require('maticjs').default
//const config = require('./config')

const config = {
  MATIC_PROVIDER: 'https://testnet2.matic.network',
  PARENT_PROVIDER:
    'https://ropsten.infura.io/v3/70645f042c3a409599c60f96f6dd9fbc',
  ROOTCHAIN_ADDRESS: '0x60e2b19b9a87a3f37827f2c8c8306be718a5f9b4',
  WITHDRAWMANAGER_ADDRESS: '0x4ef2b60cdd4611fa0bc815792acc14de4c158d22',
  DEPOSITMANAGER_ADDRESS: '0x4072fab2a132bf98207cbfcd2c341adb904a67e9',
  SYNCER_URL: 'https://matic-syncer2.api.matic.network/api/v1',
  WATCHER_URL: 'https://ropsten-watcher2.api.matic.network/api/v1',
  ROOTWETH_ADDRESS: '0x421dc9053cb4b51a7ec07b60c2bbb3ec3cfe050b',
  MATICWETH_ADDRESS: '0x31074c34a757a4b9FC45169C58068F43B717b2D0',
  PRIVATE_KEY: privateKey, // prefix with `0x`
  FROM_ADDRESS: fromAddress,
  ROPSTEN_TEST_TOKEN: '0x6b0b0e265321e788af11b6f1235012ae7b5a6808',
  MATIC_TEST_TOKEN: '0xcc5de81d1af53dcb5d707b6b33a50f4ee46d983e',
  ROPSTEN_ERC721_TOKEN: '0x07d799252cf13c01f602779b4dce24f4e5b08bbd',
  MATIC_ERC721_TOKEN: '0x9f289a264b6db56d69ad53f363d06326b984e637',
}

const token = config.ROPSTEN_TEST_TOKEN // test token address
const from = config.FROM_ADDRESS // from address



// Create object of Matic
const matic = new Matic({
  maticProvider: config.MATIC_PROVIDER,
  parentProvider: config.PARENT_PROVIDER,
  rootChainAddress: config.ROOTCHAIN_ADDRESS,
  syncerUrl: config.SYNCER_URL,
  watcherUrl: config.WATCHER_URL,
})

matic.wallet = config.PRIVATE_KEY // prefix with `0x`

// Approve token
matic
  .approveERC20TokensForDeposit(token, amount, {
    from,
    onTransactionHash: (hash) => {
      // action on Transaction success
      console.log(hash) // eslint-disable-line
    },
  })
  .then(() => {
    // Deposit tokens
    matic.depositERC20Tokens(token, from, amount, {
      from,
      onTransactionHash: (hash) => {
        // action on Transaction success
        console.log(hash) // eslint-disable-line
      },
    })
  })  
}

depositMTX("0x12D99627CC3709BB70E0DE7B0D88F145B283CCFEC9556DE5CA01AF290C53DA5C");

