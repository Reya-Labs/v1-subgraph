export enum UnderlyingToken {
  USDC = 'USDC',
}

const getUnderlyingTokenName = (address: string): UnderlyingToken => {
  switch (address) {
    case '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
      return UnderlyingToken.USDC;

    default:
      return UnderlyingToken.USDC;
  }
};

export default getUnderlyingTokenName;
