"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "@/components/Header";

// 这里假设你已经将合约地址通过props或从合约部署结果获取
const uniswapV2PairAddress = "<UniswapV2Pair-Address>";
const mockERC20Address = "<MockERC20-Address>";
const mockUSDCAddress = "<MOCK_USDC-Address>";

const TradingPage = () => {
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [mockERC20, setMockERC20] = useState<ethers.Contract | null>(null);
  const [mockUSDC, setMockUSDC] = useState<ethers.Contract | null>(null);
  const [uniswapV2Pair, setUniswapV2Pair] = useState<ethers.Contract | null>(
    null
  );

  const [balanceERC20, setBalanceERC20] = useState<string>("0");
  const [balanceUSDC, setBalanceUSDC] = useState<string>("0");

  // 获取钱包地址
  const getWalletAddress = async (provider: ethers.BrowserProvider) => {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setSigner(signer);
    setWalletAddress(address);
    return address;
  };

  // 获取余额
  const fetchBalances = async () => {
    if (mockERC20 && mockUSDC && walletAddress) {
      const erc20Balance = await mockERC20.balanceOf(walletAddress);
      const usdcBalance = await mockUSDC.balanceOf(walletAddress);
      setBalanceERC20(ethers.utils.formatUnits(erc20Balance, 18)); // 格式化 MockERC20 为 18 位
      setBalanceUSDC(ethers.utils.formatUnits(usdcBalance, 6)); // 格式化 MOCK_USDC 为 6 位
    }
  };

  // 初始化合约
  const initContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setProvider(provider);

    const mockERC20Contract = new ethers.Contract(
      mockERC20Address,
      [
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) public",
      ],
      signer
    );
    const mockUSDCContract = new ethers.Contract(
      mockUSDCAddress,
      [
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) public",
      ],
      signer
    );
    const uniswapV2PairContract = new ethers.Contract(
      uniswapV2PairAddress,
      [
        "function swap(uint256 amount0In, uint256 amount1In) public",
        "function getReserves() public view returns (uint112, uint112, uint32)",
      ],
      signer
    );

    setMockERC20(mockERC20Contract);
    setMockUSDC(mockUSDCContract);
    setUniswapV2Pair(uniswapV2PairContract);
  };

  // 处理交易
  const handleTrade = async () => {
    if (!amount || !uniswapV2Pair || !mockERC20 || !mockUSDC) return;

    const amountInWei = ethers.utils.parseUnits(amount, 18); // 将用户输入的金额转换为 Wei（18 位精度）

    // 假设交易是 1:1 交换
    const amountOut = amountInWei; // 假设交换比率为 1:1

    // 如果是 MockERC20 -> MOCK_USDC
    await mockERC20.transfer(uniswapV2PairAddress, amountInWei); // 转账代币到交换合约
    await uniswapV2Pair.swap(amountInWei, amountOut); // 执行交换

    // 刷新余额
    fetchBalances();
  };

  // 组件加载时初始化
  useEffect(() => {
    if (window.ethereum) {
      initContracts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      getWalletAddress(provider).then(() => fetchBalances());
    }
  }, [walletAddress]);

  return (
    <div>
      <Header />
      <h2>Trade between MockERC20 and MOCK_USDC</h2>
      <div>
        <p>Wallet Address: {walletAddress}</p>
        <p>Balance of MockERC20: {balanceERC20} MERC20</p>
        <p>Balance of MOCK_USDC: {balanceUSDC} MOCK_USDC</p>
      </div>
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to trade"
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleTrade}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Trade
        </button>
      </div>
    </div>
  );
};

export default TradingPage;
