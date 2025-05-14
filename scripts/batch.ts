// scripts/batch.ts
import { ethers } from "hardhat";

async function main() {
  // Configuration
  const BATCH_TRANSFER_ADDRESS = "0xcE7234872b5957eB2d7C7C2eDab945DA3D37c681";
  const AMOUNT_PER_RECIPIENT = ethers.parseUnits("5", 18); // 5 USDX (assuming 18 decimals)

  // Recipients
  const recipients = [
    "0x934634ce613b208566A4C57f49EAbb1eC6fEd531",
    "0x5963601C64aaE624D622A18b615c2E98A87f8018", 
    "0xf111CfD2c36e6f7F6984C182824FFfecafe2C4Ee"
  ];

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log(`Using wallet: ${signer.address}`);

  // Get BatchTransfer contract
  const batchTransfer = await ethers.getContractAt("BatchTransfer", BATCH_TRANSFER_ADDRESS);

  // Get USDX contract address
  const usdxAddress = await batchTransfer.USDX();
  console.log(`USDX token: ${usdxAddress}`);

  // Calculate total amount needed
  const totalAmount = AMOUNT_PER_RECIPIENT * BigInt(recipients.length);
  console.log(`Sending ${ethers.formatUnits(AMOUNT_PER_RECIPIENT, 18)} USDX to ${recipients.length} recipients`);
  console.log(`Total: ${ethers.formatUnits(totalAmount, 18)} USDX`);

  // Step 1: Approve USDX spending
  console.log("\nStep 1: Approving tokens...");
  const usdx = new ethers.Contract(
    usdxAddress,
    ["function approve(address spender, uint256 amount) external returns (bool)"],
    signer
  );

  const approveTx = await usdx.approve(BATCH_TRANSFER_ADDRESS, totalAmount);
  console.log(`Approval submitted: ${approveTx.hash}`);
  await approveTx.wait();
  console.log("Approval confirmed!");

  // Step 2: Execute batch transfer
  console.log("\nStep 2: Executing batch transfer...");
  const batchTx = await batchTransfer.batchTransfer(recipients, AMOUNT_PER_RECIPIENT);
  console.log(`Transaction submitted: ${batchTx.hash}`);

  const receipt = await batchTx.wait();
  console.log("Transaction confirmed!");

  // Parse the event
  const batchEvent = receipt.logs
    .filter(log => log.topics[0] === ethers.id("Batch(address,address[],uint256)"))
    .map(log => batchTransfer.interface.parseLog({
      topics: log.topics as string[],
      data: log.data
    }))[0];

  if (batchEvent) {
    console.log("\nTransaction successful!");
    console.log(`Sender: ${batchEvent.args[0]}`);
    console.log(`Recipients: ${batchEvent.args[1].length} addresses`);
    console.log(`Amount per recipient: ${ethers.formatUnits(batchEvent.args[2], 18)} USDX`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });