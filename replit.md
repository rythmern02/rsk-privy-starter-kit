# Rootstock Privy Starter Kit

## Overview

This is a React-based starter kit for building decentralized applications (dApps) on the Rootstock blockchain. It provides pre-configured wallet connection via Privy, sample smart contract interactions for ERC20/ERC721/ERC1155 tokens, and account abstraction capabilities through Etherspot. The application serves as a hackathon starter template for developers building on Bitcoin-secured smart contract infrastructure.

**Live Demo:** https://rsk-privy-starter-kit.vercel.app/

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 19** with TypeScript as the core UI framework
- **Vite** as the build tool and development server
- Single-page application architecture with React Router for navigation

### Styling System
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** component library built on Radix UI primitives
- CSS variables for theming (dark mode by default)
- Custom fonts (NeueMachina family)

### Blockchain Integration
- **Wagmi v2** for React hooks to interact with Ethereum-compatible chains
- **Viem** as the underlying blockchain client library
- **Privy** for wallet authentication (supports Google, Twitter, Discord, email, and external wallets)
- **Ethers.js v5** for some contract interactions (legacy support)

### State Management
- **TanStack React Query** for server state and caching
- React's built-in useState/useEffect for local component state

### Supported Networks
- Rootstock Mainnet (chain ID: 30)
- Rootstock Testnet (chain ID: 31) - default network

### Key Architectural Patterns
1. **Provider Hierarchy**: App wraps components in PrivyProvider → QueryClientProvider → WagmiProvider
2. **Smart Contract ABIs**: Stored as TypeScript files in `src/assets/abis/`
3. **Contract Utilities**: Centralized in `src/utils/contract.ts` for reusable blockchain operations
4. **Component Structure**: UI primitives in `src/components/ui/`, feature components organized by domain

### Account Abstraction
- **Etherspot Prime SDK** integration for smart contract wallets
- Enables gasless transactions and batch operations

## External Dependencies

### Authentication & Wallet
- **Privy** (`@privy-io/react-auth`, `@privy-io/wagmi`) - Requires `VITE_PRIVY_APP_ID` environment variable

### Blockchain RPCs
- Rootstock Testnet: `https://public-node.testnet.rsk.co`
- Rootstock Mainnet: Default Viem transport

### Smart Contracts (Deployed on Rootstock Testnet)
- ERC20 Token: `0x72df7a1734dd6cea1682f2b93634c7f7007ad511`
- ERC721 NFT: `0x65C955e31f8bd0964127a0A2F4bC84AB298c71BE`
- ERC1155 Multi-Token: `0xB522148B5587625007AeB9600A1716DAe2bB6DE9`
- Content Paywall: `0xC8d4943aeB1BcDAb09007A9b91af5a3Fe8f22a24`

### Node.js Polyfills
- `Buffer` and `process` polyfills required for browser compatibility (configured in `src/polyfills.ts` and Vite config)

### Development Notes for Replit
- Use `yarn install --network-timeout 600000` to avoid EAGAIN errors
- Webview may require refresh for styles to load properly
- Server configured for `0.0.0.0:5173` with HMR on port 443