import isNull from 'lodash/isNull';
import { BigInt } from '@graphprotocol/graph-ts';

import { Position, Tick } from '../../generated/schema';

export type GetOrCreatePositionArgs = {
  address: string;
  tickLower: Tick;
  tickUpper: Tick;
  timestamp: BigInt;
};

const getOrCreatePosition = ({
  address,
  tickLower,
  tickUpper,
  timestamp,
}: GetOrCreatePositionArgs): Position => {
  const positionId = `${address}#${tickLower.value}#${tickUpper.value}`;
  const existingPosition = Position.load(positionId);

  if (!isNull(existingPosition)) {
    return existingPosition;
  }

  const position = new Position(positionId);

  position.createdTimestamp = timestamp;
  position.save();

  return position;
};

export default getOrCreatePosition;
