import { BigInt } from '@graphprotocol/graph-ts';

import { Position, Tick } from '../../generated/schema';
import { ZERO_BI } from '../constants';

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

  const position = new Position(positionId);

  position.createdTimestamp = timestamp;
  position.snapshotCount = ZERO_BI;
  position.save();

  return position;
};

export default getOrCreatePosition;
