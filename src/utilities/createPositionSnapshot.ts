import { BigInt } from '@graphprotocol/graph-ts';

import { Position, PositionSnapshot } from '../../generated/schema';
import { ONE_BI } from '../constants';

const createPositionSnapshot = (position: Position, timestamp: BigInt): void => {
  const positionSnapshotId = `${position.id}#${position.snapshotCount.toString()}`;
  const positionSnapshot = new PositionSnapshot(positionSnapshotId);

  positionSnapshot.owner = position.owner;
  positionSnapshot.createdTimestamp = timestamp;
  positionSnapshot.margin = position.margin;
  positionSnapshot.liquidity = position.liquidity;
  positionSnapshot.fixedTokenBalance = position.fixedTokenBalance;
  positionSnapshot.variableTokenBalance = position.variableTokenBalance;
  positionSnapshot.isSettled = position.isSettled;
  positionSnapshot.save();

  // eslint-disable-next-line no-param-reassign
  position.snapshotCount = position.snapshotCount.plus(ONE_BI);
  position.save();
};

export default createPositionSnapshot;
