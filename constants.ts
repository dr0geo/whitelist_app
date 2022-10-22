export const WHITELIST_CONTRACT_ADDRESS: string = '0x4bCFA5b0A99DB98E66a4d3491FB295d0fC0f8599';

export const abi: Array<object> = [
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_maxWhitelistedAddresses',
        type: 'uint8'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'MaxWhitelistedAddresses',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'addAddressToWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'numAddressesWhitelisted',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'whitelistedAddresses',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
