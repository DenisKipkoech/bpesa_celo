type Currency = {
  code: string;
  name: string;
  flag: string;
  token: string;
};

export const CURRENCIES: Currency[] = [
  {
    code: "KES",
    name: "Kenyan Shilling",
    flag: "https://flagcdn.com/32x24/ke.png",
    token: "cKES",
  },
  {
    code: "USD",
    name: "US Dollar",
    flag: "https://flagcdn.com/32x24/us.png",
    token: "cUSD",
  },
];

