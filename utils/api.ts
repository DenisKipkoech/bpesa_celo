import { getCurrentNetwork } from '@/constants/networks';

export interface SendTransactionRequest {
  from: string;
  to: string;
  amount: string;
  signature: string;
  permitData?: any;
  transactionData?: any;
  txType:string;
}

export interface TransactionResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface userOnboardRequest {
  walletAddress: string;
  id_encrypted: string;
  notification_token: string;
}

export interface WithdrawMoneyRequest {
  phoneNumber: string;
  amount: string;
  agentNumber: string;
  signature: string;
}

// Mock API base URL - replace with your actual API
const API_BASE_URL = 'https://rafiki-launchpad.devligence.com/bpesa/';

// Send transaction to blockchain via API
export const sendTransaction = async (request: SendTransactionRequest): Promise<TransactionResponse> => {
  try {
    // Mock API call - replace with actual implementation
    const response = await fetch(`${API_BASE_URL}/send-money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        network: getCurrentNetwork().name,
        chainId: getCurrentNetwork().chainId,
      }),
    });

    if (!response.ok) {
      throw new Error('Transaction failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
          success: false,
          transactionHash: "",
    }
  }
};


// User Onboarding
// export const userOnboard = async (request: userOnboardRequest): Promise<TransactionResponse> => {
//   try {
//     // Mock API call
//     const response = await fetch(`${API_BASE_URL}/user-onboard`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(request),
//     });

//     if (!response.ok) {
//       throw new Error('Load failed');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
    
//     return {
//           success: false,
//           transactionHash: '',
//         }
//   }
// };

// Withdraw money at Agent
export const withdrawAtAgent = async (request: SendTransactionRequest): Promise<TransactionResponse> => {
  try {
    // Mock API call
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        network: getCurrentNetwork().name,
        chainId: getCurrentNetwork().chainId,
      }),
    });

    if (!response.ok) {
      throw new Error('Withdrawal failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock successful response
    return {
          success: false,
          transactionHash: "",
    }
  }
};

// Get transaction status
export const getTransactionStatus = async (transactionHash: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${transactionHash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get transaction status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Mock response
    return {
      status: 'completed',
      confirmations: 12,
      blockNumber: Math.floor(Math.random() * 1000000),
    };
  }
};