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
 * Get contract instance with provider or signer
 */
export const getContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  if (!CONTENT_PAYWALL_ADDRESS) {
    throw new Error("Contract address not configured in constants");
  }
  return new ethers.Contract(CONTENT_PAYWALL_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

/**
 * Check if user has access to specific content
 */
export const checkAccess = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  contentId: string
): Promise<boolean> => {
  try {
    const contract = getContract(provider);
    const hasAccess = await contract.hasAccess(userAddress, contentId);
    return hasAccess;
  } catch (error) {
    console.error("Error checking access:", error);
    return false;
  }
};

/**
 * Get price for specific content
 */
export const getContentPrice = async (
  provider: ethers.providers.Provider,
  contentId: string
): Promise<ethers.BigNumber> => {
  try {
    const contract = getContract(provider);
    const price = await contract.contentPrices(contentId);
    return price;
  } catch (error) {
    console.error("Error getting content price:", error);
    return ethers.BigNumber.from(0);
  }
};

/**
 * Unlock content by paying
 */
export const unlockContent = async (
  signer: ethers.Signer,
  contentId: string,
  price: ethers.BigNumber
): Promise<{ success: boolean; receipt?: any; error?: string }> => {
  try {
    const contract = getContract(signer);

    // Estimate gas
    const gasEstimate = await contract.estimateGas.unlockContent(contentId, {
      value: price,
    });

    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate.mul(120).div(100);

    console.log("Unlocking content:", {
      contentId,
      price: ethers.utils.formatEther(price),
      gasLimit: gasLimit.toString(),
    });

    // Send transaction
    const tx = await contract.unlockContent(contentId, {
      value: price,
      gasLimit: gasLimit,
    });

    console.log("Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();

    console.log("Transaction confirmed:", receipt.transactionHash);

    return { success: true, receipt };
  } catch (error: any) {
    console.error("Error unlocking content:", error);

    let errorMessage = "Failed to unlock content";

    if (error.code === "INSUFFICIENT_FUNDS") {
      errorMessage = "Insufficient funds to complete transaction";
    } else if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      errorMessage = "Transaction rejected by user";
    } else if (error.message?.includes("already unlocked")) {
      errorMessage = "You already have access to this content";
    } else if (error.message?.includes("Incorrect payment")) {
      errorMessage = "Incorrect payment amount";
    } else if (error.message?.includes("Content does not exist")) {
      errorMessage = "Content does not exist or price not set";
    } else if (error.reason) {
      errorMessage = error.reason;
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Listen for ContentUnlocked events for a specific user
 */
export const listenForUnlockEvents = (
  provider: ethers.providers.Provider,
  userAddress: string,
  callback: (event: {
    user: string;
    contentId: string;
    price: string;
    timestamp: number;
  }) => void
) => {
  try {
    const contract = getContract(provider);

    // Create filter for user's unlock events
    const filter = contract.filters.ContentUnlocked(userAddress);

    console.log("Setting up event listener for user:", userAddress);

    // Listen for events
    contract.on(filter, (user: string, contentId: string, price: ethers.BigNumber, timestamp: ethers.BigNumber) => {
      console.log("ContentUnlocked event received:", {
        user,
        contentId,
        price: price.toString(),
        timestamp: timestamp.toNumber(),
      });

      callback({
        user,
        contentId,
        price: price.toString(),
        timestamp: timestamp.toNumber(),
      });
    });

    // Return cleanup function
    return () => {
      console.log("Cleaning up event listener");
      contract.removeAllListeners(filter);
    };
  } catch (error) {
    console.error("Error setting up event listener:", error);
    return () => {};
  }
};

/**
 * Listen for all ContentUnlocked events (not user-specific)
 */
export const listenForAllUnlockEvents = (
  provider: ethers.providers.Provider,
  callback: (event: {
    user: string;
    contentId: string;
    price: string;
    timestamp: number;
  }) => void
) => {
  try {
    const contract = getContract(provider);

    // Create filter for all unlock events
    const filter = contract.filters.ContentUnlocked();

    console.log("Setting up global event listener");

    // Listen for events
    contract.on(filter, (user: string, contentId: string, price: ethers.BigNumber, timestamp: ethers.BigNumber) => {
      console.log("ContentUnlocked event received:", {
        user,
        contentId,
        price: price.toString(),
        timestamp: timestamp.toNumber(),
      });

      callback({
        user,
        contentId,
        price: price.toString(),
        timestamp: timestamp.toNumber(),
      });
    });

    // Return cleanup function
    return () => {
      console.log("Cleaning up global event listener");
      contract.removeAllListeners(filter);
    };
  } catch (error) {
    console.error("Error setting up global event listener:", error);
    return () => {};
  }
};

/**
 * Get contract statistics
 */
export const getContractStats = async (
  provider: ethers.providers.Provider
): Promise<{
  totalBalance: ethers.BigNumber;
  totalUnlocks: number;
}> => {
  try {
    const contract = getContract(provider);

    const [balance, unlocks] = await Promise.all([
      contract.getContractBalance(),
      contract.totalUnlocks(),
    ]);

    return {
      totalBalance: balance,
      totalUnlocks: unlocks.toNumber(),
    };
  } catch (error) {
    console.error("Error getting contract stats:", error);
    return {
      totalBalance: ethers.BigNumber.from(0),
      totalUnlocks: 0,
    };
  }
};

/**
 * Check multiple content access at once (batch operation)
 */
export const checkMultipleAccess = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  contentIds: string[]
): Promise<boolean[]> => {
  try {
    const contract = getContract(provider);

    // Check if contract has batch function
    if (contract.checkMultipleAccess) {
      const accessList = await contract.checkMultipleAccess(userAddress, contentIds);
      return accessList;
    }

    // Fallback to individual checks
    const accessChecks = await Promise.all(
      contentIds.map((id) => contract.hasAccess(userAddress, id))
    );

    return accessChecks;
  } catch (error) {
    console.error("Error checking multiple access:", error);
    return contentIds.map(() => false);
  }
};

/**
 * Get prices for multiple content items (batch operation)
 */
export const getMultipleContentPrices = async (
  provider: ethers.providers.Provider,
  contentIds: string[]
): Promise<ethers.BigNumber[]> => {                   
  try {
    const contract = getContract(provider);

    const prices = await Promise.all(
      contentIds.map((id) => contract.contentPrices(id))
    );

    return prices;
  } catch (error) {
    console.error("Error getting multiple content prices:", error);
    return contentIds.map(() => ethers.BigNumber.from(0));
  }
};

/**
 * Get detailed content info (price + user access)
 */
export const getContentInfo = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  contentId: string
): Promise<{
  price: ethers.BigNumber;
  hasAccess: boolean;
  priceFormatted: string;
}> => {
  try {
    const contract = getContract(provider);

    const [price, hasAccess] = await Promise.all([
      contract.contentPrices(contentId),
      contract.hasAccess(userAddress, contentId),
    ]);

    return {
      price,
      hasAccess,
      priceFormatted: ethers.utils.formatEther(price),
    };
  } catch (error) {
    console.error("Error getting content info:", error);
    return {
      price: ethers.BigNumber.from(0),
      hasAccess: false,
      priceFormatted: "0",
    };
  }
};

/**
 * Format rBTC amount for display
 */
export const formatRBTC = (amount: ethers.BigNumber, decimals: number = 4): string => {
  return parseFloat(ethers.utils.formatEther(amount)).toFixed(decimals);
};

/**
 * Parse rBTC amount from string
 */
export const parseRBTC = (amount: string): ethers.BigNumber => {
  try {
    return ethers.utils.parseEther(amount);
  } catch (error) {
    console.error("Error parsing rBTC amount:", error);
    return ethers.BigNumber.from(0);
  }
};

/**
 * Get transaction URL for block explorer
 */
export const getTxUrl = (txHash: string): string => {
  return `${ROOTSTOCK_TESTNET.blockExplorer}/tx/${txHash}`;
};

/**
 * Get address URL for block explorer
 */
export const getAddressUrl = (address: string): string => {
  return `${ROOTSTOCK_TESTNET.blockExplorer}/address/${address}`;
};

/**
 * Get contract URL for block explorer
 */
export const getContractUrl = (): string => {
  return `${ROOTSTOCK_TESTNET.blockExplorer}/address/${CONTENT_PAYWALL_ADDRESS}`;
};

/**
 * Shorten address for display (0x1234...5678)
 */
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Validate if string is valid Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Get user's unlock history from events
 */
export const getUserUnlockHistory = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  fromBlock: number = 0
): Promise<Array<{
  contentId: string;
  price: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}>> => {
  try {
    const contract = getContract(provider);

    // Create filter for user's unlock events
    const filter = contract.filters.ContentUnlocked(userAddress);

    // Query past events
    const events = await contract.queryFilter(filter, fromBlock);

    // Format events
    return events.map((event) => ({
      contentId: event.args?.contentId || "",
      price: event.args?.price?.toString() || "0",
      timestamp: event.args?.timestamp?.toNumber() || 0,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    }));
  } catch (error) {
    console.error("Error getting unlock history:", error);
    return [];
  }
};

/**
 * Get recent unlock events across all users
 */
export const getRecentUnlocks = async (
  provider: ethers.providers.Provider,
  limit: number = 10
): Promise<Array<{
  user: string;
  contentId: string;
  price: string;
  timestamp: number;
  transactionHash: string;
}>> => {
  try {
    const contract = getContract(provider);

    // Get current block
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

    // Create filter for all unlock events
    const filter = contract.filters.ContentUnlocked();

    // Query past events
    const events = await contract.queryFilter(filter, fromBlock);

    // Format and sort events (most recent first)
    const formattedEvents = events
      .map((event) => ({
        user: event.args?.user || "",
        contentId: event.args?.contentId || "",
        price: event.args?.price?.toString() || "0",
        timestamp: event.args?.timestamp?.toNumber() || 0,
        transactionHash: event.transactionHash,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return formattedEvents;
  } catch (error) {
    console.error("Error getting recent unlocks:", error);
    return [];
  }
};

/**
 * Estimate gas cost for unlocking content
 */
export const estimateUnlockGas = async (
  provider: ethers.providers.Provider,
  signer: ethers.Signer,
  contentId: string,
  price: ethers.BigNumber
): Promise<{
  gasLimit: ethers.BigNumber;
  gasCost: ethers.BigNumber;
  totalCost: ethers.BigNumber;
}> => {
  try {
    const contract = getContract(signer);

    // Estimate gas
    const gasLimit = await contract.estimateGas.unlockContent(contentId, {
      value: price,
    });

    // Get gas price
    const gasPrice = await provider.getGasPrice();

    // Calculate costs
    const gasCost = gasLimit.mul(gasPrice);
    const totalCost = price.add(gasCost);

    return {
      gasLimit,
      gasCost,
      totalCost,
    };
  } catch (error) {
    console.error("Error estimating gas:", error);
    return {
      gasLimit: ethers.BigNumber.from(0),
      gasCost: ethers.BigNumber.from(0),
      totalCost: price,
    };
  }
};

/**
 * Check if user has sufficient balance
 */
export const checkSufficientBalance = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  requiredAmount: ethers.BigNumber
): Promise<boolean> => {
  try {
    const balance = await provider.getBalance(userAddress);
    return balance.gte(requiredAmount);
  } catch (error) {
    console.error("Error checking balance:", error);
    return false;
  }
};

// Export contract address for convenience
export { CONTENT_PAYWALL_ADDRESS as CONTRACT_ADDRESS };