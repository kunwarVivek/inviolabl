require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/kE0K4ykRxT7TQ8vFk6IOpnGCEmpKtn0-",
      accounts: ["dbd4f4486cef628b2779c4b29a3d0029463f8be5e64a2b137e6322039703a6ae"]
    }
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
};
