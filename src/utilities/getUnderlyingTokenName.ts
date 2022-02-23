export enum UnderlyingToken {
  USDC = 'USDC',
}

const getUnderlyingTokenName = (address: string): UnderlyingToken => {
  switch (address) {
    case '':
      return UnderlyingToken.USDC;

    default:
      return UnderlyingToken.USDC;
  }
};

export default getUnderlyingTokenName;
