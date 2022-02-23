import isNull from 'lodash/isNull';
import { BigInt } from '@graphprotocol/graph-ts';

import { AMM } from '../../generated/schema';

export type GetOrCreateAMMArgs = {
  vammAddress: string;
  timestamp: BigInt;
};

const getOrCreateAMM = ({ vammAddress, timestamp }: GetOrCreateAMMArgs): AMM => {
  const existingAMM = AMM.load(vammAddress);

  if (!isNull(existingAMM)) {
    return existingAMM;
  }

  const amm = new AMM(vammAddress);

  amm.createdTimestamp = timestamp;
  amm.save();

  return amm;
};

export default getOrCreateAMM;
