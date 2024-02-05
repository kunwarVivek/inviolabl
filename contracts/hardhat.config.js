require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 84532,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/kE0K4ykRxT7TQ8vFk6IOpnGCEmpKtn0-",
      accounts: ["dbd4f4486cef628b2779c4b29a3d0029463f8be5e64a2b137e6322039703a6ae"]
    },
    basesepolia: {
      url: 'https://base-sepolia.g.alchemy.com/v2/JsC7CASSssdGpZ6rOrmEw9tYdn6-oJPd',
      accounts: ['b94d99dc056aee26ed6b8e8081f7c7b0e8903738bd57a5ef4bcb7a9f3cf3224a'],
    },
    polygonMumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/2whJusWfiI6VzVXYZisDphI_kYeJZLWJ',
      accounts: ['e3244ba1fe7f5622332c6e181931a64ca0f342f8b50076ec7afa69ddf41fd655'],
    }
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
};
