// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

/// new operations
// SHL = 0x1b
// SHR = 0x1c
// SAR = 0x1d

// EXTCODEHASH = 0x3f

// CHAINID     OpCode = 0x46
// SELFBALANCE OpCode = 0x47
// BASEFEE     OpCode = 0x48

// BEGINSUB  OpCode = 0x5c
// RETURNSUB OpCode = 0x5d
// JUMPSUB   OpCode = 0x5e

// CREATE2 = 0xf5

contract UniswapV2Pair {
  function sum(uint a, uint b) public pure returns (uint) {
    return a + b;
  }
}

contract EvmOps {
  event PairCreated(address indexed token0, address indexed token1, address pair, uint);
  
  function getPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
    bytes memory bytecode = type(UniswapV2Pair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
      pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    emit PairCreated(token0, token1, pair, 1);
  }

  function getChainId() public view returns (uint) {
    uint chainId;
    assembly {
      chainId := chainid()
    }

    return chainId;
  }

  function getSHL(uint e, uint b) public pure returns (uint v) {
    assembly {
      v := shl(e, b)
    } 
  }

  function getSHR(uint e, uint b) public pure returns (uint v) {
    assembly {
      v := shr(e, b)
    } 
  }

  function getSAR(uint e, int b) public pure returns (uint v) {
    assembly {
      v := sar(e, b)
    } 
  }

  function isContract(address account) public view returns (bool) {
    bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

    bytes32 codeHash;    
    assembly { codeHash := extcodehash(account) }

    return (codeHash != accountHash && codeHash != 0x0);
  }

  function getBalance() public view returns (uint v) {
    v = address(this).balance;
  }

  function getBaseFee() public view returns (uint v) {
    assembly { v := basefee() }
  }

  // 以下3个被移除
	// BEGINSUB  OpCode = 0x5c
	// RETURNSUB OpCode = 0x5d
	// JUMPSUB   OpCode = 0x5e
}