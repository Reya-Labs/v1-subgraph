import isNull from 'lodash/isNull';

import { Position, Tick } from '../../generated/schema';

export type GetOrCreatePositionArgs = {
  address: string;
  tickLower: Tick;
  tickUpper: Tick;
};

const getOrCreatePosition = ({
  address,
  tickLower,
  tickUpper,
}: GetOrCreatePositionArgs): Position => {
  const positionId = `${address}${tickLower.value}${tickUpper.value}`;
  const existingPosition = Position.load(positionId);

  if (!isNull(existingPosition)) {
    return existingPosition;
  }

  return new Position(positionId);
};

export default getOrCreatePosition;
