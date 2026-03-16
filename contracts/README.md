# Contracts

This starter kit interacts with the **ContentPaywall** smart contract deployed on **Rootstock Testnet**.

## Deployed Contract

| Field          | Value                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Network        | Rootstock Testnet (chainId: 31)                                                                                                    |
| Address        | [`0xC8d4943aeB1BcDAb09007A9b91af5a3Fe8f22a24`](https://explorer.testnet.rsk.co/address/0xC8d4943aeB1BcDAb09007A9b91af5a3Fe8f22a24) |
| ABI            | See [`src/assets/abis/ContentPaywall.ts`](../src/assets/abis/ContentPaywall.ts)                                                    |
| Explorer       | https://explorer.testnet.rsk.co/address/0xC8d4943aeB1BcDAb09007A9b91af5a3Fe8f22a24                                                |

> [!NOTE]
> The Solidity source code for this contract is **not included** in this starter kit. You can verify the contract's on-chain behaviour using the block explorer link above.

## Deploy Your Own

To deploy your own version of the ContentPaywall contract:

1. Install [Hardhat](https://hardhat.org/) or [Foundry](https://book.getfoundry.sh/)
2. Write your Solidity contract implementing (at minimum):
   - `contentPrices(string contentId) returns (uint256)` — price in wei per content ID
   - `checkMultipleAccess(address user, string[] contentIds) returns (bool[])` — batch access check
   - `unlockContent(string contentId) payable` — purchase access
3. Configure Rootstock Testnet RPC: `https://public-node.testnet.rsk.co`
4. Get test RBTC from the [Rootstock Faucet](https://faucet.rootstock.io)
5. Update `CONTENT_PAYWALL_ADDRESS` in [`src/lib/constants/index.ts`](../src/lib/constants/index.ts)

## Resources

- [Rootstock Developer Docs](https://dev.rootstock.io)
- [Rootstock Testnet Faucet](https://faucet.rootstock.io)
- [Rootstock Block Explorer](https://explorer.testnet.rsk.co)
