"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

// 类型定义确保 `window.ethereum` 的类型正确
declare global {
  interface Window {
    ethereum?: any; // 可以进一步完善为具体的类型，如 `EthereumProvider` 来增强类型安全
    web3?: any;
  }
}

const Header = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // 判断是否为 MetaMask 或 WalletConnect
  const isMetaMaskAvailable = window.ethereum && window.ethereum.isMetaMask;
  const isWalletConnectAvailable =
    !isMetaMaskAvailable && typeof window !== "undefined";

  // 处理钱包连接
  const connectMetaMask = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setProvider(provider);
      setConnected(true);
    }
  };

  const connectWalletConnect = async () => {
    const walletConnectProvider = new WalletConnectProvider({
      infuraId: "INFURA_PROJECT_ID", // 替换为你的 Infura 项目 ID
    });

    walletConnectProvider.enable();
    const provider = new ethers.BrowserProvider(walletConnectProvider);
    const accounts = await provider.send("eth_accounts", []);
    setWalletAddress(accounts[0]);
    setProvider(provider);
    setConnected(true);
  };

  useEffect(() => {
    // 初次加载时检查 MetaMask 是否已连接
    if (window.ethereum) {
      const init = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setProvider(provider);
          setConnected(true);
        }
      };
      init();
    }
  }, []);

  return (
    <header>
      <h1>UniswapV2-inspired SPA</h1>
      {connected ? (
        <p>Connected Wallet: {walletAddress}</p>
      ) : (
        <>
          <button onClick={connectMetaMask}>Connect with MetaMask</button>
          {isWalletConnectAvailable && (
            <button onClick={connectWalletConnect}>
              Connect with WalletConnect
            </button>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
