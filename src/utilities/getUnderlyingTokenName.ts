const getUnderlyingTokenName = (address: string): string => {
  if (address.toLowerCase().includes('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase())) {
    return 'USDC';
  }

  if (address.toLowerCase().includes('0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase())) {
    return 'DAI';
  }

  return 'UNKNOWN';
};

export default getUnderlyingTokenName;
