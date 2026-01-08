"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import ContentCard from "../components/ContentCard";

// Sample content data - in production, fetch from your backend/API
const CONTENT_ITEMS = [
  {
    contentId: "0",
    title: "Bitcoin Security Deep Dive",
    description:
      "Learn how Bitcoin's merged mining secures Rootstock and why it matters for your dApps",
    previewContent:
      "Bitcoin's security model is the gold standard in cryptocurrency. Through merged mining, Rootstock inherits this security while adding smart contract capabilities. In this comprehensive guide, we'll explore...",
    fullContent: `Bitcoin's security model is the gold standard in cryptocurrency. Through merged mining, Rootstock inherits this security while adding smart contract capabilities.

Merged mining allows Bitcoin miners to simultaneously mine both Bitcoin and Rootstock blocks without additional computational cost. This means Rootstock benefits from over 50% of Bitcoin's hash power - billions of dollars worth of mining infrastructure.

When you deploy smart contracts on Rootstock, you're not just getting EVM compatibility. You're getting Bitcoin-grade security that has withstood over a decade of attacks. This makes Rootstock ideal for high-value applications like DeFi, NFTs, and payment systems.

The process works through a clever cryptographic technique where RSK block hashes are embedded in Bitcoin blocks. If a miner successfully mines a Bitcoin block, they've also contributed to securing Rootstock. The economic incentives align perfectly - miners earn fees from both networks.

For developers, this means you can build with confidence knowing your smart contracts are protected by the most secure blockchain network in existence.`,
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  },
  {
    contentId: "1",
    title: "Building DeFi on Rootstock",
    description:
      "Complete video course on creating decentralized finance applications with Bitcoin security",
    previewContent:
      "This comprehensive video course covers everything you need to build production-ready DeFi applications on Rootstock. Topics include liquidity pools, yield farming, flash loans, and more...",
    fullContent: `🎥 VIDEO COURSE CONTENT

Module 1: Introduction to Rootstock DeFi
- Understanding the Rootstock ecosystem
- Why Bitcoin security matters for DeFi
- Setting up your development environment

Module 2: Smart Contract Development
- Writing secure Solidity contracts
- Testing with Hardhat
- Gas optimization techniques

Module 3: Building a DEX
- Automated Market Maker (AMM) design
- Liquidity pool implementation
- Swap functionality and pricing

Module 4: Yield Farming Protocols
- Staking mechanisms
- Reward distribution
- Time-locked vaults

Module 5: Advanced Topics
- Flash loans
- Oracle integration
- Cross-chain bridges

Total Duration: 8 hours
Includes: Source code, exercises, and project templates`,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    contentId: "2",
    title: "2025 Blockchain Industry Report",
    description:
      "Exclusive analysis of blockchain trends, market data, and investment opportunities",
    previewContent:
      "Our annual blockchain industry report provides deep insights into market trends, emerging technologies, and investment opportunities for 2025. This year's report covers...",
    fullContent: `📊 BLOCKCHAIN INDUSTRY REPORT 2025

Executive Summary:
The blockchain industry has reached an inflection point. With Bitcoin ETFs approved and institutional adoption accelerating, we're seeing unprecedented growth across all sectors.

Key Findings:

1. Bitcoin Layer 2 Solutions
- Rootstock and similar platforms experiencing 400% growth
- Smart contract deployments up 650% YoY
- Total Value Locked (TVL) exceeds $5B

2. DeFi Evolution
- Real-world asset tokenization reaching $50B
- Decentralized exchanges handling $2T in annual volume
- Yield opportunities ranging from 5-20% APY

3. Institutional Adoption
- 78% of Fortune 500 companies exploring blockchain
- $100B in institutional capital deployed
- Regulatory clarity improving in major markets

4. Technology Trends
- Zero-knowledge proofs becoming mainstream
- Account abstraction improving UX
- Cross-chain interoperability maturing

5. Investment Opportunities
- Infrastructure: Scaling solutions, bridges, oracles
- Applications: DeFi, gaming, social platforms
- Enterprise: Supply chain, identity, payments

Market Projections:
- Total blockchain market cap: $5T by EOY 2025
- Active users: 500M globally
- Smart contract deployments: 100M+

This report includes 50+ charts, detailed analysis, and actionable insights for investors and builders.`,
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
];

export default function Dashboard() {
  const { authenticated } = usePrivy();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUnlock = () => {
    // Refresh the dashboard to show updated access
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Premium Content <span className="text-orange-400">Marketplace</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock exclusive content with rBTC. All purchases are secured on the
            Rootstock blockchain.
          </p>
        </div>

        {/* Stats */}
        {authenticated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 bg-opacity-20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available Content</p>
                  <p className="text-white text-2xl font-bold">
                    {CONTENT_ITEMS.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Blockchain Secured</p>
                  <p className="text-white text-2xl font-bold">Rootstock</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Instant Access</p>
                  <p className="text-white text-2xl font-bold">~30s</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Not Authenticated */}
        {!authenticated && (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center mb-12">
            <svg
              className="w-16 h-16 text-orange-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 mb-6">
              Sign in with your social account to start unlocking premium
              content
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secured by Bitcoin • No seed phrases required
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONTENT_ITEMS.map((item) => (
            <ContentCard
              key={`${item.contentId}-${refreshKey}`}
              {...item}
              onUnlock={handleUnlock}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-6 py-3">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-gray-400">
              Connected to{" "}
              <span className="text-white font-semibold">
                Rootstock Testnet
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
