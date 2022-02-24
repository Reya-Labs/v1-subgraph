import { BigInt } from '@graphprotocol/graph-ts';

import { Swap as SwapEvent } from '../../../generated/templates/VAMM/VAMM';
import { Swap } from '../../../generated/schema';
import { ONE_BI } from '../../constants';
import {
  getOrCreateAMM,
  getOrCreatePosition,
  getOrCreateTick,
  getOrCreateTransaction,
} from '../../utilities';

function handleSwap(event: SwapEvent): void {
  const sender = event.params.sender.toHexString();
  const owner = event.params.recipient.toHexString();
  const transaction = getOrCreateTransaction(event);

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(owner, tickLower, tickUpper, event.block.timestamp);

  const mintId = `${transaction.id}#${amm.txCount.toString()}`;
  const mint = new Swap(mintId);

  mint.transaction = transaction.id;
  mint.amm = amm.id;
  mint.position = position.id;
  mint.sender = sender;
  mint.sqrtPriceX96 = event.params.sqrtPriceX96;
  mint.liquidity = event.params.liquidity;
  mint.tick = BigInt.fromI32(event.params.tick);
  mint.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleSwap;
