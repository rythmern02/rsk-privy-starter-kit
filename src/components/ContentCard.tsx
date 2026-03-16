// NOTE: "use client" is a Next.js directive and has no effect in Vite + React projects. Removed.

import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import PaymentModal from "./PaymentModal";

interface ContentCardProps {
  contentId: string;
  title: string;
  description: string;
  previewContent: string;
  fullContent: string;
  imageUrl?: string;
  /** From contract: checkMultipleAccess / hasAccess */
  hasAccess: boolean;
  /** From contract: contentPrices(contentId) — in wei (bigint) */
  price: bigint;
  onUnlock?: () => void;
}

export default function ContentCard({
  contentId,
  title,
  description,
  previewContent,
  fullContent,
  imageUrl,
  hasAccess,
  price,
  onUnlock,
}: ContentCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { address } = useAccount();

  const handleUnlockClick = () => {
    setShowPaymentModal(true);
  };

  const priceAsBigNumber = ethers.BigNumber.from(price.toString());

  return (
    <>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-orange-400 transition-all">
        {/* Image */}
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover ${!hasAccess ? "blur-sm" : ""}`}
            />
            {!hasAccess && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-orange-400"
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
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {!hasAccess && price > 0n && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {ethers.utils.formatEther(priceAsBigNumber)} rBTC
              </span>
            )}
            {hasAccess && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Unlocked
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4">{description}</p>

          {/* Content Preview/Full */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            {hasAccess ? (
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {fullContent}
              </p>
            ) : (
              <p className="text-gray-500 text-sm leading-relaxed blur-sm select-none">
                {previewContent}
              </p>
            )}
          </div>

          {/* Action Button */}
          {!hasAccess && (
            <button
              onClick={handleUnlockClick}
              disabled={!address}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {address ? (
                <>
                  <svg
                    className="w-5 h-5 inline mr-2"
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
                  Unlock Content
                </>
              ) : (
                "Connect Wallet to Unlock"
              )}
            </button>
          )}

          {hasAccess && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              You have full access to this content
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal — uses contract price (msg.value) for unlockContent */}
      {showPaymentModal && price > 0n && (
        <PaymentModal
          contentId={contentId}
          title={title}
          price={priceAsBigNumber}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            onUnlock?.();
          }}
        />
      )}
    </>
  );
}