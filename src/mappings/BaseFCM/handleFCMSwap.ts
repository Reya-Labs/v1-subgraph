import { log } from '@graphprotocol/graph-ts';
import { ONE_BI, ZERO_BI } from '../../constants';
import { FCMSwap } from '../../../generated/schema';
import { FullyCollateralisedSwap } from '../../../generated/templates/BaseFCM/BaseFCM';
import { getAMMFromFCMAddress, getOrCreateTransaction } from '../../utilities';
import getOrCreateFCMPosition from '../../utilities/getOrCreateFCMPosition';

function handleFCMSwap(event: FullyCollateralisedSwap): void {
  const trader = event.params.trader.toHexString();
  const transaction = getOrCreateTransaction(event);

  const fcmAddress = event.address.toHexString();
  const amm = getAMMFromFCMAddress(fcmAddress);

  if (amm === null) {
    log.info('Event (FCMSwap: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const fcmPosition = getOrCreateFCMPosition(amm, trader, event.block.timestamp);

  const fcmSwapId = `${transaction.id}#${amm.txCount.toString()}`;
  const fcmSwap = new FCMSwap(fcmSwapId);

  fcmSwap.transaction = transaction.id;
  fcmSwap.amm = amm.id;
  fcmSwap.fcmPosition = fcmPosition.id;
  fcmSwap.desiredNotional = event.params.desiredNotional;
  fcmSwap.sqrtPriceLimitX96 = event.params.sqrtPriceLimitX96;
  fcmSwap.cumulativeFeeIncurred = event.params.cumulativeFeeIncurred;
  fcmSwap.fixedTokenDelta = event.params.fixedTokenDelta;
  fcmSwap.variableTokenDelta = event.params.variableTokenDelta;
  fcmSwap.fixedTokenDeltaUnbalanced = event.params.fixedTokenDeltaUnbalanced;
  fcmSwap.save();

  if (fcmSwap.variableTokenDelta.abs().gt(ZERO_BI)) {
    fcmPosition.totalNotionalTraded = fcmPosition.totalNotionalTraded.plus(
      fcmSwap.variableTokenDelta.abs(),
    );
    fcmPosition.sumOfWeightedFixedRate = fcmPosition.sumOfWeightedFixedRate.plus(
      fcmSwap.fixedTokenDeltaUnbalanced.abs(),
    );
    fcmPosition.save();
  }

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleFCMSwap;
