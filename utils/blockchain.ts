import { ethers } from 'ethers';
import { getCurrentNetwork, NETWORKS } from '@/constants/networks';

export interface EIP2612PermitData {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
}

export interface TransactionData {
  to: string;
  amount: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

// Get provider for current network
export const getProvider = (): ethers.JsonRpcProvider => {
  const network = getCurrentNetwork();
  return new ethers.JsonRpcProvider(network.rpcUrl);
};

// Get wallet instance from private key
export const getWallet = (privateKey: string): ethers.Wallet => {
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
};

// EIP-2612 domain separator
const getDomainSeparator = (tokenAddress: string, chainId: number): any => {
  return {
    name: 'cKES',
    version: '1',
    chainId,
    verifyingContract: tokenAddress,
  };
};

// EIP-2612 permit types
const getPermitTypes = () => {
  return {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };
};

// Sign EIP-2612 permit
export const signEIP2612Permit = async (
  privateKey: string,
  permitData: EIP2612PermitData
): Promise<string> => {
  const network = getCurrentNetwork();
  const wallet = new ethers.Wallet(privateKey);
  
  const domain = getDomainSeparator(network.contractAddresses.cKES, network.chainId);
  const types = getPermitTypes();
  
  const value = {
    owner: permitData.owner,
    spender: permitData.spender,
    value: permitData.value,
    nonce: permitData.nonce,
    deadline: permitData.deadline,
  };
  console.log(domain, types, value)
  const signature = await wallet.signTypedData(domain, types, value);
  return signature;
};

// Sign transaction
export const signTransaction = async (
  privateKey: string,
  transactionData: TransactionData
): Promise<string> => {
  const wallet = getWallet(privateKey);
  
  const tx = {
    to: transactionData.to,
    value: ethers.parseEther(transactionData.amount),
    data: transactionData.data || '0x',
    gasLimit: transactionData.gasLimit || '21000',
    gasPrice: transactionData.gasPrice || ethers.parseUnits('20', 'gwei'),
  };

  const signedTx = await wallet.signTransaction(tx);
  return signedTx;
};


// Get balance
export const getBalance = async (address: string): Promise<string> => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};



const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function nonces(address owner) public view returns (uint256)",
];

export const getCkesBalance = async (address: string): Promise<string> => {
  const provider = getProvider();
  const cKesContract = new ethers.Contract(NETWORKS.alfajores.contractAddresses.cKES, tokenAbi, provider);
  const balance = await cKesContract.balanceOf(address);
  return ethers.formatEther(balance); // assuming cKes has 18 decimals
};


const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTransactions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "txReference",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "bytes10",
            "name": "fromNumber",
            "type": "bytes10"
          },
          {
            "internalType": "bytes10",
            "name": "toNumber",
            "type": "bytes10"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "enum SimpleTransfer.TransactionType",
            "name": "txType",
            "type": "uint8"
          }
        ],
        "internalType": "struct SimpleTransfer.Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


export interface DecodedTransaction {
  txReference: string;
  from: string;
  to: string;
  fromNumber: string;
  toNumber: string;
  amount: string;
  timestamp: string;
  txType: number;
}

export const getUserTransactions = async (userAddress: string): Promise<DecodedTransaction[]> => {
  const provider = getProvider();
  const bpesaContract = new ethers.Contract(
    NETWORKS.alfajores.contractAddresses.bpesaPayments,
    contractABI,
    provider
  );

  const transactions = await bpesaContract.getUserTransactions(userAddress);
  // console.log(transactions)
  return transactions;
};
// Get transaction count (nonce)
export const getTransactionCount = async (address: string): Promise<number> => {
  const provider = getProvider();
  const cKesContract = new ethers.Contract(NETWORKS.alfajores.contractAddresses.cKES, tokenAbi, provider);
  const nonce = await cKesContract.nonces(address);
  return nonce
};

// Estimate gas
export const estimateGas = async (transactionData: TransactionData): Promise<string> => {
  const provider = getProvider();
  
  const tx = {
    to: transactionData.to,
    value: ethers.parseEther(transactionData.amount),
    data: transactionData.data || '0x',
  };

  const gasEstimate = await provider.estimateGas(tx);
  return gasEstimate.toString();
};

// Get current gas price
export const getGasPrice = async (): Promise<string> => {
  const provider = getProvider(); // must be a valid JsonRpcProvider or similar
  const feeData = await provider.getFeeData();

  if (!feeData.gasPrice) {
    throw new Error('Gas price not available from provider');
  }

  return feeData.gasPrice.toString(); // BigInt as string
};

// Validate Ethereum address
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// // Convert KES to Wei (assuming 1 KES = 0.001 ETH for demo)
// export const kestoWei = (kes: number): string => {
//   const ethAmount = kes * 0.001; // Mock conversion rate
//   return ethers.parseEther(ethAmount.toString()).toString();
// };


export const kestoWei = (kes: number): string => {
  return ethers.parseUnits(kes.toString(), 18).toString();
};

// Convert Wei to KES
export const weiToKes = (wei: string): number => {
  const ethAmount = parseFloat(ethers.formatEther(wei));
  return ethAmount / 0.001; // Mock conversion rate
};