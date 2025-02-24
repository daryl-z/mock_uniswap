require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`, // 使用 Infura 或 Alchemy
      accounts: [`${process.env.NEXT_PRIVATE_API_KEY}`],
    },
  },
};
b85c1a21d0e0abe4df069dc58475c10bc5055bbe0a12bde7cecd3b1e4c06c942;
