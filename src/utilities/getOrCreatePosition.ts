import { BigInt } from '@graphprotocol/graph-ts';

import { Position, Tick } from '../../generated/schema';
import { ZERO_BI, ONE_BI } from '../constants';
import getOrCreateWallet from './getOrCreateWallet';

const getOrCreatePosition = (
  address: string,
  tickLower: Tick,
  tickUpper: Tick,
  timestamp: BigInt,
): Position => {
  const positionId = `${address}#${tickLower.value}#${tickUpper.value}`;
  const existingPosition = Position.load(positionId);

  if (existingPosition !== null) {
    return existingPosition;
  }

  const wallet = getOrCreateWallet(address);
  const position = new Position(positionId);

  position.owner = wallet.id;
  position.createdTimestamp = timestamp;
  position.snapshotCount = ZERO_BI;
  position.save();

  wallet.positionCount = wallet.positionCount.plus(ONE_BI);
  wallet.save();

  return position;
};

export default getOrCreatePosition;
