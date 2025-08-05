// export const formatCurrency = (amount: string,country:string): string => {
//   const parsed = parseFloat(amount);
//   if (isNaN(parsed)) return 'KES 0.00';

import { CURRENCIES } from "@/constants/constants";

//   return `${country} ${parsed.toLocaleString('en-KE', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;
// };

  // Map of supported countries to currency and locale
export const currencyMap: Record<string, { symbol: string; flag: string; name: string; locale: string; currency: string }> = {
    KE: { symbol: 'Ksh', flag: '🇰🇪', name: 'Kenyan Shilling', locale: 'en-KE', currency: 'KES' },
    UG: { symbol: 'UGX', flag: '🇺🇬', name: 'Ugandan Shilling', locale: 'en-UG', currency: 'UGX' },
    TZ: { symbol: 'TZS', flag: '🇹🇿', name: 'Tanzanian Shilling', locale: 'en-TZ', currency: 'TZS' }
  };

  export const getCurrencySymbol = (country: string): string => {
    return currencyMap[country]?.symbol || currencyMap['KE'].symbol;
  }
export const formatCurrency = (amount: string, country: string): string => {
  const parsed = parseFloat(amount);

  if (isNaN(parsed)) return 'KES 0.00';

  // const { locale, currency } = currencyMap[country] || currencyMap['KE'];
  const currency = CURRENCIES.find(curr => curr.token === country)?.code

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
};


// export const formatPhoneNumber = (phoneNumber: string): string => {
//   // Format as +254 XXX XXX XXX
//   if (phoneNumber.length === 12 && phoneNumber.startsWith('254')) {
//     return `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 9)} ${phoneNumber.slice(9)}`;
//   }
//   return phoneNumber;
// };

export const formatPhoneNumber = (phone: number | string, country: string): string => {
  const raw = phone.toString().replace(/\D/g, '').padStart(9, '0'); // Clean and pad
  console.log("raw phone",raw)

  const countryMap: Record<string, { code: string; prefix?: string }> = {
    KE: { code: '+254' }, // Kenya
    UG: { code: '+256' }, // Uganda
    TZ: { code: '+255' }, // Tanzania
    RW: { code: '+250' }, // Rwanda
    BI: { code: '+257' }, // Burundi
    SS: { code: '+211' }, // South Sudan
    ET: { code: '+251' }, // Ethiopia
    SO: { code: '+252' }, // Somalia
    NG: { code: '+234' }, // Nigeria
  };

  const { code } = countryMap[country] || countryMap['KE']; // default to KE
  console.log(`${code} ${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 9)}`)

  return `${code} ${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 9)}`;
};


export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};