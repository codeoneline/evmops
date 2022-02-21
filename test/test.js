const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token0",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token1",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "pair",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "PairCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
      }
    ],
    "name": "getPair",
    "outputs": [
      {
        "internalType": "address",
        "name": "pair",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getChainId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "e",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "b",
        "type": "uint256"
      }
    ],
    "name": "getSHL",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "v",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "e",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "b",
        "type": "uint256"
      }
    ],
    "name": "getSHR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "v",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "e",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "b",
        "type": "int256"
      }
    ],
    "name": "getSAR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "v",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isContract",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "v",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getBaseFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "v",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const Web3 = require("web3")
const rpc = "http://127.0.0.1:8548"
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

const contract = new web3.eth.Contract(abi, "0x3FF58e2E4F9Ab2D47f0cd84bEAD42dD0369846c9");

async function testGetChainId() {
  const chainId = await contract.methods["getChainId"]().call(null, null)
  console.log(`chainId = ${chainId}`)
}

const account0 = "0x9dA26FC2E1D6Ad9FDD46138906b0104ae68a65D8"
const account1 = "0xd80B541dfFBBFDd8F328B0191fBA9671A7896e84"
const pair = "0x54E2155B9479b3140C1C786c3B957DA8a5f48A1a"

async function testCreate2() {
  contract.methods["getPair"]("0x9da26fc2e1d6ad9fdd46138906b0104ae68a65d8", "0xd80b541dffbbfdd8f328b0191fba9671a7896e84")
  .send({
    from: "0x9da26fc2e1d6ad9fdd46138906b0104ae68a65d8",
    gasPrice: '0x3B9ACA00',
    gas: 5000000
  })
  .on('error', function(error){ console.error(error)})
  .on('transactionHash', function(transactionHash){ console.log(`txHash = ${transactionHash}`) })
  .on('receipt', function(receipt) {
    console.log(`receipt = ${JSON.stringify(receipt, null, 2)}`) // contains the new contract address
    console.log(`pair = ${receipt.contractAddress}`)
  })
  .then(function(newContractInstance){
    console.log(`then = ${JSON.stringify(newContractInstance, null, 2)}`) // instance with the new contract address
  });
}

const a = 1
const b = 0xff
async function testSHL() {
  const v = await contract.methods["getSHL"](a, b).call(null, null)
  // asset(v === 510)
  console.log(`${a} shl ${b} = ${v} `)
}

async function testSHR() {
  const v = await contract.methods["getSHR"](a, b).call(null, null)
  // asset(v === 127)
  console.log(`${a} shr ${b} = ${v} `)
}

async function testSAR() {
  const v = await contract.methods["getSAR"](a, -1).call(null, null)
  // asset(v === "115792089237316195423570985008687907853269984665640564039457584007913129639935")
  console.log(`${a} sar -1 = ${v} `)
}

async function testExtCodeHash() {
  const v = await contract.methods["isContract"](pair).call(null, null)
  console.log(`pair ${pair}, isContract = ${v}`)

  const v0 = await contract.methods["isContract"](account0).call(null, null)
  console.log(`account0 ${account0}, isContract = ${v0}`)
}

async function testGetBalance() {
  const v = await contract.methods["getBalance"]().call(null, null)
  console.log(`balance is ${v}`)
}

async function testGetBaseFee() {
  const v = await contract.methods["getBaseFee"]().call(null, null)
  console.log(`base fee is ${v}`)
}

setTimeout(async () => {
  await testGetChainId()
  await testGetBalance()
  await testGetBaseFee()
  // await testSAR()
  // await testSHR()
  // await testSHL()
  // await testCreate2()
  // await testExtCodeHash()
}, 0);
