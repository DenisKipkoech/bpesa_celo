export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contractAddresses: {
    cKES: string;
    cUSD: string;
    bpesaPayments: string;
  };
}

export const NETWORKS: Record<string, NetworkConfig> = {
  alfajores: {
    name: 'Celo Alfajores Testnet',
    chainId: 44787,
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorerUrl: 'https://alfajores.celoscan.io',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
    contractAddresses: {
      cKES: '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92',
      cUSD: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B', 
      bpesaPayments: '0x8F058b0A4Cbb1335D63682DF1cd453FB2347C081', // Mock address
    },
  },
  mainnet: {
    name: 'Celo Mainnet',
    chainId: 42220,
    rpcUrl: 'https://forno.celo.org',
    blockExplorerUrl: 'https://celoscan.io',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
    contractAddresses: {
      cKES: '0x0000000000000000000000000000000000000000', // To be deployed
      cUSD: '0x0000000000000000000000000000000000000000', // To be deployed
      bpesaPayments: '0x0000000000000000000000000000000000000000', // To be deployed
    },
  },
};

export const DEFAULT_NETWORK = 'alfajores';
export const getCurrentNetwork = (): NetworkConfig => NETWORKS[DEFAULT_NETWORK];