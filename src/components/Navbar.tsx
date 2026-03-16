import Logo from "@/components/ui/logo";
import ConnectButton from "./ConnectButton";
import { Link } from "react-router-dom";
import { JSX } from "react";

export default function Navbar(): JSX.Element {
  return (
    <nav className="sticky top-4 flex items-center justify-between py-3 px-5 rounded-full mt-4 w-full max-w-[1200px] mx-auto bg-gray-600/20 backdrop-blur-lg z-[100]">
      <Link to="/">
        <Logo className="w-[150px] h-[50px]" />
      </Link>

      {/* Navigation links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
          SocialFi Paywall
        </Link>
        <Link to="/aa" className="text-gray-300 hover:text-white transition-colors">
          Account Abstraction
        </Link>
        <Link to="/wagmi" className="text-gray-300 hover:text-white transition-colors">
          Wagmi Demo
        </Link>
      </div>

      <ConnectButton />
    </nav>
  );
}
