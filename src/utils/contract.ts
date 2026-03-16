import { ethers } from "ethers";
import { CONTENT_PAYWALL_ADDRESS } from "../lib/constants";
import { abi as CONTRACT_ABI } from "../assets/abis/ContentPaywall";

// Rootstock Testnet configuration
export const ROOTSTOCK_TESTNET = {
  chainId: 31,
  name: "Rootstock Testnet",
  rpcUrl: "https://public-node.testnet.rsk.co",
  blockExplorer: "https://explorer.testnet.rsk.co",
  nativeCurrency: {
    name: "Test Rootstock Bitcoin",
    symbol: "tRBTC",
    decimals: 18,
  },
};

/**
 * Get a contract instance bound to a signer or provider.
 * This is the core utility used by all other functions in this file.
 */
export const getContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
) => {
  if (!CONTENT_PAYWALL_ADDRESS) {
    throw new Error("Contract address not configured in constants");
  }
  return new ethers.Contract(
    CONTENT_PAYWALL_ADDRESS,
    CONTRACT_ABI,
    signerOrProvider,
  );
};

/**
 * Unlock content by paying with rBTC.
 *
 * ACTIVELY USED: This is the primary write function imported by PaymentModal.tsx.
 *
 * Uses legacy transactions (type 0 + gasPrice) for Rootstock/RSK compatibility,
 * since Rootstock does not support EIP-1559.
 */
export const unlockContent = async (
  signer: ethers.Signer,
  contentId: string,
  price: ethers.BigNumber,
): Promise<{ success: boolean; receipt?: any; error?: string }> => {
  try {
    const contract = getContract(signer);
    const provider = signer.provider;
    if (!provider) {
      return { success: false, error: "No provider available for signer" };
    }

    let gasLimit;
    try {
      const estimatedGas = await contract.estimateGas.unlockContent(contentId, {
        value: price,
      });
      gasLimit = estimatedGas.mul(120).div(100);
    } catch (estError) {
      console.warn("Gas estimation failed, falling back to safe default", estError);
      gasLimit = ethers.BigNumber.from(500000);
    }

    // Rootstock/RSK uses legacy gas model (gasPrice), not EIP-1559. Force legacy tx.
    const gasPrice = await provider.getGasPrice();
    const gasPriceWithBuffer = gasPrice.mul(110).div(100);

    const txOverrides: {
      value: ethers.BigNumber;
      gasLimit: ethers.BigNumber;
      type: number;
      gasPrice: ethers.BigNumber;
    } = {
      value: price,
      gasLimit,
      type: 0,
      gasPrice: gasPriceWithBuffer,
    };

    const tx = await contract.unlockContent(contentId, txOverrides);
    const receipt = await tx.wait();

    return { success: true, receipt };
  } catch (error: any) {
    console.error("Error unlocking content:", error);

    const errString = String(
      error?.data?.message || error?.message || error,
    ).toLowerCase();
    const code = error?.code ?? error?.error?.code;

    let finalError = "Failed to unlock content";

    if (errString.includes("insufficient funds")) {
      finalError = "Insufficient funds (You need tRBTC for gas)";
    } else if (errString.includes("user rejected") || errString.includes("action_rejected")) {
      finalError = "Transaction rejected by user";
    } else if (errString.includes("content does not exist") || errString.includes("price not set")) {
      finalError = "Content not found or Price is 0";
    } else if (
      code === "SERVER_ERROR" ||
      code === -32603 ||
      errString.includes("internal server error") ||
      errString.includes("processing response error")
    ) {
      finalError = "Network error: RPC rejected the transaction. Try again or switch network.";
    } else {
      finalError = errString.slice(0, 120);
    }

    return { success: false, error: finalError };
  }
};

// ---------------------------------------------------------------------------
// Utility functions — available for builders extending this starter kit.
// The functions below are NOT currently imported by the UI but are provided
// as ready-to-use helpers. Remove any you don't need to keep your bundle lean.
// ---------------------------------------------------------------------------

/** Check if a user has access to a specific content item. */
export const checkAccess = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  contentId: string,
): Promise<boolean> => {
  try {
    const contract = getContract(provider);
    return await contract.hasAccess(userAddress, contentId);
  } catch (error) {
    console.error("Error checking access:", error);
    return false;
  }
};

/** Get the price (in wei) for a specific content item. */
export const getContentPrice = async (
  provider: ethers.providers.Provider,
  contentId: string,
): Promise<ethers.BigNumber> => {
  try {
    const contract = getContract(provider);
    return await contract.contentPrices(contentId);
  } catch (error) {
    console.error("Error getting content price:", error);
    return ethers.BigNumber.from(0);
  }
};

/** Format a wei BigNumber as a human-readable rBTC string. */
export const formatRBTC = (
  amount: ethers.BigNumber,
  decimals: number = 4,
): string => {
  return parseFloat(ethers.utils.formatEther(amount)).toFixed(decimals);
};

/** Parse a decimal rBTC string into a wei BigNumber. */
export const parseRBTC = (amount: string): ethers.BigNumber => {
  try {
    return ethers.utils.parseEther(amount);
  } catch (error) {
    console.error("Error parsing rBTC amount:", error);
    return ethers.BigNumber.from(0);
  }
};

/** Validate whether a string is a valid Ethereum address. */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

/** Shorten an address for display (0x1234...5678). */
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/** Return the block explorer URL for a transaction hash. */
export const getTxUrl = (txHash: string): string =>
  `${ROOTSTOCK_TESTNET.blockExplorer}/tx/${txHash}`;

/** Return the block explorer URL for a wallet address. */
export const getAddressUrl = (address: string): string =>
  `${ROOTSTOCK_TESTNET.blockExplorer}/address/${address}`;

/** Return the block explorer URL for the ContentPaywall contract. */
export const getContractUrl = (): string =>
  `${ROOTSTOCK_TESTNET.blockExplorer}/address/${CONTENT_PAYWALL_ADDRESS}`;

// Re-export for convenience
export { CONTENT_PAYWALL_ADDRESS as CONTRACT_ADDRESS };
