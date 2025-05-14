import { ethers, network, run, artifacts } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const USDX_ADDRESS = "0x421C76cd7C1550c4fcc974F4d74c870150c45995";

  if (network.name !== "sepolia") throw new Error("Must deploy on Sepolia");

  console.log("Starting BatchTransfer deployment...");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

  if (balance < ethers.parseEther("0.01")) throw new Error("Insufficient balance");

  console.log(`Using USDX: ${USDX_ADDRESS}`);

  const BatchTransferFactory = await ethers.getContractFactory("BatchTransfer");
  const batchTransfer = await BatchTransferFactory.deploy(USDX_ADDRESS, { gasLimit: 1000000 });

  console.log("Transaction sent, waiting for confirmation...");
  await batchTransfer.waitForDeployment();

  const contractAddress = await batchTransfer.getAddress();
  const deployTx = batchTransfer.deploymentTransaction();

  console.log(`BatchTransfer deployed to: ${contractAddress}`);
  console.log(`Transaction hash: ${deployTx?.hash}`);

  // Create logs directory if it doesn't exist
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // Generate timestamp for log files
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").substring(0, 14);

  // Save deployment info
  const deploymentInfo = {
    contractName: "BatchTransfer",
    address: contractAddress,
    transactionHash: deployTx?.hash,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    network: network.name,
    chainId: network.config.chainId,
    usdxAddress: USDX_ADDRESS
  };

  fs.writeFileSync(
    path.join(logDir, `deploy_BatchTransfer_${timestamp}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Save contract ABI
  const artifact = artifacts.readArtifactSync("BatchTransfer");
  fs.writeFileSync(
    path.join(logDir, `abi_BatchTransfer_${timestamp}.json`),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("Deployment logs saved to:", logDir);

  // Wait for additional confirmations before verification
  console.log("Waiting for additional confirmations before verification...");
  if (deployTx) await deployTx.wait(5);

  // Verify contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [USDX_ADDRESS]
    });
    console.log("Contract verified successfully on Etherscan!");
  } catch (error: any) {
    console.log(`Verification failed: ${error.message}`);
  }

  console.log("\nDeployment Summary:");
  console.log(`Network: ${network.name}`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`Tx hash: ${deployTx?.hash}`);
  console.log(`USDX: ${USDX_ADDRESS}`);
  console.log("\nVerify manually if needed:");
  console.log(`npx hardhat verify --network ${network.name} ${contractAddress} "${USDX_ADDRESS}"`);

  console.log("\nDeployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Deployment failed: ${error.message}\n${error.stack}`);
    process.exit(1);
  });