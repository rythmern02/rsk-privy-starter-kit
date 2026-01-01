"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";
import { rootstockTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectButton from "./components/ConnectButton";
import Dashboard from "./pages/Dashboard";

// Configure Wagmi for Rootstock Testnet
const config = createConfig({
  chains: [rootstockTestnet],
  transports: {
    [rootstockTestnet.id]: http("https://public-node.testnet.rsk.co"),
  },
});

// Create React Query client
const queryClient = new QueryClient();

export default function App() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmjvz6xmy00pelb0c24nl8zqw"}
      config={{
        loginMethods: ["google", "twitter", "discord", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#FF6B00",
          logo: "https://your-logo-url.com/logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },
        defaultChain: rootstockTestnet,
        supportedChains: [rootstockTestnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black bg-opacity-50 backdrop-blur-sm sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                      <svg
                        className="w-8 h-8 text-white"
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
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        SocialFi <span className="text-orange-400">Paywall</span>
                      </h1>
                      <p className="text-xs text-gray-500">Powered by Rootstock</p>
                    </div>
                  </div>

                  {/* Navigation & Connect Button */}
                  <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6">
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                      >
                        Explore
                      </a>

                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                      >
                        My Content
                      </a>

                      <a
                        href="https://faucet.rootstock.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        Get Testnet Tokens
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </nav>

                    {/* Using Your ConnectButton Component */}
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>
              <Dashboard />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black bg-opacity-50 mt-20">
              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* About */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
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
                      </div>
                      <span className="text-lg font-bold text-white">
                        SocialFi Paywall
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      A decentralized content marketplace powered by Rootstock's
                      Bitcoin-secured blockchain. Unlock premium content with frictionless
                      social authentication and micropayments.
                    </p>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://rootstock.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                        </svg>
                      </a>

                      <a
                        href="https://twitter.com/rootstock_io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>

                      <a
                        href="https://github.com/rsksmart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="https://dev.rootstock.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://faucet.rootstock.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Testnet Faucet
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://explorer.testnet.rsk.co"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Block Explorer
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://privy.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Privy Auth
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Support</h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Help Center
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Tutorial
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          Report Issue
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-gray-500 text-sm">
                    © 2025 SocialFi Paywall. Built on Rootstock.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-400"></span>
                      Testnet Active
                    </span>
                    <span>•</span>
                    <a
                      href={`https://explorer.testnet.rsk.co/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(0, 6)}...
                      {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(-4)}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}