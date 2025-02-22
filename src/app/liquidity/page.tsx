"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "@/components/Header";

// 这里假设你已经将合约地址通过props或从合约部署结果获取
const uniswapV2PairAddress = "<UniswapV2Pair-Address>";
const mockERC20Address = "<MockERC20-Address>";
const mockUSDCAddress = "<MOCK_USDC-Address>";

const LiquidityPage = () => {
  const [amountERC20, setAmountERC20] = useState<string>("");
  const [amountUSDC, setAmountUSDC] = useState<string>("");
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

  const [totalSupply, setTotalSupply] = useState<string>("0");

  // 获取钱包地址
  const getWalletAddress = async (provider: ethers.BrowserProvider) => {
    const signer = await provider.getSigner();
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
      setBalanceERC20(ethers.formatUnits(erc20Balance, 18)); // 格式化 MockERC20 为 18 位
      setBalanceUSDC(ethers.formatUnits(usdcBalance, 6)); // 格式化 MOCK_USDC 为 6 位
    }
  };

  // 初始化合约
  const initContracts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
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
        "function addLiquidity(uint256 amount0, uint256 amount1) external returns (uint256)",
        "function removeLiquidity(uint256 liquidity) external returns (uint256 amount0, uint256 amount1)",
      ],
      signer
    );

    setMockERC20(mockERC20Contract);
    setMockUSDC(mockUSDCContract);
    setUniswapV2Pair(uniswapV2PairContract);
  };

  // 添加流动性
  const addLiquidity = async () => {
    if (
      !amountERC20 ||
      !amountUSDC ||
      !uniswapV2Pair ||
      !mockERC20 ||
      !mockUSDC
    )
      return;

    const amountERC20InWei = ethers.parseUnits(amountERC20, 18);
    const amountUSDCInWei = ethers.parseUnits(amountUSDC, 6);

    // 批准代币转移给 Uniswap 合约
    await mockERC20.approve(uniswapV2PairAddress, amountERC20InWei);
    await mockUSDC.approve(uniswapV2PairAddress, amountUSDCInWei);

    // 添加流动性
    await uniswapV2Pair.addLiquidity(amountERC20InWei, amountUSDCInWei);

    // 刷新余额
    fetchBalances();
  };

  // 移除流动性
  const removeLiquidity = async () => {
    if (!uniswapV2Pair) return;

    const liquidityAmount = ethers.parseUnits("1", 18); // 假设移除 1 单位流动性（实际可以根据流动性池的余额动态获取）

    // 执行移除流动性
    const [amountERC20Out, amountUSDCOut] = await uniswapV2Pair.removeLiquidity(
      liquidityAmount
    );

    // 刷新余额
    fetchBalances();
    console.log(
      `Removed liquidity: ${amountERC20Out} MockERC20, ${amountUSDCOut} MOCK_USDC`
    );
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
      <h2>Manage Liquidity</h2>
      <div>
        <p>Wallet Address: {walletAddress}</p>
        <p>Balance of MockERC20: {balanceERC20} MERC20</p>
        <p>Balance of MOCK_USDC: {balanceUSDC} MOCK_USDC</p>
        <p>Total Supply of Liquidity: {totalSupply}</p>
      </div>

      <div>
        <h3>Add Liquidity</h3>
        <input
          type="text"
          value={amountERC20}
          onChange={(e) => setAmountERC20(e.target.value)}
          placeholder="Amount of MockERC20"
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          value={amountUSDC}
          onChange={(e) => setAmountUSDC(e.target.value)}
          placeholder="Amount of MOCK_USDC"
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={addLiquidity}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Add Liquidity
        </button>
      </div>

      <div>
        <h3>Remove Liquidity</h3>
        <button
          onClick={removeLiquidity}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Remove Liquidity
        </button>
      </div>
    </div>
  );
};

export default LiquidityPage;
