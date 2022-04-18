import { FCMTraderUpdate } from '../../../generated/templates/aaveFCM/aaveFCM';
import { createFCMPositionSnapshot, getAMMFromFCMAddress } from '../../utilities';
import getOrCreateFCMPosition from '../../utilities/getOrCreateFCMPosition';

function handlePositionUpdate(event: FCMTraderUpdate): void {
  const trader = event.params.trader.toHexString();

  const fcmAddress = event.address.toHexString();
  const amm = getAMMFromFCMAddress(fcmAddress);

  if (amm === null) {
    return;
  }

  const fcmPosition = getOrCreateFCMPosition(amm, trader, event.block.timestamp);

  fcmPosition.updatedTimestamp = event.block.timestamp;
  fcmPosition.fixedTokenBalance = event.params.fixedTokenBalance;
  fcmPosition.variableTokenBalance = event.params.variableTokenBalance;
  // eslint-disable-next-line no-underscore-dangle
  fcmPosition.marginInScaledYieldBearingTokens = event.params.marginInScaledYieldBearingTokens;
  fcmPosition.save();

  createFCMPositionSnapshot(fcmPosition, event.block.timestamp);
}

export default handlePositionUpdate;
