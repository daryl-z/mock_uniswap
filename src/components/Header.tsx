"use client";
import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";

const Header = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // 连接 MetaMask 钱包
  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setProvider(provider);
          setConnected(true);
          fetchBalance(provider, accounts[0]);
        }
      } catch (error) {
        console.error("MetaMask connection failed", error);
      }
    }
  };

  // 获取钱包余额
  const fetchBalance = async (
    provider: ethers.BrowserProvider,
    address: string
  ) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(formatEther(balance)); // 格式化余额为 ETH
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setProvider(null);
    setConnected(false);
  };

  // 初始化检查 MetaMask 连接
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const init = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        try {
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setProvider(provider);
            setConnected(true);
            fetchBalance(provider, accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask connection", error);
        }
      };
      init();
    } else {
      const isMetaMaskAvailable =
        window.ethereum && (window.ethereum as any).isMetaMask;
      if (!isMetaMaskAvailable) {
        console.log(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }
    }
  }, []);

  return (
    <header className="p-6 bg-blue-600 text-white rounded-xl shadow-xl space-y-6">
      <h1 className="text-4xl font-semibold">UniswapV2-inspired SPA</h1>
      {connected ? (
        <div className="mt-4">
          <p className="text-lg">Connected Wallet: {walletAddress}</p>
          <p className="text-lg">Balance: {balance} ETH</p>
          <button
            onClick={disconnectWallet}
            className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="mt-4 space-x-4">
          <button
            onClick={connectMetaMask}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Connect with MetaMask
          </button>
        </div>
      )}
      <div className="mt-8">
        <div className="font-semibold text-lg mb-4">Wallet Connect</div>
        <ConnectButton />
        <ActionButtonList />
        <InfoList />
      </div>
    </header>
  );
};

export default Header;
