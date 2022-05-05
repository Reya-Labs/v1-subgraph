import { BigInt } from '@graphprotocol/graph-ts';

import { AMM, FCMPosition } from '../../generated/schema';
import { ZERO_BI, ONE_BI } from '../constants';
import getOrCreateWallet from './getOrCreateWallet';

const getOrCreateFCMPosition = (amm: AMM, trader: string, timestamp: BigInt): FCMPosition => {
  const fcmPositionId = `${amm.fcm}#${trader}`;
  const existingPosition = FCMPosition.load(fcmPositionId);

  if (existingPosition !== null) {
    return existingPosition;
  }

  const wallet = getOrCreateWallet(trader);
  const fcmPosition = new FCMPosition(fcmPositionId);

  fcmPosition.owner = wallet.id;
  fcmPosition.createdTimestamp = timestamp;
  fcmPosition.snapshotCount = ZERO_BI;
  fcmPosition.totalNotionalTraded = ZERO_BI;
  fcmPosition.sumOfWeightedFixedRate = ZERO_BI;
  fcmPosition.amm = amm.id;
  fcmPosition.save();

  wallet.fcmPositionCount = wallet.fcmPositionCount.plus(ONE_BI);
  wallet.save();

  return fcmPosition;
};

export default getOrCreateFCMPosition;
