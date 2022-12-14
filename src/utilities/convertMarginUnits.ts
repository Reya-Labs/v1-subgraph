import { BigInt } from '@graphprotocol/graph-ts';
import { MIL_BI, WAD_BI } from '../constants';

const convertMarginUnits = (margin: BigInt, underlyingToken: string): BigInt => {
  if (underlyingToken === 'USDC' || underlyingToken === 'USDT' || underlyingToken === 'DAI') {
    const convertedMargin = margin.div(MIL_BI);
    return convertedMargin;
  }
  if (underlyingToken === 'ETH') {
    const convertedMargin = margin.div(WAD_BI);
    return convertedMargin;
  }
  return BigInt.fromString('0');
};

export default convertMarginUnits;
