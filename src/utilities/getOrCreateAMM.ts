import { BigInt } from '@graphprotocol/graph-ts';

import { AMM } from '../../generated/schema';
import { ZERO_BI } from '../constants';

const getOrCreateAMM = (vammAddress: string, timestamp: BigInt): AMM => {
  const existingAMM = AMM.load(vammAddress);

  if (existingAMM !== null) {
    return existingAMM;
  }

  const amm = new AMM(vammAddress);

  amm.txCount = ZERO_BI;
  amm.totalNotionalTraded = ZERO_BI;
  amm.totalLiquidity = ZERO_BI;
  amm.createdTimestamp = timestamp;
  amm.save();

  return amm;
};

export default getOrCreateAMM;
