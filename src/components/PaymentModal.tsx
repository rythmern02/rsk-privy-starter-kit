"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { unlockContent } from "../utils/contract";

const COINGECKO_BTC_USD_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

interface PaymentModalProps {
  contentId: string;
  title: string;
  price: ethers.BigNumber;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  contentId,
  title,
  price,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [btcUsdPrice, setBtcUsdPrice] = useState<number | null>(null);

  const { wallets } = useWallets();

  useEffect(() => {
    let cancelled = false;
    fetch(COINGECKO_BTC_USD_URL)
      .then((res) => res.json())
      .then((data: { bitcoin?: { usd?: number } }) => {
        if (cancelled) return;
        const usd = data?.bitcoin?.usd;
        if (typeof usd === "number") setBtcUsdPrice(usd);
      })
      .catch(() => {
        if (!cancelled) setBtcUsdPrice(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayment = async () => {
    if (!wallets[0]) {
      setError("No wallet connected");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const provider = await wallets[0].getEthereumProvider();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();

      // Execute payment transaction
      const result = await unlockContent(signer, contentId, price);

      if (result.success && result.receipt) {
        setTxHash(result.receipt.transactionHash);

        // Wait a moment for the blockchain to update
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.error || "Transaction failed");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Unlock Content</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Content</p>
            <p className="text-white font-semibold">{title}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Price</p>
            <p className="text-2xl text-orange-400 font-bold">
              {ethers.utils.formatEther(price)} rBTC
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {btcUsdPrice != null
                ? `≈ $${(parseFloat(ethers.utils.formatEther(price)) * btcUsdPrice).toFixed(2)} USD`
                : "≈ — USD (loading…)"}
            </p>
          </div>

          {/* Transaction Status */}
          {isProcessing && !txHash && (
            <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <div>
                  <p className="text-blue-400 font-semibold">Processing Payment...</p>
                  <p className="text-xs text-gray-400">Please confirm the transaction in your wallet</p>
                </div>
              </div>
            </div>
          )}

          {txHash && (
            <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-green-400 font-semibold">Payment Successful!</p>
                  <a
                    href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline break-all"
                  >
                    View transaction →
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-red-400 font-semibold">Payment Failed</p>
                  <p className="text-xs text-gray-400">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !!txHash}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : txHash ? "Completed" : "Confirm Payment"}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By confirming, you agree to unlock this content permanently on the blockchain
        </p>
      </div>
    </div>
  );
}