require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/2f831a59247243729a21415b6491cd2b",
      accounts: [`0xdbd4f4486cef628b2779c4b29a3d0029463f8be5e64a2b137e6322039703a6ae`]
    }
  }
};
