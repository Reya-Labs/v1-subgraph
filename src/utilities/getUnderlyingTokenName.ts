const getUnderlyingTokenName = (address: string): string => {
  // mainnet
  if (address.toLowerCase().includes('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase())) {
    return 'USDC';
  }

  // goerli
  if (address.toLowerCase().includes('0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C'.toLowerCase())) {
    return 'USDC';
  }

  // goerli
  if (address.toLowerCase().includes('0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557'.toLowerCase())) {
    return 'USDC';
  }

  // mainnet
  if (address.toLowerCase().includes('0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase())) {
    return 'DAI';
  }

  // goerli
  if (address.toLowerCase().includes('0x73967c6a0904aa032c103b4104747e88c566b1a2'.toLowerCase())) {
    return 'DAI';
  }

  // mainnet
  if (address.toLowerCase().includes('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.toLowerCase())) {
    return 'ETH';
  }

  // goerli
  if (address.toLowerCase().includes('0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'.toLowerCase())) {
    return 'ETH';
  }

  return 'UNKNOWN';
};

export default getUnderlyingTokenName;
