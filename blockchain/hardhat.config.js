require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/kE0K4ykRxT7TQ8vFk6IOpnGCEmpKtn0-",
      accounts: [`0xdbd4f4486cef628b2779c4b29a3d0029463f8be5e64a2b137e6322039703a6ae`]
    }
  }
};
