import { log } from '@graphprotocol/graph-ts';

import { ONE_BI, ZERO_BI } from '../../constants';
import { FCMUnwind } from '../../../generated/schema';
import { FullyCollateralisedUnwind } from '../../../generated/templates/BaseFCM/BaseFCM';
import { getAMMFromFCMAddress, getOrCreateTransaction } from '../../utilities';
import getOrCreateFCMPosition from '../../utilities/getOrCreateFCMPosition';

function handleFCMUnwind(event: FullyCollateralisedUnwind): void {
  const trader = event.params.trader.toHexString();
  const transaction = getOrCreateTransaction(event);

  const fcmAddress = event.address.toHexString();
  const amm = getAMMFromFCMAddress(fcmAddress);

  if (amm === null) {
    log.info('Event (FCMUnwind: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const fcmPosition = getOrCreateFCMPosition(amm, trader, event.block.timestamp);

  const fcmUnwindId = `${transaction.id}#${amm.txCount.toString()}`;
  const fcmUnwind = new FCMUnwind(fcmUnwindId);

  fcmUnwind.transaction = transaction.id;
  fcmUnwind.amm = amm.id;
  fcmUnwind.fcmPosition = fcmPosition.id;
  fcmUnwind.desiredNotional = event.params.desiredNotional;
  fcmUnwind.sqrtPriceLimitX96 = event.params.sqrtPriceLimitX96;
  fcmUnwind.cumulativeFeeIncurred = event.params.cumulativeFeeIncurred;
  fcmUnwind.fixedTokenDelta = event.params.fixedTokenDelta;
  fcmUnwind.variableTokenDelta = event.params.variableTokenDelta;
  fcmUnwind.fixedTokenDeltaUnbalanced = event.params.fixedTokenDeltaUnbalanced;
  fcmUnwind.save();

  if (fcmUnwind.variableTokenDelta.abs().gt(ZERO_BI)) {
    fcmPosition.totalNotionalTraded = fcmPosition.totalNotionalTraded.plus(
      fcmUnwind.variableTokenDelta.abs(),
    );
    fcmPosition.sumOfWeightedFixedRate = fcmPosition.sumOfWeightedFixedRate.plus(
      fcmUnwind.fixedTokenDeltaUnbalanced.abs(),
    );
    fcmPosition.save();
  }

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleFCMUnwind;
