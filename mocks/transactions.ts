import { TransactionType } from '@/components/TransactionCard';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipient: string;
  recipientAddress?: string;
  sender?: string;
  senderAddress?: string;
  date: string;
  timestamp: number;
  hash: string;
  status: 'completed' | 'pending' | 'failed';
}

export const mockTransactions: Transaction[] = [
  // {
  //   id: '1',
  //   type: 'send',
  //   amount: 1500,
  //   recipient: '+254 712 345 678',
  //   recipientAddress: '0x1234567890abcdef1234567890abcdef12345678',
  //   date: 'Jul 9, 2025',
  //   timestamp: 1720022400000,
  //   hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  //   status: 'completed',
  // },
  // {
  //   id: '2',
  //   type: 'receive',
  //   amount: 2000,
  //   recipient: '+254 723 456 789',
  //   sender: '+254 723 456 789',
  //   senderAddress: '0x2345678901abcdef2345678901abcdef23456789',
  //   date: 'Jul 8, 2025',
  //   timestamp: 1719936000000,
  //   hash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a',
  //   status: 'completed',
  // },
  // {
  //   id: '3',
  //   type: 'load',
  //   amount: 5000,
  //   recipient: 'M-Pesa',
  //   date: 'Jul 7, 2025',
  //   timestamp: 1719849600000,
  //   hash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
  //   status: 'completed',
  // },
  // {
  //   id: '4',
  //   type: 'withdraw',
  //   amount: 3000,
  //   recipient: 'M-Pesa',
  //   date: 'Jul 6, 2025',
  //   timestamp: 1719763200000,
  //   hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
  //   status: 'completed',
  // },
  // {
  //   id: '5',
  //   type: 'send',
  //   amount: 500,
  //   recipient: '+254 734 567 890',
  //   recipientAddress: '0x3456789012abcdef3456789012abcdef34567890',
  //   date: 'Jul 5, 2025',
  //   timestamp: 1719676800000,
  //   hash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
  //   status: 'completed',
  // },
  // {
  //   id: '6',
  //   type: 'receive',
  //   amount: 1000,
  //   recipient: '+254 745 678 901',
  //   sender: '+254 745 678 901',
  //   senderAddress: '0x4567890123abcdef4567890123abcdef45678901',
  //   date: 'Jul 4, 2025',
  //   timestamp: 1719590400000,
  //   hash: '0xf1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde',
  //   status: 'completed',
  // },
  // {
  //   id: '7',
  //   type: 'load',
  //   amount: 2500,
  //   recipient: 'M-Pesa',
  //   date: 'Jul 3, 2025',
  //   timestamp: 1719504000000,
  //   hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  //   status: 'completed',
  // },
  // {
  //   id: '8',
  //   type: 'withdraw',
  //   amount: 1500,
  //   recipient: 'M-Pesa',
  //   date: 'Jul 2, 2025',
  //   timestamp: 1719417600000,
  //   hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
  //   status: 'completed',
  // },
];