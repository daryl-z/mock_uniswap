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

  // 判断是否为 MetaMask
  const isMetaMaskAvailable = window.ethereum && window.ethereum.isMetaMask;

  // 检查 MetaMask 是否安装
  const checkMetaMask = () => {
    if (!isMetaMaskAvailable) {
      console.log(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
    }
  };

  // 连接 MetaMask 钱包
  const connectMetaMask = async () => {
    if (window.ethereum) {
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
    if (window.ethereum) {
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
      checkMetaMask(); // 检查 MetaMask 是否安装
    }
  }, []);

  return (
    <header className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold">UniswapV2-inspired SPA</h1>
      {connected ? (
        <div className="mt-4">
          <p>Connected Wallet: {walletAddress}</p>
          <p>Balance: {balance} ETH</p>
          <button
            onClick={disconnectWallet}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="mt-4 space-x-4">
          <button
            onClick={connectMetaMask}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          >
            Connect with MetaMask
          </button>
        </div>
      )}
      <div>
        <div>Wallet Connect</div>
        <ConnectButton />
        <ActionButtonList />
        <InfoList />
      </div>
    </header>
  );
};

export default Header;
