# XFT Batch Payments

BatchTransfer.sol enables sending identical USDX amounts to multiple recipients in one transaction. Use cases:

- **Pension Payments**: Monthly retiree benefits
- **Healthcare Claims**: Patient reimbursements
- **Tax Refunds**: Government returns
- **Disaster Relief**: Emergency aid
- **Utility Rebates**: Conservation incentives
- **Insurance Payouts**: Policy claims
- **Public Assistance**: Welfare benefits
- **Interest Payments**: Bond/loan earnings
- **Payroll**: Employee salaries
- **Customer Refunds**: Retail reimbursements
- **Grants**: Scholarship funding

Benefits: Gas efficiency, convenience, instant + 24/7/365 + global + transparent + immutable transaction record.

### User Flow - Batch Payments

1. User has 1000 USDX tokens
2. User approves BatchTransfer to spend 500 USDX
3. User calls batchTransfer([0xabc..., 0xdef...], 250)
4. 250 USDX sent to each recipient (500 total)
5. User has 500 USDX remaining


## BatchTransfer.sol  
- BatchTransfer.sol → ERC1967Proxy.sol → USDX Implementation


```mermaid
sequenceDiagram
    actor User
    participant BC as BatchTransfer.sol
    participant Proxy as ERC1967Proxy.sol
    participant USDX as USDX.sol
    
    User->>Proxy: approve(BatchTransfer, totalAmount)
    Proxy->>USDX: delegatecall
    
    User->>BC: batchTransfer(recipients[], amount)
    BC->>Proxy: allowance(user, this)
    Proxy->>USDX: delegatecall
    
    loop For each recipient
        BC->>Proxy: transferFrom(user, recipient, amount)
        Proxy->>USDX: delegatecall
    end
    
    BC-->>User: emit Batch(user, recipients, amount)
```



### Sepolia
- BatchTransfer.sol: [0xcE7234872b5957eB2d7C7C2eDab945DA3D37c681](https://sepolia.etherscan.io/address/0xcE7234872b5957eB2d7C7C2eDab945DA3D37c681)
- USDX.sol Proxy: [0x2f572059dbc598c8acfea4af06fe4f7669d1b3b1](https://sepolia.etherscan.io/address/0x2f572059dbc598c8acfea4af06fe4f7669d1b3b1)
- USDX.sol Implementation: [0xf6080682dFCa67A25F294343a03C8cd8675cc41E](https://sepolia.etherscan.io/address/0xf6080682dfca67a25f294343a03c8cd8675cc41e#code)


### BatchTransfer.sol
```
PUBLIC AND EXTERNAL FUNCTIONS
constructor(address _usdx): Sets USDX token address
batchTransfer(address[] calldata recipients, uint256 amount): Sends same USDX amount to multiple recipients

EVENTS
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

### RETIREMENT

```mermaid
sequenceDiagram
    actor Admin
    participant App as XFT Web App
    participant Batch as BatchTransfer.sol
    participant USDX as USDX Proxy
    participant Ret as Retiree

    Admin->>App: upload CSV + amount
    App-->>Admin: preview total
    Admin->>USDX: approve(Batch,total)
    USDX-->>Admin: approved
    Admin->>Batch: batchTransfer(recipients,benefit)
    loop each retiree
        Batch->>USDX: transferFrom(Admin,Ret,benefit)
        USDX-->>Ret: transfer event
    end
    Batch-->>Admin: Batch event
```


**Retirement Benefits Demo Flow**:
- Admin uploads CSV with retiree addresses and benefit amount via XFT Web App.
- App shows total cost preview.
- Admin approves `BatchTransfer.sol` to spend USDX tokens.
- Admin calls `batchTransfer`, sending fixed benefit to each retiree.
- `BatchTransfer` loops, calling `transferFrom` on USDX proxy for each retiree.
- USDX emits `Transfer` events; `BatchTransfer` emits `Batch` event.
- Efficient: Single transaction for mass pension payouts.


USDX.sol
- USD retirement contribution --> Mint USDX
- Retirement benefits = Transfer USDX 


### Wallet Generation

## Purpose
Generate 10 Ethereum wallets with private keys stored in code but not displayed in UI.

## Tech Stack
- Node.js
- ethers.js for wallet generation
- Simple HTML/CSS frontend (Arial, black/white)

## Implementation

### Backend (Node.js)
```javascript
// wallets.js
const { ethers } = require('ethers');

// Generate and store wallets
function generateWallets() {
  const wallets = [];
  const privateKeys = [];
  
  for(let i = 0; i < 10; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      index: i + 1
    });
    // Store private keys in memory only
    privateKeys.push(wallet.privateKey);
  }
  
  // Write private keys to secure file
  const fs = require('fs');
  fs.writeFileSync('private_keys.json', JSON.stringify(privateKeys, null, 2));
  
  return wallets;
}

module.exports = { generateWallets };
```

### Frontend (Express Server)
```javascript
// server.js
const express = require('express');
const app = express();
const { generateWallets } = require('./wallets');

app.use(express.static('public'));

app.get('/generate', (req, res) => {
  const wallets = generateWallets();
  res.json({ wallets });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Frontend (HTML/JS)
```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>ETH Wallet Generator</title>
  <style>
    body { font-family: Arial; color: black; background: white; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid black; padding: 8px; text-align: left; }
  </style>
</head>
<body>
  <h1>Ethereum Wallet Generator</h1>
  <button id="generate">Generate 10 Wallets</button>
  <div id="result">
    <table id="wallets">
      <thead><tr><th>#</th><th>Address</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  
  <script>
    document.getElementById('generate').addEventListener('click', async () => {
      const response = await fetch('/generate');
      const data = await response.json();
      
      const tbody = document.querySelector('#wallets tbody');
      tbody.innerHTML = '';
      
      data.wallets.forEach(wallet => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${wallet.index}</td><td>${wallet.address}</td>`;
        tbody.appendChild(row);
      });
    });
  </script>
</body>
</html>
```

## Security Notes
- Private keys stored in `private_keys.json` file on server
- Only addresses transmitted to frontend
- File permissions should be restricted
- For production: encrypt keys or use hardware security module

## Data Flow
1. User clicks "Generate"
2. Server creates 10 random wallets
3. Private keys saved to server-side file
4. Only addresses returned to frontend
5. Frontend displays addresses in table


### Create Wallets
- [XFT Wallet Generator](https://xft-eth-wallet-generator.lovable.app/)






