import { defineChain } from "viem";

export const rsktestnet = defineChain({
  id: 31,
  name: "Rootstock Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Rootstock Smart Bitcoin",
    symbol: "tRBTC",
  },
  rpcUrls: {
    default: {
      http: ["https://public-node.testnet.rsk.co"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.testnet.rsk.co" },
  },
  contracts: {
    multicall3: {
      address: "0xC8d4943aeB1BcDAb09007A9b91af5a3Fe8f22a24",
      blockCreated: 2771150,
    },
  },
});
