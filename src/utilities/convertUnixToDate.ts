import { BigInt } from '@graphprotocol/graph-ts';
import { WAD_BI } from '../constants';

const convertUnixToDate = (unixTimestamp: BigInt): string => {
  const unixTime = unixTimestamp.div(WAD_BI);

  const timestampMilliseconds = unixTime.times(BigInt.fromString('1000'));
  const timestamp = timestampMilliseconds.toI64();
  const date = new Date(timestamp);
  return date.toString();
};

export default convertUnixToDate;
