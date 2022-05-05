import { BigInt } from '@graphprotocol/graph-ts';

import { FCMPosition, FCMPositionSnapshot } from '../../generated/schema';
import { ONE_BI } from '../constants';

const createFCMPositionSnapshot = (fcmPosition: FCMPosition, timestamp: BigInt): void => {
  const fcmpositionSnapshotId = `${fcmPosition.id}#${fcmPosition.snapshotCount.toString()}`;
  const fcmpositionSnapshot = new FCMPositionSnapshot(fcmpositionSnapshotId);

  fcmpositionSnapshot.fcmPosition = fcmPosition.id;
  fcmpositionSnapshot.createdTimestamp = timestamp;
  fcmpositionSnapshot.marginInScaledYieldBearingTokens =
    fcmPosition.marginInScaledYieldBearingTokens;
  fcmpositionSnapshot.fixedTokenBalance = fcmPosition.fixedTokenBalance;
  fcmpositionSnapshot.variableTokenBalance = fcmPosition.variableTokenBalance;
  fcmpositionSnapshot.isSettled = fcmPosition.isSettled;
  fcmpositionSnapshot.totalNotionalTraded = fcmPosition.totalNotionalTraded;
  fcmpositionSnapshot.sumOfWeightedFixedRate = fcmPosition.sumOfWeightedFixedRate;
  fcmpositionSnapshot.save();

  // eslint-disable-next-line no-param-reassign
  fcmPosition.snapshotCount = fcmPosition.snapshotCount.plus(ONE_BI);
  fcmPosition.save();
};

export default createFCMPositionSnapshot;
