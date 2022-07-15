import { log } from '@graphprotocol/graph-ts';

import { ONE_BI } from '../../constants';
import { FCMSettlement } from '../../../generated/schema';
import { getAMMFromFCMAddress, getOrCreateTransaction } from '../../utilities';
import getOrCreateFCMPosition from '../../utilities/getOrCreateFCMPosition';

import { fcmPositionSettlement as aaveFCMPositionSettlement } from '../../../generated/templates/aaveFCM/aaveFCM';
import { fcmPositionSettlement as compoundFCMPositionSettlement } from '../../../generated/templates/compoundFCM/compoundFCM';

function handleSettleFCMPosition<T>(event: T): void {
  if (
    event instanceof aaveFCMPositionSettlement ||
    event instanceof compoundFCMPositionSettlement
  ) {
    const transaction = getOrCreateTransaction(event);

    const trader = event.params.trader.toHexString();
    const fcmAddress = event.address.toHexString();
    const amm = getAMMFromFCMAddress(fcmAddress);

    if (amm === null) {
      log.info('Event (fcmPositionSettlement: {}) cannot be linked to a pool', [
        event.transaction.hash.toHexString(),
      ]);
      return;
    }

    const fcmPosition = getOrCreateFCMPosition(amm, trader, event.block.timestamp);

    const fcmSettlementId = `${transaction.id}#${amm.txCount.toString()}`;
    const fcmSettlement = new FCMSettlement(fcmSettlementId);

    fcmSettlement.transaction = transaction.id;
    fcmSettlement.amm = amm.id;
    fcmSettlement.fcmPosition = fcmPosition.id;
    fcmSettlement.settlementCashflow = event.params.settlementCashflow;
    fcmSettlement.save();

    fcmPosition.isSettled = true;
    fcmPosition.save();

    amm.txCount = amm.txCount.plus(ONE_BI);
    amm.save();
  }
}

export default handleSettleFCMPosition;
