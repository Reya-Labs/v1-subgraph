import { BigInt } from '@graphprotocol/graph-ts';

import { AMM, Position } from '../../generated/schema';
import { ZERO_BI, ONE_BI } from '../constants';
import getOrCreateWallet from './getOrCreateWallet';

const getOrCreatePosition = (
  amm: AMM,
  address: string,
  tickLower: BigInt,
  tickUpper: BigInt,
  timestamp: BigInt,
): Position => {
  const positionId = `${amm.marginEngine}#${address}#${tickLower}#${tickUpper}`;
  const existingPosition = Position.load(positionId);

  if (existingPosition !== null) {
    return existingPosition;
  }

  const wallet = getOrCreateWallet(address);
  const position = new Position(positionId);

  position.owner = wallet.id;
  position.createdTimestamp = timestamp;
  position.tickLower = tickLower;
  position.tickUpper = tickUpper;
  position.snapshotCount = ZERO_BI;
  position.amm = amm.id;
  position.save();

  wallet.positionCount = wallet.positionCount.plus(ONE_BI);
  wallet.save();

  return position;
};

export default getOrCreatePosition;
