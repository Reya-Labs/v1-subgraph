import { BigInt } from '@graphprotocol/graph-ts';

import { Swap as SwapEvent } from '../../../generated/templates/VAMM/VAMM';
import { Swap } from '../../../generated/schema';
import { ONE_BI, ZERO_BI } from '../../constants';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTransaction } from '../../utilities';

function handleSwap(event: SwapEvent): void {
  const sender = event.params.sender.toHexString();
  const owner = event.params.recipient.toHexString();
  const transaction = getOrCreateTransaction(event);

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const position = getOrCreatePosition(
    amm,
    owner,
    BigInt.fromI32(event.params.tickLower),
    BigInt.fromI32(event.params.tickUpper),
    event.block.timestamp,
  );

  const swapId = `${transaction.id}#${amm.txCount.toString()}`;
  const swap = new Swap(swapId);

  swap.transaction = transaction.id;
  swap.amm = amm.id;
  swap.position = position.id;
  swap.sender = sender;
  swap.desiredNotional = event.params.desiredNotional;
  swap.sqrtPriceLimitX96 = event.params.sqrtPriceLimitX96;
  swap.cumulativeFeeIncurred = event.params.cumulativeFeeIncurred;
  swap.fixedTokenDelta = event.params.fixedTokenDelta;
  swap.variableTokenDelta = event.params.variableTokenDelta;
  swap.fixedTokenDeltaUnbalanced = event.params.fixedTokenDeltaUnbalanced;
  swap.save();

  if (swap.variableTokenDelta.abs().gt(ZERO_BI)) {
    position.totalNotionalTraded = position.totalNotionalTraded.plus(swap.variableTokenDelta.abs());
    position.sumOfWeightedFixedRate = position.sumOfWeightedFixedRate.plus(
      swap.fixedTokenDeltaUnbalanced.abs(),
    );
    position.save();
  }

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.totalNotionalTraded = amm.totalNotionalTraded.plus(swap.variableTokenDelta.abs());
  amm.save();
}

export default handleSwap;
