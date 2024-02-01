import type {
    UserOperationRequest,
    UserOperationStruct,
  } from "@alchemy/aa-core";
  import {
    toHex,
    type Client,
    encodeAbiParameters,
    keccak256,
    isHex,
  } from "viem";
  
  
  type AsHex<T> = {
    [K in keyof T]: `0x${string}`;
  };
  
  const formatAsHex = (
    value: undefined | string | Uint8Array | bigint | number
  ): `0x${string}` | undefined => {
    if (value === undefined) {
      return value as any;
    } else if (typeof value === "string") {
      if (!isHex(value))
        throw new Error("Cannot convert a non-hex string to a hex string");
      return value as `0x${string}`;
    } else {
      
      return toHex(value);
    }
  };
  
  /**
   * Helper function to convert the fields of a user operation to hexadecimal strings.
   *
   * @param userOp {UserOperationStruct}
   * @returns {AsHex<UserOperationStruct>} userOp with all fields transformed to hexstrings
   */
  const formatUserOpAsHex = (
    userOp: UserOperationStruct
  ): AsHex<UserOperationStruct> => {
    const {
      sender,
      nonce,
      initCode,
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      signature,
    } = userOp;
  
    const formattedUserOp: AsHex<UserOperationStruct> = {
      sender: formatAsHex(sender)!,
      nonce: formatAsHex(nonce)!,
      initCode: formatAsHex(initCode)!,
      callData: formatAsHex(callData)!,
      callGasLimit: formatAsHex(callGasLimit),
      verificationGasLimit: formatAsHex(verificationGasLimit),
      preVerificationGas: formatAsHex(preVerificationGas),
      maxFeePerGas: formatAsHex(maxFeePerGas),
      maxPriorityFeePerGas: formatAsHex(maxPriorityFeePerGas),
      paymasterAndData: formatAsHex(paymasterAndData)!,
      signature: formatAsHex(signature)!,
    };
  
    return formattedUserOp;
  };
  
  /**
   * Accepts an unsigned user operation, queries the Base Goerli paymaster, and populates
   * the `paymasterAndData` field of the operation with the paymaster's response. This method will
   * also increment the operation's `preVerificationGas` and `verificationGasLimit` to account
   * for the cost of verifying the paymaster.
   *
   * If the paymaster will not sponsor the user operation, this method will throw an error.
   *
   * @param userOp {UserOperationStruct} unsigned user operation to be sponsored
   * @param rpcClient {Client} Public RPC client connected to the Base Goerli Paymaster
   * @returns {Promise<UserOperationStruct>} unsigned user operation with `paymasterAndData` popuilated
   */
  export const populateWithPaymaster = async (
    userOp: UserOperationStruct,
    paymaster: Client
  ): Promise<UserOperationStruct> => {
    
    const formattedUserOp: AsHex<UserOperationStruct> = formatUserOpAsHex(userOp);
  
    const bufferedUserOp: AsHex<UserOperationStruct> = {
      ...formattedUserOp,
      preVerificationGas: formattedUserOp.preVerificationGas
        ? toHex(
            BigInt(formattedUserOp.preVerificationGas) 
              
          )
        : undefined,
      verificationGasLimit: formattedUserOp.verificationGasLimit
        ? toHex(
            BigInt(formattedUserOp.verificationGasLimit) 
              
          )
        : undefined,
    };
  
    
    try {
      
      const populatedUserOp: AsHex<UserOperationStruct> = {
        ...bufferedUserOp,
        
      };
  
      return populatedUserOp;
    } catch (error) {
      
      throw new Error(`${error}`);
    }
  };
  
  /**
   * Accepts an unsigned user operation and packs it. Used as part of the procedure required to
   * compute the user operation's hash and sign it.
   *
   * Adapted to viem from https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
   *
   * @param userOp {UserOperationStruct} unsigned user operation
   * @returns {`0x${string}`} hexadecimal string representing packed user operation
   */
  const packUserOp = (userOp: AsHex<UserOperationStruct>): `0x${string}` => {
    // address -> `0x${string}`, uint256 -> bigint, bytes32 -> `0x${string}`
    const packedUserOp = encodeAbiParameters(
      [
        { name: "sender", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "initCode", type: "bytes32" },
        { name: "callData", type: "bytes32" },
        { name: "callGasLimit", type: "uint256" },
        { name: "verificationGasLimit", type: "uint256" },
        { name: "preVerificationGas", type: "uint256" },
        { name: "maxFeePerGas", type: "uint256" },
        { name: "maxPriorityFeePerGas", type: "uint256" },
        { name: "paymasterAndData", type: "bytes32" },
      ],
      [
        userOp.sender,
        BigInt(userOp.nonce),
        keccak256(userOp.initCode),
        keccak256(userOp.callData),
        BigInt(userOp.callGasLimit!),
        BigInt(userOp.verificationGasLimit!),
        BigInt(userOp.preVerificationGas!),
        BigInt(userOp.maxFeePerGas!),
        BigInt(userOp.maxPriorityFeePerGas!),
        keccak256(userOp.paymasterAndData),
      ]
    );
  
    return packedUserOp;
  };
  
  /**
   * Accepts an unsigned user operation and computes its hash, by first packing it, and then re-encoding
   * and hashing the packed user operation with the entry point address and chain ID.
   *
   * Adapted to viem from https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
   *
   * @param userOp {UserOperationStruct} unsigned user operation
   * @returns {`0x${string}`} hexadecimal string representing the user operation's hash
   */
 
  
  /**
   * Accepts an unsigned user operation and computes its hash, and then signature, given the
   * AlchemyProvider for the user's smart wallet. The input user operation should have all of
   * its necessary fields populated/modified (e.g. `paymasterAndData`, `preVerificationGas`, etc.).
   *
   * Adapted to viem from https://github.com/stackup-wallet/userop.js/blob/main/src/context.ts
   *
   * @param userOp {UserOperationStruct} unsigned user operation
   * @returns {Promise<UserOperationRequest>} user operation with the `signature` field populated
   */
  
  