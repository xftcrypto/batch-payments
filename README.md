# XFT Batch Payments
BatchTransfer.sol

### Sepolia
- BatchTransfer.sol: [0xcE7234872b5957eB2d7C7C2eDab945DA3D37c681](https://sepolia.etherscan.io/address/0xcE7234872b5957eB2d7C7C2eDab945DA3D37c681)
- USDX Proxy: [0x2f572059dbc598c8acfea4af06fe4f7669d1b3b1](https://sepolia.etherscan.io/address/0x2f572059dbc598c8acfea4af06fe4f7669d1b3b1)
- USDX.sol: [0xf6080682dFCa67A25F294343a03C8cd8675cc41E](https://sepolia.etherscan.io/address/0xf6080682dfca67a25f294343a03c8cd8675cc41e#code)


### Public and External Functions
```
constructor(address _usdx): Sets USDX token address
batchTransfer(address[] calldata recipients, uint256 amount): Sends same USDX amount to multiple recipients
```

### Events
```
Batch(address indexed sender, address[] recipients, uint256 amount): Emitted after successful batch transfer.
```

### ABI
```json
[{"inputs":[{"internalType":"address","name":"_usdx","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address[]","name":"recipients","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Batch","type":"event"},{"inputs":[],"name":"USDX","outputs":[{"internalType":"contract IUSDX","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"batchTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"}]
```

### Shell Flow
```
npm install hardhat @nomicfoundation/hardhat-toolbox dotenv ethers
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

### Deployment
This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


```
git add .
git commit -m "X"
git push -f origin main
```

